import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../styles/theme";
import { useCategories } from "../../features/categories/hooks/useCategories";
import CategoryForm from "../../features/categories/components/CategoryForm";
import { DazzleButton, DazzleDialog } from "../../shared/components";
import { PATHS } from "../../routes/paths";
import { CategoryType, Status } from "../../constants";
import { useDocumentTitle } from "../../shared/hooks/useDocumentTitle";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";

const CatalogPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useDocumentTitle(t("categories.title"));

  const {
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
  } = useCategories();

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
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: colors.text.primary }}
        >
          {t("categories.title")}
        </Typography>
        <DazzleButton
          label={t("categories.addCategory")}
          variant="primary"
          startIcon={<Add />}
          onClick={() => setAddDialogOpen(true)}
        />
      </Box>

      {/* Categories grid */}
      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  height: 160,
                  backgroundColor: colors.background.paper,
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : categories.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <Typography sx={{ color: colors.text.secondary }}>
            {t("common.noData")}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: colors.background.paper,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  borderLeft:
                    category.type === CategoryType.PRIMARY
                      ? "6px solid #3B82F6"
                      : "6px solid #F97316",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                  },
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate(
                    PATHS.CATALOG_PRODUCTS.replace(":categoryId", category.id),
                  )
                }
              >
                <CardContent sx={{ pb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 15,
                        color: colors.text.primary,
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Chip
                      label={
                        category.status === Status.ACTIVE
                          ? t("common.active")
                          : t("common.inactive")
                      }
                      variant="outlined"
                      sx={{
                        fontSize: 11,
                        height: 25,
                        borderColor:
                          category.status === Status.ACTIVE
                            ? "#4CAF50"
                            : "#F44336",
                        backgroundColor:
                          category.status === Status.ACTIVE
                            ? "#4CAF5018"
                            : "#F4433618",
                        color:
                          category.status === Status.ACTIVE
                            ? "#4CAF50"
                            : "#F44336",
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </CardContent>

                <CardActions
                  sx={{
                    px: 2,
                    pb: 1.5,
                    justifyContent: "space-between",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Chip
                      label={
                        category.type === CategoryType.PRIMARY
                          ? CategoryType.PRIMARY
                          : CategoryType.SECONDARY
                      }
                      icon={
                        category.type === CategoryType.PRIMARY ? (
                          <CategoryOutlinedIcon fontSize="small" color="inherit" />
                        ) : (
                          <LayersOutlinedIcon fontSize="small" color="inherit" />
                        )
                      }
                      sx={{
                        mt: 1,
                        height: 25,
                        width: "fit-content",
                        fontWeight: 500,
                        fontSize: 12,
                        bgcolor:
                          category.type === CategoryType.PRIMARY
                            ? "#3B82F620"
                            : "#F9731620",
                        color:
                          category.type === CategoryType.PRIMARY
                            ? "#60A5FA"
                            : "#F97316",
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title={t("common.edit")}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(category);
                        }}
                        sx={{ color: colors.text.secondary }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("common.delete")}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(category);
                        }}
                        sx={{ color: "#F44336" }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Dialog */}
      <DazzleDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        title={t("categories.addCategory")}
        primaryLabel={t("common.save")}
        secondaryLabel={t("common.cancel")}
        isLoading={isSubmitting}
        onPrimary={() => {
          document
            .getElementById("category-form")
            ?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            );
        }}
        content={<CategoryForm onSubmit={handleAdd} isLoading={isSubmitting} />}
      />

      {/* Edit Dialog */}
      <DazzleDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
        }}
        title={t("categories.editCategory")}
        primaryLabel={t("common.save")}
        secondaryLabel={t("common.cancel")}
        isLoading={isSubmitting}
        onPrimary={() => {
          document
            .getElementById("category-form")
            ?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            );
        }}
        content={
          <CategoryForm
            onSubmit={handleEdit}
            defaultValues={selectedCategory}
            isLoading={isSubmitting}
          />
        }
      />

      {/* Delete Dialog */}
      <DazzleDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title={t("categories.deleteCategory")}
        primaryLabel={t("common.delete")}
        secondaryLabel={t("common.cancel")}
        isLoading={isSubmitting}
        onPrimary={handleDelete}
        maxWidth="xs"
        content={
          <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
            {t("categories.deleteConfirm")}{" "}
            <Typography
              component="span"
              variant="body2"
              sx={{ color: "#F44336", fontWeight: 600 }}
            >
              {t("categories.deleteWarning")}
            </Typography>
          </Typography>
        }
      />
    </Box>
  );
};

export default CatalogPage;
