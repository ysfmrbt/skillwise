import { useAuth } from '@/contexts/AuthContext';
import { withAuth } from '@/components/hoc/withAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	Users,
	BookOpen,
	GraduationCap,
	Settings,
	LogOut,
	PlusCircle,
	BarChart3,
	FolderOpen,
} from 'lucide-react';

function DashboardPage() {
	const { user, logout } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
			// AuthContext will handle clearing state and redirect
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	const getInitials = (name?: string, email?: string) => {
		if (name) {
			return name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase();
		}
		if (email) {
			return email.substring(0, 2).toUpperCase();
		}
		return 'U';
	};

	const getRoleBasedContent = () => {
		switch (user?.role) {
			case 'ADMIN':
			case 'SUPER_ADMIN':
				return (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
							<Link href='/admin/users'>
								<CardHeader className='flex flex-row items-center space-y-0 pb-2'>
									<Users className='h-6 w-6 text-blue-600' />
									<CardTitle className='ml-2 text-lg'>Manage Users</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>
										View and manage all platform users
									</CardDescription>
								</CardContent>
							</Link>
						</Card>

						<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
							<Link href='/admin/courses'>
								<CardHeader className='flex flex-row items-center space-y-0 pb-2'>
									<BookOpen className='h-6 w-6 text-green-600' />
									<CardTitle className='ml-2 text-lg'>Manage Courses</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>
										Oversee all courses and content
									</CardDescription>
								</CardContent>
							</Link>
						</Card>

						<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
							<Link href='/admin/categories'>
								<CardHeader className='flex flex-row items-center space-y-0 pb-2'>
									<FolderOpen className='h-6 w-6 text-purple-600' />
									<CardTitle className='ml-2 text-lg'>Categories</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>Manage course categories</CardDescription>
								</CardContent>
							</Link>
						</Card>
					</div>
				);
			case 'INSTRUCTOR':
				return (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
							<Link href='/instructor/courses'>
								<CardHeader className='flex flex-row items-center space-y-0 pb-2'>
									<BookOpen className='h-6 w-6 text-blue-600' />
									<CardTitle className='ml-2 text-lg'>My Courses</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>
										Manage your courses and lessons
									</CardDescription>
								</CardContent>
							</Link>
						</Card>

						<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
							<Link href='/instructor/create-course'>
								<CardHeader className='flex flex-row items-center space-y-0 pb-2'>
									<PlusCircle className='h-6 w-6 text-green-600' />
									<CardTitle className='ml-2 text-lg'>Create Course</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>Start creating a new course</CardDescription>
								</CardContent>
							</Link>
						</Card>
					</div>
				);
			case 'STUDENT':
			default:
				return (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
							<Link href='/courses'>
								<CardHeader className='flex flex-row items-center space-y-0 pb-2'>
									<BookOpen className='h-6 w-6 text-blue-600' />
									<CardTitle className='ml-2 text-lg'>Browse Courses</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>
										Discover and enroll in courses
									</CardDescription>
								</CardContent>
							</Link>
						</Card>

						<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
							<Link href='/my-courses'>
								<CardHeader className='flex flex-row items-center space-y-0 pb-2'>
									<GraduationCap className='h-6 w-6 text-green-600' />
									<CardTitle className='ml-2 text-lg'>My Enrollments</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>View your enrolled courses</CardDescription>
								</CardContent>
							</Link>
						</Card>
					</div>
				);
		}
	};

	return (
		<div className='min-h-screen bg-background'>
			{/* Navigation Header */}
			<header className='border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50'>
				<div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
					<div className='flex gap-6 md:gap-10'>
						<Link
							href='/dashboard'
							className='flex items-center space-x-2'>
							<GraduationCap className='h-6 w-6' />
							<span className='font-bold text-xl'>SkillWise</span>
						</Link>
					</div>
					<div className='flex flex-1 items-center justify-end space-x-4'>
						<nav className='flex items-center space-x-2'>
							<Avatar className='h-8 w-8'>
								<AvatarFallback>
									{getInitials(user?.name, user?.email)}
								</AvatarFallback>
							</Avatar>
							<div className='flex flex-col'>
								<span className='text-sm font-medium leading-none'>
									{user?.name || user?.email}
								</span>
								<Badge
									variant='secondary'
									className='w-fit mt-1'>
									{user?.role}
								</Badge>
							</div>
							<Button
								variant='ghost'
								size='sm'
								asChild>
								<Link href='/profile'>
									<Settings className='h-4 w-4' />
								</Link>
							</Button>
							<Button
								variant='ghost'
								size='sm'
								onClick={handleLogout}>
								<LogOut className='h-4 w-4' />
							</Button>
						</nav>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='container py-8'>
				<div className='mb-8'>
					<h1 className='text-4xl font-bold tracking-tight'>Dashboard</h1>
					<p className='text-muted-foreground mt-2'>
						Welcome back to your SkillWise dashboard
					</p>
				</div>

				{getRoleBasedContent()}
			</main>
		</div>
	);
}

export default withAuth(DashboardPage);
