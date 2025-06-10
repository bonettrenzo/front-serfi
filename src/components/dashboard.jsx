import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Chip,
} from "@mui/material"
import { Dashboard as DashboardIcon, People, Person, ExitToApp, Security } from "@mui/icons-material"
import { useAuth } from "../contexts/auth-context"
import UserManagement from "./user-management"
import UserProfile from "./user-profile"
import PermissionGuard from "./permission-guard"

const drawerWidth = 240

export default function Dashboard() {
  const { user, logout, hasPermission } = useAuth()
  const [selectedView, setSelectedView] = useState("dashboard")

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <DashboardIcon />,
      permission: null,
    },
    {
      id: "users",
      label: "Gestión de Usuarios",
      icon: <People />,
      permission: "LeerUsuarios",
    },
    {
      id: "profile",
      label: "Mi Perfil",
      icon: <Person />,
      permission: "LeerPropiosDatos",
    },
  ]

  const renderContent = () => {
    switch (selectedView) {
      case "users":
        return (
          <PermissionGuard permission="LeerUsuarios">
            <UserManagement />
          </PermissionGuard>
        )
      case "profile":
        return (
          <PermissionGuard permission="LeerPropiosDatos">
            <UserProfile />
          </PermissionGuard>
        )
      default:
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              Bienvenido, {user?.nombreCompleto}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Rol: {user?.rolNombre}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              País: {user?.pais}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Tus Permisos:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {user?.permisos.map((permiso) => (
                  <Chip key={permiso} label={permiso} color="primary" variant="outlined" icon={<Security />} />
                ))}
              </Box>
            </Box>
          </Box>
        )
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }}>{user?.nombreCompleto.charAt(0)}</Avatar>
            <Typography variant="body2">{user?.nombreCompleto}</Typography>
            <Button color="inherit" onClick={logout} startIcon={<ExitToApp />}>
              Salir
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => {
              if (item.permission && !hasPermission(item.permission)) {
                return null
              }

              return (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton selected={selectedView === item.id} onClick={() => setSelectedView(item.id)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="lg">{renderContent()}</Container>
      </Box>
    </Box>
  )
}
