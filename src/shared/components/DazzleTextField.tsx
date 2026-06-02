import { TextField, InputAdornment, useTheme } from '@mui/material'
import type { ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import type { RegisterOptions } from 'react-hook-form'

interface DazzleTextFieldProps {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  label?: string
  type?: string
  placeholder?: string
  fullWidth?: boolean
  variant?: 'outlined' | 'filled' | 'standard'
  margin?: 'none' | 'dense' | 'normal'
  size?: 'small' | 'medium'
  disabled?: boolean
  multiline?: boolean
  borderRadius?: number
  rows?: number
  startIcon?: ReactNode
  endIcon?: ReactNode
  rules?: RegisterOptions
  select?: boolean
  children?: ReactNode
}

const DazzleTextField = ({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  fullWidth = true,
  variant = 'outlined',
  margin = 'normal',
  size = 'medium',
  disabled = false,
  multiline = false,
  borderRadius = 2,
  rows,
  startIcon,
  endIcon,
  rules,
  select = false,
  children,
}: DazzleTextFieldProps) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type={type}
          label={label}
          placeholder={placeholder}
          fullWidth={fullWidth}
          variant={variant}
          margin={margin}
          size={size}
          disabled={disabled}
          multiline={multiline}
          rows={rows}
          error={!!error}
          helperText={error ? error.message : ''}
          autoComplete="off"
          select={select}
          slotProps={{
            input: {
              startAdornment: startIcon ? (
                <InputAdornment position="start">{startIcon}</InputAdornment>
              ) : undefined,
              endAdornment: endIcon ? (
                <InputAdornment position="end">{endIcon}</InputAdornment>
              ) : undefined,
            },
          }}
          sx={{
            bgcolor: isDark ? '#101624' : '#ECECEC',
            borderRadius: borderRadius,
            '& .MuiOutlinedInput-root': {
              borderRadius: borderRadius,
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'transparent' },
              '&.Mui-focused fieldset': { borderColor: 'transparent' },
            },
          }}
        >
          {children}
        </TextField>
      )}
    />
  )
}

export default DazzleTextField