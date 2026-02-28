// Native PostgREST API client - 100% self-hosted

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

    // If authenticated, use the auth token instead
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

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // GET request
  async select(table, query = '') {
    const queryString = query ? `?${query}` : '';
    return this.request(`/${table}${queryString}`);
  }

  // POST request (insert)
  async insert(table, data, returnData = true) {
    const headers = returnData ? { 'Prefer': 'return=representation' } : {};
    return this.request(`/${table}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  // PATCH request (update)
  async update(table, data, query) {
    return this.request(`/${table}?${query}`, {
      method: 'PATCH',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(table, query) {
    return this.request(`/${table}?${query}`, {
      method: 'DELETE',
    });
  }

  // UPSERT request (insert or update)
  async upsert(table, data, returnData = true) {
    const headers = {
      'Prefer': returnData ? 'return=representation,resolution=merge-duplicates' : 'resolution=merge-duplicates'
    };
    return this.request(`/${table}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  // Authentication
  async authenticate(email, password) {
    try {
      const response = await fetch(`${AUTH_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();

      if (data.access_token) {
        this.authToken = data.access_token;
        localStorage.setItem('auth_token', data.access_token);
      }

      return data;
    } catch (error) {
      console.error('Authentication error:', error.message);
      throw error;
    }
  }
}

// Create and export the API client
export const api = new PostgRESTClient(API_URL, API_KEY);

// Export authentication function for convenience
export const authenticateAPI = async () => {
  const email = import.meta.env.VITE_APP_USER_EMAIL;
  const password = import.meta.env.VITE_APP_USER_PASSWORD;
  return api.authenticate(email, password);
};
