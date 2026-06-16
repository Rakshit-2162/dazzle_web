import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { clientService } from '../services/clientService'
import { useSnackbarStore } from '../../../store/snackbarStore'
import { useAuthStore } from '../../../store/authStore'
import type { Client, ClientForm } from '../types'

export const useClients = () => {
  const { t } = useTranslation()
  const { showSnackbar } = useSnackbarStore()
  const { user } = useAuthStore()

  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true)
      const { data } = await clientService.getAll()
      if (data) setClients(data as Client[])
      setIsLoading(false)
    }
    fetchClients()
  }, [refreshKey])

  const refresh = () => setRefreshKey((prev) => prev + 1)

  const handleAdd = async (form: ClientForm) => {
    if (!user) return
    setIsSubmitting(true)
    const { error } = await clientService.create(form, user.user_id)
    if (error) {
      showSnackbar(t('common.error'), 'error')
    } else {
      showSnackbar(t('clients.addSuccess'), 'success')
      setAddDialogOpen(false)
      refresh()
    }
    setIsSubmitting(false)
  }

  const handleEdit = async (form: ClientForm) => {
    if (!user || !selectedClient) return
    setIsSubmitting(true)
    const { error } = await clientService.update(selectedClient.id, form, user.user_id)
    if (error) {
      showSnackbar(t('common.error'), 'error')
    } else {
      showSnackbar(t('clients.updateSuccess'), 'success')
      setEditDialogOpen(false)
      setSelectedClient(null)
      refresh()
    }
    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    if (!selectedClient) return
    setIsSubmitting(true)
    const { error } = await clientService.delete(selectedClient.id)
    if (error) {
      showSnackbar(t('common.error'), 'error')
    } else {
      showSnackbar(t('clients.deleteSuccess'), 'success')
      setDeleteDialogOpen(false)
      setSelectedClient(null)
      refresh()
    }
    setIsSubmitting(false)
  }

  const openEditDialog = (client: Client) => {
    setSelectedClient(client)
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client)
    setDeleteDialogOpen(true)
  }

  return {
    clients,
    isLoading,
    isSubmitting,
    selectedClient,
    addDialogOpen,
    editDialogOpen,
    deleteDialogOpen,
    setAddDialogOpen,
    setEditDialogOpen,
    setDeleteDialogOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    openEditDialog,
    openDeleteDialog,
  }
}