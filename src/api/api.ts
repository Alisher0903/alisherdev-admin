import axios from 'axios';

const axiosBase = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosBase.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosBase.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post('/api/auth/refresh-token');
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return axiosBase(originalRequest);
      } catch (refreshError) {
        // Redirect to login or handle error
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { axiosBase };
