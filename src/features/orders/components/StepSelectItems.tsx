import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material'
import { Check, Close, Delete } from '@mui/icons-material'
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { tokens } from '../../../styles/theme'
import type { Product } from '../../products/types'
import type { OrderItemForm } from '../types'
import { useSnackbarStore } from '../../../store/snackbarStore'

interface StepSelectItemsProps {
  products: Product[]
  cart: OrderItemForm[]
  setCart: React.Dispatch<React.SetStateAction<OrderItemForm[]>>
}

const StepSelectItems = ({ products, cart, setCart }: StepSelectItemsProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const { showSnackbar } = useSnackbarStore()

  const [searchCode, setSearchCode] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [qty, setQty] = useState('')

  const codeInputRef = useRef<HTMLInputElement>(null)
  const qtyInputRef = useRef<HTMLInputElement>(null)

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0)

  const handleCodeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !searchCode.trim()) return

    const found = products.find(
      (p) => p.code.toLowerCase() === searchCode.trim().toLowerCase()
    )

    if (found) {
      setSelectedProduct(found)
      setQty('')
      setTimeout(() => qtyInputRef.current?.focus(), 100)
    } else {
      showSnackbar(t('products.notFound'), 'error')
    }
  }

  const handleQtyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    confirmAdd()
  }

  const confirmAdd = () => {
    if (!selectedProduct || Number(qty) <= 0) return

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product_code === selectedProduct.code
      )
      if (existing) {
        showSnackbar(t('orderItems.qtyUpdated'), 'success')
        return prev.map((item) =>
          item.product_code === selectedProduct.code
            ? { ...item, qty: Number(qty) }
            : item
        )
      }
      showSnackbar(t('orderItems.productAdded'), 'success')
      return [...prev, { product_code: selectedProduct.code, qty: Number(qty) }]
    })

    setSelectedProduct(null)
    setSearchCode('')
    setQty('')
    setTimeout(() => codeInputRef.current?.focus(), 100)
  }

  const handleCancelProduct = () => {
    setSelectedProduct(null)
    setSearchCode('')
    setQty('')
    setTimeout(() => codeInputRef.current?.focus(), 100)
  }

  const handleRemoveFromCart = (code: string) => {
    setCart((prev) => prev.filter((item) => item.product_code !== code))
  }

  const getProductName = (code: string) =>
    products.find((p) => p.code === code)?.name ?? '—'

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, color: colors.text.primary, mb: 2 }}
      >
        {t('orderItems.addByCode')}
      </Typography>

      {/* Code input */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: colors.background.paper,
        }}
      >
        <TextField
          inputRef={codeInputRef}
          label={t('orderItems.enterProductCode')}
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          onKeyDown={handleCodeEnter}
          placeholder={t('orderItems.scanOrType')}
          fullWidth
          size="small"
          disabled={!!selectedProduct}
          autoFocus
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
          }}
        />

        {/* Selected product row */}
        {selectedProduct && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,63,255,0.04)',
              border: `1px solid ${colors.primary.main}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Product info */}
            <Box>
              <Typography
                sx={{ fontWeight: 600, fontSize: 14, color: colors.text.primary }}
              >
                {selectedProduct.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary }}
              >
                {t('products.productCode')}: {selectedProduct.code}
              </Typography>
            </Box>

            {/* Qty input + actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                inputRef={qtyInputRef}
                label={t('orderItems.quantity')}
                size="small"
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                onKeyDown={handleQtyEnter}
                slotProps={{
                  htmlInput: { min: 1 }
                }}
                sx={{
                  width: 90,
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                }}
              />
              <IconButton
                onClick={confirmAdd}
                disabled={!qty || Number(qty) <= 0}
                sx={{
                  color: '#4CAF50',
                  '&:hover': { backgroundColor: '#4CAF5015' },
                }}
              >
                <Check />
              </IconButton>
              <IconButton
                onClick={handleCancelProduct}
                sx={{
                  color: '#F44336',
                  '&:hover': { backgroundColor: '#F4433615' },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Cart summary */}
      {cart.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1.5,
            }}
          >
            <Typography
              sx={{ fontWeight: 600, fontSize: 13, color: colors.text.primary }}
            >
              {t('orderItems.cartSummary')} ({cart.length} {t('orderItems.products')})
            </Typography>
            <Typography
              sx={{ fontWeight: 600, fontSize: 13, color: colors.primary.main }}
            >
              {t('orders.totalQty')}: {totalQty}
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              overflow: 'hidden',
              maxHeight: 220,
              overflowY: 'auto',
            }}
          >
            {cart.map((item, index) => (
              <Box key={item.product_code}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{ fontSize: 13, fontWeight: 500, color: colors.text.primary }}
                    >
                      {getProductName(item.product_code)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: colors.text.secondary }}
                    >
                      {item.product_code}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: colors.primary.main,
                        minWidth: 40,
                        textAlign: 'right',
                      }}
                    >
                      {t('orderItems.qty')}: {item.qty}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFromCart(item.product_code)}
                      sx={{ color: '#F44336' }}
                    >
                      <Delete sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
                {index < cart.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        </Box>
      )}

      {/* Empty cart hint */}
      {cart.length === 0 && (
        <Box
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 2,
            border: `1px dashed ${theme.palette.divider}`,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ color: colors.text.secondary, fontSize: 13 }}>
            {t('orderItems.emptyCartHint')}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default StepSelectItems