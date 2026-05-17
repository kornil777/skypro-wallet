import { post, setAuthToken } from './client';

export const loginApi = async (email, password) => {
  
  const response = await post('/auth/login', { email, password }, true);
  
  if (response && response.token) {
    setAuthToken(response.token);
    localStorage.setItem('token', response.token);
    
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
  }
  return response;
};

export const registerApi = async (email, password, name) => {
  const response = await post('/auth/register', { email, password, name }, true);
  if (response && response.token) {
    setAuthToken(response.token);
    localStorage.setItem('token', response.token);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
  }
  return response;
};

export const initAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
};