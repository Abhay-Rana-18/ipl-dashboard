"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Trophy, Target } from 'lucide-react'

interface Match {
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

// Mock data for demonstration
const mockMatches: Match[] = [
  {
    id: 1,
    season: "2024",
    city: "Mumbai",
    date: "2024-03-15",
    match_type: "T20",
    player_of_match: "V Kohli",
    venue: "Wankhede Stadium",
    team1: "Mumbai Indians",
    team2: "Chennai Super Kings",
    toss_winner: "Mumbai Indians",
    toss_decision: "bat",
    winner: "Mumbai Indians",
    result: "won by 6 wickets",
    result_margin: "6 wickets",
    target_runs: "165",
    target_overs: "20",
    super_over: "N",
    method: "regular",
    umpire1: "A Nand Kishore",
    umpire2: "K Ananthapadmanabhan"
  },
  {
    id: 2,
    season: "2024",
    city: "Chennai",
    date: "2024-03-18",
    match_type: "T20",
    player_of_match: "MS Dhoni",
    venue: "MA Chidambaram Stadium",
    team1: "Chennai Super Kings",
    team2: "Royal Challengers Bangalore",
    toss_winner: "Chennai Super Kings",
    toss_decision: "field",
    winner: "Royal Challengers Bangalore",
    result: "won by 4 runs",
    result_margin: "4 runs",
    target_runs: "180",
    target_overs: "20",
    super_over: "N",
    method: "regular",
    umpire1: "Nitin Menon",
    umpire2: "Anil Chaudhary"
  },
  {
    id: 3,
    season: "2024",
    city: "Bangalore",
    date: "2024-03-20",
    match_type: "T20",
    player_of_match: "AB de Villiers",
    venue: "M Chinnaswamy Stadium",
    team1: "Royal Challengers Bangalore",
    team2: "Delhi Capitals",
    toss_winner: "Royal Challengers Bangalore",
    toss_decision: "bat",
    winner: "Royal Challengers Bangalore",
    result: "won by 8 wickets",
    result_margin: "8 wickets",
    target_runs: "155",
    target_overs: "20",
    super_over: "N",
    method: "regular",
    umpire1: "Virender Sharma",
    umpire2: "Sundaram Ravi"
  },
  {
    id: 4,
    season: "2024",
    city: "Delhi",
    date: "2024-03-22",
    match_type: "T20",
    player_of_match: "R Pant",
    venue: "Arun Jaitley Stadium",
    team1: "Delhi Capitals",
    team2: "Kolkata Knight Riders",
    toss_winner: "Kolkata Knight Riders",
    toss_decision: "field",
    winner: "Delhi Capitals",
    result: "won by 5 runs",
    result_margin: "5 runs",
    target_runs: "175",
    target_overs: "20",
    super_over: "N",
    method: "regular",
    umpire1: "Chris Gaffaney",
    umpire2: "Marais Erasmus"
  },
  {
    id: 5,
    season: "2024",
    city: "Kolkata",
    date: "2024-03-25",
    match_type: "T20",
    player_of_match: "A Russell",
    venue: "Eden Gardens",
    team1: "Kolkata Knight Riders",
    team2: "Punjab Kings",
    toss_winner: "Kolkata Knight Riders",
    toss_decision: "bat",
    winner: "Kolkata Knight Riders",
    result: "won by 7 wickets",
    result_margin: "7 wickets",
    target_runs: "160",
    target_overs: "20",
    super_over: "N",
    method: "regular",
    umpire1: "Bruce Oxenford",
    umpire2: "Ian Gould"
  },
  {
    id: 6,
    season: "2024",
    city: "Mohali",
    date: "2024-03-28",
    match_type: "T20",
    player_of_match: "KL Rahul",
    venue: "PCA Stadium",
    team1: "Punjab Kings",
    team2: "Rajasthan Royals",
    toss_winner: "Punjab Kings",
    toss_decision: "field",
    winner: "Rajasthan Royals",
    result: "won by 3 wickets",
    result_margin: "3 wickets",
    target_runs: "170",
    target_overs: "20",
    super_over: "N",
    method: "regular",
    umpire1: "Aleem Dar",
    umpire2: "Richard Kettleborough"
  }
]

export default function TossStatsPage() {
  const [selectedSeason, setSelectedSeason] = useState<string>("all")
  const [selectedMatchType, setSelectedMatchType] = useState<string>("all")

  const filteredMatches = useMemo(() => {
    return mockMatches.filter(match => {
      if (selectedSeason !== "all" && match.season !== selectedSeason) return false
      if (selectedMatchType !== "all" && match.match_type !== selectedMatchType) return false
      return true
    })
  }, [selectedSeason, selectedMatchType])

  const stats = useMemo(() => {
    const totalMatches = filteredMatches.length
    const tossWinnerAlsoWon = filteredMatches.filter(match => match.toss_winner === match.winner).length
    const tossWinPercentage = totalMatches > 0 ? (tossWinnerAlsoWon / totalMatches) * 100 : 0

    const batFirstStats = filteredMatches.filter(match => match.toss_decision === "bat")
    const batFirstWins = batFirstStats.filter(match => match.toss_winner === match.winner).length
    const batFirstPercentage = batFirstStats.length > 0 ? (batFirstWins / batFirstStats.length) * 100 : 0

    const fieldFirstStats = filteredMatches.filter(match => match.toss_decision === "field")
    const fieldFirstWins = fieldFirstStats.filter(match => match.toss_winner === match.winner).length
    const fieldFirstPercentage = fieldFirstStats.length > 0 ? (fieldFirstWins / fieldFirstStats.length) * 100 : 0

    return {
      totalMatches,
      tossWinnerAlsoWon,
      tossWinPercentage,
      batFirstStats: batFirstStats.length,
      batFirstWins,
      batFirstPercentage,
      fieldFirstStats: fieldFirstStats.length,
      fieldFirstWins,
      fieldFirstPercentage
    }
  }, [filteredMatches])

  const pieChartData = [
    { name: "Toss Winner Won", value: stats.tossWinnerAlsoWon, fill: "#22c55e" },
    { name: "Toss Winner Lost", value: stats.totalMatches - stats.tossWinnerAlsoWon, fill: "#ef4444" }
  ]

  const decisionChartData = [
    { 
      decision: "Bat First", 
      wins: stats.batFirstWins, 
      losses: stats.batFirstStats - stats.batFirstWins,
      percentage: stats.batFirstPercentage 
    },
    { 
      decision: "Field First", 
      wins: stats.fieldFirstWins, 
      losses: stats.fieldFirstStats - stats.fieldFirstWins,
      percentage: stats.fieldFirstPercentage 
    }
  ]

  const seasons = [...new Set(mockMatches.map(match => match.season))]
  const matchTypes = [...new Set(mockMatches.map(match => match.match_type))]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Toss Win to Match Win Correlation</h1>
        <p className="text-muted-foreground">
          Analyze the relationship between winning the toss and winning the match
        </p>
        
        <div className="flex gap-4">
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Seasons</SelectItem>
              {seasons.map(season => (
                <SelectItem key={season} value={season}>{season}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedMatchType} onValueChange={setSelectedMatchType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select match type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Match Types</SelectItem>
              {matchTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMatches}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toss Winner Won</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tossWinnerAlsoWon}</div>
            <p className="text-xs text-muted-foreground">
              out of {stats.totalMatches} matches
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            {stats.tossWinPercentage >= 50 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tossWinPercentage.toFixed(1)}%</div>
            <Badge variant={stats.tossWinPercentage >= 50 ? "default" : "secondary"}>
              {stats.tossWinPercentage >= 50 ? "Advantage" : "No Advantage"}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Decision</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.batFirstPercentage > stats.fieldFirstPercentage ? "Bat" : "Field"}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.max(stats.batFirstPercentage, stats.fieldFirstPercentage).toFixed(1)}% success
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="decisions">Toss Decisions</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Toss Win vs Match Win</CardTitle>
                <CardDescription>
                  Distribution of match outcomes for toss winners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    won: { label: "Won", color: "#22c55e" },
                    lost: { label: "Lost", color: "#ef4444" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Success by Toss Decision</CardTitle>
                <CardDescription>
                  Win percentage when choosing to bat or field first
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    wins: { label: "Wins", color: "#22c55e" },
                    losses: { label: "Losses", color: "#ef4444" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={decisionChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="decision" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="wins" fill="#22c55e" name="Wins" />
                      <Bar dataKey="losses" fill="#ef4444" name="Losses" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="decisions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bat First Analysis</CardTitle>
                <CardDescription>
                  Performance when winning toss and choosing to bat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Matches:</span>
                  <Badge variant="outline">{stats.batFirstStats}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Wins:</span>
                  <Badge variant="default">{stats.batFirstWins}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Success Rate:</span>
                  <Badge variant={stats.batFirstPercentage >= 50 ? "default" : "secondary"}>
                    {stats.batFirstPercentage.toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Field First Analysis</CardTitle>
                <CardDescription>
                  Performance when winning toss and choosing to field
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Matches:</span>
                  <Badge variant="outline">{stats.fieldFirstStats}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Wins:</span>
                  <Badge variant="default">{stats.fieldFirstWins}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Success Rate:</span>
                  <Badge variant={stats.fieldFirstPercentage >= 50 ? "default" : "secondary"}>
                    {stats.fieldFirstPercentage.toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Match Details</CardTitle>
              <CardDescription>
                Detailed breakdown of all matches in the selected filter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Teams</TableHead>
                    <TableHead>Toss Winner</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Match Winner</TableHead>
                    <TableHead>Correlation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMatches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>{match.date}</TableCell>
                      <TableCell>{match.team1} vs {match.team2}</TableCell>
                      <TableCell>{match.toss_winner}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {match.toss_decision === "bat" ? "Bat First" : "Field First"}
                        </Badge>
                      </TableCell>
                      <TableCell>{match.winner}</TableCell>
                      <TableCell>
                        <Badge variant={match.toss_winner === match.winner ? "default" : "secondary"}>
                          {match.toss_winner === match.winner ? "✓ Match" : "✗ No Match"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
