// API Configuration
export const API_CONFIG = {
  // Base URL for API calls
  // Can be overridden via NEXT_PUBLIC_API_BASE_URL environment variable
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',

  // API endpoints
  endpoints: {
    documents: '/api/documents',
    employees: '/api/employees'
    // Add other endpoints here
  },

  // Helper function to get full URL
  getUrl: (endpoint: string) => {
    const baseUrl = API_CONFIG.baseUrl;
    return baseUrl ? `${baseUrl}${endpoint}` : endpoint;
  }
};

// Helper function to create API URL
export function createApiUrl(endpoint: string): string {
  return API_CONFIG.getUrl(endpoint);
}

// Export commonly used URLs
export const API_URLS = {
  documents: createApiUrl(API_CONFIG.endpoints.documents),
  employees: createApiUrl(API_CONFIG.endpoints.employees)
};
