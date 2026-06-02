import { Box, MenuItem } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { CategoryType, Status } from '../../../constants'
import type { Category, CategoryForm as CategoryFormType } from '../types'
import { DazzleTextField } from '../../../shared/components'

interface CategoryFormProps {
  onSubmit: (data: CategoryFormType) => void
  defaultValues?: Category | null
  isLoading?: boolean
}

const CategoryForm = ({ onSubmit, defaultValues, isLoading }: CategoryFormProps) => {
  const { t } = useTranslation()

  const { control, handleSubmit, reset } = useForm<CategoryFormType>({
    defaultValues: {
      name: defaultValues?.name ?? '',
      type: defaultValues?.type ?? CategoryType.PRIMARY,
      status: defaultValues?.status ?? Status.ACTIVE,
    },
  })

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name,
        type: defaultValues.type,
        status: defaultValues.status,
      })
    } else {
      reset({
        name: '',
        type: CategoryType.PRIMARY,
        status: Status.ACTIVE,
      })
    }
  }, [defaultValues, reset])

  return (
    <Box
      component="form"
      id="category-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Name */}
      <DazzleTextField
        name="name"
        control={control}
        label={t('categories.categoryName')}
        disabled={isLoading}
        rules={{ required: t('validation.categoryNameRequired') }}
      />

      {/* Type */}
      <DazzleTextField
        name="type"
        control={control}
        label={t('categories.categoryType')}
        disabled={isLoading}
        rules={{ required: t('validation.required') }}
        select
      >
        <MenuItem value={CategoryType.PRIMARY}>{t('categories.primary')}</MenuItem>
        <MenuItem value={CategoryType.SECONDARY}>{t('categories.secondary')}</MenuItem>
      </DazzleTextField>

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

export default CategoryForm