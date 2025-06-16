import axios from 'axios';

// Create axios instance with default config
export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9357',
	withCredentials: true, // Important: This enables HTTP-only cookies
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor for adding any additional headers
api.interceptors.request.use(
	(config) => {
		// You can add additional headers here if needed
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Handle common errors
		if (error.response?.status === 401) {
			// Only redirect to login if we're not already on auth pages
			if (typeof window !== 'undefined') {
				const currentPath = window.location.pathname;
				if (!currentPath.startsWith('/auth/')) {
					window.location.href = '/auth/login';
				}
			}
		}
		return Promise.reject(error);
	},
);

export default api;
