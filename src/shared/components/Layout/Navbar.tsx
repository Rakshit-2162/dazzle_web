import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Switch,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { tokens } from "../../../styles/theme";
import { useAuthStore } from "../../../store/authStore";
import { useThemeStore } from "../../../store/themeStore";
import { useLogout } from "../../../features/auth/hooks/useLogout";
import { PATHS } from "../../../routes/paths";

interface NavbarProps {
  pageTitle?: string;
  navbarText?: string;
  sidebarWidth: number;
}

const Navbar = ({ pageTitle, navbarText, sidebarWidth }: NavbarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();
  const { logout } = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: colors.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: 1200,
        top: 0,
        left: `${sidebarWidth}px`,
        width: `calc(100% - ${sidebarWidth}px)`,
        transition: "left 0.3s ease, width 0.3s ease",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          height: 64,
          minHeight: "64px !important",
          maxHeight: 64,
          px: 3,
        }}
      >
        {/* Page title */}
        <Typography
          variant="h6"
          sx={{
            color: colors.text.primary,
            fontWeight: 600,
          }}
        >
          {pageTitle || t("common.appName")}
        </Typography>

        {/* Right side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Custom text */}
          {navbarText && (
            <Typography
              variant="body2"
              sx={{
                color: colors.text.secondary,
                fontWeight: 500,
              }}
            >
              {navbarText}
            </Typography>
          )}

          {/* Avatar */}
          <IconButton onClick={handleOpenMenu} size="small" sx={{ p: 0 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                backgroundColor: colors.primary.main,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {user?.user_name ? getInitials(user.user_name) : "U"}
            </Avatar>
          </IconButton>

          {/* Avatar menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: colors.background.paper,
                  minWidth: 220,
                  borderRadius: 2,
                  mt: 1,
                  boxShadow: "0px 4px 24px rgba(0,0,0,0.1)",
                },
              },
            }}
          >
            {/* User info */}
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: colors.text.primary }}
              >
                {user?.user_name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary }}
              >
                {user?.user_type}
              </Typography>
            </Box>

            <Divider />

            {/* Theme toggle */}
            <MenuItem
              sx={{ gap: 1.5, py: 1.2, mt: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
            >
              <Typography variant="body2" sx={{ flexGrow: 1, fontSize: 13 }}>
                {t("navigation.theme")}
              </Typography>
              <Switch
                checked={mode === "dark"}
                onChange={toggleTheme}
                onClick={(e) => e.stopPropagation()}
                icon={
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: "#444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LightMode sx={{ fontSize: 14, color: "#fff" }} />
                  </Box>
                }
                checkedIcon={
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: "#003FFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DarkMode sx={{ fontSize: 14, color: "#fff" }} />
                  </Box>
                }
                sx={{
                  width: 52,
                  height: 28,
                  padding: 0,
                  "& .MuiSwitch-switchBase": {
                    padding: 0,
                    margin: "3px",
                    transitionDuration: "300ms",
                    "&.Mui-checked": {
                      transform: "translateX(24px)",
                      "& + .MuiSwitch-track": {
                        backgroundColor: "#90caf9",
                        opacity: 1,
                      },
                    },
                  },
                  "& .MuiSwitch-track": {
                    borderRadius: 14,
                    backgroundColor: "#aab4be",
                    opacity: 1,
                  },
                }}
              />
            </MenuItem>

            <Divider />

            {/* My Account */}
            <MenuItem
              onClick={() => {
                navigate(PATHS.MY_ACCOUNT);
                handleCloseMenu();
              }}
              sx={{ py: 1.5 }}
            >
              <Typography variant="body2">
                {t("navigation.myAccount")}
              </Typography>
            </MenuItem>

            {/* Logout */}
            <MenuItem
              onClick={() => {
                logout();
                handleCloseMenu();
              }}
              sx={{ py: 1.5, color: "#ff0000" }}
            >
              <Typography variant="body2" color="inherit">
                {t("auth.logout")}
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
