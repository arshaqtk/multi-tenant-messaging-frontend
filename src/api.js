const API_BASE_URL = import.meta.env.VITE_API_BASE_URL';

async function request(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || 'Request failed';
    throw new Error(message);
  }

  return data;
}

export function login(payload) {
  return request('/auth/login', { method: 'POST', body: payload });
}

export function registerOrgAdmin(payload) {
  return request('/auth/register-org-admin', { method: 'POST', body: payload });
}

export function getGroups(token) {
  return request('/groups', { token });
}

export function getMessages(token, groupId, limit = 50) {
  return request(`/groups/${groupId}/messages?limit=${limit}`, { token });
}

export function postMessage(token, groupId, text) {
  return request(`/groups/${groupId}/messages`, {
    method: 'POST',
    token,
    body: { text },
  });
}

export function getAllUsers(token) {
  return request('/api/users', { token });
}

export function getAllGroups(token) {
  return request('/api/groups', { token });
}

export function createGroup(token, payload) {
  return request('/api/groups', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function addUserToGroup(token, groupId, userId) {
  return request(`/api/groups/${groupId}/users`, {
    method: 'PUT',
    token,
    body: { userId },
  });
}

export function removeUserFromGroup(token, groupId, userId) {
  return request(`/api/groups/${groupId}/users/${userId}`, {
    method: 'DELETE',
    token,
  });
}
