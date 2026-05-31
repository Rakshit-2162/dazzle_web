import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material'
import { useTheme } from '@mui/material'
import { tokens } from '../../../styles/theme'

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  isLoading?: boolean
}

const StatCard = ({ title, value, icon, color, isLoading }: StatCardProps) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: colors.background.paper,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: colors.text.secondary, fontSize: 13, fontWeight: 500 }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: `${color}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>

        {isLoading ? (
          <Skeleton variant="text" width={60} height={40} />
        ) : (
          <Typography
            sx={{
              fontSize: 32,
              fontWeight: 700,
              color: colors.text.primary,
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard