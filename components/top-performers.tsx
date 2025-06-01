"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Match } from "@/lib/supabase"
import { Star, Target, Trophy } from "lucide-react"

interface TopPerformersProps {
  matches: Match[]
}

export function TopPerformers({ matches }: TopPerformersProps) {
  // Calculate player of match awards
  const playerAwards = matches.reduce(
    (acc, match) => {
      if (match.player_of_match) {
        acc[match.player_of_match] = (acc[match.player_of_match] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const topPlayers = Object.entries(playerAwards)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  // Calculate team performance
  const teamWins = matches.reduce(
    (acc, match) => {
      if (match.winner && match.winner !== "No Result") {
        acc[match.winner] = (acc[match.winner] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const topTeams = Object.entries(teamWins)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Calculate venue statistics
  const venueMatches = matches.reduce(
    (acc, match) => {
      if (match.venue) {
        acc[match.venue] = (acc[match.venue] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const topVenues = Object.entries(venueMatches)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
          <Star className="h-4 w-4 ml-auto text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPlayers.map(([player, awards], index) => (
              <div key={player} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={index < 3 ? "default" : "secondary"}>#{index + 1}</Badge>
                  <span className="text-sm font-medium">{player}</span>
                </div>
                <span className="text-sm text-muted-foreground">{awards} awards</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Successful Teams</CardTitle>
          <Trophy className="h-4 w-4 ml-auto text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topTeams.map(([team, wins], index) => (
              <div key={team} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={index < 3 ? "default" : "secondary"}>#{index + 1}</Badge>
                  <span className="text-sm font-medium">{team}</span>
                </div>
                <span className="text-sm text-muted-foreground">{wins} wins</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Busiest Venues</CardTitle>
          <Target className="h-4 w-4 ml-auto text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topVenues.map(([venue, matches], index) => (
              <div key={venue} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={index < 3 ? "default" : "secondary"}>#{index + 1}</Badge>
                  <span className="text-sm font-medium text-xs">{venue}</span>
                </div>
                <span className="text-sm text-muted-foreground">{matches}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
