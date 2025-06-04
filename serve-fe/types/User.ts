export interface User{
    id: number;
    username: string,
    isAuthenticated: boolean
    token: string | null
    email: string
}
export interface UserState {
    profile: User | null;
    isLoading: boolean;
    error: string | null;
}