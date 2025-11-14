import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
};

// Habit API
export const habitAPI = {
    getAll: () => api.get('/habits'),
    getActive: () => api.get('/habits/active'),
    getById: (id) => api.get(`/habits/${id}`),
    create: (data) => api.post('/habits', data),
    update: (id, data) => api.put(`/habits/${id}`, data),
    delete: (id) => api.delete(`/habits/${id}`),
    getStats: (id) => api.get(`/habits/${id}/stats`),
};

// Habit Log API
export const habitLogAPI = {
    log: (data) => api.post('/habit-logs', data),
    getByHabit: (habitId, startDate, endDate) =>
        api.get(`/habit-logs/habit/${habitId}`, { params: { startDate, endDate } }),
    getRecent: (limit = 10) => api.get('/habit-logs/recent', { params: { limit } }),
};

// Dashboard API
export const dashboardAPI = {
    get: () => api.get('/dashboard'),
    getMilestones: () => api.get('/dashboard/milestones'),
    getAchievements: () => api.get('/dashboard/achievements'),
};

export default api;