import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material"
import { Edit, Delete, Add, Visibility } from "@mui/icons-material"
import { useAuth } from "../contexts/auth-context"
import { useCache } from "../contexts/cache-context"
import PermissionGuard from "./permission-guard"

const availablePermissions = ["CrearUsuario", "EditarUsuario", "EliminarUsuario", "LeerUsuarios", "LeerPropiosDatos"]

const roles = ["Administrador", "Operador", "Cliente"]

export default function UserManagement() {
  const { user: currentUser, hasPermission } = useAuth()
  const { getCache, setCache } = useCache()
  const [users, setUsers] = useState([])
  const [countries, setCountries] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    pais: "",
    rolNombre: "",
    permisos: [],
  })

  useEffect(() => {
    loadUsers()
    loadCountries()
  }, [])

  const loadUsers = () => {
    // Mock data - en producción vendría de tu API
    const mockUsers = [
      {
        id: 1,
        nombreCompleto: "Juan Pérez",
        email: "admin@example.com",
        pais: "Chile",
        rolNombre: "Administrador",
        permisos: ["CrearUsuario", "EditarUsuario", "EliminarUsuario", "LeerUsuarios", "LeerPropiosDatos"],
        ultimaConexion: new Date().toISOString(),
      },
      {
        id: 2,
        nombreCompleto: "María García",
        email: "operador@example.com",
        pais: "Argentina",
        rolNombre: "Operador",
        permisos: ["EditarUsuario", "LeerUsuarios", "LeerPropiosDatos"],
        ultimaConexion: new Date().toISOString(),
      },
      {
        id: 3,
        nombreCompleto: "Carlos López",
        email: "cliente@example.com",
        pais: "México",
        rolNombre: "Cliente",
        permisos: ["LeerPropiosDatos"],
        ultimaConexion: new Date().toISOString(),
      },
    ]
    setUsers(mockUsers)
  }

  const loadCountries = async () => {
    const cacheKey = "countries"
    const cachedCountries = getCache(cacheKey)

    if (cachedCountries) {
      setCountries(cachedCountries)
      return
    }

    try {
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name")
      const data = await response.json()
      const countryNames = data.map((country) => country.name.common).sort()

      setCountries(countryNames)
      setCache(cacheKey, countryNames, 3600000) 
    } catch (error) {
      console.error("Error loading countries:", error)
      setCountries(["Chile", "Argentina", "México", "Colombia", "Perú"])
    }
  }

  const handleOpenDialog = (user) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        nombreCompleto: user.nombreCompleto,
        email: user.email,
        pais: user.pais,
        rolNombre: user.rolNombre,
        permisos: user.permisos,
      })
    } else {
      setEditingUser(null)
      setFormData({
        nombreCompleto: "",
        email: "",
        pais: "",
        rolNombre: "",
        permisos: [],
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUser(null)
  }

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...editingUser, ...formData } : u)))
    } else {
      const newUser = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        ...formData,
        ultimaConexion: new Date().toISOString(),
      }
      setUsers([...users, newUser])
    }
    handleCloseDialog()
  }

  const handleDelete = (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      setUsers(users.filter((u) => u.id !== userId))
    }
  }

  const canEditUser = (user) => {
    if (hasPermission("EditarUsuario")) {
      if (currentUser?.rolNombre === "Administrador") return true
      if (currentUser?.rolNombre === "Operador" && user.rolNombre === "Cliente") return true
    }
    return false
  }

  const canDeleteUser = (user) => {
    return hasPermission("EliminarUsuario") && currentUser?.rolNombre === "Administrador"
  }

  const getVisibleUsers = () => {
    if (currentUser?.rolNombre === "Administrador") {
      return users
    } else if (currentUser?.rolNombre === "Operador") {
      return users.filter((u) => u.rolNombre === "Cliente" || u.id === currentUser.id)
    } else {
      return users.filter((u) => u.id === currentUser?.id)
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Gestión de Usuarios</Typography>
        <PermissionGuard permission="CrearUsuario">
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Nuevo Usuario
          </Button>
        </PermissionGuard>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>País</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Permisos</TableCell>
              <TableCell>Última Conexión</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getVisibleUsers().map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nombreCompleto}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.pais}</TableCell>
                <TableCell>
                  <Chip label={user.rolNombre} color="primary" size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {user.permisos.slice(0, 2).map((permiso) => (
                      <Chip key={permiso} label={permiso} size="small" variant="outlined" />
                    ))}
                    {user.permisos.length > 2 && <Chip label={`+${user.permisos.length - 2}`} size="small" />}
                  </Box>
                </TableCell>
                <TableCell>
                  {user.ultimaConexion ? new Date(user.ultimaConexion).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(user)}>
                    <Visibility />
                  </IconButton>
                  {canEditUser(user) && (
                    <IconButton onClick={() => handleOpenDialog(user)}>
                      <Edit />
                    </IconButton>
                  )}
                  {canDeleteUser(user) && (
                    <IconButton onClick={() => handleDelete(user.id)} color="error">
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Nombre Completo"
              value={formData.nombreCompleto}
              onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>País</InputLabel>
              <Select
                value={formData.pais}
                onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                label="País"
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={formData.rolNombre}
                onChange={(e) => setFormData({ ...formData, rolNombre: e.target.value })}
                label="Rol"
              >
                {roles.map((rol) => (
                  <MenuItem key={rol} value={rol}>
                    {rol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Permisos</InputLabel>
              <Select
                multiple
                value={formData.permisos}
                onChange={(e) => setFormData({ ...formData, permisos: e.target.value })}
                label="Permisos"
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {availablePermissions.map((permission) => (
                  <MenuItem key={permission} value={permission}>
                    {permission}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            {editingUser ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
