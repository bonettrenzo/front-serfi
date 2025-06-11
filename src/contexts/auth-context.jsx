import  React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import * as authServices from "../services/auth.services"


const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const foundUser = await authServices.loginUser(email, password)

    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        nombreCompleto: foundUser.nombreCompleto,
        email: foundUser.email,
        pais: foundUser.pais,
        rolNombre: foundUser.rolNombre,
        permisos: foundUser.permisos,
        ultimaConexion: new Date(foundUser.ultimaConexion).toISOString(),
      }

      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const hasPermission = (permission) => {
    return user?.permisos.includes(permission) || false
  }

  return <AuthContext.Provider value={{ user, login, logout, loading, hasPermission }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("fuera de alcance")
  }
  return context
}
