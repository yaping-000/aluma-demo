// API utility functions for handling environment-specific base URLs

// Get the API base URL based on environment
export const getApiBaseUrl = () => {
  // In production, use the environment variable
  if (import.meta.env.PROD) {
    const envUrl =
      import.meta.env.VITE_API_BASE_URL ||
      "https://aluma-backend-production.up.railway.app"
    // Remove /upload if it's included in the URL
    return envUrl.replace(/\/upload$/, "")
  }

  // In development, use localhost
  return "http://localhost:3000"
}

// Helper function to make API calls with proper base URL
export const apiCall = async (endpoint, options = {}) => {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`

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
