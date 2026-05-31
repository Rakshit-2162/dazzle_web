export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Dazzle'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const Status = {
  ACTIVE: 'ACT',
  INACTIVE: 'INA'
} as const
export type Status = typeof Status[keyof typeof Status]

export const UserType = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT'
} as const
export type UserType = typeof UserType[keyof typeof UserType]

export const OrderStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]

export const CategoryType = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY'
} as const
export type CategoryType = typeof CategoryType[keyof typeof CategoryType]