import { useAuth } from '@/contexts/AuthContext';
import { withAuth } from '@/components/hoc/withAuth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';

const profileSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email address'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function ProfilePage() {
	const { user, refreshUser } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user?.name || '',
			email: user?.email || '',
		},
	});

	const onSubmit = async (data: ProfileFormData) => {
		try {
			setIsLoading(true);
			setMessage(null);

			// Update user profile
			await api.put(`/users/${user?.id}`, data);

			// Refresh user data
			await refreshUser();

			setMessage({ type: 'success', text: 'Profile updated successfully!' });
		} catch (error: any) {
			setMessage({
				type: 'error',
				text: error.response?.data?.message || 'Failed to update profile',
			});
		} finally {
			setIsLoading(false);
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
							<a
								href='/dashboard'
								className='text-blue-600 hover:text-blue-800'>
								Dashboard
							</a>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='bg-white shadow rounded-lg'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<h2 className='text-2xl font-bold text-gray-900'>
							Profile Settings
						</h2>
						<p className='text-gray-600 mt-1'>
							Manage your account information
						</p>
					</div>

					<div className='px-6 py-4'>
						{message && (
							<div
								className={`mb-4 p-4 rounded-md ${
									message.type === 'success'
										? 'bg-green-50 border border-green-200 text-green-700'
										: 'bg-red-50 border border-red-200 text-red-700'
								}`}>
								{message.text}
							</div>
						)}

						<form
							onSubmit={handleSubmit(onSubmit)}
							className='space-y-6'>
							<div>
								<label
									htmlFor='name'
									className='block text-sm font-medium text-gray-700'>
									Full Name
								</label>
								<input
									{...register('name')}
									type='text'
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
								/>
								{errors.name && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.name.message}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-gray-700'>
									Email Address
								</label>
								<input
									{...register('email')}
									type='email'
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
								/>
								{errors.email && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.email.message}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Role
								</label>
								<span className='mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 block'>
									{user?.role}
								</span>
								<p className='mt-1 text-sm text-gray-500'>
									Your role cannot be changed from this interface.
								</p>
							</div>

							<div className='flex justify-end'>
								<button
									type='submit'
									disabled={isLoading}
									className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'>
									{isLoading ? 'Saving...' : 'Save Changes'}
								</button>
							</div>
						</form>
					</div>
				</div>
			</main>
		</div>
	);
}

export default withAuth(ProfilePage);
