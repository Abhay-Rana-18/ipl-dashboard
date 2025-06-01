"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface CityCoordinates {
  [key: string]: [number, number]
}

interface CityStats {
  [key: string]: number
}

interface ChartData {
  city?: string
  count?: number
  team?: string
  wins?: number
  season?: string
  matches?: number
}

interface TeamCityWins {
  [city: string]: {
    [team: string]: number
  }
}

interface Match {
  id: string
  season: string
  city: string
  team1: string
  team2: string
  winner: string
  date?: string
}

interface MatchesByCityProps {
  matches?: Match[]
}

const cityCoordinates: CityCoordinates = {
  Mumbai: [72.8777, 19.076],
  Chennai: [80.2707, 13.0827],
  Delhi: [77.1025, 28.7041],
  Kolkata: [88.3639, 22.5726],
  Bengaluru: [77.5946, 12.9716],
  Hyderabad: [78.4867, 17.385],
  Jaipur: [75.7873, 26.9124],
  Ahmedabad: [72.5714, 23.0225],
  Pune: [73.8567, 18.5204],
  Rajkot: [70.8022, 22.3039],
  Mohali: [76.7179, 30.7046],
  Indore: [75.8577, 22.7196],
  Kanpur: [80.3319, 26.4499],
  Dharamshala: [76.3234, 32.2396],
  Cuttack: [85.8245, 20.4625],
  Ranchi: [85.324, 23.3441],
  Nagpur: [79.0882, 21.1458],
  Visakhapatnam: [83.3018, 17.6868],
}

const teamColors: { [key: string]: string } = {
  "Mumbai Indians": "#004BA0",
  "Chennai Super Kings": "#BFAE2E",
  "Royal Challengers Bangalore": "#EC1C24",
  "Kolkata Knight Riders": "#3A225D",
  "Sunrisers Hyderabad": "#FF822A",
  "Delhi Capitals": "#282968",
  "Punjab Kings": "#ED1B24",
  "Rajasthan Royals": "#254AA5",
  "Gujarat Titans": "#1B2951",
  "Lucknow Super Giants": "#00A9E0",
}

