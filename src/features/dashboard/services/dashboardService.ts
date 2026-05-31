import { supabase } from "../../../lib/supabaseClient";

export const dashboardService = {
  getStats: async () => {
    try {
      const [ordersResult, totalClients, totalProducts, totalCategories] =
        await Promise.all([
          supabase.from("order_master").select("order_status"),
          supabase
            .from("clients")
            .select("*", { count: "exact", head: true })
            .eq("status", "ACT"),
          supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("status", "ACT"),
          supabase
            .from("categories")
            .select("*", { count: "exact", head: true })
            .eq("status", "ACT"),
        ]);

      const orders = ordersResult.data ?? [];
      const totalOrders = orders.length;
      const inProgressOrders = orders.filter(
        (order) => order.order_status === "IN_PROGRESS",
      ).length;
      const completedOrders = orders.filter(
        (order) => order.order_status === "COMPLETED",
      ).length;

      return {
        data: {
          totalOrders,
          inProgressOrders,
          completedOrders,
          totalClients: totalClients.count ?? 0,
          totalProducts: totalProducts.count ?? 0,
          totalCategories: totalCategories.count ?? 0,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  },
};
