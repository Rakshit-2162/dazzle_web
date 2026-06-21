import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../styles/theme";
import { useOrders } from "../../features/orders/hooks/useOrders";
import OrderMasterForm from "../../features/orders/components/OrderMasterForm";
import {
  DazzleButton,
  DazzleDialog,
  DazzleTable,
} from "../../shared/components";
import type { DazzleTableColumn } from "../../shared/components";
import { OrderStatus } from "../../constants";
import { PATHS } from "../../routes/paths";
import type { OrderMaster } from "../../features/orders/types";
import { useDocumentTitle } from "../../shared/hooks/useDocumentTitle";

const OrdersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  useDocumentTitle(t("orders.title"));
  const colors = tokens(theme.palette.mode);

  const {
    orders,
    isLoading,
    isSubmitting,
    selectedOrder,
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
    handleToggleStatus,
  } = useOrders();

  const columns: DazzleTableColumn[] = [
    {
      field: "order_no",
      headerName: t("orders.orderNo"),
      width: 100,
    },
    {
      field: "clients",
      headerName: t("orders.client"),
      renderCell: (row: OrderMaster) => row.clients?.name ?? "—",
    },
    {
      field: "total_qty",
      headerName: t("orders.totalQty"),
      width: 130,
    },
    {
      field: "order_status",
      headerName: t("orders.orderStatus"),
      width: 140,
      renderCell: (row: OrderMaster) => (
        <Chip
          label={
            row.order_status === OrderStatus.IN_PROGRESS
              ? t("orders.inProgress")
              : t("orders.completed")
          }
          variant="outlined"
          sx={{
            borderColor:
              row.order_status === OrderStatus.IN_PROGRESS
                ? "#FF9800"
                : "#4CAF50",
            fontSize: 11,
            height: 25,
            backgroundColor:
              row.order_status === OrderStatus.IN_PROGRESS
                ? "#FF980018"
                : "#4CAF5018",
            color:
              row.order_status === OrderStatus.IN_PROGRESS
                ? "#FF9800"
                : "#4CAF50",
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "created_at",
      headerName: t("common.createdAt"),
      width: 170,
      renderCell: (row: OrderMaster) =>
        new Date(row.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    // update columns actions
    {
      field: "actions",
      headerName: t("common.actions"),
      width: 150,
      renderCell: (row: OrderMaster) => (
        <Box
          sx={{ display: "flex", gap: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip
            title={
              row.order_status === OrderStatus.IN_PROGRESS
                ? t("orders.markComplete")
                : t("orders.markInProgress")
            }
          >
            <IconButton
              size="small"
              onClick={() => handleToggleStatus(row)}
              sx={{
                color:
                  row.order_status === OrderStatus.IN_PROGRESS
                    ? "#4CAF50"
                    : "#FF9800",
              }}
            >
              {row.order_status === OrderStatus.IN_PROGRESS ? (
                <CheckCircle fontSize="small" />
              ) : (
                <RadioButtonUnchecked fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title={t("common.edit")}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openEditDialog(row);
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
                openDeleteDialog(row);
              }}
              sx={{ color: "#F44336" }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
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
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: colors.text.primary }}
        >
          {t("orders.title")}
        </Typography>
        <DazzleButton
          label={t("orders.addOrder")}
          variant="primary"
          startIcon={<Add />}
          onClick={() => setAddDialogOpen(true)}
        />
      </Box>

      {/* Table */}
      <DazzleTable
        columns={columns}
        rows={orders}
        isLoading={isLoading}
        enableSearch
        searchPlaceholder={t("orders.client")}
        emptyMessage={t("common.noData")}
        onRowClick={(row) =>
          navigate(PATHS.ORDER_DETAIL.replace(":id", row.id))
        }
      />

      {/* Add Dialog */}
      <DazzleDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        title={t("orders.addOrder")}
        primaryLabel={t("common.save")}
        secondaryLabel={t("common.cancel")}
        isLoading={isSubmitting}
        onPrimary={() => {
          document
            .getElementById("order-master-form")
            ?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            );
        }}
        content={
          <OrderMasterForm onSubmit={handleAdd} isLoading={isSubmitting} />
        }
      />

      {/* Edit Dialog */}
      <DazzleDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title={t("orders.editOrder")}
        primaryLabel={t("common.save")}
        secondaryLabel={t("common.cancel")}
        isLoading={isSubmitting}
        onPrimary={() => {
          document
            .getElementById("order-master-form")
            ?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            );
        }}
        content={
          <OrderMasterForm
            onSubmit={handleEdit}
            defaultValues={selectedOrder}
            isLoading={isSubmitting}
          />
        }
      />

      {/* Delete Dialog */}
      <DazzleDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title={t("orders.deleteOrder")}
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
            {t("orders.deleteConfirm")}
          </Typography>
        }
      />
    </Box>
  );
};

export default OrdersPage;
