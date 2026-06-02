import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { categoryService } from "../services/categoryService";
import { useSnackbarStore } from "../../../store/snackbarStore";
import { useAuthStore } from "../../../store/authStore";
import type { Category, CategoryForm } from "../types";

export const useCategories = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbarStore();
  const { user } = useAuthStore();
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger re-fetch

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const { data } = await categoryService.getAll();
      if (data) setCategories(data as Category[]);
      setIsLoading(false);
    };
    fetchCategories();
  }, [refreshKey]);

  const refresh = () => setRefreshKey((prev) => prev + 1);

  const handleAdd = async (form: CategoryForm) => {
    if (!user) return;
    setIsSubmitting(true);
    const { error } = await categoryService.create(form, user.user_id);
    if (error) {
      showSnackbar(t("common.error"), "error");
    } else {
      showSnackbar(t("categories.addSuccess"), "success");
      setAddDialogOpen(false);
      refresh();
    }
    setIsSubmitting(false);
  };

  const handleEdit = async (form: CategoryForm) => {
    if (!user || !selectedCategory) return;
    setIsSubmitting(true);
    const { error } = await categoryService.update(
      selectedCategory.id,
      form,
      user.user_id,
    );
    if (error) {
      showSnackbar(t("common.error"), "error");
    } else {
      showSnackbar(t("categories.updateSuccess"), "success");
      setEditDialogOpen(false);
      setSelectedCategory(null);
      refresh();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);
    const { error } = await categoryService.delete(selectedCategory.id);
    if (error) {
      showSnackbar(t("common.error"), "error");
    } else {
      showSnackbar(t("categories.deleteSuccess"), "success");
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
      refresh();
    }
    setIsSubmitting(false);
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  return {
    categories,
    isLoading,
    isSubmitting,
    selectedCategory,
    addDialogOpen,
    editDialogOpen,
    deleteDialogOpen,
    setAddDialogOpen,
    setEditDialogOpen,
    setDeleteDialogOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    openEditDialog,
    openDeleteDialog,
  };
};
