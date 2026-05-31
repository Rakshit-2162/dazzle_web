import { useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./styles/theme";
import { useThemeStore } from "./store/themeStore";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./features/auth/hooks/useAuth";
import DazzleSnackbar from "./shared/components/DazzleSnackbar";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useAuth()
  return <>{children}</>
}

const App = () => {
  const { mode } = useThemeStore();
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <DazzleSnackbar />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
