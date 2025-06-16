import Link from 'next/link';

export default function UnauthorizedPage() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50'>
			<div className='max-w-md w-full text-center'>
				<div className='bg-white shadow-lg rounded-lg p-8'>
					<div className='text-6xl text-red-500 mb-4'>⚠️</div>
					<h1 className='text-3xl font-bold text-gray-900 mb-4'>
						Access Denied
					</h1>
					<p className='text-gray-600 mb-6'>
						You don't have permission to access this page. Please contact your
						administrator if you believe this is an error.
					</p>
					<div className='space-y-3'>
						<Link
							href='/dashboard'
							className='block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors'>
							Go to Dashboard
						</Link>
						<Link
							href='/'
							className='block text-blue-600 hover:text-blue-800 font-medium'>
							Return to Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
