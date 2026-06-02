import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { tokens } from '../../../styles/theme'
import type { OrderItemForm } from '../types'
import type { Product } from '../../products/types'

interface StepReviewItemsProps {
  cart: OrderItemForm[]
  products: Product[]
  setCart: React.Dispatch<React.SetStateAction<OrderItemForm[]>>
}

const StepReviewItems = ({ cart, products, setCart }: StepReviewItemsProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const getProductName = (code: string) =>
    products.find((p) => p.code === code)?.name ?? '—'

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0)

  const handleRemove = (code: string) => {
    setCart((prev) => prev.filter((item) => item.product_code !== code))
  }

  if (cart.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}
      >
        <Typography sx={{ color: colors.text.secondary }}>
          No items in cart. Go back and add items.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          maxHeight: 380,
          overflow: 'auto',
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  color: colors.text.secondary,
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(0,0,0,0.02)',
                }}
              >
                {t('products.productCode')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  color: colors.text.secondary,
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(0,0,0,0.02)',
                }}
              >
                {t('products.productName')}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  color: colors.text.secondary,
                  width: 100,
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(0,0,0,0.02)',
                }}
              >
                {t('orderItems.quantity')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  color: colors.text.secondary,
                  width: 60,
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(0,0,0,0.02)',
                }}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <TableRow
                key={item.product_code}
                sx={{ '&:last-child td': { border: 0 } }}
              >
                <TableCell sx={{ fontSize: 13, color: colors.text.secondary }}>
                  {item.product_code}
                </TableCell>
                <TableCell sx={{ fontSize: 13, color: colors.text.primary }}>
                  {getProductName(item.product_code)}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 13, fontWeight: 600, color: colors.primary.main }}>
                  {item.qty}
                </TableCell>
                <TableCell>
                  <Tooltip title={t('common.delete')}>
                    <IconButton
                      size="small"
                      onClick={() => handleRemove(item.product_code)}
                      sx={{ color: '#F44336' }}
                    >
                      <Delete sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 2,
          gap: 3,
        }}
      >
        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
          Total Products: <strong>{cart.length}</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
          Total Qty: <strong>{totalQty}</strong>
        </Typography>
      </Box>
    </Box>
  )
}

export default StepReviewItems