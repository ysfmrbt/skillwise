import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react';
import { api } from '@/lib/api';

// User type definition
export interface User {
	id: string;
	email: string;
	name: string;
	role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN';
}

// Auth context type
interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name: string) => Promise<void>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Check if user is authenticated on mount
	useEffect(() => {
		// Don't check auth on auth pages to prevent infinite loops
		if (typeof window !== 'undefined') {
			const currentPath = window.location.pathname;
			if (currentPath.startsWith('/auth/')) {
				setIsLoading(false);
				return;
			}
		}
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			setIsLoading(true);
			const response = await api.get('/auth/profile');

			// The profile endpoint returns JWT payload, we need to get full user data
			// For now, we'll use the basic info from the token
			setUser({
				id: response.data.sub,
				email: response.data.email,
				name: response.data.email.split('@')[0], // Temporary until we get full profile
				role: response.data.role,
			});
		} catch (error) {
			// User is not authenticated
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			const response = await api.post('/auth/login', { email, password });

			// Set user from response
			setUser(response.data.user);

			// Redirect to dashboard after successful login
			if (typeof window !== 'undefined') {
				window.location.href = '/dashboard';
			}
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Login failed');
		}
	};

	const register = async (email: string, password: string, name: string) => {
		try {
			const response = await api.post('/auth/register', {
				email,
				password,
				name,
			});

			// Set user from response
			setUser(response.data.user);

			// Redirect to dashboard after successful registration
			if (typeof window !== 'undefined') {
				window.location.href = '/dashboard';
			}
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Registration failed');
		}
	};

	const logout = async () => {
		try {
			await api.post('/auth/logout');
		} catch (error) {
			// Even if logout fails on server, clear local state
			console.error('Logout error:', error);
		} finally {
			setUser(null);

			// Redirect to login page
			if (typeof window !== 'undefined') {
				window.location.href = '/auth/login';
			}
		}
	};

	const refreshUser = async () => {
		await checkAuth();
	};

	const value = {
		user,
		isLoading,
		login,
		register,
		logout,
		refreshUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
