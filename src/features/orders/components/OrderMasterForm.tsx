import { Box, MenuItem } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { OrderStatus } from '../../../constants'
import type { OrderMaster, OrderMasterForm as OrderMasterFormType } from '../types'
import type { Client } from '../../clients/types'
import { DazzleTextField } from '../../../shared/components'
import { clientService } from '../../clients/services/clientService'

interface OrderMasterFormProps {
  onSubmit: (data: OrderMasterFormType) => void
  defaultValues?: OrderMaster | null
  isLoading?: boolean
}

const OrderMasterForm = ({ onSubmit, defaultValues, isLoading }: OrderMasterFormProps) => {
  const { t } = useTranslation()
  const [clients, setClients] = useState<Client[]>([])

  const { control, handleSubmit, reset } = useForm<OrderMasterFormType>({
    defaultValues: {
      client_id: defaultValues?.client_id ?? '',
      remarks: defaultValues?.remarks ?? '',
      order_status: defaultValues?.order_status ?? OrderStatus.IN_PROGRESS,
    },
  })

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await clientService.getAllActive()
      if (data) setClients(data as Client[])
    }
    fetchClients()
  }, [])

  useEffect(() => {
    if (defaultValues) {
      reset({
        client_id: defaultValues.client_id,
        remarks: defaultValues.remarks,
        order_status: defaultValues.order_status,
      })
    } else {
      reset({
        client_id: '',
        remarks: '',
        order_status: OrderStatus.IN_PROGRESS,
      })
    }
  }, [defaultValues, reset])

  return (
    <Box
      component="form"
      id="order-master-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Client */}
      <DazzleTextField
        name="client_id"
        control={control}
        label={t('orders.client')}
        disabled={isLoading}
        rules={{ required: t('validation.required') }}
        select
      >
        {clients.map((client) => (
          <MenuItem key={client.id} value={client.id}>
            {client.name}
          </MenuItem>
        ))}
      </DazzleTextField>

      {/* Remarks */}
      <DazzleTextField
        name="remarks"
        control={control}
        label={t('orders.remarks')}
        disabled={isLoading}
        multiline
        rows={3}
      />

      {/* Status */}
      <DazzleTextField
        name="order_status"
        control={control}
        label={t('orders.orderStatus')}
        disabled={isLoading}
        rules={{ required: t('validation.required') }}
        select
      >
        <MenuItem value={OrderStatus.IN_PROGRESS}>{t('orders.inProgress')}</MenuItem>
        <MenuItem value={OrderStatus.COMPLETED}>{t('orders.completed')}</MenuItem>
      </DazzleTextField>
    </Box>
  )
}

export default OrderMasterForm