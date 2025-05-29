import { useState, useCallback } from 'react';
import { apiUtils } from '../utils/apiClient';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, config) =>
    request(() => apiUtils.get(url, config)), [request]);

  const post = useCallback((url, data, config) =>
    request(() => apiUtils.post(url, data, config)), [request]);

  const put = useCallback((url, data, config) =>
    request(() => apiUtils.put(url, data, config)), [request]);

  const patch = useCallback((url, data, config) =>
    request(() => apiUtils.patch(url, data, config)), [request]);

  const del = useCallback((url, config) =>
    request(() => apiUtils.delete(url, config)), [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    clearError: () => setError(null),
  };
};
