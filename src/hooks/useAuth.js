import { useEffect, useState } from 'react';
import api from '../api/axios';
import { clearTokens } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch {
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  return {
    user,
    loading,
    isAdmin: user?.role === 'ADMIN',
    isUser: user?.role === 'USER'
  };
};
