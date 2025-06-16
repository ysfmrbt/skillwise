import { createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';

interface NotificationContextType {
	success: (message: string, description?: string) => void;
	error: (message: string, description?: string) => void;
	warning: (message: string, description?: string) => void;
	info: (message: string, description?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined,
);

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			'useNotification must be used within a NotificationProvider',
		);
	}
	return context;
};

interface NotificationProviderProps {
	children: ReactNode;
}

export const NotificationProvider = ({
	children,
}: NotificationProviderProps) => {
	const success = (message: string, description?: string) => {
		toast.success(message, {
			description,
		});
	};

	const error = (message: string, description?: string) => {
		toast.error(message, {
			description,
		});
	};

	const warning = (message: string, description?: string) => {
		toast.warning(message, {
			description,
		});
	};

	const info = (message: string, description?: string) => {
		toast.info(message, {
			description,
		});
	};

	return (
		<NotificationContext.Provider value={{ success, error, warning, info }}>
			{children}
		</NotificationContext.Provider>
	);
};
