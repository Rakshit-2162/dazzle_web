import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { orderService } from "../services/orderService";
import { useSnackbarStore } from "../../../store/snackbarStore";
import { useAuthStore } from "../../../store/authStore";
import { PATHS } from "../../../routes/paths";
import type { OrderMaster, OrderMasterForm } from "../types";
import { OrderStatus } from "../../../constants";

export const useOrders = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbarStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderMaster | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const { data } = await orderService.getAll();
      if (data) setOrders(data as OrderMaster[]);
      setIsLoading(false);
    };
    fetchOrders();
  }, [refreshKey]);

  const refresh = () => setRefreshKey((prev) => prev + 1);

  const handleAdd = async (form: OrderMasterForm) => {
    if (!user) return;
    setIsSubmitting(true);
    const { data, error } = await orderService.create(form, user.user_id);
    if (error) {
      showSnackbar(t("common.error"), "error");
    } else {
      showSnackbar(t("orders.addSuccess"), "success");
      setAddDialogOpen(false);
      navigate(PATHS.ORDER_DETAIL.replace(":id", data.id));
    }
    setIsSubmitting(false);
  };

  const handleEdit = async (form: OrderMasterForm) => {
    if (!user || !selectedOrder) return;
    setIsSubmitting(true);
    const { error } = await orderService.update(
      selectedOrder.id,
      form,
      user.user_id,
    );
    if (error) {
      showSnackbar(t("common.error"), "error");
    } else {
      showSnackbar(t("orders.updateSuccess"), "success");
      setEditDialogOpen(false);
      setSelectedOrder(null);
      refresh();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);
    const { error } = await orderService.delete(selectedOrder.id);
    if (error) {
      showSnackbar(t("common.error"), "error");
    } else {
      showSnackbar(t("orders.deleteSuccess"), "success");
      setDeleteDialogOpen(false);
      setSelectedOrder(null);
      refresh();
    }
    setIsSubmitting(false);
  };

  const handleToggleStatus = async (order: OrderMaster) => {
    if (!user) return;
    const { error } = await orderService.toggleStatus(
      order.id,
      order.order_status,
      user.user_id,
    );
    if (error) {
      showSnackbar(t("common.error"), "error");
    } else {
      showSnackbar(
        order.order_status === OrderStatus.IN_PROGRESS
          ? t("orders.markedComplete")
          : t("orders.markedInProgress"),
        "success",
      );
      refresh();
    }
  };

  const openEditDialog = (order: OrderMaster) => {
    setSelectedOrder(order);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (order: OrderMaster) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  return {
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
  };
};
