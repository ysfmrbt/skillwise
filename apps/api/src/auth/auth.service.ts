import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signIn.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersService.user({ email });
    const isValidPassword = await bcrypt.compare(
      password,
      user?.password || '',
    );
    if (!user || !isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    // Check if user has an existing refresh token
    const existingRefreshToken = await this.getRefreshTokenByUserId(user.id);
    let refreshToken: string;
    let hashedRefreshToken: string;

    if (existingRefreshToken && existingRefreshToken.expiresAt > new Date()) {
      // Reuse existing non-expired refresh token
      refreshToken = existingRefreshToken.token;
      hashedRefreshToken = refreshToken;
    } else {
      // Create new refresh token
      refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });
      hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      // Save or update refresh token
      await this.saveOrUpdateRefreshToken({
        userId: user.id,
        refreshToken: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
    }

    return {
      message: 'Login successful',
      accessToken: accessToken,
      refreshToken: hashedRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existingUser = await this.usersService.user({ email });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const newUser = await this.usersService.createUser({
      email,
      password: await bcrypt.hash(password, 10),
      name,
    });
    const payload: JwtPayload = {
      email: newUser.email,
      sub: newUser.id,
      role: newUser.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Create refresh token for new user
    await this.saveOrUpdateRefreshToken({
      userId: newUser.id,
      refreshToken: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      message: 'User registered successfully',
      accessToken: accessToken,
      refreshToken: hashedRefreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    };
  }

  async getRefreshTokenByUserId(userId: string) {
    return await this.prisma.refreshToken.findFirst({
      where: { userId },
    });
  }

  async saveOrUpdateRefreshToken({
    userId,
    refreshToken,
    expiresAt,
  }: {
    userId: string;
    refreshToken: string;
    expiresAt: Date;
  }) {
    try {
      // First check if refresh token exists for this user
      const existingToken = await this.prisma.refreshToken.findFirst({
        where: { userId },
      });

      if (existingToken) {
        // Update existing token
        await this.prisma.refreshToken.update({
          where: { id: existingToken.id },
          data: {
            token: refreshToken,
            expiresAt,
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new token
        await this.prisma.refreshToken.create({
          data: {
            userId,
            token: refreshToken,
            expiresAt,
          },
        });
      }
    } catch (error) {
      console.error('Error saving/updating refresh token:', error);
      throw error;
    }
  }

  async deleteRefreshToken(userId: string) {
    try {
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    } catch (error) {
      console.error('Error deleting refresh token:', error);
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      // Find the refresh token in the database
      const storedRefreshToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if refresh token is expired
      if (storedRefreshToken.expiresAt < new Date()) {
        // Delete expired token
        await this.prisma.refreshToken.delete({
          where: { id: storedRefreshToken.id },
        });
        throw new UnauthorizedException('Refresh token expired');
      }

      // Generate new access token
      const payload: JwtPayload = {
        email: storedRefreshToken.user.email,
        sub: storedRefreshToken.user.id,
        role: storedRefreshToken.user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      });

      return {
        accessToken,
        user: {
          id: storedRefreshToken.user.id,
          email: storedRefreshToken.user.email,
          name: storedRefreshToken.user.name,
          role: storedRefreshToken.user.role,
        },
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
