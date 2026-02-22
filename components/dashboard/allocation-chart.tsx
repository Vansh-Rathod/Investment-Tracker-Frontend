"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { AllocationData } from "@/types"

interface AllocationChartProps {
  data: AllocationData[]
  title: string
}

const COLORS = ["#f97316", "#0ea5e9", "#22c55e", "#a855f7", "#eab308"]

export function AllocationChart({ data, title }: AllocationChartProps) {
  const chartData = (data || []).map((d) => ({
    name: d.name,
    value: Number(d.value) || 0,
    percentage: Number(d.percentage) || 0,
  })).filter((d) => d.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No allocation data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`₹${Number(value).toLocaleString("en-IN")}`, "Value"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
