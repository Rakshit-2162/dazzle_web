import { Box, MenuItem } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Status } from '../../../constants'
import type { Client, ClientForm as ClientFormType } from '../types'
import { DazzleTextField } from '../../../shared/components'

interface ClientFormProps {
  onSubmit: (data: ClientFormType) => void
  defaultValues?: Client | null
  isLoading?: boolean
}

const ClientForm = ({ onSubmit, defaultValues, isLoading }: ClientFormProps) => {
  const { t } = useTranslation()

  const { control, handleSubmit, reset } = useForm<ClientFormType>({
    defaultValues: {
      name: defaultValues?.name ?? '',
      city: defaultValues?.city ?? '',
      mobile: defaultValues?.mobile ?? '',
      status: defaultValues?.status ?? Status.ACTIVE,
    },
  })

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name,
        city: defaultValues.city,
        mobile: defaultValues.mobile,
        status: defaultValues.status,
      })
    } else {
      reset({
        name: '',
        city: '',
        mobile: '',
        status: Status.ACTIVE,
      })
    }
  }, [defaultValues, reset])

  return (
    <Box
      component="form"
      id="client-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Name */}
      <DazzleTextField
        name="name"
        control={control}
        label={t('clients.clientName')}
        disabled={isLoading}
        rules={{ required: t('validation.required') }}
      />

      {/* City */}
      <DazzleTextField
        name="city"
        control={control}
        label={t('clients.city')}
        disabled={isLoading}
      />

      {/* Mobile */}
      <DazzleTextField
        name="mobile"
        control={control}
        label={t('clients.mobile')}
        disabled={isLoading}
        rules={{
          pattern: {
            value: /^[0-9]{10}$/,
            message: t('validation.mobileInvalid'),
          },
        }}
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

export default ClientForm