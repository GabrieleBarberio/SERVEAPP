import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface User{
    id: number;
    username: string,
    email: string
}
interface UserState {
    profile: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export const fetchUser =  createAsyncThunk<User, number>(
    'user/fetchUser',
    async (userId: number) => {
        try {
            const response = await fetch(`/api/users/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error: any) {
            return console.error(error.message);
        }
    }
);
const initialState: UserState = {
    profile: null,
    isAuthenticated: false,
    loading: false,
    error: null
};
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state: UserState, action: PayloadAction<User>) => {
            state.profile = action.payload;
            state.isAuthenticated = true;   
            state.error = null;
        },
        logout: (state: UserState) => {
            state.profile = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state: UserState) => {
            state.error = null;
        }
            
    },
    extraReducers: (builder: any) => {
        builder
        .addCase(fetchUser.pending, (state: UserState) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUser.fulfilled, (state: UserState, action: PayloadAction<User>) => {
            state.profile = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        })
        .addCase(fetchUser.rejected, (state: UserState, action: PayloadAction<User>) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch user';
            state.isAuthenticated = false;
        });
},
});
export const { login, logout, clearError } = userSlice.actions;
export default userSlice.reducer;