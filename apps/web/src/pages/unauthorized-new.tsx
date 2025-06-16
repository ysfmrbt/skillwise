import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-background p-4'>
			<Card className='w-full max-w-md text-center'>
				<CardHeader>
					<div className='flex justify-center mb-4'>
						<div className='flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10'>
							<AlertTriangle className='h-8 w-8 text-destructive' />
						</div>
					</div>
					<CardTitle className='text-2xl'>Access Denied</CardTitle>
					<CardDescription>
						You don't have permission to access this page. Please contact your
						administrator if you believe this is an error.
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Button
						asChild
						className='w-full'>
						<Link href='/dashboard'>
							<ArrowLeft className='mr-2 h-4 w-4' />
							Go to Dashboard
						</Link>
					</Button>
					<Button
						variant='outline'
						asChild
						className='w-full'>
						<Link href='/'>
							<Home className='mr-2 h-4 w-4' />
							Return to Home
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
