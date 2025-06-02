import { ApiConstant } from '@/constants/Api';
import { ApiClientConfig, ApiError } from '@/types/Api';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Cambia con il tuo backend
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Gestione token
export function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
export function removeAuthToken() {
  delete api.defaults.headers.common['Authorization'];
}
// Gestione errori
api.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiError>) => {
    const errResponse = error.response;
    if (errResponse) {
      const apiError: ApiError = {
        message: errResponse.data?.message || 'Errore sconosciuto',
        status: errResponse.status,
        code: errResponse.data?.code,
        details: errResponse.data?.details,
      };
      // Gestione errori specifici solo per lo sviluppo
      if (apiError.status === 401) {
        console.error('Token non valido o scaduto', apiError);
      } else if (apiError.status === 403) {
        console.error('Accesso negato', apiError);
      } else {
        console.error('Errore API', apiError);
      }

          return Promise.reject(apiError);
        }  
      }
    );

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.get<T>(url, config);
  return res.data;
}
export async function apiPost<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.post<T>(url, data, config);
  return res.data;
}
export async function apiPut<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.put<T>(url, data, config);
  return res.data;
}
export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.delete<T>(url, config);
  return res.data;
}

export default api;
