const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getCountries = () => `${API_BASE_URL}/api/Countries`