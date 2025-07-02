import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (credentials: any) => {
  const response = await apiClient.post('/users/login', credentials, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const getPosts = async () => {
  const response = await apiClient.get('/posts');
  return response.data;
};

export const getPost = async (id: string) => {
  const response = await apiClient.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (post: any, token: string) => {
  const response = await apiClient.post('/posts', post, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updatePost = async (id: string, post: any, token: string) => {
  const response = await apiClient.put(`/posts/${id}`, post, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deletePost = async (id: string, token: string) => {
  const response = await apiClient.delete(`/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCurrentUser = async (token: string) => {
  const response = await apiClient.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
