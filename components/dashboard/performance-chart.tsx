"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { PerformanceData } from "@/types"
import { format } from "date-fns"

interface PerformanceChartProps {
  data: PerformanceData[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = (data || []).map((d) => ({
    date: d.date ? format(new Date(d.date), "MMM d") : "",
    invested: Number(d.investedAmount) || 0,
    value: Number(d.currentValue) || 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Investment Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No performance data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "var(--color-muted-foreground)" }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value: number) => [`₹${Number(value).toLocaleString("en-IN")}`, "Current Value"]}
                  labelFormatter={(label) => label}
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Current Value"
                  stroke="#0ea5e9"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
