import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';

export default function Home() {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<Layout>
				<div className='flex items-center justify-center min-h-[60vh]'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				{/* Hero Section */}
				<div className='text-center mb-16'>
					<h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
						Welcome to <span className='text-blue-600'>SkillWise</span>
					</h1>
					<p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto'>
						Unlock your potential with our comprehensive learning platform.
						Discover courses, connect with expert instructors, and advance your
						skills.
					</p>

					{user ? (
						<div className='space-x-4'>
							<Link
								href='/dashboard'
								className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors'>
								Go to Dashboard
							</Link>
							<Link
								href='/courses'
								className='border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors'>
								Browse Courses
							</Link>
						</div>
					) : (
						<div className='space-x-4'>
							<Link
								href='/auth/register'
								className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors'>
								Get Started
							</Link>
							<Link
								href='/auth/login'
								className='border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors'>
								Sign In
							</Link>
						</div>
					)}
				</div>

				{/* Features Section */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
					<div className='text-center p-6 bg-white rounded-lg shadow-sm'>
						<div className='text-4xl mb-4'>📚</div>
						<h3 className='text-xl font-semibold mb-2'>Expert-Led Courses</h3>
						<p className='text-gray-600'>
							Learn from industry professionals with real-world experience
						</p>
					</div>
					<div className='text-center p-6 bg-white rounded-lg shadow-sm'>
						<div className='text-4xl mb-4'>🎯</div>
						<h3 className='text-xl font-semibold mb-2'>Skill-Based Learning</h3>
						<p className='text-gray-600'>
							Focus on practical skills that advance your career
						</p>
					</div>
					<div className='text-center p-6 bg-white rounded-lg shadow-sm'>
						<div className='text-4xl mb-4'>🏆</div>
						<h3 className='text-xl font-semibold mb-2'>Track Progress</h3>
						<p className='text-gray-600'>
							Monitor your learning journey with detailed analytics
						</p>
					</div>
				</div>

				{/* Call to Action */}
				{!user && (
					<div className='bg-blue-600 text-white text-center py-12 px-6 rounded-lg'>
						<h2 className='text-3xl font-bold mb-4'>
							Ready to Start Learning?
						</h2>
						<p className='text-xl mb-6 opacity-90'>
							Join thousands of learners advancing their careers with SkillWise
						</p>
						<Link
							href='/auth/register'
							className='bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-medium transition-colors'>
							Create Your Free Account
						</Link>
					</div>
				)}
			</div>
		</Layout>
	);
}
