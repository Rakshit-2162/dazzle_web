import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  Tooltip,
} from '@mui/material'
import { Add, Remove, Search } from '@mui/icons-material'
import { useState } from 'react'
import { useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { tokens } from '../../../styles/theme'
import type { Product } from '../../products/types'
import type { OrderItemForm } from '../types'

interface StepSelectItemsProps {
  products: Product[]
  cart: OrderItemForm[]
  setCart: React.Dispatch<React.SetStateAction<OrderItemForm[]>>
}

const StepSelectItems = ({ products, cart, setCart }: StepSelectItemsProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [search, setSearch] = useState('')

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  )

  const getCartQty = (code: string) => {
    return cart.find((item) => item.product_code === code)?.qty ?? 0
  }

  const handleAdd = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product_code === product.code)
      if (existing) {
        return prev.map((item) =>
          item.product_code === product.code
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      return [...prev, { product_code: product.code, qty: 1 }]
    })
  }

  const handleRemove = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product_code === product.code)
      if (!existing) return prev
      if (existing.qty <= 1) {
        return prev.filter((item) => item.product_code !== product.code)
      }
      return prev.map((item) =>
        item.product_code === product.code
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    })
  }

  const handleQtyChange = (product: Product, value: number) => {
    if (value <= 0) {
      setCart((prev) =>
        prev.filter((item) => item.product_code !== product.code)
      )
      return
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product_code === product.code)
      if (existing) {
        return prev.map((item) =>
          item.product_code === product.code ? { ...item, qty: value } : item
        )
      }
      return [...prev, { product_code: product.code, qty: value }]
    })
  }

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <Box>
      {/* Search + cart summary */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <TextField
          size="small"
          placeholder={t('products.productName')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: colors.text.secondary }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: 260,
            bgcolor: colors.background.paper,
            borderRadius: 2,
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
          }}
        />
        {cart.length > 0 && (
          <Chip
            label={`${cart.length} product(s) — ${totalItems} qty`}
            size="small"
            sx={{
              backgroundColor: `${colors.primary.main}18`,
              color: colors.primary.main,
              fontWeight: 600,
              fontSize: 12,
            }}
          />
        )}
      </Box>

      {/* Products table */}
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
        <Table stickyHeader size="small">
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
                  width: 140,
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(0,0,0,0.02)',
                }}
              >
                {t('orderItems.quantity')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    {t('common.noData')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const qty = getCartQty(product.code)
                const inCart = qty > 0

                return (
                  <TableRow
                    key={product.code}
                    sx={{
                      backgroundColor: inCart
                        ? `${colors.primary.main}08`
                        : 'transparent',
                      '&:last-child td': { border: 0 },
                    }}
                  >
                    <TableCell sx={{ fontSize: 13, color: colors.text.secondary }}>
                      {product.code}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, color: colors.text.primary, fontWeight: inCart ? 600 : 400 }}>
                      {product.name}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                        }}
                      >
                        <Tooltip title="Remove">
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => handleRemove(product)}
                              disabled={qty === 0}
                              sx={{
                                color: qty > 0 ? '#F44336' : colors.text.secondary,
                                width: 28,
                                height: 28,
                              }}
                            >
                              <Remove sx={{ fontSize: 16 }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <TextField
                          size="small"
                          value={qty === 0 ? '' : qty}
                          onChange={(e) =>
                            handleQtyChange(product, parseInt(e.target.value) || 0)
                          }
                          placeholder="0"
                          sx={{
                            width: 52,
                            '& .MuiOutlinedInput-root': { borderRadius: 1 },
                            '& input': {
                              textAlign: 'center',
                              fontSize: 13,
                              p: '4px 6px',
                            },
                          }}
                        />
                        <Tooltip title="Add">
                          <IconButton
                            size="small"
                            onClick={() => handleAdd(product)}
                            sx={{
                              color: colors.primary.main,
                              width: 28,
                              height: 28,
                            }}
                          >
                            <Add sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default StepSelectItems