import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react"
import type { DashboardSummary } from "@/types"
import { cn } from "@/lib/utils"

interface SummaryCardsProps {
  summary: DashboardSummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const isPositive = summary.totalReturns >= 0
  const invested = Number(summary.investedAmount) || 0
  const current = Number(summary.currentValue) || 0
  const returns = Number(summary.totalReturns) || 0
  const returnsPct = Number(summary.absReturns) || 0

  const cards = [
    {
      title: "Total Invested",
      value: `₹${invested.toLocaleString("en-IN")}`,
      icon: Wallet,
      description: "Across all investments",
    },
    {
      title: "Current Value",
      value: `₹${current.toLocaleString("en-IN")}`,
      icon: BarChart3,
      description: "Portfolio worth today",
    },
    {
      title: "Total Returns",
      value: `₹${Math.abs(returns).toLocaleString("en-IN")}`,
      icon: isPositive ? TrendingUp : TrendingDown,
      description: `${isPositive ? "+" : ""}${returnsPct.toFixed(2)}%`,
      positive: isPositive,
    },
    {
      title: "Stocks vs MFs",
      value: "Allocation",
      icon: BarChart3,
      description: `Stocks ₹${(summary.stockCurrentValue ?? 0).toLocaleString("en-IN")} · MFs ₹${(summary.mfCurrentValue ?? 0).toLocaleString("en-IN")}`,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon
              className={cn(
                "h-5 w-5",
                card.positive !== undefined
                  ? card.positive
                    ? "text-green-600"
                    : "text-red-600"
                  : "text-muted-foreground",
              )}
            />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                card.positive !== undefined ? (card.positive ? "text-green-600" : "text-red-600") : "text-foreground",
              )}
            >
              {card.positive !== undefined && (isPositive ? "+" : "-")}
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
