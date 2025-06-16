import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { withGuest } from '@/components/hoc/withAuth';
import { registerSchema, RegisterFormData } from '@/lib/validations/auth';

function RegisterPage() {
	const { register: registerUser } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterFormData) => {
		try {
			setIsLoading(true);
			setError(null);
			await registerUser(data.email, data.password, data.name);
			// AuthContext will handle redirect
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Create your SkillWise account
					</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						Or{' '}
						<Link
							href='/auth/login'
							className='font-medium text-blue-600 hover:text-blue-500'>
							sign in to your existing account
						</Link>
					</p>
				</div>

				<form
					className='mt-8 space-y-6'
					onSubmit={handleSubmit(onSubmit)}>
					{error && (
						<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
							{error}
						</div>
					)}

					<div className='space-y-4'>
						<div>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-gray-700'>
								Full Name
							</label>
							<input
								{...register('name')}
								type='text'
								autoComplete='name'
								className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
								placeholder='Enter your full name'
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
								Email address
							</label>
							<input
								{...register('email')}
								type='email'
								autoComplete='email'
								className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
								placeholder='Enter your email'
							/>
							{errors.email && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.email.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700'>
								Password
							</label>
							<input
								{...register('password')}
								type='password'
								autoComplete='new-password'
								className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
								placeholder='Create a password (min 8 characters)'
							/>
							{errors.password && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.password.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor='confirmPassword'
								className='block text-sm font-medium text-gray-700'>
								Confirm Password
							</label>
							<input
								{...register('confirmPassword')}
								type='password'
								autoComplete='new-password'
								className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
								placeholder='Confirm your password'
							/>
							{errors.confirmPassword && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.confirmPassword.message}
								</p>
							)}
						</div>
					</div>

					<div>
						<button
							type='submit'
							disabled={isLoading}
							className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'>
							{isLoading ? 'Creating account...' : 'Create account'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default withGuest(RegisterPage);
