export const URI = {
    // Base URL for the API
    BASE_URL: 'http://localhost:3000',

    // Authentication endpoints
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',

    // User profile endpoints
    USER_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/update-profile',
    CHANGE_PASSWORD: '/user/change-password',

    // Product endpoints
    PRODUCTS: '/products',
    PRODUCT_DETAILS: (id: string) => `/products/${id}`,
    CREATE_PRODUCT: '/products/create',
    UPDATE_PRODUCT: (id: string) => `/products/${id}/update`,
    DELETE_PRODUCT: (id: string) => `/products/${id}/delete`,

    // Order endpoints
    ORDERS: '/orders',
    ORDER_DETAILS: (id: string) => `/orders/${id}`,
};
