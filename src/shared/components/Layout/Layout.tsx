import { useState } from 'react'
import { Box } from '@mui/material'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
  pageTitle?: string
  navbarText?: string
}

const SIDEBAR_WIDTH = 240
const SIDEBAR_COLLAPSED_WIDTH = 64
const NAVBAR_HEIGHT = 64

const Layout = ({ children, pageTitle, navbarText }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
        width={sidebarWidth}
      />

      {/* Main content area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ml: `${sidebarWidth}px`,
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
        }}
      >
        {/* Navbar */}
        <Navbar
          pageTitle={pageTitle}
          navbarText={navbarText}
          sidebarWidth={sidebarWidth}
        />

        {/* Page content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            mt: `${NAVBAR_HEIGHT}px`,
            backgroundColor: 'background.default',
          }}
        >
          {children}
        </Box>
      </Box>

    </Box>
  )
}

export default Layout