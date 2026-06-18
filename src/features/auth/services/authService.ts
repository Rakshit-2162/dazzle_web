import { supabase } from "../../../lib/supabaseClient";
import type { Profile } from "../types";

export const authService = {
  signUp: async (
    email: string,
    password: string,
    userName: string,
    userType: string,
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_name: userName,
            user_type: userType,
          },
        },
      });
      return { data: data.user, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data: data.user, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  getUserProfile: async (
    userId: string,
  ): Promise<{ data: Profile | null; error: unknown }> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  updateProfile: async (userId: string, userName: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ user_name: userName })
        .eq("user_id", userId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  updatePassword: async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { data: data.user, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};
