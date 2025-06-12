const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const createAndList = `${API_BASE_URL}/User`  /* -> POST and GET */
export const updateAndDelete = (id) => `${API_BASE_URL}/User/${id}`  /* -> PUT and DELETE */
