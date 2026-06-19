import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Chip,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { tokens } from "../../styles/theme";
import { useMyAccount } from "../../features/auth/hooks/useMyAccount";
import type {
  ProfileFormValues,
  PasswordFormValues,
} from "../../features/auth/hooks/useMyAccount";
import { DazzleTextField, DazzleButton } from "../../shared/components";
import { Status, UserType } from "../../constants";
import { useDocumentTitle } from "../../shared/hooks/useDocumentTitle";

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{ color: colors.text.secondary, fontSize: 12, fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: colors.text.primary,
          fontSize: 14,
          fontWeight: 500,
          mt: 0.5,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const MyAccountPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useDocumentTitle(t("myAccount.title"));

  const {
    user,
    email,
    isUpdatingProfile,
    isUpdatingPassword,
    handleUpdateProfile,
    handleUpdatePassword,
  } = useMyAccount();

  const profileForm = useForm<ProfileFormValues>({
    defaultValues: { user_name: user?.user_name ?? "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    mode: "onTouched",
  });

  const { isDirty: isProfileDirty } = profileForm.formState;
  const { isDirty: isPasswordDirty } = passwordForm.formState;

  return (
    <Box sx={{ maxWidth: 640, mx: "auto" }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: colors.background.paper,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Avatar + name header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: colors.primary.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {user?.user_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) ?? "U"}
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: colors.text.primary,
                }}
              >
                {user?.user_name}
              </Typography>
              <Chip
                label={user?.user_type === UserType.ADMIN ? "Admin" : "Client"}
                variant="outlined"
                sx={{
                  fontSize: 11,
                  height: 25,
                  mt: 0.5,
                  borderColor: colors.primary.main,
                  backgroundColor: `${colors.primary.main}18`,
                  color: colors.primary.main,
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Read only fields */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ReadOnlyField label={t("auth.email")} value={email ?? "—"} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ReadOnlyField
                label={t("common.status")}
                value={
                  user?.status === Status.ACTIVE
                    ? t("common.active")
                    : t("common.inactive")
                }
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Edit user name */}
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 14,
              color: colors.text.primary,
              mb: 1,
            }}
          >
            {t("myAccount.editProfile")}
          </Typography>

          <Box
            component="form"
            onSubmit={profileForm.handleSubmit((data) =>
              handleUpdateProfile(data, () =>
                profileForm.reset({ user_name: data.user_name }),
              ),
            )}
          >
            <DazzleTextField
              name="user_name"
              control={profileForm.control}
              label={t("auth.userName")}
              disabled={isUpdatingProfile}
              rules={{ required: t("validation.userNameRequired") }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <DazzleButton
                label={t("myAccount.updateProfile")}
                variant="primary"
                type="submit"
                isLoading={isUpdatingProfile}
                disabled={!isProfileDirty || isUpdatingProfile}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Change password */}
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 14,
              color: colors.text.primary,
              mb: 1,
            }}
          >
            {t("myAccount.changePassword")}
          </Typography>

          <Box
            component="form"
            onSubmit={passwordForm.handleSubmit((data) =>
              handleUpdatePassword(data, () => passwordForm.reset()),
            )}
          >
            {/* Current password */}
            <DazzleTextField
              name="current_password"
              control={passwordForm.control}
              label={t("myAccount.currentPassword")}
              type={showCurrentPassword ? "text" : "password"}
              disabled={isUpdatingPassword}
              rules={{ required: t("validation.passwordRequired") }}
              endIcon={
                <IconButton
                  onClick={() => setShowCurrentPassword((p) => !p)}
                  edge="end"
                  size="small"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />

            {/* New password */}
            <DazzleTextField
              name="new_password"
              control={passwordForm.control}
              label={t("myAccount.newPassword")}
              type={showNewPassword ? "text" : "password"}
              disabled={isUpdatingPassword}
              rules={{
                required: t("validation.passwordRequired"),
                minLength: {
                  value: 6,
                  message: t("validation.passwordMin"),
                },
              }}
              endIcon={
                <IconButton
                  onClick={() => setShowNewPassword((p) => !p)}
                  edge="end"
                  size="small"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />

            {/* Confirm new password */}
            <DazzleTextField
              name="confirm_password"
              control={passwordForm.control}
              label={t("auth.confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              disabled={isUpdatingPassword}
              rules={{
                required: t("validation.confirmPasswordRequired"),
                validate: (value: string) =>
                  value === passwordForm.getValues("new_password") ||
                  t("validation.passwordMismatch"),
              }}
              endIcon={
                <IconButton
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  edge="end"
                  size="small"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <DazzleButton
                label={t("myAccount.updatePassword")}
                variant="primary"
                type="submit"
                isLoading={isUpdatingPassword}
                disabled={!isPasswordDirty || isUpdatingPassword}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MyAccountPage;
