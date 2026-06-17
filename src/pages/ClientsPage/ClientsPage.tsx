import { Box, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import { Edit, Delete, Add } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material'
import { tokens } from '../../styles/theme'
import { useClients } from '../../features/clients/hooks/useClients'
import ClientForm from '../../features/clients/components/ClientForm'
import { DazzleButton, DazzleDialog, DazzleTable } from '../../shared/components'
import type { DazzleTableColumn } from '../../shared/components'
import { Status } from '../../constants'
import type { Client } from '../../features/clients/types'
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle'

const ClientsPage = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  useDocumentTitle(t('clients.title'))

  const {
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
  } = useClients()

  const columns: DazzleTableColumn[] = [
    {
      field: 'name',
      headerName: t('clients.clientName'),
    },
    {
      field: 'city',
      headerName: t('clients.city'),
      width: 150,
    },
    {
      field: 'mobile',
      headerName: t('clients.mobile'),
      width: 150,
    },
    {
      field: 'status',
      headerName: t('common.status'),
      width: 120,
      renderCell: (row: Client) => (
        <Chip
          label={row.status === Status.ACTIVE ? t('common.active') : t('common.inactive')}
          size="small"
          sx={{
            fontSize: 11,
            height: 22,
            backgroundColor: row.status === Status.ACTIVE ? '#4CAF5018' : '#F4433618',
            color: row.status === Status.ACTIVE ? '#4CAF50' : '#F44336',
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: 'created_at',
      headerName: t('common.createdAt'),
      width: 180,
      renderCell: (row: Client) =>
        new Date(row.created_at).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 100,
      renderCell: (row: Client) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={t('common.edit')}>
            <IconButton
              size="small"
              onClick={() => openEditDialog(row)}
              sx={{ color: colors.text.secondary }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <IconButton
              size="small"
              onClick={() => openDeleteDialog(row)}
              sx={{ color: '#F44336' }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: colors.text.primary }}
        >
          {t('clients.title')}
        </Typography>
        <DazzleButton
          label={t('clients.addClient')}
          variant="primary"
          startIcon={<Add />}
          onClick={() => setAddDialogOpen(true)}
        />
      </Box>

      {/* Table */}
      <DazzleTable
        columns={columns}
        rows={clients}
        isLoading={isLoading}
        enableSearch
        searchPlaceholder={t('clients.clientName')}
        emptyMessage={t('common.noData')}
      />

      {/* Add Dialog */}
      <DazzleDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        title={t('clients.addClient')}
        primaryLabel={t('common.save')}
        secondaryLabel={t('common.cancel')}
        isLoading={isSubmitting}
        onPrimary={() => {
          document.getElementById('client-form')?.dispatchEvent(
            new Event('submit', { cancelable: true, bubbles: true })
          )
        }}
        content={
          <ClientForm
            onSubmit={handleAdd}
            isLoading={isSubmitting}
          />
        }
      />

      {/* Edit Dialog */}
      <DazzleDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title={t('clients.editClient')}
        primaryLabel={t('common.save')}
        secondaryLabel={t('common.cancel')}
        isLoading={isSubmitting}
        onPrimary={() => {
          document.getElementById('client-form')?.dispatchEvent(
            new Event('submit', { cancelable: true, bubbles: true })
          )
        }}
        content={
          <ClientForm
            onSubmit={handleEdit}
            defaultValues={selectedClient}
            isLoading={isSubmitting}
          />
        }
      />

      {/* Delete Dialog */}
      <DazzleDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title={t('clients.deleteClient')}
        primaryLabel={t('common.delete')}
        secondaryLabel={t('common.cancel')}
        isLoading={isSubmitting}
        onPrimary={handleDelete}
        maxWidth="xs"
        content={
          <Typography
            variant="body2"
            sx={{ color: colors.text.secondary, lineHeight: 1.8 }}
          >
            {t('clients.deleteConfirm')}
          </Typography>
        }
      />
    </Box>
  )
}

export default ClientsPage