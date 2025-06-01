"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Match } from "@/lib/supabase"
import { CalendarDays, MapPin, Trophy, Users, TrendingUp } from "lucide-react"

interface OverviewStatsProps {
  matches: Match[]
}

export function OverviewStats({ matches }: OverviewStatsProps) {
  const totalMatches = matches.length
  const uniqueCities = new Set(matches.map((m) => m.city)).size
  const uniqueVenues = new Set(matches.map((m) => m.venue)).size
  const uniquePlayers = new Set(matches.map((m) => m.player_of_match)).size
  const seasons = new Set(matches.map((m) => m.season)).size

  const stats = [
    {
      title: "Total Matches",
      value: totalMatches,
      description: "IPL matches",
      icon: Trophy,
      color: "text-blue-600",
    },
    {
      title: "Cities",
      value: uniqueCities,
      description: "Host cities",
      icon: MapPin,
      color: "text-green-600",
    },
    {
      title: "Venues",
      value: uniqueVenues,
      description: "Cricket stadiums",
      icon: CalendarDays,
      color: "text-purple-600",
    },
    {
      title: "Players",
      value: uniquePlayers,
      description: "Man of the Match",
      icon: Users,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">IPL Dashboard Overview</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Insights from {seasons} seasons of cricket</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 sm:p-2 rounded-md bg-gray-100">
                  <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Cricket Excellence
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs sm:text-sm text-gray-600">
              Experience IPL through data-driven insights, comprehensive statistics, and interactive visualizations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              Advanced Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs sm:text-sm text-gray-600">
              Explore team performance, player statistics, venue analysis, and seasonal trends with modern analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
