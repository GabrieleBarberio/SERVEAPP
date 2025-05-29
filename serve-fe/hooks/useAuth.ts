import { useDispatch, useSelector } from 'react-redux';


export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;


import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  logoutUser,
  fetchUserProfile,
  clearError,
  selectAuth,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();


  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);


  const login = (credentials) => dispatch(loginUser(credentials));
  const logout = () => dispatch(logoutUser());
  const getUserProfile = () => dispatch(fetchUserProfile());
  const clearAuthError = () => dispatch(clearError());

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    login,
    logout,
    getUserProfile,
    clearAuthError,
  };
};

