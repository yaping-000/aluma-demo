// API utility functions for handling environment-specific base URLs

// Get the API base URL based on environment
export const getApiBaseUrl = () => {
  // In production, use the environment variable
  if (import.meta.env.PROD) {
    const envUrl =
      import.meta.env.VITE_API_BASE_URL ||
      "https://aluma-backend-production.up.railway.app"
    // Remove /upload if it's included in the URL and ensure no trailing slash
    return envUrl.replace(/\/upload$/, "").replace(/\/$/, "")
  }

  // In development, use localhost
  return "http://localhost:3000"
}

// Helper function to make API calls with proper base URL
export const apiCall = async (endpoint, options = {}) => {
  const baseUrl = getApiBaseUrl()
  // Ensure no double slashes by removing trailing slash from baseUrl and leading slash from endpoint
  const cleanBaseUrl = baseUrl.replace(/\/$/, "")
  const cleanEndpoint = endpoint.replace(/^\//, "")
  const url = `${cleanBaseUrl}/${cleanEndpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(
      `API call failed: ${response.status} ${response.statusText}`
    )
  }

  return response.json()
}
