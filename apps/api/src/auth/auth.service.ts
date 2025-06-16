import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signIn.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

    return {
      message: 'Login successful',
      accessToken: await this.jwtService.signAsync(payload),
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
    return {
      message: 'User registered successfully',
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    };
  }
}
