import { useState, useEffect } from 'react'
import { dashboardService } from '../services/dashboardService'

interface DashboardStats {
  totalOrders: number
  inProgressOrders: number
  completedOrders: number
  totalClients: number
  totalProducts: number
  totalCategories: number
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      const { data } = await dashboardService.getStats()
      if (data) setStats(data)
      setIsLoading(false)
    }

    fetchStats()
  }, [])

  return { stats, isLoading }
}