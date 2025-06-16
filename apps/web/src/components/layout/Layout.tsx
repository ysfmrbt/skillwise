import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, BookOpen, Users, Shield } from 'lucide-react';

interface LayoutProps {
	children: ReactNode;
	title?: string;
}

export default function Layout({ children, title = 'SkillWise' }: LayoutProps) {
	const { user, logout } = useAuth();
	const notification = useNotification();

	const handleLogout = async () => {
		try {
			await logout();
			notification.success('Logged out successfully', 'See you next time!');
		} catch (error) {
			notification.error(
				'Logout failed',
				'An error occurred while logging out.',
			);
			console.error('Logout error:', error);
		}
	};

	const getUserInitials = (name: string, email: string) => {
		if (name) {
			return name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase();
		}
		return email.charAt(0).toUpperCase();
	};

	return (
		<div className='min-h-screen bg-background'>
			{/* Navigation Header */}
			<header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center py-4'>
						<div className='flex items-center space-x-8'>
							<Link
								href='/dashboard'
								className='text-2xl font-bold text-primary hover:text-primary/80 transition-colors'>
								SkillWise
							</Link>

							{user && (
								<nav className='hidden md:flex space-x-6'>
									<Button
										variant='ghost'
										asChild>
										<Link href='/dashboard'>Dashboard</Link>
									</Button>
									<Button
										variant='ghost'
										asChild>
										<Link href='/courses'>
											<BookOpen className='h-4 w-4 mr-2' />
											Courses
										</Link>
									</Button>
									{(user.role === 'INSTRUCTOR' ||
										user.role === 'ADMIN' ||
										user.role === 'SUPER_ADMIN') && (
										<Button
											variant='ghost'
											asChild>
											<Link href='/instructor/courses'>Teach</Link>
										</Button>
									)}
									{(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
										<Button
											variant='ghost'
											asChild>
											<Link href='/admin'>
												<Shield className='h-4 w-4 mr-2' />
												Admin
											</Link>
										</Button>
									)}
								</nav>
							)}
						</div>

						<div className='flex items-center space-x-4'>
							{user ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='ghost'
											className='flex items-center space-x-2'>
											<Avatar className='h-8 w-8'>
												<AvatarFallback>
													{getUserInitials(user.name, user.email)}
												</AvatarFallback>
											</Avatar>
											<div className='hidden sm:block text-left'>
												<p className='text-sm font-medium'>
													{user.name || user.email}
												</p>
												<Badge
													variant='secondary'
													className='text-xs'>
													{user.role}
												</Badge>
											</div>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align='end'
										className='w-56'>
										<DropdownMenuItem asChild>
											<Link
												href='/profile'
												className='flex items-center'>
												<User className='h-4 w-4 mr-2' />
												Profile
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link
												href='/settings'
												className='flex items-center'>
												<Settings className='h-4 w-4 mr-2' />
												Settings
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={handleLogout}
											className='flex items-center text-destructive focus:text-destructive'>
											<LogOut className='h-4 w-4 mr-2' />
											Logout
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<div className='flex items-center space-x-2'>
									<Button
										variant='ghost'
										asChild>
										<Link href='/auth/login'>Login</Link>
									</Button>
									<Button asChild>
										<Link href='/auth/register'>Sign Up</Link>
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main>{children}</main>
		</div>
	);
}
