import React, {createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';

const AuthContext = createContext();

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const res = await axios.post('/auth/refresh');
        const {token: newToken, user: newUser} = res.data.data;
        setToken(newToken);
        setUser(newUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    refreshSession();
  }, []);

  const login = async (login, password) => {
    const res = await axios.post('/auth/login', {login, password});
    const {token: newToken, user: newUser} = res.data.data;
    setToken(newToken);
    setUser(newUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    // Опционально: вызвать /auth/logout, если реализовано на бэке
  };

  return (
    <AuthContext.Provider value={{user, token, login, logout, isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};