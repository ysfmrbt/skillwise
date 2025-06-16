import { useAuth } from '@/contexts/AuthContext';
import { withAuth } from '@/components/hoc/withAuth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
	ArrowLeft,
	CheckCircle,
	AlertCircle,
	Loader2,
	Settings,
	User,
} from 'lucide-react';

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

			setMessage({
				type: 'success',
				text: 'Profile updated successfully!',
			});
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
		<div className='min-h-screen bg-background'>
			{/* Navigation Header */}
			<header className='border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50'>
				<div className='container flex h-16 items-center space-x-4'>
					<Button
						variant='ghost'
						size='sm'
						asChild>
						<Link href='/dashboard'>
							<ArrowLeft className='h-4 w-4 mr-2' />
							Back to Dashboard
						</Link>
					</Button>
					<div className='flex items-center space-x-2'>
						<Settings className='h-5 w-5' />
						<span className='font-semibold'>Profile Settings</span>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='container py-8'>
				<div className='max-w-2xl mx-auto'>
					<Card>
						<CardHeader>
							<div className='flex items-center space-x-4'>
								<div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
									<User className='h-6 w-6 text-primary' />
								</div>
								<div>
									<CardTitle className='text-2xl'>Profile Settings</CardTitle>
									<CardDescription>
										Manage your account information and preferences
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							{message && (
								<Alert
									variant={message.type === 'error' ? 'destructive' : 'default'}
									className='mb-6'>
									{message.type === 'success' ? (
										<CheckCircle className='h-4 w-4' />
									) : (
										<AlertCircle className='h-4 w-4' />
									)}
									<AlertDescription>{message.text}</AlertDescription>
								</Alert>
							)}

							<form
								onSubmit={handleSubmit(onSubmit)}
								className='space-y-6'>
								<div className='space-y-2'>
									<Label htmlFor='name'>Full Name</Label>
									<Input
										{...register('name')}
										id='name'
										type='text'
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
									<Label htmlFor='email'>Email Address</Label>
									<Input
										{...register('email')}
										id='email'
										type='email'
										placeholder='Enter your email address'
										aria-invalid={errors.email ? 'true' : 'false'}
									/>
									{errors.email && (
										<p className='text-sm text-destructive'>
											{errors.email.message}
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label>Role</Label>
									<div className='flex items-center space-x-2'>
										<Badge variant='secondary'>{user?.role}</Badge>
										<p className='text-sm text-muted-foreground'>
											Your role cannot be changed from this interface.
										</p>
									</div>
								</div>

								<div className='pt-4'>
									<Button
										type='submit'
										disabled={isLoading}
										className='w-full sm:w-auto'>
										{isLoading ? (
											<>
												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
												Saving...
											</>
										) : (
											'Save Changes'
										)}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}

export default withAuth(ProfilePage);
