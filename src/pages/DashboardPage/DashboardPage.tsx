import { Grid } from '@mui/material'
import {
  ShoppingCart,
  HourglassTop,
  CheckCircle,
  People,
  Inventory,
  Category,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useDashboard } from '../../features/dashboard/hooks/useDashboard'
import StatCard from '../../features/dashboard/components/StatCard'

const DashboardPage = () => {
  const { t } = useTranslation()
  const { stats, isLoading } = useDashboard()

  const statCards = [
    {
      title: t('dashboard.totalOrders'),
      value: stats?.totalOrders ?? 0,
      icon: <ShoppingCart fontSize="small" />,
      color: '#003FFF',
    },
    {
      title: t('dashboard.inProgressOrders'),
      value: stats?.inProgressOrders ?? 0,
      icon: <HourglassTop fontSize="small" />,
      color: '#FF9800',
    },
    {
      title: t('dashboard.completedOrders'),
      value: stats?.completedOrders ?? 0,
      icon: <CheckCircle fontSize="small" />,
      color: '#4CAF50',
    },
    {
      title: t('dashboard.totalClients'),
      value: stats?.totalClients ?? 0,
      icon: <People fontSize="small" />,
      color: '#9C27B0',
    },
    {
      title: t('dashboard.totalProducts'),
      value: stats?.totalProducts ?? 0,
      icon: <Inventory fontSize="small" />,
      color: '#F44336',
    },
    {
      title: t('dashboard.totalCategories'),
      value: stats?.totalCategories ?? 0,
      icon: <Category fontSize="small" />,
      color: '#00BCD4',
    },
  ]

  return (
    <Grid container spacing={3}>
      {statCards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <StatCard
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            isLoading={isLoading}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default DashboardPage