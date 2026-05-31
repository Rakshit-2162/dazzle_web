import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { PATHS } from './paths'
import { CircularProgress, Box } from '@mui/material'

interface PublicRouteProps {
  children: React.ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress size={48} thickness={4} sx={{ color: '#003FFF' }} />
      </Box>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={PATHS.DASHBOARD} replace />
  }

  return <>{children}</>
}

export default PublicRoute