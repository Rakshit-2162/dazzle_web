import { Snackbar, Alert } from '@mui/material'
import { useSnackbarStore } from '../../store/snackbarStore'

const DazzleSnackbar = () => {
  const { open, message, severity, hideSnackbar } = useSnackbarStore()

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={hideSnackbar}
        severity={severity}
        variant="filled"
        sx={{ width: '100%', borderRadius: 2 }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default DazzleSnackbar