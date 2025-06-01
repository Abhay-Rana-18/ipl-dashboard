"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import { TeamWinsMap } from "./components/team-wins-map"
import { TossAnalysis } from "./components/toss-analysis"
import { TopPerformers } from "./components/top-performers"
import { OverviewStats } from "./components/overview-stats"
import { useMatches } from "./hooks/use-matches"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import MatchesByCity from "./components/matches-by-city"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const { matches, loading, error } = useMatches()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin mx-auto mb-4 text-primary" />
          <span className="text-base md:text-lg font-medium">Loading IPL data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center max-w-md p-6 border rounded-lg shadow-sm">
          <p className="text-red-600 mb-3 text-base md:text-lg font-medium">Error loading data: {error}</p>
          <p className="text-sm md:text-base text-muted-foreground">Using demo data for preview</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewStats matches={matches} />
      case "map":
        return <TeamWinsMap matches={matches} />
      case "city":
        return <MatchesByCity matches={matches} />
      case "performers":
        return <TopPerformers matches={matches} />
      case "toss":
        return <TossAnalysis matches={matches} />
      default:
        return <OverviewStats matches={matches} />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <SidebarInset>
        <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 md:gap-4 border-b px-4 md:px-6 bg-background">
          <SidebarTrigger className="-ml-1 h-8 w-8 md:h-9 md:w-9" />
          <Separator orientation="vertical" className="mr-2 h-4 md:h-6" />
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-lg lg:text-xl font-medium text-foreground">IPL Interactive Dashboard</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-background">
          <div className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-10rem)] flex-1 rounded-lg border bg-card p-4 md:p-6 shadow-sm">
            <div className="w-full h-full">{renderContent()}</div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
