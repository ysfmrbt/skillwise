import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { withGuest } from '@/components/hoc/withAuth';
import { registerSchema, RegisterFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function RegisterPage() {
	const { register: registerUser } = useAuth();
	const notification = useNotification();
	const [isLoading, setIsLoading] = useState(false);

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
			await registerUser(data.email, data.password, data.name);
			notification.success(
				'Account created!',
				'Welcome to SkillWise. You can now start learning.',
			);
			// AuthContext will handle redirect automatically
		} catch (err: any) {
			notification.error(
				'Registration failed',
				err.message || 'An error occurred during registration.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
			<Card className='w-full max-w-md'>
				<CardHeader className='text-center'>
					<CardTitle className='text-3xl font-bold'>
						Create your account
					</CardTitle>
					<CardDescription>
						Already have an account?{' '}
						<Link
							href='/auth/login'
							className='font-medium text-primary hover:text-primary/80 underline underline-offset-4'>
							Sign in here
						</Link>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='name'>Full Name</Label>
							<Input
								{...register('name')}
								id='name'
								type='text'
								autoComplete='name'
								placeholder='Enter your full name'
								aria-invalid={errors.name ? 'true' : 'false'}
							/>
							{errors.name && (
								<p className='text-sm text-destructive'>
									{errors.name.message}
								</p>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='email'>Email address</Label>
							<Input
								{...register('email')}
								id='email'
								type='email'
								autoComplete='email'
								placeholder='Enter your email'
								aria-invalid={errors.email ? 'true' : 'false'}
							/>
							{errors.email && (
								<p className='text-sm text-destructive'>
									{errors.email.message}
								</p>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								{...register('password')}
								id='password'
								type='password'
								autoComplete='new-password'
								placeholder='Create a password'
								aria-invalid={errors.password ? 'true' : 'false'}
							/>
							{errors.password && (
								<p className='text-sm text-destructive'>
									{errors.password.message}
								</p>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='confirmPassword'>Confirm Password</Label>
							<Input
								{...register('confirmPassword')}
								id='confirmPassword'
								type='password'
								autoComplete='new-password'
								placeholder='Confirm your password'
								aria-invalid={errors.confirmPassword ? 'true' : 'false'}
							/>
							{errors.confirmPassword && (
								<p className='text-sm text-destructive'>
									{errors.confirmPassword.message}
								</p>
							)}
						</div>

						<Button
							type='submit'
							disabled={isLoading}
							className='w-full'>
							{isLoading ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Creating account...
								</>
							) : (
								'Create account'
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export default withGuest(RegisterPage);
