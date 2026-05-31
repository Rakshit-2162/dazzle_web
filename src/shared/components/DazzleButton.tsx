import { Button, CircularProgress } from '@mui/material'
import type { ButtonProps } from '@mui/material/Button'
import { useTheme } from '@mui/material'
import { tokens } from '../../styles/theme'

type DazzleButtonVariant = 'primary' | 'secondary' | 'text' | 'outlined'

type DazzleButtonProps = Omit<ButtonProps, 'variant'> & {
  label: string
  variant?: DazzleButtonVariant
  isLoading?: boolean
  fullWidth?: boolean
}

const DazzleButton = ({
  label,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  disabled,
  startIcon,
  endIcon,
  sx,
  ...props
}: DazzleButtonProps) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return {
          variant: 'contained' as const,
          sx: {
            backgroundColor: colors.primary.main,
            color: '#ffffff',
            '&:hover': {
              backgroundColor: colors.blueAccent.main,
            },
          },
        }
      case 'secondary':
        return {
          variant: 'contained' as const,
          sx: {
            backgroundColor: colors.activeBlue.main,
            color: '#ffffff',
            '&:hover': {
              backgroundColor: colors.blueAccent.main,
            },
          },
        }
      case 'outlined':
        return {
          variant: 'outlined' as const,
          sx: {
            borderColor: colors.primary.main,
            color: colors.primary.main,
            '&:hover': {
              borderColor: colors.blueAccent.main,
              color: colors.blueAccent.main,
              backgroundColor: 'transparent',
            },
          },
        }
      case 'text':
        return {
          variant: 'text' as const,
          sx: {
            color: colors.primary.main,
            '&:hover': {
              color: colors.blueAccent.main,
              backgroundColor: 'transparent',
            },
          },
        }
    }
  }

  const variantProps = getVariantProps()

  return (
    <Button
      {...props}
      variant={variantProps.variant}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      startIcon={!isLoading ? startIcon : undefined}
      endIcon={!isLoading ? endIcon : undefined}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        px: 3,
        py: 1,
        fontSize: 14,
        fontWeight: 500,
        minWidth: 100,
        ...variantProps.sx,
        ...sx,
      }}
    >
      {isLoading
        ? <CircularProgress size={20} color="inherit" />
        : label
      }
    </Button>
  )
}

export default DazzleButton