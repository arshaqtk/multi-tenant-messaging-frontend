import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const TOKEN_KEY = 'chat_app_token';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function normalizeError(error) {
  return error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || 'Request failed';
}

export async function registerUser(payload) {
  try {
    const { data } = await api.post('/auth/register-org-admin', payload);
    return data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function loginUser(payload) {
  try {
    const { data } = await api.post('/auth/login', payload);
    return data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function fetchUsers() {
  try {
    const { data } = await api.get('/users');
    return data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function createOrgUser(payload) {
  try {
    const { data } = await api.post('/users', payload);
    return data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function fetchGroups() {
  try {
    const { data } = await api.get('/groups');
    return data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function createGroup(payload) {
  try {
    const { data } = await api.post('/groups', payload);
    return data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function addUserToGroup(groupId, userId) {
  try {
    const { data } = await api.post(`/groups/${groupId}/members`, { userId });
    return data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function fetchGroupMessages(groupId, limit = 50) {
  try {
    const { data } = await api.get(`/groups/${groupId}/messages?limit=${limit}`);
    return data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function sendGroupMessage(groupId, text) {
  try {
    const { data } = await api.post(`/groups/${groupId}/messages`, { text });
    return data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function removeUserFromGroup(groupId, userId) {
  throw new Error(
    'DELETE /groups/:groupId/users/:userId route is not available in current backend'
  );
}

export { TOKEN_KEY };
