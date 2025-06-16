import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from '@/components/ui/sonner';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<NotificationProvider>
			<AuthProvider>
				<Component {...pageProps} />
				<Toaster />
			</AuthProvider>
		</NotificationProvider>
	);
}
