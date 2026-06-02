import { supabase } from "../../../lib/supabaseClient";
import type { CategoryForm } from "../types";

export const categoryService = {
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });
    return { data, error };
  },

  create: async (formData: CategoryForm, userId: string) => {
    const { data, error } = await supabase
      .from("categories")
      .insert([
        {
          name: formData.name,
          type: formData.type,
          status: formData.status,
          created_by: userId,
          updated_by: userId,
        },
      ])
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, formData: CategoryForm, userId: string) => {
    const { data, error } = await supabase
      .from("categories")
      .update({
        name: formData.name,
        type: formData.type,
        status: formData.status,
        updated_by: userId,
      })
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { data, error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },
};
