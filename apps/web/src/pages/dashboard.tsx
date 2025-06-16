import { useAuth } from '@/contexts/AuthContext';
import { withAuth } from '@/components/hoc/withAuth';
import Link from 'next/link';

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

	const getRoleBasedContent = () => {
		switch (user?.role) {
			case 'ADMIN':
			case 'SUPER_ADMIN':
				return (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						<Link
							href='/admin/users'
							className='bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg transition-colors'>
							<h3 className='text-xl font-semibold mb-2'>Manage Users</h3>
							<p>View and manage all platform users</p>
						</Link>
						<Link
							href='/admin/courses'
							className='bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg transition-colors'>
							<h3 className='text-xl font-semibold mb-2'>Manage Courses</h3>
							<p>Oversee all courses and content</p>
						</Link>
						<Link
							href='/admin/categories'
							className='bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg transition-colors'>
							<h3 className='text-xl font-semibold mb-2'>Categories</h3>
							<p>Manage course categories</p>
						</Link>
					</div>
				);
			case 'INSTRUCTOR':
				return (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Link
							href='/instructor/courses'
							className='bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg transition-colors'>
							<h3 className='text-xl font-semibold mb-2'>My Courses</h3>
							<p>Manage your courses and lessons</p>
						</Link>
						<Link
							href='/instructor/create-course'
							className='bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg transition-colors'>
							<h3 className='text-xl font-semibold mb-2'>Create Course</h3>
							<p>Start creating a new course</p>
						</Link>
					</div>
				);
			case 'STUDENT':
			default:
				return (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Link
							href='/courses'
							className='bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg transition-colors'>
							<h3 className='text-xl font-semibold mb-2'>Browse Courses</h3>
							<p>Discover and enroll in courses</p>
						</Link>
						<Link
							href='/my-courses'
							className='bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg transition-colors'>
							<h3 className='text-xl font-semibold mb-2'>My Enrollments</h3>
							<p>View your enrolled courses</p>
						</Link>
					</div>
				);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Navigation Header */}
			<header className='bg-white shadow-sm'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center py-4'>
						<div className='flex items-center'>
							<h1 className='text-2xl font-bold text-gray-900'>SkillWise</h1>
						</div>
						<div className='flex items-center space-x-4'>
							<span className='text-sm text-gray-600'>
								Welcome, {user?.name || user?.email}
							</span>
							<span className='px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full'>
								{user?.role}
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
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='mb-8'>
					<h2 className='text-3xl font-bold text-gray-900 mb-2'>Dashboard</h2>
					<p className='text-gray-600'>Welcome to your SkillWise dashboard</p>
				</div>

				{getRoleBasedContent()}
			</main>
		</div>
	);
}

export default withAuth(DashboardPage);
