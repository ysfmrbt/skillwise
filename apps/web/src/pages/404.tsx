import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function Custom404() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
			<Card className='w-full max-w-md text-center'>
				<CardHeader>
					<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10'>
						<AlertCircle className='h-8 w-8 text-destructive' />
					</div>
					<CardTitle className='text-3xl font-bold'>404</CardTitle>
					<CardDescription className='text-lg'>
						Oops! The page you're looking for doesn't exist.
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<p className='text-sm text-muted-foreground'>
						The page you requested could not be found. It might have been moved,
						deleted, or you entered the wrong URL.
					</p>
					<div className='space-y-3'>
						<Button
							asChild
							className='w-full'>
							<Link href='/'>
								<Home className='mr-2 h-4 w-4' />
								Go to Homepage
							</Link>
						</Button>
						<Button
							variant='outline'
							asChild
							className='w-full'>
							<Link href='/dashboard'>
								<ArrowLeft className='mr-2 h-4 w-4' />
								Back to Dashboard
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
