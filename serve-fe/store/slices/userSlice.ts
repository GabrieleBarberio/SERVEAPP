import { UserState, User } from '@/types/User';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';




const initialState: UserState = {
    profile: null,
    isLoading: false,
    error: null
};
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state: UserState, action: PayloadAction<{ user: User, serveToken: string }>) => {
        state.profile = {
        ...action.payload.user,
        isAuthenticated: true,
        token: action.payload.serveToken,
    };
    state.error = null;
},
        logout: (state: UserState) => {
            state.profile = null;
            state.error = null;
        },
        clearError: (state: UserState) => {
            state.error = null;
        }
            
    }
});
export const { login, logout, clearError } = userSlice.actions;
export default userSlice.reducer;