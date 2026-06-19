import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { authService } from "../services/authService";
import { useAuthStore } from "../../../store/authStore";
import { useSnackbarStore } from "../../../store/snackbarStore";

export interface ProfileFormValues {
  user_name: string;
}

export interface PasswordFormValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const useMyAccount = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuthStore();
  const { showSnackbar } = useSnackbarStore();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      const { data } = await authService.getCurrentUser();
      if (data?.user?.email) {
        setEmail(data.user.email);
      }
    };
    fetchEmail();
  }, []);

  const handleUpdateProfile = async (data: ProfileFormValues, onSuccess?: () => void) => {
    if (!user) return;
    setIsUpdatingProfile(true);

    try {
      const { data: updatedProfile, error } = await authService.updateProfile(
        user.user_id,
        data.user_name,
      );
      if (error) {
        showSnackbar(t("common.error"), "error");
      }

      if (updatedProfile) {
        setUser({ ...user, user_name: updatedProfile.user_name });
      }
      showSnackbar(t("myAccount.profileUpdateSuccess"), "success");
      onSuccess?.();
    } catch {
      showSnackbar(t("common.error"), "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (
    data: PasswordFormValues,
    onSuccess?: () => void,
  ) => {
    if (!user) return;
    setIsUpdatingPassword(true);

    try {
      const { error: signInError } = await authService.login(
        email ?? "",
        data.current_password,
      );

      if (signInError) {
        showSnackbar(t("myAccount.incorrectCurrentPassword"), "error");
        setIsUpdatingPassword(false);
        return;
      }

      const { error } = await authService.updatePassword(data.new_password);

      if (error) {
        showSnackbar(t("common.error"), "error");
      }

      showSnackbar(t("myAccount.passwordUpdateSuccess"), "success");
      onSuccess?.();
    } catch {
      showSnackbar(t("common.error"), "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return {
    user,
    email,
    isUpdatingProfile,
    isUpdatingPassword,
    handleUpdateProfile,
    handleUpdatePassword,
  };
};
