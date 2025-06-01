import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Match {
  id?: number
  season: string
  city: string
  date?: string
  match_type: string
  player_of_match: string
  venue?: string
  team1: string
  team2: string
  toss_winner: string
  toss_decision: string
  winner: string
  result: string
  result_margin: string
  target_runs: string
  target_overs: string
  super_over: string
  method: string
  umpire1: string
  umpire2: string
  [key: string]: any
}
