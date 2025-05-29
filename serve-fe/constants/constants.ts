
// API Configuration
export const API_CONFIG = {
  BASE_URL:'http://localhost:3000/',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    AVATAR: '/user/avatar',
    PREFERENCES: '/user/preferences',
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  APP_SETTINGS: '@app_settings',
  ONBOARDING_COMPLETED: '@onboarding_completed',
};

// Redux Persist Config
export const PERSIST_CONFIG = {
  key: 'root',
  whitelist: ['auth', 'settings'], // Slice da persistere
  blacklist: ['api', 'ui'], // Slice da NON persistere
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
};

// App States
export const APP_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  IDLE: 'idle',
};

// User Roles (se necessario)
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
};

// Navigation Routes
export const ROUTES = {
  // Auth Stack
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',

  // Main Stack
  HOME: 'Home',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',

  // Nested
  PROFILE_EDIT: 'ProfileEdit',
  CHANGE_PASSWORD: 'ChangePassword',
};
