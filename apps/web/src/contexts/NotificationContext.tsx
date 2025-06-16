import { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	title: string;
	message?: string;
	duration?: number;
}

interface NotificationContextType {
	notifications: Notification[];
	addNotification: (notification: Omit<Notification, 'id'>) => void;
	removeNotification: (id: string) => void;
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
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const addNotification = (notification: Omit<Notification, 'id'>) => {
		const id = Math.random().toString(36).substr(2, 9);
		const newNotification = { ...notification, id };

		setNotifications((prev) => [...prev, newNotification]);

		// Auto-remove notification after duration (default 5 seconds)
		const duration = notification.duration || 5000;
		setTimeout(() => {
			removeNotification(id);
		}, duration);
	};

	const removeNotification = (id: string) => {
		setNotifications((prev) => prev.filter((notif) => notif.id !== id));
	};

	return (
		<NotificationContext.Provider
			value={{ notifications, addNotification, removeNotification }}>
			{children}
			<NotificationContainer />
		</NotificationContext.Provider>
	);
};

const NotificationContainer = () => {
	const { notifications, removeNotification } = useNotification();

	return (
		<div className='fixed top-4 right-4 z-50 space-y-2'>
			{notifications.map((notification) => (
				<NotificationItem
					key={notification.id}
					notification={notification}
					onClose={() => removeNotification(notification.id)}
				/>
			))}
		</div>
	);
};

interface NotificationItemProps {
	notification: Notification;
	onClose: () => void;
}

const NotificationItem = ({ notification, onClose }: NotificationItemProps) => {
	const getNotificationStyles = () => {
		switch (notification.type) {
			case 'success':
				return 'bg-green-50 border-green-200 text-green-800';
			case 'error':
				return 'bg-red-50 border-red-200 text-red-800';
			case 'warning':
				return 'bg-yellow-50 border-yellow-200 text-yellow-800';
			case 'info':
			default:
				return 'bg-blue-50 border-blue-200 text-blue-800';
		}
	};

	const getIcon = () => {
		switch (notification.type) {
			case 'success':
				return '✓';
			case 'error':
				return '✕';
			case 'warning':
				return '⚠';
			case 'info':
			default:
				return 'ℹ';
		}
	};

	return (
		<div
			className={`border rounded-lg p-4 shadow-lg min-w-80 max-w-md ${getNotificationStyles()}`}>
			<div className='flex items-start'>
				<div className='flex-shrink-0 mr-3 text-lg'>{getIcon()}</div>
				<div className='flex-1'>
					<h4 className='font-medium'>{notification.title}</h4>
					{notification.message && (
						<p className='mt-1 text-sm opacity-90'>{notification.message}</p>
					)}
				</div>
				<button
					onClick={onClose}
					className='flex-shrink-0 ml-3 text-lg hover:opacity-70'>
					×
				</button>
			</div>
		</div>
	);
};
