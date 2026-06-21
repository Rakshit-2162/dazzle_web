import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { PATHS } from "./paths";
import { CircularProgress, Box } from "@mui/material";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.15)",
          zIndex: 9999,
        }}
      >
        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          }}
        >
          <CircularProgress
            enableTrackSlot
            size={42}
            thickness={4}
            sx={{ color: "#003FFF" }}
          />
        </Box>
      </Box>
    );
  }
  if (isAuthenticated) {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
