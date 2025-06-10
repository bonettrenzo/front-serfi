import React from 'react'
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import LoginForm from "./components/login-form"
import Dashboard from "./components/dashboard"
import { AuthProvider, useAuth } from "./contexts/auth-context"
import { CacheProvider } from "./contexts/cache-context"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Cargando...</div>
  }

  
  return user ? <Dashboard /> : <LoginForm />
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CacheProvider>
          <AppContent />
        </CacheProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

