import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

// Loading component
const LoadingSpinner = () => (
	<div className='min-h-screen flex items-center justify-center bg-background'>
		<Loader2 className='h-8 w-8 animate-spin text-primary' />
	</div>
);

// HOC for protecting routes that require authentication
export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
	const AuthComponent = (props: P) => {
		const { user, isLoading } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (!isLoading && !user) {
				router.push('/auth/login');
			}
		}, [user, isLoading, router]);

		if (isLoading) {
			return <LoadingSpinner />;
		}

		if (!user) {
			return null; // Will redirect
		}

		return <WrappedComponent {...props} />;
	};

	return AuthComponent;
}

// HOC for protecting routes based on user roles
export function withRole<P extends object>(
	WrappedComponent: ComponentType<P>,
	allowedRoles: string[],
) {
	const RoleComponent = (props: P) => {
		const { user, isLoading } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (!isLoading && user && !allowedRoles.includes(user.role)) {
				router.push('/unauthorized');
			}
		}, [user, isLoading, router]);

		if (isLoading) {
			return <LoadingSpinner />;
		}

		if (!user || !allowedRoles.includes(user.role)) {
			return null; // Will redirect
		}

		return <WrappedComponent {...props} />;
	};

	return RoleComponent;
}

// HOC for routes that should only be accessible when NOT authenticated (login, register)
export function withGuest<P extends object>(
	WrappedComponent: ComponentType<P>,
) {
	const GuestComponent = (props: P) => {
		const { user, isLoading } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (!isLoading && user) {
				router.push('/dashboard');
			}
		}, [user, isLoading, router]);

		if (isLoading) {
			return <LoadingSpinner />;
		}

		if (user) {
			return null; // Will redirect
		}

		return <WrappedComponent {...props} />;
	};

	return GuestComponent;
}
