// PostgREST API client. Reads use VITE_API_KEY; admin writes require a JWT obtained from an interactive login (no auto-login from baked credentials).

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const AUTH_URL = import.meta.env.VITE_AUTH_SERVICE_URL;

class PostgRESTClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.authToken = null;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'apikey': this.apiKey,
      ...options.headers,
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'Request failed');
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async select(table, query = '') {
    const queryString = query ? `?${query}` : '';
    return this.request(`/${table}${queryString}`);
  }

  async insert(table, data, returnData = true) {
    const headers = returnData ? { 'Prefer': 'return=representation' } : {};
    return this.request(`/${table}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  async update(table, data, query) {
    return this.request(`/${table}?${query}`, {
      method: 'PATCH',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify(data),
    });
  }

  async delete(table, query) {
    return this.request(`/${table}?${query}`, {
      method: 'DELETE',
    });
  }

  async upsert(table, data, returnData = true) {
    const headers = {
      'Prefer': returnData ? 'return=representation,resolution=merge-duplicates' : 'resolution=merge-duplicates',
    };
    return this.request(`/${table}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  // Interactive login. Caller supplies creds from a form, never from env.
  async authenticate(email, password) {
    const response = await fetch(`${AUTH_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Authentication failed');
    const data = await response.json();
    if (data.access_token) {
      this.authToken = data.access_token;
      localStorage.setItem('auth_token', data.access_token);
    }
    return data;
  }

  restoreToken() {
    const token = localStorage.getItem('auth_token');
    if (token) this.authToken = token;
  }

  clearToken() {
    this.authToken = null;
    localStorage.removeItem('auth_token');
  }

  isAuthed() {
    return this.authToken !== null;
  }
}

export const api = new PostgRESTClient(API_URL, API_KEY);
api.restoreToken();
