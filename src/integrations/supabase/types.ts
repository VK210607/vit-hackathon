export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blood_camps: {
        Row: {
          created_at: string
          date: string
          end_time: string
          id: string
          is_active: boolean | null
          location: string
          name: string
          organizer: string | null
          start_time: string
        }
        Insert: {
          created_at?: string
          date: string
          end_time: string
          id?: string
          is_active?: boolean | null
          location: string
          name: string
          organizer?: string | null
          start_time: string
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          is_active?: boolean | null
          location?: string
          name?: string
          organizer?: string | null
          start_time?: string
        }
        Relationships: []
      }
      blood_donation_history: {
        Row: {
          blood_type: Database["public"]["Enums"]["blood_type"]
          camp_id: string | null
          created_at: string
          donation_date: string
          donor_id: string
          id: string
          lives_saved: number | null
          notes: string | null
        }
        Insert: {
          blood_type: Database["public"]["Enums"]["blood_type"]
          camp_id?: string | null
          created_at?: string
          donation_date: string
          donor_id: string
          id?: string
          lives_saved?: number | null
          notes?: string | null
        }
        Update: {
          blood_type?: Database["public"]["Enums"]["blood_type"]
          camp_id?: string | null
          created_at?: string
          donation_date?: string
          donor_id?: string
          id?: string
          lives_saved?: number | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blood_donation_history_camp_id_fkey"
            columns: ["camp_id"]
            isOneToOne: false
            referencedRelation: "blood_camps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blood_donation_history_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      camp_registrations: {
        Row: {
          blood_type: Database["public"]["Enums"]["blood_type"]
          camp_id: string
          donor_id: string
          id: string
          registered_at: string
        }
        Insert: {
          blood_type: Database["public"]["Enums"]["blood_type"]
          camp_id: string
          donor_id: string
          id?: string
          registered_at?: string
        }
        Update: {
          blood_type?: Database["public"]["Enums"]["blood_type"]
          camp_id?: string
          donor_id?: string
          id?: string
          registered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "camp_registrations_camp_id_fkey"
            columns: ["camp_id"]
            isOneToOne: false
            referencedRelation: "blood_camps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "camp_registrations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          blood_type: Database["public"]["Enums"]["blood_type"] | null
          created_at: string
          delivery_type: Database["public"]["Enums"]["delivery_type"] | null
          donation_type: Database["public"]["Enums"]["donation_type"]
          donor_id: string
          expiry_date: string | null
          id: string
          item_image_url: string | null
          item_name: string | null
          location: string | null
          notes: string | null
          quantity: number | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["donation_status"]
          time_slot: string | null
          updated_at: string
        }
        Insert: {
          blood_type?: Database["public"]["Enums"]["blood_type"] | null
          created_at?: string
          delivery_type?: Database["public"]["Enums"]["delivery_type"] | null
          donation_type: Database["public"]["Enums"]["donation_type"]
          donor_id: string
          expiry_date?: string | null
          id?: string
          item_image_url?: string | null
          item_name?: string | null
          location?: string | null
          notes?: string | null
          quantity?: number | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["donation_status"]
          time_slot?: string | null
          updated_at?: string
        }
        Update: {
          blood_type?: Database["public"]["Enums"]["blood_type"] | null
          created_at?: string
          delivery_type?: Database["public"]["Enums"]["delivery_type"] | null
          donation_type?: Database["public"]["Enums"]["donation_type"]
          donor_id?: string
          expiry_date?: string | null
          id?: string
          item_image_url?: string | null
          item_name?: string | null
          location?: string | null
          notes?: string | null
          quantity?: number | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["donation_status"]
          time_slot?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aadhar: string | null
          age: number | null
          contact_number: string | null
          created_at: string
          email: string
          facility_name: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          hfr_id: string | null
          id: string
          location: string | null
          ngo_coordinator: string | null
          ngo_id: string | null
          ngo_name: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          aadhar?: string | null
          age?: number | null
          contact_number?: string | null
          created_at?: string
          email: string
          facility_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          hfr_id?: string | null
          id?: string
          location?: string | null
          ngo_coordinator?: string | null
          ngo_id?: string | null
          ngo_name?: string | null
          phone_number?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          aadhar?: string | null
          age?: number | null
          contact_number?: string | null
          created_at?: string
          email?: string
          facility_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          hfr_id?: string | null
          id?: string
          location?: string | null
          ngo_coordinator?: string | null
          ngo_id?: string | null
          ngo_name?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          blood_type: Database["public"]["Enums"]["blood_type"] | null
          created_at: string
          id: string
          item_name: string
          location: string | null
          notes: string | null
          priority: Database["public"]["Enums"]["priority_level"]
          quantity: number
          request_type: Database["public"]["Enums"]["donation_type"]
          requester_id: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          blood_type?: Database["public"]["Enums"]["blood_type"] | null
          created_at?: string
          id?: string
          item_name: string
          location?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["priority_level"]
          quantity?: number
          request_type: Database["public"]["Enums"]["donation_type"]
          requester_id: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          blood_type?: Database["public"]["Enums"]["blood_type"] | null
          created_at?: string
          id?: string
          item_name?: string
          location?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["priority_level"]
          quantity?: number
          request_type?: Database["public"]["Enums"]["donation_type"]
          requester_id?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      delivery_type: "pickup" | "self_drop"
      donation_status:
        | "pending"
        | "approved"
        | "collected"
        | "dispatched"
        | "in_transit"
        | "delivered"
        | "in_stock"
      donation_type: "blood" | "medicine" | "equipment"
      gender_type: "male" | "female" | "other"
      priority_level: "low" | "medium" | "critical"
      request_status:
        | "pending"
        | "approved"
        | "rejected"
        | "dispatched"
        | "in_transit"
        | "delivered"
      user_role: "individual" | "healthcare_facility" | "ngo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blood_type: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      delivery_type: ["pickup", "self_drop"],
      donation_status: [
        "pending",
        "approved",
        "collected",
        "dispatched",
        "in_transit",
        "delivered",
        "in_stock",
      ],
      donation_type: ["blood", "medicine", "equipment"],
      gender_type: ["male", "female", "other"],
      priority_level: ["low", "medium", "critical"],
      request_status: [
        "pending",
        "approved",
        "rejected",
        "dispatched",
        "in_transit",
        "delivered",
      ],
      user_role: ["individual", "healthcare_facility", "ngo"],
    },
  },
} as const
