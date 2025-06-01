"use client"

import { useState, useEffect } from "react"
import { supabase, type Match } from "@/lib/supabase"

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatches() {
      try {
        const { data, error } = await supabase.from("matches").select("*")

        if (error) throw error

        setMatches(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        // Fallback to mock data for demo
        setMatches(mockMatches)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  return { matches, loading, error }
}

// Mock data for demonstration
const mockMatches: Match[] = [
  {
    id: 1,
    season: "2023",
    city: "Mumbai",
    date: "2023-04-15",
    match_type: "League",
    player_of_match: "Rohit Sharma",
    venue: "Wankhede Stadium",
    team1: "Mumbai Indians",
    team2: "Chennai Super Kings",
    toss_winner: "Mumbai Indians",
    toss_decision: "bat",
    winner: "Mumbai Indians",
    result: "normal",
    result_margin: "5 wickets",
    target_runs: "180",
    target_overs: "20",
    super_over: "N",
    method: "",
    umpire1: "Nitin Menon",
    umpire2: "KN Ananthapadmanabhan",
  },
  {
    id: 2,
    season: "2023",
    city: "Chennai",
    date: "2023-04-18",
    match_type: "League",
    player_of_match: "MS Dhoni",
    venue: "M. A. Chidambaram Stadium",
    team1: "Chennai Super Kings",
    team2: "Royal Challengers Bangalore",
    toss_winner: "Chennai Super Kings",
    toss_decision: "field",
    winner: "Chennai Super Kings",
    result: "normal",
    result_margin: "8 runs",
    target_runs: "165",
    target_overs: "20",
    super_over: "N",
    method: "",
    umpire1: "Anil Chaudhary",
    umpire2: "Nitin Menon",
  },
  {
    id: 3,
    season: "2023",
    city: "Bangalore",
    date: "2023-04-20",
    match_type: "League",
    player_of_match: "Virat Kohli",
    venue: "M. Chinnaswamy Stadium",
    team1: "Royal Challengers Bangalore",
    team2: "Kolkata Knight Riders",
    toss_winner: "Royal Challengers Bangalore",
    toss_decision: "bat",
    winner: "Royal Challengers Bangalore",
    result: "normal",
    result_margin: "6 wickets",
    target_runs: "155",
    target_overs: "20",
    super_over: "N",
    method: "",
    umpire1: "Virender Sharma",
    umpire2: "Anil Chaudhary",
  },
]
