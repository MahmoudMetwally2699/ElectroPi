import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('electropi_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    setUser(data);
    localStorage.setItem('electropi_user', JSON.stringify(data));
    return data;
  };

  const register = async (userData) => {
    const { data } = await registerUser(userData);
    setUser(data);
    localStorage.setItem('electropi_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('electropi_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
