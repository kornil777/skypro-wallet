import { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, initAuth } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const hasToken = initAuth();
      if (hasToken) {
        
        const savedLogin = localStorage.getItem('user_login');
        const savedName = localStorage.getItem('user_name');
        if (savedLogin) {
          setUser({ login: savedLogin, name: savedName });
        } else {
          
          setUser({ login: 'user', name: 'Пользователь' });
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (login, password) => {
  try {
    const userData = await loginApi(login, password);
    localStorage.setItem('user_login', userData.login);
    localStorage.setItem('user_name', userData.name);
    setUser({ login: userData.login, name: userData.name });
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    // Возвращаем кастомное сообщение вместо технического
    return { success: false, error: "Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку." };
  }
};

const register = async (login, password, name) => {
  try {
    const userData = await registerApi(login, password, name);
    localStorage.setItem('user_login', userData.login);
    localStorage.setItem('user_name', userData.name);
    setUser({ login: userData.login, name: userData.name });
    return { success: true };
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, error: "Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку." };
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_login');
    localStorage.removeItem('user_name');
    setUser(null);
    
    import('../api/client').then(({ setAuthToken }) => setAuthToken(null));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);