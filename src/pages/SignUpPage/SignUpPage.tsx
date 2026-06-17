import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSignUp } from '../../features/auth/hooks/useSignUp'
import type { SignUpFormValues } from '../../features/auth/hooks/useSignUp'
import { DazzleTextField, DazzleButton } from '../../shared/components'
import { tokens } from '../../styles/theme'
import { useThemeStore } from '../../store/themeStore'
import { PATHS } from '../../routes/paths'
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle'

const SignUpPage = () => {
  const { t } = useTranslation()
  const { mode } = useThemeStore()
  const colors = tokens(mode)
  const navigate = useNavigate()
  const { isLoading, onSubmit } = useSignUp()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  useDocumentTitle(t('auth.signUp'))

  const { control, handleSubmit, getValues } = useForm<SignUpFormValues>({
    defaultValues: {
      user_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    mode: 'onTouched',
  })

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.default,
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: colors.background.paper,
          borderRadius: 3,
          boxShadow: '0px 4px 24px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ padding: 4 }}>

          {/* App name */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: colors.primary.main,
              textAlign: 'center',
              mb: 1,
            }}
          >
            {t('common.appName')}
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: colors.text.secondary,
              mb: 4,
            }}
          >
            {t('auth.signUp')}
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>

            {/* User Name */}
            <DazzleTextField
              name="user_name"
              control={control}
              label={t('auth.userName')}
              disabled={isLoading}
              rules={{
                required: t('validation.userNameRequired'),
              }}
            />

            {/* Email */}
            <DazzleTextField
              name="email"
              control={control}
              label={t('auth.email')}
              type="email"
              disabled={isLoading}
              rules={{
                required: t('validation.emailRequired'),
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: t('validation.emailInvalid'),
                },
              }}
            />

            {/* Password */}
            <DazzleTextField
              name="password"
              control={control}
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              disabled={isLoading}
              rules={{
                required: t('validation.passwordRequired'),
                minLength: {
                  value: 6,
                  message: t('validation.passwordMin'),
                },
              }}
              endIcon={
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />

            {/* Confirm Password */}
            <DazzleTextField
              name="confirm_password"
              control={control}
              label={t('auth.confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              disabled={isLoading}
              rules={{
                required: t('validation.confirmPasswordRequired'),
                validate: (value: string) =>
                  value === getValues('password') || t('validation.passwordMismatch'),
              }}
              endIcon={
                <IconButton
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />

            {/* Submit */}
            <Box sx={{ mt: 3 }}>
              <DazzleButton
                label={t('auth.signUp')}
                variant="primary"
                fullWidth
                type="submit"
                isLoading={isLoading}
              />
            </Box>

            {/* Login link */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <DazzleButton
                label={t('auth.alreadyHaveAccount')}
                variant="text"
                onClick={() => navigate(PATHS.LOGIN)}
              />
            </Box>

          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SignUpPage