const BASE_URL = 'https://wedev-api.sky.pro/api';

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

const request = async (endpoint, options = {}) => {
  const { skipJsonContentType = false, ...fetchOptions } = options;
  
  const headers = {
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };
  
  if (!skipJsonContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  
  let body = options.body;
  if (skipJsonContentType && body && typeof body === 'object') {
    body = new URLSearchParams(body).toString();
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    body,
  });

  if (!response.ok) {
    let errorMessage = `Ошибка ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

export const get = (endpoint) => request(endpoint, { method: 'GET' });
export const post = (endpoint, data, skipJsonContentType = false) => 
  request(endpoint, { method: 'POST', body: data, skipJsonContentType });
export const patch = (endpoint, data) => 
  request(endpoint, { method: 'PATCH', body: data });
export const del = (endpoint) => request(endpoint, { method: 'DELETE' });