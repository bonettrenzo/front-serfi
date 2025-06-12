import React from "react"

import { useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert } from "@mui/material"
import { useAuth } from "../contexts/auth-context"


export default function PermissionGuard({ permission, children }) {
  const { hasPermission } = useAuth()
  const [showModal, setShowModal] = useState(false)

  if (!hasPermission(permission)) {
    return (
      <>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => setShowModal(true)}>
              Ver Detalles
            </Button>
          }
        >
          No tienes permisos para acceder a esta sección
        </Alert>

        <Dialog open={showModal} onClose={() => setShowModal(false)}>
          <DialogTitle>Acceso Denegado</DialogTitle>
          <DialogContent>
            <Typography>No tienes el permiso necesario para acceder a esta funcionalidad.</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Permiso requerido: <strong style={{color: "red"}}>{permission}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Contacta con tu administrador si necesitas acceso.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>Entendido</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }

  return <>{children}</>
}
