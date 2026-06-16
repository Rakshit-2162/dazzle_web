import { Box, MenuItem } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Status } from '../../../constants'
import type { Product, ProductForm as ProductFormType } from '../types'
import { DazzleTextField } from '../../../shared/components'

interface ProductFormProps {
  onSubmit: (data: ProductFormType) => void
  defaultValues?: Product | null
  isLoading?: boolean
}

const ProductForm = ({ onSubmit, defaultValues, isLoading }: ProductFormProps) => {
  const { t } = useTranslation()

  const { control, handleSubmit, reset } = useForm<ProductFormType>({
    defaultValues: {
      code: defaultValues?.code ?? '',
      name: defaultValues?.name ?? '',
      status: defaultValues?.status ?? Status.ACTIVE,
    },
  })

  useEffect(() => {
    if (defaultValues) {
      reset({
        code: defaultValues.code,
        name: defaultValues.name,
        status: defaultValues.status,
      })
    } else {
      reset({
        code: '',
        name: '',
        status: Status.ACTIVE,
      })
    }
  }, [defaultValues, reset])

  return (
    <Box
      component="form"
      id="product-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Code */}
      <DazzleTextField
        name="code"
        control={control}
        label={t('products.productCode')}
        disabled={isLoading}
        rules={{ required: t('validation.required') }}
      />

      {/* Name */}
      <DazzleTextField
        name="name"
        control={control}
        label={t('products.productName')}
        disabled={isLoading}
        rules={{ required: t('validation.required') }}
      />

      {/* Status */}
      <DazzleTextField
        name="status"
        control={control}
        label={t('common.status')}
        disabled={isLoading}
        rules={{ required: t('validation.required') }}
        select
      >
        <MenuItem value={Status.ACTIVE}>{t('common.active')}</MenuItem>
        <MenuItem value={Status.INACTIVE}>{t('common.inactive')}</MenuItem>
      </DazzleTextField>
    </Box>
  )
}

export default ProductForm