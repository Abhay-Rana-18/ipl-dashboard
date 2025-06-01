"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Match } from "@/lib/supabase"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface TossAnalysisProps {
  matches: Match[]
}

export function TossAnalysis({ matches }: TossAnalysisProps) {
  // Calculate toss decisions
  const tossDecisions = matches.reduce(
    (acc, match) => {
      if (match.toss_decision) {
        acc[match.toss_decision] = (acc[match.toss_decision] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  // Calculate toss win vs match win correlation
  const tossWinMatchWin = matches.filter(
    (match) => match.toss_winner && match.winner && match.toss_winner === match.winner,
  ).length

  const totalMatches = matches.filter((match) => match.toss_winner && match.winner).length
  const tossWinPercentage = totalMatches > 0 ? ((tossWinMatchWin / totalMatches) * 100).toFixed(1) : 0

  const pieData = Object.entries(tossDecisions).map(([decision, count]) => ({
    name: decision === "bat" ? "Bat First" : "Field First",
    value: count,
    fill: decision === "bat" ? "hsl(var(--primary))" : "hsl(var(--secondary))",
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Toss Decisions</CardTitle>
          <CardDescription>Distribution of toss decisions in IPL matches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                  labelStyle={{ fontWeight: "bold", color: "hsl(var(--foreground))" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Toss Impact</CardTitle>
          <CardDescription>How often does winning the toss lead to winning the match?</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[300px]">
          <div className="text-6xl font-bold text-primary mb-4">{tossWinPercentage}%</div>
          <p className="text-lg text-muted-foreground text-center">of toss winners also win the match</p>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Toss winners who won: {tossWinMatchWin}</p>
            <p>Total matches: {totalMatches}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
