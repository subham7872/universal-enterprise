// Base URL configuration - cleans any trailing slashes or duplicate /api prefixes
const getApiBase = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6060';
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed.slice(0, -4) : trimmed;
};

const API_BASE = getApiBase();

async function request(endpoint, options = {}) {
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Ensure endpoint starts with /api if not already
  if (!cleanEndpoint.startsWith('/api/') && cleanEndpoint !== '/api') {
    cleanEndpoint = `/api${cleanEndpoint}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${cleanEndpoint}`;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('crm_token') : null;
  const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`[API Error ${cleanEndpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/products${query ? `?${query}` : ''}`);
  },
  getProductById: (id) => request(`/api/products/${id}`),
  getBrands: () => request('/api/products/brands'),
  getSuggestions: (searchQuery) => request(`/api/products/suggestions?query=${encodeURIComponent(searchQuery)}`),
  createProduct: (productData) => request('/api/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  updateProduct: (id, productData) => request(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  deleteProduct: (id) => request(`/api/products/${id}`, {
    method: 'DELETE',
  }),
  uploadProductImage: (imageBase64, filename, productId) => request('/api/products/upload-image', {
    method: 'POST',
    body: JSON.stringify({ imageBase64, filename, productId }),
  }),
  uploadCsv: (csvText) => request('/api/products/upload', {
    method: 'POST',
    body: JSON.stringify({ csvText }),
  }),

  // AI Chat
  sendChatMessage: (messages) => request('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  }),

  // Quotes
  submitQuote: (quoteData) => request('/api/quotes', {
    method: 'POST',
    body: JSON.stringify(quoteData),
  }),
  getQuoteById: (quoteId) => request(`/api/quotes/${quoteId}`),
  getQuotesByEmail: (email) => request(`/api/quotes/by-email?email=${encodeURIComponent(email)}`),
  getQuotes: () => request('/api/quotes'),

  // Orders / Tracking
  getOrderByReference: (refId) => request(`/api/orders/${refId}`),
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/orders${query ? `?${query}` : ''}`);
  },

  // CRM Leads & Unified Form Ingestion
  getLeads: () => request('/api/leads'),
  submitLead: (leadData) => request('/api/leads/submit', {
    method: 'POST',
    body: JSON.stringify(leadData),
  }),
  createLead: (leadData) => request('/api/leads/submit', {
    method: 'POST',
    body: JSON.stringify(leadData),
  }),
  updateLead: (id, data) => request(`/api/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteLead: (id) => request(`/api/leads/${id}`, {
    method: 'DELETE',
  }),

  // Auth
  loginAdmin: (creds) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(creds),
  }),
  verifyAdmin: () => request('/api/auth/verify'),

  // Customers
  getCustomers: () => request('/api/customers'),
  createCustomer: (customerData) => request('/api/customers', {
    method: 'POST',
    body: JSON.stringify(customerData),
  }),

  // Appointments
  getAppointments: () => request('/api/appointments'),
  createAppointment: (aptData) => request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(aptData),
  }),
  updateAppointment: (id, data) => request(`/api/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Call Logs
  getCallLogs: () => request('/api/calls'),

  // Workflows
  getWorkflows: () => request('/api/workflows'),
  createWorkflow: (wfData) => request('/api/workflows', {
    method: 'POST',
    body: JSON.stringify(wfData),
  }),
  toggleWorkflow: (id) => request(`/api/workflows/${id}/toggle`, {
    method: 'PATCH',
  }),

  // Analytics
  getAnalytics: () => request('/api/analytics/metrics'),
};

export default api;
