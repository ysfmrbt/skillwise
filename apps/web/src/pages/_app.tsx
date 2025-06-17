import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/sonner';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider defaultTheme='system'>
			<NotificationProvider>
				<AuthProvider>
					<Component {...pageProps} />
					<Toaster />
				</AuthProvider>
			</NotificationProvider>
		</ThemeProvider>
	);
}
