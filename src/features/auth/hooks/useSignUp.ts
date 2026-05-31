import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authService } from '../services/authService'
import { useSnackbarStore } from '../../../store/snackbarStore'
import { PATHS } from '../../../routes/paths'

export interface SignUpFormValues {
  user_name: string
  email: string
  password: string
  confirm_password: string
}

export const useSignUp = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { showSnackbar } = useSnackbarStore()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true)

    try {
      const { error } = await authService.signUp(
        data.email,
        data.password,
        data.user_name,
        'ADMIN'
      )

      if (error) {
        showSnackbar(t('common.error'), 'error')
        return
      }

      showSnackbar(t('auth.signUpSuccess'), 'success')
      setIsLoading(false)
      navigate(PATHS.DASHBOARD)
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