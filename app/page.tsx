"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { AllocationChart } from "@/components/dashboard/allocation-chart"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { dashboardService } from "@/services/dashboardService"
import { usePortfolio } from "@/components/providers/portfolio-provider"
import { DashboardSummary, AllocationData, PerformanceData } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { selectedPortfolioId } = usePortfolio()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [allocation, setAllocation] = useState<AllocationData[]>([])
  const [performance, setPerformance] = useState<PerformanceData[]>([])
  const [sectorAllocation, setSectorAllocation] = useState<AllocationData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [summaryRes, allocationRes, performanceRes, sectorRes] = await Promise.all([
          dashboardService.getSummary(selectedPortfolioId || undefined),
          dashboardService.getAssetAllocation(selectedPortfolioId || undefined),
          dashboardService.getPerformance(selectedPortfolioId || undefined),
          dashboardService.getSectorAllocation(selectedPortfolioId || undefined),
        ])

        if (summaryRes.success) setSummary(summaryRes.data)
        if (allocationRes.success) setAllocation(allocationRes.data)
        if (performanceRes.success) setPerformance(performanceRes.data)
        if (sectorRes.success) setSectorAllocation(sectorRes.data)
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedPortfolioId])

  if (isLoading) {
    return (
      <MainLayout title="Dashboard">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px]" />
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        {summary && <SummaryCards summary={summary} />}

        <div className="grid gap-6 lg:grid-cols-2">
          <PerformanceChart data={performance} />
          <AllocationChart data={allocation} title="Asset Allocation" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {sectorAllocation.length > 0 && (
            <AllocationChart data={sectorAllocation} title="Sector Allocation (Stocks)" />
          )}
        </div>
      </div>
    </MainLayout>
  )
}
