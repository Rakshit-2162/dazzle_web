import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { useLogin } from '../../features/auth/hooks/useLogin'
import { DazzleTextField, DazzleButton } from '../../shared/components'
import { tokens } from '../../styles/theme'
import { useThemeStore } from '../../store/themeStore'
import { PATHS } from '../../routes/paths'
import { useNavigate } from 'react-router-dom'

interface LoginFormValues {
  email: string
  password: string
}

const LoginPage = () => {
  const { t } = useTranslation()
  const { mode } = useThemeStore()
  const navigate = useNavigate()
  const colors = tokens(mode)
  const { isLoading, onSubmit } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const { control, handleSubmit: hookFormSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
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
            {t('auth.login')}
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={hookFormSubmit(onSubmit)}>

            {/* Email */}
            <DazzleTextField
              name="email"
              control={control}
              label={t('auth.email')}
              type="email"
              disabled={isLoading}
            />

            {/* Password */}
            <DazzleTextField
              name="password"
              control={control}
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              disabled={isLoading}
              endIcon={
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />

            {/* Submit */}
            <Box sx={{ mt: 3 }}>
              <DazzleButton
                label={t('auth.login')}
                variant="primary"
                fullWidth
                type="submit"
                isLoading={isLoading}
              />
            </Box>

            {/* Sign up link */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <DazzleButton
                label={t('auth.dontHaveAccount')}
                variant="text"
                onClick={() => navigate(PATHS.SIGNUP)}
              />
            </Box>

          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginPage