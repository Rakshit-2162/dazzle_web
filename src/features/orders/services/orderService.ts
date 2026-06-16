import { supabase } from "../../../lib/supabaseClient";
import type { OrderMasterForm, OrderItemForm } from "../types";

export const orderService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("order_master")
      .select("*, clients(id, name, city, mobile)")
      .order("created_at", { ascending: false });
    return { data, error };
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("order_master")
      .select("*, clients(id, name, city, mobile)")
      .eq("id", id)
      .single();
    return { data, error };
  },

  create: async (form: OrderMasterForm, userId: string) => {
    const { data, error } = await supabase
      .from("order_master")
      .insert({
        client_id: form.client_id,
        remarks: form.remarks,
        order_status: form.order_status,
        created_by: userId,
        updated_by: userId,
      })
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, form: OrderMasterForm, userId: string) => {
    const { data, error } = await supabase
      .from("order_master")
      .update({
        client_id: form.client_id,
        remarks: form.remarks,
        order_status: form.order_status,
        updated_by: userId,
      })
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("order_master").delete().eq("id", id);
    return { error };
  },

  // order items
  getItems: async (orderId: string) => {
    const { data, error } = await supabase
      .from("order_items")
      .select("*, products(id, code, name, category_id, categories(id, name))")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });
    return { data, error };
  },

  addItems: async (orderId: string, items: OrderItemForm[], userId: string) => {
    try {
      const results = await Promise.all(
        items.map((item) =>
          supabase.rpc("upsert_order_item", {
            p_order_id: orderId,
            p_product_code: item.product_code,
            p_qty: item.qty,
            p_user_id: userId,
          }),
        ),
      );

      const error = results.find((r) => r.error)?.error ?? null;
      const data = results.map((r) => r.data);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  updateItem: async (id: string, qty: number, userId: string) => {
    const { data, error } = await supabase
      .from("order_items")
      .update({ qty, updated_by: userId })
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  deleteItems: async (ids: string[]) => {
    const { error } = await supabase.from("order_items").delete().in("id", ids);
    return { error };
  },

  toggleStatus: async (id: string, currentStatus: string, userId: string) => {
    const newStatus =
      currentStatus === "IN_PROGRESS" ? "COMPLETED" : "IN_PROGRESS";
    const { data, error } = await supabase
      .from("order_master")
      .update({ order_status: newStatus, updated_by: userId })
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },
};
