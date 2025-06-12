import axios from "axios"
import * as authApi from "../api/auth.api"
import { toast } from "react-toastify"

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(authApi.login, { email, password })
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error desconocido";
    toast.error(errorMessage)
  }
}