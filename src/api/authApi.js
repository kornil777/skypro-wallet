import { post, setAuthToken } from './client';

export const loginApi = async (login, password) => {
  const response = await post('/user/login', { login, password });
  
  if (response.user?.token) {
    setAuthToken(response.user.token);
  }
  return response.user;
};

export const registerApi = async (login, password, name) => {
  const response = await post('/user', { login, name, password });
  
  if (response.user?.token) {
    setAuthToken(response.user.token);
  }
  return response.user;
};

export const initAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
};