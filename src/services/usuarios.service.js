import axios from "axios"
import * as userApi from "../api/user.api"

export const createUser = async ({ NombreCompleto, Email, Password, Pais, RolesId }) => {
    try {
        const response = await axios.post(userApi.createAndList, { NombreCompleto, Email, Password, Pais, RolesId })
        return response.data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const updateUser = async (id, { NombreCompleto, Email, Password, Pais, RolesId }) => {
    try {
        const response = await axios.put(userApi.updateAndDelete(id), { NombreCompleto, Email, Password, Pais, RolesId })
        return response.data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(userApi.updateAndDelete(id))
        return response.data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const listUsers = async () => {
    try {
        const response = await axios.get(userApi.createAndList)
        return response.data
    } catch (error) {
        console.log(error)
        return null
    }
}