import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authService } from '../services/authService'
import { useSnackbarStore } from '../../../store/snackbarStore'
import { PATHS } from '../../../routes/paths'

export const useLogout = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { showSnackbar } = useSnackbarStore()

  const logout = async () => {
    const { error } = await authService.logout()

    if (error) {
      showSnackbar(t('common.error'), 'error')
      return
    }

    showSnackbar(t('auth.logoutSuccess'), 'success')
    navigate(PATHS.LOGIN)
  }

  return { logout }
}