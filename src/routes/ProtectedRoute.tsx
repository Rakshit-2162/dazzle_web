import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { PATHS } from './paths'
import { CircularProgress, Box } from '@mui/material'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          backgroundColor: '#7373736b',
        }}
      >
        <CircularProgress
          size={48}
          thickness={4}
          sx={{ color: '#003FFF' }}
        />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute