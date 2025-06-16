import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface LayoutProps {
	children: ReactNode;
	title?: string;
}

export default function Layout({ children, title = 'SkillWise' }: LayoutProps) {
	const { user, logout } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Navigation Header */}
			<header className='bg-white shadow-sm'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center py-4'>
						<div className='flex items-center space-x-8'>
							<Link
								href='/dashboard'
								className='text-2xl font-bold text-gray-900'>
								SkillWise
							</Link>

							{user && (
								<nav className='hidden md:flex space-x-6'>
									<Link
										href='/dashboard'
										className='text-gray-600 hover:text-gray-900'>
										Dashboard
									</Link>
									<Link
										href='/courses'
										className='text-gray-600 hover:text-gray-900'>
										Courses
									</Link>
									{(user.role === 'INSTRUCTOR' ||
										user.role === 'ADMIN' ||
										user.role === 'SUPER_ADMIN') && (
										<Link
											href='/instructor/courses'
											className='text-gray-600 hover:text-gray-900'>
											Teach
										</Link>
									)}
									{(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
										<Link
											href='/admin'
											className='text-gray-600 hover:text-gray-900'>
											Admin
										</Link>
									)}
								</nav>
							)}
						</div>

						<div className='flex items-center space-x-4'>
							{user ? (
								<>
									<span className='text-sm text-gray-600'>
										{user.name || user.email}
									</span>
									<span className='px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full'>
										{user.role}
									</span>
									<Link
										href='/profile'
										className='text-blue-600 hover:text-blue-800'>
										Profile
									</Link>
									<button
										onClick={handleLogout}
										className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors'>
										Logout
									</button>
								</>
							) : (
								<div className='space-x-2'>
									<Link
										href='/auth/login'
										className='text-blue-600 hover:text-blue-800'>
										Login
									</Link>
									<Link
										href='/auth/register'
										className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium'>
										Sign Up
									</Link>
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
