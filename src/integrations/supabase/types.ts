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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      claim_submissions: {
        Row: {
          claim_text: string
          context: string | null
          created_at: string
          email: string | null
          id: string
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          claim_text: string
          context?: string | null
          created_at?: string
          email?: string | null
          id?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          claim_text?: string
          context?: string | null
          created_at?: string
          email?: string | null
          id?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      fact_checks: {
        Row: {
          author: string | null
          category: string | null
          claim: string
          confidence_level: string | null
          created_at: string
          date: string | null
          excerpt: string | null
          featured: boolean | null
          id: string
          politician_id: string | null
          shares: number | null
          sources_count: number | null
          title: string
          updated_at: string
          verdict: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          claim: string
          confidence_level?: string | null
          created_at?: string
          date?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          politician_id?: string | null
          shares?: number | null
          sources_count?: number | null
          title: string
          updated_at?: string
          verdict: string
        }
        Update: {
          author?: string | null
          category?: string | null
          claim?: string
          confidence_level?: string | null
          created_at?: string
          date?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          politician_id?: string | null
          shares?: number | null
          sources_count?: number | null
          title?: string
          updated_at?: string
          verdict?: string
        }
        Relationships: [
          {
            foreignKeyName: "fact_checks_politician_id_fkey"
            columns: ["politician_id"]
            isOneToOne: false
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      politicians: {
        Row: {
          avatar_color: string | null
          created_at: string
          false_pct: number | null
          id: string
          initials: string | null
          misleading_pct: number | null
          name: string
          role: string | null
          true_pct: number | null
          updated_at: string
        }
        Insert: {
          avatar_color?: string | null
          created_at?: string
          false_pct?: number | null
          id?: string
          initials?: string | null
          misleading_pct?: number | null
          name: string
          role?: string | null
          true_pct?: number | null
          updated_at?: string
        }
        Update: {
          avatar_color?: string | null
          created_at?: string
          false_pct?: number | null
          id?: string
          initials?: string | null
          misleading_pct?: number | null
          name?: string
          role?: string | null
          true_pct?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      site_stats: {
        Row: {
          false_claims_pct: number | null
          id: string
          last_updated: string | null
          politicians_tracked: number | null
          total_fact_checks: number | null
        }
        Insert: {
          false_claims_pct?: number | null
          id?: string
          last_updated?: string | null
          politicians_tracked?: number | null
          total_fact_checks?: number | null
        }
        Update: {
          false_claims_pct?: number | null
          id?: string
          last_updated?: string | null
          politicians_tracked?: number | null
          total_fact_checks?: number | null
        }
        Relationships: []
      }
      ticker_items: {
        Row: {
          created_at: string
          headline: string
          id: string
          is_active: boolean | null
          label: string | null
          priority: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          headline: string
          id?: string
          is_active?: boolean | null
          label?: string | null
          priority?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          headline?: string
          id?: string
          is_active?: boolean | null
          label?: string | null
          priority?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
