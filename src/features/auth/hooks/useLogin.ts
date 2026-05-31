import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../services/authService'
import { useSnackbarStore } from '../../../store/snackbarStore'

export interface LoginFormValues {
  email: string
  password: string
}

export const useLogin = () => {
  const { t } = useTranslation()
  const { showSnackbar } = useSnackbarStore()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)

    try {
      const { error } = await authService.login(data.email, data.password)

      if (error) {
        showSnackbar(t('auth.invalidCredentials'), 'error')
        return
      }

      showSnackbar(t('auth.loginSuccess'), 'success')
    } catch {
      showSnackbar(t('common.error'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    onSubmit,
  }
}