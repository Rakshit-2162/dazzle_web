import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Dashboard,
  ShoppingCart,
  Category,
  People,
  AccountCircle,
  Logout,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material";
import { tokens } from "../../../styles/theme";
import { PATHS } from "../../../routes/paths";
import { useLogout } from "../../../features/auth/hooks/useLogout";
import logo from "../../../assets/logo.jpg";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  width: number;
}

const Sidebar = ({ isCollapsed, onToggle, width }: SidebarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { logout } = useLogout();

  const topNavItems = [
    {
      label: t("navigation.dashboard"),
      icon: <Dashboard />,
      path: PATHS.DASHBOARD,
    },
    {
      label: t("navigation.orders"),
      icon: <ShoppingCart />,
      path: PATHS.ORDERS,
    },
    { label: t("navigation.catalog"), icon: <Category />, path: PATHS.CATALOG },
    { label: t("navigation.clients"), icon: <People />, path: PATHS.CLIENTS },
  ];

  const bottomNavItems = [
    {
      label: t("navigation.myAccount"),
      icon: <AccountCircle />,
      path: PATHS.MY_ACCOUNT,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({
    label,
    icon,
    path,
  }: {
    label: string;
    icon: React.ReactNode;
    path: string;
  }) => (
    <Tooltip title={isCollapsed ? label : ""} placement="right">
      <ListItem disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          onClick={() => navigate(path)}
          sx={{
            borderRadius: 2,
            mx: 1,
            backgroundColor: isActive(path)
              ? colors.primary.main
              : "transparent",
            color: isActive(path) ? "#ffffff" : colors.text.primary,
            "&:hover": {
              backgroundColor: isActive(path)
                ? colors.primary.main
                : theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : colors.blueAccent13.main,
            },
            justifyContent: isCollapsed ? "center" : "flex-start",
            px: isCollapsed ? 1 : 2,
            minHeight: 48,
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive(path) ? "#ffffff" : colors.text.primary,
              minWidth: isCollapsed ? 0 : 40,
              justifyContent: "center",
            }}
          >
            {icon}
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText
              primary={label}
              slotProps={{
                primary: {
                  sx: { fontSize: 14, fontWeight: isActive(path) ? 600 : 400 },
                },
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );

  return (
    <Box
      sx={{
        width: width,
        minHeight: "100vh",
        backgroundColor: colors.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden",
        zIndex: 1200,
      }}
    >
      {/* Logo + toggle */}
      <Box
        sx={{
          height: 64,
          minHeight: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          px: 1.5,
          flexShrink: 0,
        }}
      >
        {!isCollapsed && (
          <Box
            component="img"
            src={logo}
            alt="Dazzle"
            sx={{
              height: 32,
              objectFit: "contain",
              maxWidth: 140,
              ml: 0.5,
            }}
          />
        )}
        <IconButton
          onClick={onToggle}
          size="small"
          sx={{
            color: colors.text.secondary,
            "&:hover": { backgroundColor: colors.blueAccent13.main },
            ml: isCollapsed ? 0 : "auto",
          }}
        >
          {isCollapsed ? (
            <ChevronRight fontSize="small" />
          ) : (
            <ChevronLeft fontSize="small" />
          )}
        </IconButton>
      </Box>

      <Divider />

      {/* Top nav items */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {topNavItems.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
      </List>

      <Divider />

      {/* Bottom nav items */}
      <List sx={{ pb: 1 }}>
        {bottomNavItems.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}

        {/* Logout */}
        <Tooltip title={isCollapsed ? t("auth.logout") : ""} placement="right">
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={logout}
              sx={{
                borderRadius: 2,
                mx: 1,
                color: colors.text.primary,
                "&:hover": {
                  backgroundColor: "#ff000015",
                  color: "#ff0000",
                  "& .MuiListItemIcon-root": {
                    color: "#ff0000",
                  },
                },
                justifyContent: isCollapsed ? "center" : "flex-start",
                px: isCollapsed ? 1 : 2,
                minHeight: 48,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: isCollapsed ? 0 : 40,
                  justifyContent: "center",
                }}
              >
                <Logout />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={t("auth.logout")}
                  slotProps={{
                    primary: {
                      sx: { fontSize: 14 },
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>
    </Box>
  );
};

export default Sidebar;
