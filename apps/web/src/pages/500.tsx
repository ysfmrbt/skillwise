import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ServerCrash, Home, RefreshCw } from 'lucide-react';

export default function Custom500() {
	const handleRefresh = () => {
		window.location.reload();
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
			<Card className='w-full max-w-md text-center'>
				<CardHeader>
					<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10'>
						<ServerCrash className='h-8 w-8 text-destructive' />
					</div>
					<CardTitle className='text-3xl font-bold'>500</CardTitle>
					<CardDescription className='text-lg'>
						Something went wrong on our end.
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<p className='text-sm text-muted-foreground'>
						We're experiencing some technical difficulties. Our team has been
						notified and is working to fix the issue.
					</p>
					<div className='space-y-3'>
						<Button
							onClick={handleRefresh}
							className='w-full'>
							<RefreshCw className='mr-2 h-4 w-4' />
							Try Again
						</Button>
						<Button
							variant='outline'
							asChild
							className='w-full'>
							<Link href='/'>
								<Home className='mr-2 h-4 w-4' />
								Go to Homepage
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
