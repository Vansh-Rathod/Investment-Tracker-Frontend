"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { AllocationChart } from "@/components/dashboard/allocation-chart"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { dashboardService } from "@/services/dashboardService"
import { exportService } from "@/services/exportService"
import { DashboardSummary, AllocationData, PerformanceData } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"

export default function DashboardPage() {
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
          dashboardService.getSummary(),
          dashboardService.getAssetAllocation(),
          dashboardService.getPerformance(6),
          dashboardService.getSectorAllocation(),
        ])

        if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data as DashboardSummary)
        if (allocationRes.success && allocationRes.data) setAllocation(allocationRes.data)
        if (performanceRes.success && performanceRes.data) setPerformance(performanceRes.data)
        if (sectorRes.success && sectorRes.data) setSectorAllocation(sectorRes.data)
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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

  const handleExportAll = async () => {
    try {
      await exportService.downloadExport("all")
      toast.success("Export started")
    } catch (e) {
      toast.error("Export failed")
    }
  }

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleExportAll}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
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
