import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  name: string
  email: string
  phone: string
  user_type: 'vendor' | 'supplier'
  language: string
  created_at: string
  updated_at: string
}

export interface Vendor {
  id: string
  user_id: string
  business_name: string
  category: string
  description: string
  location: string
  business_license?: string
  gst_number?: string
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  user_id: string
  business_name: string
  category: string
  products: string[]
  rating?: number
  location: string
  contact_info: {
    phone: string
    email: string
  }
  price_range: string
  description: string
  established: string
  certifications: string[]
  business_license?: string
  gst_number?: string
  created_at: string
  updated_at: string
}

// Database operations
export const dbOperations = {
  // User operations
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Vendor operations
  async createVendor(vendorData: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('vendors')
      .insert([vendorData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateVendor(userId: string, updates: Partial<Vendor>) {
    const { data, error } = await supabase
      .from('vendors')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getVendorByUserId(userId: string) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Supplier operations
  async createSupplier(supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([supplierData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateSupplier(userId: string, updates: Partial<Supplier>) {
    const { data, error } = await supabase
      .from('suppliers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getSupplierByUserId(userId: string) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getSuppliersByCategory(category: string) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('category', category)
    
    if (error) throw error
    return data || []
  },

  async getAllSuppliers() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
    
    if (error) throw error
    return data || []
  }
}