export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: string
          name: string
          price: number
          image_url: string
          description: string
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          image_url: string
          description?: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          image_url?: string
          description?: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_phone: string
          items: Json
          total_amount: number
          status: 'pending' | 'preparing' | 'delivered'
          payment_status: 'unpaid' | 'paid'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_name: string
          customer_phone: string
          items: Json
          total_amount: number
          status?: 'pending' | 'preparing' | 'delivered'
          payment_status?: 'unpaid' | 'paid'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_phone?: string
          items?: Json
          total_amount?: number
          status?: 'pending' | 'preparing' | 'delivered'
          payment_status?: 'unpaid' | 'paid'
          created_at?: string
          updated_at?: string
        }
      }
      about_info: {
        Row: {
          id: string
          story: string
          mission: string
          facebook_url: string
          instagram_url: string
          updated_at: string
        }
        Insert: {
          id?: string
          story?: string
          mission?: string
          facebook_url?: string
          instagram_url?: string
          updated_at?: string
        }
        Update: {
          id?: string
          story?: string
          mission?: string
          facebook_url?: string
          instagram_url?: string
          updated_at?: string
        }
      }
    }
  }
}

export type MenuItem = Database['public']['Tables']['menu_items']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type AboutInfo = Database['public']['Tables']['about_info']['Row'];

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
