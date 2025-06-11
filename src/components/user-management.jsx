import { useState, useEffect, use } from "react"
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
import PermissionGuard from "./permission-guard"
import * as usuariosService from "../services/usuarios.service"
import * as countriesService from "../services/countries.services"


const roles = [{ id: 1, name: "Admin" }, { id: 2, name: "Operador" }, { id: 3, name: "Cliente" }]

export default function UserManagement() {
  const { user: currentUser, hasPermission } = useAuth()
  const [loading, setloading] = useState(false)
  const [users, setUsers] = useState([])
  const [countries, setCountries] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    password: "",
    email: "",
    pais: "",
    RolesId: "",
  })

  useEffect(() => {
    loadUsers()
    loadCountries()
  }, [])

  const loadUsers = async () => {
    try{
      setloading(true)
      const users = await usuariosService.listUsers()
      setUsers(users)
      setloading(false)
    }catch(err){
      setloading(false)
      console.log(err)
    }

  }

  const loadCountries = async () => {
    countriesService.getCountries().then((countries) => {      
      setCountries(countries)
    })
  }

  const handleOpenDialog = (user) => {


    if (user) {
      setEditingUser(user)
      setFormData({
        id: user.id,
        nombreCompleto: user.nombreCompleto,
        email: user.email,
        pais: user.pais,
        rolNombre: user.rolNombre,
        password: user.password,
        RolesId: roles.find(i => i.name === user.rolNombre).id,
      })
    } else {
      setEditingUser(null)
      setFormData({
        nombreCompleto: "",
        email: "",
        pais: "",
        rolNombre: "",
        RolesId: "",
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUser(null)
  }

  const handleSave = () => {

    if (!formData.email) {
      alert("Por favor, introduzca un correo electrónico válido")
      return
    }
    if (!formData.password && !editingUser) {
      alert("Por favor, introduzca una contraseña válida")
      return
    }
    if (!formData.nombreCompleto) {
      alert("Por favor, introduzca un nombre completo válido")
      return
    }
    if (!formData.pais) {
      alert("Por favor, seleccione un país válido")
      return
    }

    if (editingUser) {
      usuariosService.updateUser(formData?.id, {
        nombreCompleto: formData.nombreCompleto,
        email: formData.email,
        pais: formData.pais,
        rolesId: formData.RolesId
      }).then(() => {
        loadUsers()
      })
    } else {
      usuariosService.createUser({
        NombreCompleto: formData.nombreCompleto,
        Email: formData.email,
        Password: formData.password,
        Pais: formData.pais,
        RolesId: formData.RolesId
      }).then((value) => {
        if (value?.id) {
          loadUsers()

        }
      })
    }
    handleCloseDialog()
  }

  const handleDelete = (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      usuariosService.deleteUser(userId).then(() => {
        loadUsers()
      })
    }
  }

  const canEditUser = (user) => {
    if (hasPermission("EditarUsuario")) {
      if (currentUser?.rolNombre === "Admin") return true
      if (currentUser?.rolNombre === "Operador" && user.rolNombre === "Cliente") return true
    }
    return false
  }

  const canDeleteUser = (user) => {
    return hasPermission("EliminarUsuario") && currentUser?.rolNombre === "Admin"
  }

  const getVisibleUsers = () => {

    if (!Array.isArray(users)) {
      return []
    }

    if (currentUser?.rolNombre === "Admin") {
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
            { loading ? <h3 >Cargando...</h3> :  getVisibleUsers().map((user) => (
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

      <Dialog  open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
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

            {!editingUser ? <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              required
            /> : null}

            <FormControl fullWidth>
              <InputLabel>País</InputLabel>
              <Select
                value={formData.pais}
                onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                label="País"
              >
                { Array.isArray(countries) ? countries.map((country) => (
                  <MenuItem key={country.commonName} value={country.commonName}>
                    {country.commonName}  
                  </MenuItem>
                )) : null}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={formData.RolesId}
                onChange={(e) => setFormData({ ...formData, RolesId: e.target.value })}
                label="Rol"
              >
                {roles.map((rol) => (
                  <MenuItem key={rol.id} value={rol.id}>
                    {rol.name}
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
