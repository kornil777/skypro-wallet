let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => authToken || localStorage.getItem('token');

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`https://wedev-api.sky.pro/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Ошибка ${response.status}`);
  }
  return response.json();
};

export const get = (endpoint) => request(endpoint, { method: 'GET' });
export const post = (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) });
export const patch = (endpoint, data) => request(endpoint, { method: 'PATCH', body: JSON.stringify(data) });
export const del = (endpoint) => request(endpoint, { method: 'DELETE' });