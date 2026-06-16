import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import { Edit, Delete, Add, ArrowBack } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../styles/theme";
import { useProducts } from "../../features/products/hooks/useProducts";
import ProductForm from "../../features/products/components/ProductForm";
import {
  DazzleButton,
  DazzleDialog,
  DazzleTable,
} from "../../shared/components";
import type { DazzleTableColumn } from "../../shared/components";
import { Status } from "../../constants";
import type { Product } from "../../types";
import { useState, useEffect } from "react";
import { categoryService } from "../../features/categories/services/categoryService";
import type { Category } from "../../features/categories/types";

const CatalogProductsPage = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
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
  } = useProducts(categoryId ?? "");

  const columns: DazzleTableColumn[] = [
    {
      field: "code",
      headerName: t("products.productCode"),
      width: 150,
    },
    {
      field: "name",
      headerName: t("products.productName"),
    },
    {
      field: "status",
      headerName: t("common.status"),
      width: 120,
      renderCell: (row: Product) => (
        <Chip
          label={
            row.status === Status.ACTIVE
              ? t("common.active")
              : t("common.inactive")
          }
          size="small"
          sx={{
            fontSize: 11,
            height: 22,
            backgroundColor:
              row.status === Status.ACTIVE ? "#4CAF5018" : "#F4433618",
            color: row.status === Status.ACTIVE ? "#4CAF50" : "#F44336",
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "created_at",
      headerName: t("common.createdAt"),
      width: 180,
      renderCell: (row: Product) =>
        new Date(row.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      field: "actions",
      headerName: t("common.actions"),
      width: 100,
      renderCell: (row: Product) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title={t("common.edit")}>
            <IconButton
              size="small"
              onClick={() => openEditDialog(row)}
              sx={{ color: colors.text.secondary }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("common.delete")}>
            <IconButton
              size="small"
              onClick={() => openDeleteDialog(row)}
              sx={{ color: "#F44336" }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      const { data } = await categoryService.getById(categoryId);
      if (data) setCategory(data as Category);
    };
    fetchCategory();
  }, [categoryId]);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title={t("common.back")}>
            <IconButton
              size="small"
              onClick={() => navigate(-1)}
              sx={{ color: colors.text.secondary }}
            >
              <ArrowBack fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: colors.text.primary,
                lineHeight: 1.2,
              }}
            >
              {t("products.title")}
            </Typography>
            {category && (
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary, fontSize: 12 }}
              >
                {category.name}
              </Typography>
            )}
          </Box>
        </Box>
        <DazzleButton
          label={t("products.addProduct")}
          variant="primary"
          startIcon={<Add />}
          onClick={() => setAddDialogOpen(true)}
        />
      </Box>

      {/* Table */}
      <DazzleTable
        columns={columns}
        rows={products}
        isLoading={isLoading}
        enableSearch
        searchPlaceholder={t("products.productName")}
        emptyMessage={t("common.noData")}
      />

      {/* Add Dialog */}
      <DazzleDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        title={t("products.addProduct")}
        primaryLabel={t("common.save")}
        secondaryLabel={t("common.cancel")}
        isLoading={isSubmitting}
        onPrimary={() => {
          document
            .getElementById("product-form")
            ?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            );
        }}
        content={<ProductForm onSubmit={handleAdd} isLoading={isSubmitting} />}
      />

      {/* Edit Dialog */}
      <DazzleDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title={t("products.editProduct")}
        primaryLabel={t("common.save")}
        secondaryLabel={t("common.cancel")}
        isLoading={isSubmitting}
        onPrimary={() => {
          document
            .getElementById("product-form")
            ?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            );
        }}
        content={
          <ProductForm
            onSubmit={handleEdit}
            defaultValues={selectedProduct}
            isLoading={isSubmitting}
          />
        }
      />

      {/* Delete Dialog */}
      <DazzleDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title={t("products.deleteProduct")}
        primaryLabel={t("common.delete")}
        secondaryLabel={t("common.cancel")}
        isLoading={isSubmitting}
        onPrimary={handleDelete}
        maxWidth="xs"
        content={
          <Typography
            variant="body2"
            sx={{ color: colors.text.secondary, lineHeight: 1.8 }}
          >
            {t("products.deleteConfirm")}
          </Typography>
        }
      />
    </Box>
  );
};

export default CatalogProductsPage;
