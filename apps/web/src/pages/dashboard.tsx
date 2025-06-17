import { useAuth } from '@/contexts/AuthContext';
import { withAuth } from '@/components/hoc/withAuth';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
	Users, 
	BookOpen, 
	GraduationCap,
	PlusCircle,
	BarChart3,
	FolderOpen,
	Shield
} from 'lucide-react';

function DashboardPage() {
	const { user } = useAuth();

	const getRoleBasedContent = () => {
		switch (user?.role) {
			case 'ADMIN':
			case 'SUPER_ADMIN':
				return (
					<div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
						<Card className='hover:shadow-lg transition-all duration-200 cursor-pointer group'>
							<Link href='/admin/users' className='block p-0'>
								<CardHeader className='pb-4'>
									<div className='flex items-center space-x-3'>
										<div className='p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors'>
											<Users className='h-6 w-6 text-blue-600 dark:text-blue-400' />
										</div>
										<CardTitle className='text-xl'>Manage Users</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-base'>
										View and manage all platform users
									</CardDescription>
								</CardContent>
							</Link>
						</Card>
						
						<Card className='hover:shadow-lg transition-all duration-200 cursor-pointer group'>
							<Link href='/admin/courses' className='block p-0'>
								<CardHeader className='pb-4'>
									<div className='flex items-center space-x-3'>
										<div className='p-2 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors'>
											<BookOpen className='h-6 w-6 text-green-600 dark:text-green-400' />
										</div>
										<CardTitle className='text-xl'>Manage Courses</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-base'>
										Oversee all courses and content
									</CardDescription>
								</CardContent>
							</Link>
						</Card>
						
						<Card className='hover:shadow-lg transition-all duration-200 cursor-pointer group'>
							<Link href='/admin/categories' className='block p-0'>
								<CardHeader className='pb-4'>
									<div className='flex items-center space-x-3'>
										<div className='p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/30 transition-colors'>
											<FolderOpen className='h-6 w-6 text-purple-600 dark:text-purple-400' />
										</div>
										<CardTitle className='text-xl'>Categories</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-base'>
										Manage course categories
									</CardDescription>
								</CardContent>
							</Link>
						</Card>
						
						<Card className='hover:shadow-lg transition-all duration-200 cursor-pointer group'>
							<Link href='/admin/analytics' className='block p-0'>
								<CardHeader className='pb-4'>
									<div className='flex items-center space-x-3'>
										<div className='p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/30 transition-colors'>
											<BarChart3 className='h-6 w-6 text-orange-600 dark:text-orange-400' />
										</div>
										<CardTitle className='text-xl'>Analytics</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-base'>
										View platform analytics and reports
									</CardDescription>
								</CardContent>
							</Link>
						</Card>
					</div>
				);
			case 'INSTRUCTOR':
				return (
					<div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
						<Card className='hover:shadow-lg transition-all duration-200 cursor-pointer group'>
							<Link href='/instructor/courses' className='block p-0'>
								<CardHeader className='pb-4'>
									<div className='flex items-center space-x-3'>
										<div className='p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors'>
											<BookOpen className='h-6 w-6 text-blue-600 dark:text-blue-400' />
										</div>
										<CardTitle className='text-xl'>My Courses</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-base'>
										Manage your teaching courses
									</CardDescription>
								</CardContent>
							</Link>
						</Card>
						
						<Card className='hover:shadow-lg transition-all duration-200 cursor-pointer group'>
							<Link href='/courses/create' className='block p-0'>
								<CardHeader className='pb-4'>
									<div className='flex items-center space-x-3'>
										<div className='p-2 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors'>
											<PlusCircle className='h-6 w-6 text-green-600 dark:text-green-400' />
										</div>
										<CardTitle className='text-xl'>Create Course</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-base'>
										Create a new course to teach
									</CardDescription>
								</CardContent>
							</Link>
						</Card>
						
						<Card className='hover:shadow-lg transition-all duration-200 cursor-pointer group'>
							<Link href='/instructor/analytics' className='block p-0'>
								<CardHeader className='pb-4'>
									<div className='flex items-center space-x-3'>
										<div className='p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/30 transition-colors'>
											<BarChart3 className='h-6 w-6 text-purple-600 dark:text-purple-400' />
										</div>
										<CardTitle className='text-xl'>Analytics</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-base'>
										View your course performance
									</CardDescription>
								</CardContent>
							</Link>
						</Card>
					</div>
				);
			default:
				return (
					<div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
						<Card className='hover:shadow-lg transition-all duration-200 cursor-pointer group'>
							<Link href='/courses' className='block p-0'>
								<CardHeader className='pb-4'>
									<div className='flex items-center space-x-3'>
										<div className='p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors'>
											<BookOpen className='h-6 w-6 text-blue-600 dark:text-blue-400' />
										</div>
										<CardTitle className='text-xl'>Browse Courses</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-base'>
										Discover and enroll in courses
									</CardDescription>
								</CardContent>
							</Link>
						</Card>
						
						<Card className='hover:shadow-lg transition-all duration-200 cursor-pointer group'>
							<Link href='/my-courses' className='block p-0'>
								<CardHeader className='pb-4'>
									<div className='flex items-center space-x-3'>
										<div className='p-2 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors'>
											<GraduationCap className='h-6 w-6 text-green-600 dark:text-green-400' />
										</div>
										<CardTitle className='text-xl'>My Enrollments</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-base'>
										View your enrolled courses
									</CardDescription>
								</CardContent>
							</Link>
						</Card>
					</div>
				);
		}
	};

	return (
		<Layout title='Dashboard'>
			<div className='space-y-8'>
				<div className='space-y-2'>
					<h1 className='text-4xl font-bold tracking-tight'>Dashboard</h1>
					<p className='text-xl text-muted-foreground'>
						Welcome back to your SkillWise dashboard
					</p>
				</div>

				{getRoleBasedContent()}
			</div>
		</Layout>
	);
}

export default withAuth(DashboardPage);
