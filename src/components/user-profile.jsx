import { Box, Typography, Paper, Grid, Chip } from "@mui/material"
import { Person, Email, Public, Security, Schedule } from "@mui/icons-material"
import { useAuth } from "../contexts/auth-context"

export default function UserProfile() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mi Perfil
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Person sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Información Personal</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Nombre Completo
              </Typography>
              <Typography variant="body1">{user.nombreCompleto}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Correo Electrónico
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Email sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body1">{user.email}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                País
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Public sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body1">{user.pais}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Rol
              </Typography>
              <Chip label={user.rolNombre} color="primary" />
            </Box>

            {user.ultimaConexion && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Última Conexión
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Schedule sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body1">{new Date(user.ultimaConexion).toLocaleString()}</Typography>
                </Box>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Security sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Permisos</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Tienes acceso a las siguientes funcionalidades:
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {user.permisos.map((permiso) => (
                <Chip
                  key={permiso}
                  label={permiso}
                  color="secondary"
                  variant="outlined"
                  sx={{ alignSelf: "flex-start" }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
