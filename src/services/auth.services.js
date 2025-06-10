import axios from "axios"
import * as authApi from "../api/auth.api"

export const loginUser = async (email, password) => {
  const response = await axios.post(authApi.login, { email, password })
  return response.data
}