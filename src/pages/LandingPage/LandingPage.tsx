import {
  Box,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Container,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import {
  AutoFixHighRounded,
  Handyman,
  VerifiedUser,
  BathroomOutlined,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material'
import { tokens } from '../../styles/theme'
import { useAuthStore } from '../../store/authStore'
import { useLogout } from '../../features/auth/hooks/useLogout'
import { DazzleButton } from '../../shared/components'
import { PATHS } from '../../routes/paths'
import logo from '../../assets/logo.jpg'
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle'

const iconMap: Record<string, React.ReactNode> = {
  AutoFixHighRounded: <AutoFixHighRounded sx={{ fontSize: 32 }} />,
  Handyman: <Handyman sx={{ fontSize: 32 }} />,
  VerifiedUser: <VerifiedUser sx={{ fontSize: 32 }} />,
}

const LandingPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const { isAuthenticated } = useAuthStore()
  const { logout } = useLogout()
  useDocumentTitle(t('landingPage.home.title'))

  const services = t('landingPage.services.content', { returnObjects: true }) as Array<{
    icon: string
    title: string
    subtitle: string
  }>

  const features = t('landingPage.features.content', { returnObjects: true }) as Array<{
    title: string
    subtitle: string
  }>

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background.default }}>

      {/* Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: colors.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          <Box
            component="img"
            src={logo}
            alt="Dazzle"
            sx={{ height: 36, objectFit: 'contain', cursor: 'pointer' }}
            onClick={() => navigate(PATHS.ROOT)}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isAuthenticated ? (
              <>
                <DazzleButton
                  label="Dashboard"
                  variant="text"
                  onClick={() => navigate(PATHS.DASHBOARD)}
                />
                <DazzleButton
                  label="Logout"
                  variant="primary"
                  onClick={logout}
                />
              </>
            ) : (
              <DazzleButton
                label="Login"
                variant="primary"
                onClick={() => navigate(PATHS.LOGIN)}
              />
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero section */}
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          sx={{
            py: { xs: 6, md: 10 },
            alignItems: 'center',
          }}
        >
          {/* Left */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              sx={{
                fontSize: { xs: 28, sm: 36, md: 46 },
                fontWeight: 700,
                lineHeight: 1.2,
                color: colors.text.primary,
                mb: 3,
              }}
            >
              {t('landingPage.home.title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: colors.text.secondary,
                mb: 4,
                lineHeight: 1.8,
                fontSize: { xs: 14, md: 16 },
              }}
            >
              {t('landingPage.home.subtitle')}
            </Typography>
            <DazzleButton
              label={t('landingPage.home.getStarted')}
              variant="primary"
              onClick={() => navigate(isAuthenticated ? PATHS.DASHBOARD : PATHS.LOGIN)}
              sx={{
                px: { xs: 4, md: 6 },
                py: 1.5,
                fontSize: { xs: 14, md: 16 },
              }}
            />
          </Grid>

          {/* Right — illustration */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: { xs: 240, md: 360 },
                height: { xs: 240, md: 360 },
                borderRadius: '50%',
                backgroundColor: `${colors.primary.main}12`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <BathroomOutlined
                sx={{
                  fontSize: { xs: 120, md: 180 },
                  color: colors.primary.main,
                  opacity: 0.85,
                }}
              />

              {/* Floating accent circles */}
              <Box
                sx={{
                  position: 'absolute',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: `${colors.activeBlue.main}20`,
                  top: 20,
                  right: 20,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: `${colors.primary.main}20`,
                  bottom: 30,
                  left: 20,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Services section */}
      <Box
        sx={{
          backgroundColor: colors.background.paper,
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontSize: { xs: 24, md: 36 },
              fontWeight: 700,
              textAlign: 'center',
              color: colors.text.primary,
              mb: 1.5,
            }}
          >
            {t('landingPage.services.title')}
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: colors.text.secondary,
              mb: 6,
              fontSize: { xs: 14, md: 16 },
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            {t('landingPage.services.subtitle')}
          </Typography>

          <Grid container spacing={3}>
            {services.map((item, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    p: 1,
                    height: '100%',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        backgroundColor: `${colors.primary.main}12`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        color: colors.primary.main,
                      }}
                    >
                      {iconMap[item.icon]}
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: colors.text.primary,
                        mb: 1,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: colors.text.secondary,
                        lineHeight: 1.7,
                      }}
                    >
                      {item.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          sx={{
            fontSize: { xs: 24, md: 36 },
            fontWeight: 700,
            textAlign: 'center',
            color: colors.text.primary,
            mb: 1.5,
          }}
        >
          {t('landingPage.features.title')}
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            color: colors.text.secondary,
            mb: 6,
            fontSize: { xs: 14, md: 16 },
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          {t('landingPage.features.subtitle')}
        </Typography>

        <Grid container spacing={3}>
          {features.map((item, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  height: '100%',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
                  },
                }}
              >
                {/* Image placeholder */}
                <Box
                  sx={{
                    height: 180,
                    backgroundColor: `${colors.primary.main}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BathroomOutlined
                    sx={{
                      fontSize: 64,
                      color: `${colors.primary.main}60`,
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 15,
                      color: colors.text.primary,
                      mb: 0.5,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: colors.text.secondary,
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: colors.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          py: 3,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: colors.text.secondary, fontSize: 13 }}
        >
          © {new Date().getFullYear()} {t('common.appName')}. All rights reserved.
        </Typography>
      </Box>

    </Box>
  )
}

export default LandingPage