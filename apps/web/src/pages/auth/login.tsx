import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { withGuest } from '@/components/hoc/withAuth';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
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

function LoginPage() {
	const { login } = useAuth();
	const notification = useNotification();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			setIsLoading(true);
			await login(data.email, data.password);
			notification.success(
				'Welcome back!',
				'You have been successfully logged in.',
			);
			// AuthContext will handle redirect automatically
		} catch (err: any) {
			notification.error(
				'Login failed',
				err.message || 'An error occurred during login.',
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
						Sign in to SkillWise
					</CardTitle>
					<CardDescription>
						Or{' '}
						<Link
							href='/auth/register'
							className='font-medium text-primary hover:text-primary/80 underline underline-offset-4'>
							create a new account
						</Link>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-4'>
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
								autoComplete='current-password'
								placeholder='Enter your password'
								aria-invalid={errors.password ? 'true' : 'false'}
							/>
							{errors.password && (
								<p className='text-sm text-destructive'>
									{errors.password.message}
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
									Signing in...
								</>
							) : (
								'Sign in'
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export default withGuest(LoginPage);
