export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type ProductSpec = { label: string; value: string }
export type ProductImage = { url: string; alt?: string | null }

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          category: string
          tagline: string | null
          short_description: string | null
          full_description: string | null
          origin: string | null
          emoji: string | null
          accent_color: string | null
          images: ProductImage[]
          specs: ProductSpec[]
          varieties: string[]
          grades: string[]
          packaging: string[]
          certifications: string[]
          use_cases: string[]
          related_slugs: string[]
          availability: string | null
          moq: string | null
          moq_unit: 'Kg' | 'MT' | 'Container Load' | 'Custom' | null
          hs_code: string | null
          loading_capacity: string | null
          supply_capacity: string | null
          display_order: number
          is_published: boolean
          is_future: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category: string
          tagline?: string | null
          short_description?: string | null
          full_description?: string | null
          origin?: string | null
          emoji?: string | null
          accent_color?: string | null
          images?: ProductImage[]
          specs?: ProductSpec[]
          varieties?: string[]
          grades?: string[]
          packaging?: string[]
          certifications?: string[]
          use_cases?: string[]
          related_slugs?: string[]
          availability?: string | null
          moq?: string | null
          moq_unit?: 'Kg' | 'MT' | 'Container Load' | 'Custom' | null
          hs_code?: string | null
          loading_capacity?: string | null
          supply_capacity?: string | null
          display_order?: number
          is_published?: boolean
          is_future?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          full_name: string
          company: string | null
          country: string
          product_required: string
          quantity: string | null
          email: string
          whatsapp: string | null
          message: string | null
          source: string | null
          status: 'new' | 'contacted' | 'closed'
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          company?: string | null
          country: string
          product_required: string
          quantity?: string | null
          email: string
          whatsapp?: string | null
          message?: string | null
          source?: string | null
          status?: 'new' | 'contacted' | 'closed'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
        Relationships: []
      }
      news: {
        Row: {
          id: string
          title: string
          slug: string
          cover_image_url: string | null
          body: string | null
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          cover_image_url?: string | null
          body?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['news']['Insert']>
        Relationships: []
      }
      certifications: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          description: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          description?: string | null
          display_order?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['certifications']['Insert']>
        Relationships: []
      }
      gallery_images: {
        Row: {
          id: string
          url: string
          alt: string | null
          category: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          url: string
          alt?: string | null
          category?: string | null
          display_order?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['gallery_images']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
export type Lead = Database['public']['Tables']['leads']['Row']
export type LeadUpdate = Database['public']['Tables']['leads']['Update']
export type NewsPost = Database['public']['Tables']['news']['Row']
export type NewsInsert = Database['public']['Tables']['news']['Insert']
export type NewsUpdate = Database['public']['Tables']['news']['Update']
export type Certification = Database['public']['Tables']['certifications']['Row']
export type CertificationInsert = Database['public']['Tables']['certifications']['Insert']
export type GalleryImage = Database['public']['Tables']['gallery_images']['Row']
export type GalleryImageInsert = Database['public']['Tables']['gallery_images']['Insert']
