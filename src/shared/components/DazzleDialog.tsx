import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Divider,
  Box,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useTheme } from '@mui/material'
import { tokens } from '../../styles/theme'
import DazzleButton from './DazzleButton'

interface DazzleDialogProps {
  open: boolean
  onClose: () => void
  title: string
  content: React.ReactNode
  primaryLabel?: string
  secondaryLabel?: string
  onPrimary?: () => void
  onSecondary?: () => void
  isLoading?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg'
}

const DazzleDialog = ({
  open,
  onClose,
  title,
  content,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  isLoading = false,
  maxWidth = 'sm',
}: DazzleDialogProps) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: colors.background.paper,
            borderRadius: 3,
            boxShadow: '0px 8px 32px rgba(0,0,0,0.12)',
          },
        },
      }}
    >
      {/* Title */}
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 16,
              color: colors.text.primary,
            }}
          >
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: colors.text.secondary }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {content}
      </DialogContent>

      {/* Actions */}
      {(primaryLabel || secondaryLabel) && (
        <>
          <Divider />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            {secondaryLabel && (
              <DazzleButton
                label={secondaryLabel}
                variant="outlined"
                onClick={onSecondary || onClose}
                disabled={isLoading}
              />
            )}
            {primaryLabel && (
              <DazzleButton
                label={primaryLabel}
                variant="primary"
                onClick={onPrimary}
                isLoading={isLoading}
              />
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default DazzleDialog