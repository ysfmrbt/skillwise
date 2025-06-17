import { ReactNode, useState } from 'react';
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
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
	User,
	LogOut,
	Settings,
	BookOpen,
	Shield,
	Menu,
	X,
	Home,
	GraduationCap,
} from 'lucide-react';

interface LayoutProps {
	children: ReactNode;
	title?: string;
}

export default function Layout({ children, title = 'SkillWise' }: LayoutProps) {
	const { user, logout } = useAuth();
	const notification = useNotification();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

	const navigationLinks = [
		{
			href: '/dashboard',
			label: 'Dashboard',
			icon: Home,
			show: !!user,
		},
		{
			href: '/courses',
			label: 'Courses',
			icon: BookOpen,
			show: !!user,
		},
		{
			href: '/instructor/courses',
			label: 'Teach',
			icon: GraduationCap,
			show: user && ['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(user.role),
		},
		{
			href: '/admin',
			label: 'Admin',
			icon: Shield,
			show: user && ['ADMIN', 'SUPER_ADMIN'].includes(user.role),
		},
	];

	return (
		<div className='min-h-screen bg-background text-foreground'>
			{/* Navigation Header */}
			<header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='container mx-auto flex h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8'>
					<div className='mr-6 hidden md:flex'>
						<Link
							href={user ? '/dashboard' : '/'}
							className='mr-6 flex items-center space-x-2 lg:mr-8'>
							<GraduationCap className='h-6 w-6' />
							<span className='hidden font-bold lg:inline-block'>
								SkillWise
							</span>
						</Link>
						{user && (
							<nav className='flex items-center gap-6 text-sm lg:gap-8'>
								{navigationLinks
									.filter((link) => link.show)
									.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											className='flex items-center gap-2 text-foreground/70 transition-colors hover:text-foreground'>
											<link.icon className='h-4 w-4' />
											{link.label}
										</Link>
									))}
							</nav>
						)}
					</div>

					{/* Mobile menu button */}
					<Button
						variant='ghost'
						className='mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
						{mobileMenuOpen ? (
							<X className='h-6 w-6' />
						) : (
							<Menu className='h-6 w-6' />
						)}
						<span className='sr-only'>Toggle Menu</span>
					</Button>

					{/* Mobile brand */}
					<div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
						<div className='w-full flex-1 md:w-auto md:flex-none'>
							<Link
								href={user ? '/dashboard' : '/'}
								className='flex items-center space-x-2 md:hidden'>
								<GraduationCap className='h-6 w-6' />
								<span className='font-bold'>SkillWise</span>
							</Link>
						</div>

						{/* Right side actions */}
						<div className='flex items-center space-x-2'>
							<ThemeToggle />

							{user ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='ghost'
											className='relative h-8 w-8 rounded-full'>
											<Avatar className='h-8 w-8'>
												<AvatarFallback className='text-xs'>
													{getUserInitials(user.name, user.email)}
												</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className='w-56'
										align='end'
										forceMount>
										<div className='flex items-center justify-start gap-2 p-2'>
											<div className='flex flex-col space-y-1 leading-none'>
												{user.name && (
													<p className='font-medium'>{user.name}</p>
												)}
												<p className='w-[200px] truncate text-sm text-muted-foreground'>
													{user.email}
												</p>
											</div>
										</div>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild>
											<Link
												href='/profile'
												className='flex items-center'>
												<User className='mr-2 h-4 w-4' />
												<span>Profile</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link
												href='/settings'
												className='flex items-center'>
												<Settings className='mr-2 h-4 w-4' />
												<span>Settings</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className='cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400'
											onSelect={handleLogout}>
											<LogOut className='mr-2 h-4 w-4' />
											<span>Log out</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<div className='flex items-center space-x-2'>
									<Button
										variant='ghost'
										size='sm'
										asChild>
										<Link href='/auth/login'>Sign in</Link>
									</Button>
									<Button
										size='sm'
										asChild>
										<Link href='/auth/register'>Sign up</Link>
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Mobile navigation menu */}
				{mobileMenuOpen && user && (
					<div className='border-t border-border bg-background px-4 py-6 md:hidden'>
						<nav className='flex flex-col space-y-4'>
							{navigationLinks
								.filter((link) => link.show)
								.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										className='flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground'
										onClick={() => setMobileMenuOpen(false)}>
										<link.icon className='h-4 w-4' />
										{link.label}
									</Link>
								))}
						</nav>
						{user && (
							<div className='mt-6 flex items-center gap-3 rounded-md border border-border bg-muted/50 px-4 py-3'>
								<Avatar className='h-10 w-10'>
									<AvatarFallback className='text-sm font-medium'>
										{getUserInitials(user.name, user.email)}
									</AvatarFallback>
								</Avatar>
								<div className='flex flex-col'>
									<p className='text-sm font-medium'>
										{user.name || user.email}
									</p>
									<Badge
										variant='secondary'
										className='w-fit text-xs mt-1'>
										{user.role}
									</Badge>
								</div>
							</div>
						)}
					</div>
				)}
			</header>

			{/* Main Content */}
			<main className='flex-1 min-h-0'>
				<div className='container mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16'>
					{children}
				</div>
			</main>

			{/* Footer */}
			<footer className='border-t border-border bg-muted/30'>
				<div className='container mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8'>
					<div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
						<div className='flex items-center space-x-2'>
							<GraduationCap className='h-5 w-5 text-primary' />
							<span className='text-sm font-medium'>SkillWise</span>
						</div>
						<p className='text-center text-sm leading-loose text-muted-foreground md:text-left'>
							Built with ❤️ for learning and growth
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
