import axios from "axios"
import * as userApi from "../api/user.api"
import { toast } from "react-toastify"

export const createUser = async ({ NombreCompleto, Email, Password, Pais, RolesId }) => {
    try {
        const response = await axios.post(userApi.createAndList, { NombreCompleto, Email, Password, Pais, RolesId })
        return response.data
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error desconocido";
        toast.error(errorMessage)
    }
}

export const updateUser = async (id, { nombreCompleto, email, pais, rolesId }) => {
    try {
        const response = await axios.put(userApi.updateAndDelete(id), { nombreCompleto, email, pais, rolesId })
        return response.data
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error desconocido";
        toast.error(errorMessage)
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(userApi.updateAndDelete(id))
        return response.data
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error desconocido";
        toast.error(errorMessage)
    }
}

export const listUsers = async () => {
    try {
        const response = await axios.get(userApi.createAndList)
        return response.data
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error desconocido";
        toast.error(errorMessage)
    }
}