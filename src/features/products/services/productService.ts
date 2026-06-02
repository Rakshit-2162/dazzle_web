import { supabase } from "../../../lib/supabaseClient";
import type { ProductForm } from "../types";

export const productService = {
  getByCategoryId: async (categoryId: string) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  create: async (form: ProductForm, categoryId: string, userId: string) => {
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: form.name,
        code: form.code,
        status: form.status,
        category_id: categoryId,
        created_by: userId,
        updated_by: userId,
      })
      .select()
      .single();
    return { data, error };
  },

  update: async (productId: string, form: ProductForm, userId: string) => {
    const { data, error } = await supabase
      .from("products")
      .update({
        name: form.name,
        code: form.code,
        status: form.status,
        updated_by: userId,
      })
      .eq("id", productId)
      .select()
      .single();
    return { data, error };
  },

  delete: async (productId: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    return { error };
  },
};
