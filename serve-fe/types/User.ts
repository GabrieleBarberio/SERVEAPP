export interface User{
    id: number;
    username: string,
    token: string | null
    email: string
}
export interface UserState {
    profile: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}