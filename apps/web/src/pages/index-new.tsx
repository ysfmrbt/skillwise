import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Loader2, BookOpen, Target, Trophy, GraduationCap } from 'lucide-react';

export default function Home() {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-background'>
				<div className='flex items-center space-x-2'>
					<Loader2 className='h-6 w-6 animate-spin' />
					<span>Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background'>
			{/* Navigation Header */}
			<header className='border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50'>
				<div className='container flex h-16 items-center justify-between'>
					<Link
						href='/'
						className='flex items-center space-x-2'>
						<GraduationCap className='h-6 w-6' />
						<span className='font-bold text-xl'>SkillWise</span>
					</Link>
					<div className='flex items-center space-x-4'>
						{user ? (
							<>
								<span className='text-sm text-muted-foreground'>
									Welcome, {user.name || user.email}
								</span>
								<Button asChild>
									<Link href='/dashboard'>Dashboard</Link>
								</Button>
							</>
						) : (
							<>
								<Button
									variant='ghost'
									asChild>
									<Link href='/auth/login'>Sign In</Link>
								</Button>
								<Button asChild>
									<Link href='/auth/register'>Get Started</Link>
								</Button>
							</>
						)}
					</div>
				</div>
			</header>

			<div className='container py-12'>
				{/* Hero Section */}
				<div className='text-center mb-16'>
					<h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-6'>
						Welcome to <span className='text-primary'>SkillWise</span>
					</h1>
					<p className='text-xl text-muted-foreground mb-8 max-w-3xl mx-auto'>
						Unlock your potential with our comprehensive learning platform.
						Discover courses, connect with expert instructors, and advance your
						skills.
					</p>

					{user ? (
						<div className='flex justify-center gap-4'>
							<Button
								size='lg'
								asChild>
								<Link href='/dashboard'>Go to Dashboard</Link>
							</Button>
							<Button
								size='lg'
								variant='outline'
								asChild>
								<Link href='/courses'>Browse Courses</Link>
							</Button>
						</div>
					) : (
						<div className='flex justify-center gap-4'>
							<Button
								size='lg'
								asChild>
								<Link href='/auth/register'>Get Started</Link>
							</Button>
							<Button
								size='lg'
								variant='outline'
								asChild>
								<Link href='/auth/login'>Sign In</Link>
							</Button>
						</div>
					)}
				</div>

				{/* Features Section */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
					<Card>
						<CardHeader className='text-center'>
							<BookOpen className='h-12 w-12 mx-auto mb-4 text-primary' />
							<CardTitle>Expert-Led Courses</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription className='text-center'>
								Learn from industry professionals with real-world experience
							</CardDescription>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='text-center'>
							<Target className='h-12 w-12 mx-auto mb-4 text-primary' />
							<CardTitle>Skill-Based Learning</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription className='text-center'>
								Focus on practical skills that advance your career
							</CardDescription>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='text-center'>
							<Trophy className='h-12 w-12 mx-auto mb-4 text-primary' />
							<CardTitle>Track Progress</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription className='text-center'>
								Monitor your learning journey with detailed analytics
							</CardDescription>
						</CardContent>
					</Card>
				</div>

				{/* Call to Action */}
				{!user && (
					<Card className='bg-primary text-primary-foreground'>
						<CardContent className='text-center p-12'>
							<h2 className='text-3xl font-bold mb-4'>
								Ready to Start Learning?
							</h2>
							<p className='text-xl mb-6 opacity-90'>
								Join thousands of learners advancing their careers with
								SkillWise
							</p>
							<Button
								size='lg'
								variant='secondary'
								asChild>
								<Link href='/auth/register'>Create Your Free Account</Link>
							</Button>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
