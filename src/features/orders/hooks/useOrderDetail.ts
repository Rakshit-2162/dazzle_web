import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { orderService } from "../services/orderService";
import { useSnackbarStore } from "../../../store/snackbarStore";
import { useAuthStore } from "../../../store/authStore";
import type { OrderMaster, OrderItem, OrderItemForm } from "../types";
import { OrderStatus } from "../../../constants";
import { exportToExcel } from "../services/downloadExcelService";

export const useOrderDetail = (orderId: string) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbarStore();
  const { user } = useAuthStore();

  const [order, setOrder] = useState<OrderMaster | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [addItemsDialogOpen, setAddItemsDialogOpen] = useState(false);
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [deleteItemsDialogOpen, setDeleteItemsDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setIsLoading(true);
      const [orderResult, itemsResult] = await Promise.all([
        orderService.getById(orderId),
        orderService.getItems(orderId),
      ]);
      if (orderResult.data) setOrder(orderResult.data as OrderMaster);
      if (itemsResult.data) setItems(itemsResult.data as OrderItem[]);
      setIsLoading(false);
    };
    fetchOrderDetail();
  }, [orderId, refreshKey]);

  const refresh = () => setRefreshKey((prev) => prev + 1);

  const handleAddItems = async (newItems: OrderItemForm[]) => {
    if (!user) return;
    setIsSubmitting(true);
    const { error } = await orderService.addItems(
      orderId,
      newItems,
      user.user_id,
    );
    if (error) {
      showSnackbar(t("common.error"), "error");
    } else {
      showSnackbar(t("orderItems.addSuccess"), "success");
      setAddItemsDialogOpen(false);
      refresh();
    }
    setIsSubmitting(false);
  };

  const handleEditItem = async (qty: number) => {
    if (!user || !selectedItem) return;
    setIsSubmitting(true);
    const { error } = await orderService.updateItem(
      selectedItem.id,
      qty,
      user.user_id,
    );
    if (error) {
      showSnackbar(t("common.error"), "error");
    } else {
      showSnackbar(t("orderItems.updateSuccess"), "success");
      setEditItemDialogOpen(false);
      setSelectedItem(null);
      refresh();
    }
    setIsSubmitting(false);
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAllItems = () => {
    if (selectedItemIds.length === items.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(items.map((i) => i.id));
    }
  };

  const handleToggleStatus = async () => {
    if (!user || !order) return;
    setIsTogglingStatus(true);
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
    setIsTogglingStatus(false);
  };

  const handleDeleteItems = async () => {
    if (!user || selectedItemIds.length === 0) return;
    setIsSubmitting(true);
    const { error } = await orderService.deleteItems(selectedItemIds);
    if (error) {
      showSnackbar(t("common.error"), "error");
    } else {
      showSnackbar(t("orderItems.deleteSuccess"), "success");
      setSelectedItemIds([]);
      setDeleteItemsDialogOpen(false);
      refresh();
    }
    setIsSubmitting(false);
  };

  const handleDownloadExcel = async () => {
    if (items.length === 0) {
      showSnackbar(t("orderItems.noItemsToDownload"), "info");
      return;
    }

    try {
      setIsDownloading(true);
      await exportToExcel(order, items, `Order_${order?.order_no}.xlsx`);
    } catch (error) {
      showSnackbar(`Error downloading Excel file: ${error}`, "error");
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    order,
    items,
    isLoading,
    isSubmitting,
    selectedItem,
    selectedItemIds,
    addItemsDialogOpen,
    editItemDialogOpen,
    isTogglingStatus,
    deleteItemsDialogOpen,
    isDownloading,
    setAddItemsDialogOpen,
    setEditItemDialogOpen,
    setDeleteItemsDialogOpen,
    setSelectedItem,
    handleAddItems,
    handleEditItem,
    handleDeleteItems,
    toggleItemSelection,
    toggleAllItems,
    refresh,
    handleToggleStatus,
    handleDownloadExcel,
  };
};
