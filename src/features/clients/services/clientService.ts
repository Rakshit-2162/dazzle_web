import { supabase } from '../../../lib/supabaseClient'
import type { ClientForm } from '../types'

export const clientService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  getAllActive: async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('status', 'ACT')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  create: async (form: ClientForm, userId: string) => {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        name: form.name,
        city: form.city,
        mobile: form.mobile,
        status: form.status,
        created_by: userId,
        updated_by: userId,
      })
      .select()
      .single()
    return { data, error }
  },

  update: async (id: string, form: ClientForm, userId: string) => {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: form.name,
        city: form.city,
        mobile: form.mobile,
        status: form.status,
        updated_by: userId,
      })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    return { error }
  },
}