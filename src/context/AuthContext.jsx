import { createContext, useContext, useState, useEffect } from "react";
import { setUser, clearUserData } from "../api/expensesApi";

const AuthContext = createContext();

const USERS_STORAGE_KEY = "skypro_wallet_users";

const getUsers = () => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveUser = (email, password, name) => {
  const users = getUsers();
  const existing = users.find((u) => u.email === email);
  if (existing) {
    throw new Error("Пользователь с таким email уже существует");
  }
  const newUser = { email, password, name };
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return newUser;
};

const verifyCredentials = (email, password) => {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Неверный email или пароль");
  }
  return { email: user.email, name: user.name };
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData.email);
      return userData;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const register = (email, password, name) => {
    try {
      const userData = saveUser(email, password, name || email.split("@")[0]);
      localStorage.setItem(
        "user",
        JSON.stringify({ email: userData.email, name: userData.name })
      );
      setUserState({ email: userData.email, name: userData.name });
      setUser(userData.email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = (email, password) => {
    try {
      const userData = verifyCredentials(email, password);
      localStorage.setItem("user", JSON.stringify(userData));
      setUserState(userData);
      setUser(email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    clearUserData();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