export default function MatchesByCity({ matches }: MatchesByCityProps) {
  if (!matches) {
    matches = []
  }
  const teamMapContainerRef = useRef<HTMLDivElement | null>(null)
  const teamMapRef = useRef<any>(null)
  const teamMarkersRef = useRef<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [season, setSeason] = useState<string>("All")
  const [seasons, setSeasons] = useState<string[]>([])
  const [mapboxLoaded, setMapboxLoaded] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [matchesData, setMatchesData] = useState<Match[]>([])

  // Generate sample data if no matches provided
  useEffect(() => {
    const generateSampleData = (): Match[] => {
      const cities = Object.keys(cityCoordinates)
      const teams = Object.keys(teamColors)
      const seasonsArray = ["2020", "2021", "2022", "2023", "2024"]
      const sampleMatches: Match[] = []

      for (let i = 0; i < 200; i++) {
        const city = cities[Math.floor(Math.random() * cities.length)]
        const team1 = teams[Math.floor(Math.random() * teams.length)]
        let team2 = teams[Math.floor(Math.random() * teams.length)]
        while (team2 === team1) {
          team2 = teams[Math.floor(Math.random() * teams.length)]
        }
        const winner = Math.random() > 0.5 ? team1 : team2
        const season = seasonsArray[Math.floor(Math.random() * seasonsArray.length)]

        sampleMatches.push({
          id: `match-${i}`,
          season,
          city,
          team1,
          team2,
          winner,
          date: `2024-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(
            2,
            "0",
          )}`,
        })
      }

      return sampleMatches
    }

    try {
      const dataToUse = matches.length > 0 ? matches : generateSampleData()
      setMatchesData(dataToUse)

      // Extract unique seasons
      const uniqueSeasons = [...new Set(dataToUse.map((m) => m.season))].sort()
      setSeasons(uniqueSeasons)

      setLoading(false)
    } catch (err) {
      setError("Failed to load match data")
      setLoading(false)
    }
  }, [matches])

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Load Mapbox GL JS
  useEffect(() => {
    const loadMapbox = async () => {
      if (typeof window !== "undefined" && !(window as any).mapboxgl) {
        // Load Mapbox CSS
        const link = document.createElement("link")
        link.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
        link.rel = "stylesheet"
        document.head.appendChild(link)

        // Load Mapbox JS
        const script = document.createElement("script")
        script.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
        script.onload = () => {
          setMapboxLoaded(true)
        }
        script.onerror = () => {
          console.warn("Mapbox failed to load, using fallback")
          setMapboxLoaded(false)
        }
        document.head.appendChild(script)
      } else if ((window as any).mapboxgl) {
        setMapboxLoaded(true)
      }
    }

    loadMapbox()
  }, [])

  // useEffect for team map (teamMapRef)
  useEffect(() => {
    if (!teamMapContainerRef.current || loading) return

    // If Mapbox is not loaded, show fallback
    if (!mapboxLoaded) {
      const fallbackHTML = `
        <div class="flex items-center justify-center h-full bg-gray-50 p-4">
          <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm max-w-md w-full text-center border">
            <div class="text-3xl sm:text-4xl mb-3 sm:mb-4">🗺️</div>
            <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Interactive Map</h3>
            <div class="text-xs sm:text-sm text-gray-600 space-y-2">
              <p>Map visualization shows team wins across ${Object.keys(cityCoordinates).length} cities</p>
              <p class="text-xs text-gray-500 mt-3 sm:mt-4">Mapbox integration available with API key</p>
            </div>
          </div>
        </div>
      `
      teamMapContainerRef.current.innerHTML = fallbackHTML
      return
    }

    // Set your Mapbox access token here
    const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "YOUR_MAPBOX_ACCESS_TOKEN"

    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "YOUR_MAPBOX_ACCESS_TOKEN") {
      // Fallback display when no Mapbox token
      const fallbackHTML = `
        <div class="flex items-center justify-center h-full bg-gray-50 p-4">
          <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm max-w-md w-full text-center border">
            <div class="text-3xl sm:text-4xl mb-3 sm:mb-4">🏆</div>
            <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Team Map Setup Required</h3>
            <div class="text-xs sm:text-sm text-gray-600 space-y-2">
              <p>To display the team wins map:</p>
              <ol class="text-left list-decimal list-inside space-y-1">
                <li>Get a Mapbox token from <a href="https://account.mapbox.com/" target="_blank" class="text-blue-600 hover:underline">mapbox.com</a></li>
                <li>Add it to your environment variables</li>
                <li>Or replace the token in the code</li>
              </ol>
            </div>
            <div class="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded border">
              <p class="text-xs text-gray-500">
                Team data ready for ${Object.keys(cityCoordinates).length} cities
              </p>
            </div>
          </div>
        </div>
      `
      teamMapContainerRef.current.innerHTML = fallbackHTML
      return
    }
    ;(window as any).mapboxgl.accessToken = MAPBOX_TOKEN

    // Clean up existing team map
    if (teamMapRef.current) {
      teamMapRef.current.remove()
    }

    // Clear existing team markers
    teamMarkersRef.current.forEach((marker) => marker.remove())
    teamMarkersRef.current = []

    const teamMap = new (window as any).mapboxgl.Map({
      container: teamMapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [78.9629, 20.5937], // Center of India
      zoom: isMobile ? 3.5 : 4.2,
    })

    // Add navigation controls
    teamMap.addControl(new (window as any).mapboxgl.NavigationControl(), "top-right")

    teamMapRef.current = teamMap

    return () => {
      if (teamMapRef.current) {
        teamMapRef.current.remove()
        teamMapRef.current = null
      }
      teamMarkersRef.current.forEach((marker) => marker.remove())
      teamMarkersRef.current = []
    }
  }, [mapboxLoaded, loading, isMobile])

  useEffect(() => {
    if (!teamMapRef.current || !matchesData.length || loading || !mapboxLoaded) return

    const filtered: Match[] = season === "All" ? matchesData : matchesData.filter((m) => m.season === season)

    // Calculate team wins by city
    const teamCityWins: TeamCityWins = {}
    filtered.forEach((match) => {
      const city = match.city
      const winner = match.winner
      if (city && winner && cityCoordinates[city]) {
        if (!teamCityWins[city]) {
          teamCityWins[city] = {}
        }
        teamCityWins[city][winner] = (teamCityWins[city][winner] || 0) + 1
      }
    })

    // Clear existing team markers
    teamMarkersRef.current.forEach((marker) => marker.remove())
    teamMarkersRef.current = []

    // Add team wins markers
    Object.entries(teamCityWins).forEach(([city, teams]) => {
      const coords = cityCoordinates[city]
      if (!coords) return

      // Find the team with most wins in this city
      const topTeam = Object.entries(teams).sort(([, a], [, b]) => b - a)[0]
      const [teamName, wins] = topTeam
      const totalWins = Object.values(teams).reduce((sum, w) => sum + w, 0)

      const el = document.createElement("div")
      el.className = "team-marker"

      let size = isMobile ? 30 : 35
      if (totalWins < 5) {
        size = isMobile ? 20 : 25
      }
      if (totalWins > 20) {
        size = isMobile ? 40 : 45
      }

      el.style.width = `${size}px`
      el.style.height = `${size}px`
      el.style.backgroundColor = teamColors[teamName] || "#6b7280"
      el.style.border = "3px solid white"
      el.style.borderRadius = "50%"
      el.style.cursor = "pointer"
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)"
      el.style.display = "flex"
      el.style.alignItems = "center"
      el.style.justifyContent = "center"
      el.style.color = "white"
      el.style.fontSize = isMobile ? "8px" : "10px"
      el.style.fontWeight = "bold"
      el.style.transition = "all 0.3s ease"
      el.textContent = totalWins.toString()

      // Create detailed popup with all team wins
      const teamsList = Object.entries(teams)
        .sort(([, a], [, b]) => b - a)
        .map(
          ([team, teamWins]) => `
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0;">
          <span style="color: ${teamColors[team] || "#6b7280"}; font-size: 11px;">${team}</span>
          <strong style="font-size: 11px;">${teamWins}</strong>
        </div>
      `,
        )
        .join("")

      const popup = new (window as any).mapboxgl.Popup({
        offset: 25,
        className: "custom-popup",
        maxWidth: "250px",
        closeButton: true,
        closeOnClick: false,
      }).setHTML(`
        <div style="padding: 12px;">
          <h4 style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937; font-size: 14px;">${city}</h4>
          <p style="margin: 0 0 6px 0; color: #6b7280; font-size: 12px;">Team Wins:</p>
          ${teamsList}
          <div style="border-top: 1px solid #e5e7eb; margin-top: 6px; padding-top: 6px;">
            <span style="font-size: 12px; color: #6b7280;">Total: <strong>${totalWins}</strong></span>
          </div>
        </div>
      `)

      const marker = new (window as any).mapboxgl.Marker(el).setLngLat(coords).setPopup(popup).addTo(teamMapRef.current)

      teamMarkersRef.current.push(marker)
    })
  }, [matchesData, season, mapboxLoaded, isMobile])

  // Calculate statistics
  const filteredMatches: Match[] = season === "All" ? matchesData : matchesData.filter((m) => m.season === season)

  const cityMatchCounts: CityStats = {}
  const teamWins: CityStats = {}
  const seasonalData: CityStats = {}

  filteredMatches.forEach((match) => {
    // City stats
    if (match.city) {
      cityMatchCounts[match.city] = (cityMatchCounts[match.city] || 0) + 1
    }

    // Team wins
    if (match.winner) {
      teamWins[match.winner] = (teamWins[match.winner] || 0) + 1
    }

    // Seasonal data
    if (match.season) {
      seasonalData[match.season] = (seasonalData[match.season] || 0) + 1
    }
  })

  const topCities: ChartData[] = Object.entries(cityMatchCounts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, isMobile ? 3 : 5)

  const teamData: ChartData[] = Object.entries(teamWins)
    .map(([team, wins]) => ({ team, wins }))
    .sort((a, b) => (b.wins || 0) - (a.wins || 0))

  const seasonData: ChartData[] = Object.entries(seasonalData)
    .map(([season, matches]) => ({ season, matches }))
    .sort((a, b) => (a.season || "").localeCompare(b.season || ""))

  const colors: string[] = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

  const totalMatches: number = filteredMatches.length
  const uniqueCities: number = new Set(filteredMatches.map((m) => m.city).filter(Boolean)).size
  const uniqueTeams: number = new Set(
    [...filteredMatches.map((m) => m.team1), ...filteredMatches.map((m) => m.team2)].filter(Boolean),
  ).size

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm max-w-md w-full text-center border">
          <div className="text-red-500 text-3xl sm:text-4xl mb-3 sm:mb-4">⚠️</div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Matches by City</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Interactive analysis of IPL matches across cities</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600">Season:</span>
          <Select value={season} onValueChange={setSeason} disabled={loading}>
            <SelectTrigger className="w-full sm:w-[140px] lg:w-[160px]">
              <SelectValue placeholder="Select Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Seasons</SelectItem>
              {seasons.map((s) => (
                <SelectItem key={s} value={s}>
                  Season {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{totalMatches}</div>
            <p className="text-xs sm:text-sm text-gray-600">Total Matches</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{uniqueCities}</div>
            <p className="text-xs sm:text-sm text-gray-600">Cities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">{uniqueTeams}</div>
            <p className="text-xs sm:text-sm text-gray-600">Teams</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Map */}
        <Card className="xl:col-span-2 h-[350px] sm:h-[450px] lg:h-[500px]">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Team Wins by City</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Interactive map showing team performance across different cities
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            {loading ? (
              <Skeleton className="h-[250px] sm:h-[350px] lg:h-[400px] w-full rounded-lg" />
            ) : (
              <div ref={teamMapContainerRef} className="h-[250px] sm:h-[350px] lg:h-[400px] w-full rounded-lg border" />
            )}
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* City Matches Bar Chart */}
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base">Matches by City</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              {loading ? (
                <Skeleton className="h-[150px] sm:h-[180px] lg:h-[200px] w-full" />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={window.innerWidth < 640 ? 150 : window.innerWidth < 1024 ? 180 : 200}
                >
                  <BarChart data={topCities} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="city"
                      fontSize={window.innerWidth < 640 ? 9 : 10}
                      angle={window.innerWidth < 640 ? -45 : 0}
                      textAnchor={window.innerWidth < 640 ? "end" : "middle"}
                      height={window.innerWidth < 640 ? 50 : 30}
                    />
                    <YAxis fontSize={window.innerWidth < 640 ? 9 : 10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Season Trend */}
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base">Seasonal Trends</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              {loading ? (
                <Skeleton className="h-[150px] sm:h-[180px] lg:h-[200px] w-full" />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={window.innerWidth < 640 ? 150 : window.innerWidth < 1024 ? 180 : 200}
                >
                  <LineChart data={seasonData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="season" fontSize={window.innerWidth < 640 ? 9 : 10} />
                    <YAxis fontSize={window.innerWidth < 640 ? 9 : 10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="matches"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 4, fill: "#10b981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
