import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Checkbox,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  ArrowBack,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import TableViewOutlinedIcon from "@mui/icons-material/TableViewOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../styles/theme";
import { useOrderDetail } from "../../features/orders/hooks/useOrderDetail";
import AddOrderItemsForm from "../../features/orders/components/AddOrderItemsForm";
import {
  DazzleButton,
  DazzleDialog,
  DazzleTable,
} from "../../shared/components";
import type { DazzleTableColumn } from "../../shared/components";
import { OrderStatus } from "../../constants";
import { PATHS } from "../../routes/paths";
import type { OrderItem } from "../../features/orders/types";
import { useForm } from "react-hook-form";
import { DazzleTextField } from "../../shared/components";
import { useDocumentTitle } from "../../shared/hooks/useDocumentTitle";

const OrderDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useDocumentTitle(t("orderItems.title"));

  const {
    order,
    items,
    isLoading,
    isSubmitting,
    isTogglingStatus,
    isExcelDownloading,
    isPdfDownloading,
    selectedItem,
    selectedItemIds,
    addItemsDialogOpen,
    editItemDialogOpen,
    deleteItemsDialogOpen,
    setAddItemsDialogOpen,
    setEditItemDialogOpen,
    setDeleteItemsDialogOpen,
    setSelectedItem,
    handleAddItems,
    handleEditItem,
    handleDeleteItems,
    handleToggleStatus,
    toggleItemSelection,
    toggleAllItems,
    handleDownloadExcel,
    handleDownloadPDF,
  } = useOrderDetail(id ?? "");

  const { control, handleSubmit, reset } = useForm<{ qty: number }>({
    defaultValues: { qty: selectedItem?.qty ?? 1 },
  });

  const isCompleted = order?.order_status === OrderStatus.COMPLETED;

  const columns: DazzleTableColumn[] = [
    {
      field: "checkbox",
      headerName: "",
      width: 50,
      renderCell: (row: OrderItem) => (
        <Checkbox
          size="small"
          checked={selectedItemIds.includes(row.id)}
          onChange={() => toggleItemSelection(row.id)}
        />
      ),
    },
    {
      field: "category",
      headerName: t("categories.title"),
      renderCell: (row: OrderItem) => row.products?.categories?.name ?? "—",
      width: 220,
    },
    {
      field: "product_code",
      headerName: t("orderItems.productCode"),
      width: 130,
    },
    {
      field: "product_name",
      headerName: t("products.productName"),
      renderCell: (row: OrderItem) => row.products?.name ?? "—",
    },
    {
      field: "qty",
      headerName: t("orderItems.quantity"),
      width: 100,
    },
    {
      field: "actions",
      headerName: t("common.actions"),
      width: 80,
      renderCell: (row: OrderItem) => (
        <Tooltip title={t("common.edit")}>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedItem(row);
              reset({ qty: row.qty });
              setEditItemDialogOpen(true);
            }}
            sx={{ color: colors.text.secondary }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

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
              onClick={() => navigate(PATHS.ORDERS)}
              sx={{ color: colors.text.secondary }}
            >
              <ArrowBack fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: colors.text.primary,
              lineHeight: 1.2,
            }}
          >
            {t("orders.orderNo")} #{order?.order_no}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {/* Delete selected items */}
          {selectedItemIds.length > 0 && (
            <DazzleButton
              label={`${t("common.delete")} (${selectedItemIds.length})`}
              variant="outlined"
              startIcon={<Delete />}
              onClick={() => setDeleteItemsDialogOpen(true)}
              sx={{ color: "#F44336", borderColor: "#F44336" }}
            />
          )}

          {/* Mark complete/in progress button */}
          <DazzleButton
            label={
              isCompleted
                ? t("orders.markInProgress")
                : t("orders.markComplete")
            }
            variant={"outlined"}
            startIcon={isCompleted ? <RadioButtonUnchecked /> : <CheckCircle />}
            onClick={handleToggleStatus}
            isLoading={isTogglingStatus}
          />

          {/* Download Excel button */}
          <DazzleButton
            label={t("orders.downloadExcel")}
            startIcon={<TableViewOutlinedIcon />}
            variant="outlined"
            isLoading={isExcelDownloading}
            onClick={handleDownloadExcel}
          />

          {/* Download PDF button */}
          <DazzleButton
            label={t("orders.downloadPDF")}
            startIcon={<PictureAsPdfOutlinedIcon />}
            variant="outlined"
            isLoading={isPdfDownloading}
            onClick={handleDownloadPDF}
          />

          {/* Add items button */}
          <DazzleButton
            label={t("orderItems.addItems")}
            variant="primary"
            startIcon={<Add />}
            onClick={() => setAddItemsDialogOpen(true)}
          />
        </Box>
      </Box>

      {/* Order Info Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: colors.background.paper,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary, fontSize: 12 }}
              >
                {t("orders.client")}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: colors.text.primary,
                }}
              >
                {order?.clients?.name ?? "—"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: colors.background.paper,
            }}
          >
            <CardContent sx={{ px: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary, fontSize: 12 }}
              >
                {t("orders.orderStatus")}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={
                    isCompleted ? t("orders.completed") : t("orders.inProgress")
                  }
                  variant="outlined"
                  sx={{
                    fontSize: 12,
                    height: 25,
                    borderColor: isCompleted ? "#4CAF50" : "#FF9800",
                    backgroundColor: isCompleted ? "#4CAF5018" : "#FF980018",
                    color: isCompleted ? "#4CAF50" : "#FF9800",
                    fontWeight: 500,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: colors.background.paper,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary, fontSize: 12 }}
              >
                {t("orders.totalQty")}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: colors.text.primary,
                }}
              >
                {`${order?.total_qty ?? 0} item(s)`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: colors.background.paper,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary, fontSize: 12 }}
              >
                {t("orders.remarks")}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: colors.text.primary,
                }}
              >
                {order?.remarks || "—"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Select all row */}
      {items.length > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
          <Checkbox
            size="small"
            checked={
              selectedItemIds.length === items.length && items.length > 0
            }
            indeterminate={
              selectedItemIds.length > 0 &&
              selectedItemIds.length < items.length
            }
            onChange={toggleAllItems}
          />
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            {selectedItemIds.length > 0
              ? `${selectedItemIds.length} ${t("orderItems.selected")}`
              : t("orderItems.selectAll")}
          </Typography>
        </Box>
      )}

      {/* Items Table */}
      <DazzleTable
        columns={columns}
        rows={items}
        isLoading={isLoading}
        enableSearch
        searchPlaceholder={t("orderItems.productCode")}
        emptyMessage={t("common.noData")}
      />

      {/* Add Items Dialog */}
      <DazzleDialog
        open={addItemsDialogOpen}
        onClose={() => setAddItemsDialogOpen(false)}
        title={t("orderItems.addItems")}
        maxWidth="md"
        content={
          <AddOrderItemsForm
            onSubmit={handleAddItems}
            isLoading={isSubmitting}
          />
        }
      />

      {/* Edit Item Dialog */}
      <DazzleDialog
        open={editItemDialogOpen}
        onClose={() => setEditItemDialogOpen(false)}
        title={t("orderItems.editItem")}
        primaryLabel={t("common.save")}
        secondaryLabel={t("common.cancel")}
        isLoading={isSubmitting}
        maxWidth="xs"
        onPrimary={() => handleSubmit((data) => handleEditItem(data.qty))()}
        content={
          <Box
            component="form"
            onSubmit={handleSubmit((data) => handleEditItem(data.qty))}
          >
            <DazzleTextField
              name="qty"
              control={control}
              label={t("orderItems.quantity")}
              type="number"
              rules={{
                required: t("validation.required"),
                min: { value: 1, message: "Min 1" },
              }}
            />
          </Box>
        }
      />

      {/* Delete Items Confirmation Dialog */}
      <DazzleDialog
        open={deleteItemsDialogOpen}
        onClose={() => setDeleteItemsDialogOpen(false)}
        title={t("orderItems.deleteItems")}
        primaryLabel={t("common.delete")}
        secondaryLabel={t("common.cancel")}
        isLoading={isSubmitting}
        onPrimary={handleDeleteItems}
        maxWidth="xs"
        content={
          <Typography
            variant="body2"
            sx={{ color: colors.text.secondary, lineHeight: 1.8 }}
          >
            {t("orderItems.deleteConfirm", { count: selectedItemIds.length })}
          </Typography>
        }
      />
    </Box>
  );
};

export default OrderDetailPage;
