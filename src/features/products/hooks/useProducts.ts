import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { productService } from "../services/productService";
import { useSnackbarStore } from "../../../store/snackbarStore";
import { useAuthStore } from "../../../store/authStore";
import type { Product, ProductForm } from "../types";

export const useProducts = (categoryId: string) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbarStore();
  const { user } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger re-fetch

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const { data } = await productService.getByCategoryId(categoryId);
      if (data) setProducts(data as Product[]);
      setIsLoading(false);
    };
    fetchProducts();
  }, [refreshKey, categoryId]);

  const refresh = () => setRefreshKey((prev) => prev + 1);

  const handleAdd = async (form: ProductForm) => {
    if (!user) return;
    setIsSubmitting(true);
    const { error } = await productService.create(
      form,
      categoryId,
      user.user_id,
    );
    if (error) {
      showSnackbar(t("common.error"), "error");
    } else {
      showSnackbar(t("products.addSuccess"), "success");
      setAddDialogOpen(false);
      refresh();
    }
    setIsSubmitting(false);
  };

  const handleEdit = async (form: ProductForm) => {
    if (!user || !selectedProduct) return;
    setIsSubmitting(true);
    const { error } = await productService.update(
      selectedProduct.id,
      form,
      user.user_id,
    );
    if (error) {
      showSnackbar(t("common.error"), "error");
    } else {
      showSnackbar(t("products.updateSuccess"), "success");
      setEditDialogOpen(false);
      setSelectedProduct(null);
      refresh();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    const { error } = await productService.delete(selectedProduct.id);
    if (error) {
      showSnackbar(t("common.error"), "error");
    } else {
      showSnackbar(t("products.deleteSuccess"), "success");
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
      refresh();
    }
    setIsSubmitting(false);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  return {
    products,
    isLoading,
    isSubmitting,
    selectedProduct,
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
