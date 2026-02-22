"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, TrendingDown, TrendingUp, Wallet, Download } from "lucide-react"
import { stockService } from "@/services/stockService"
import { dashboardService } from "@/services/dashboardService"
import { exportService } from "@/services/exportService"
import { AllocationChart } from "@/components/dashboard/allocation-chart"
import { StockHolding } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { TransactionModal } from "@/components/stocks/transaction-modal"
import type { AllocationData } from "@/types"

export default function StocksPage() {
    const [holdings, setHoldings] = useState<StockHolding[]>([])
    const [sectorAllocation, setSectorAllocation] = useState<AllocationData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [modalState, setModalState] = useState<{
        open: boolean
        assetId: number
        assetName: string
        transactionType: number
        defaultPrice?: number
        maxUnits?: number
    } | null>(null)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [holdingsRes, sectorRes] = await Promise.all([
                stockService.getHoldings(),
                dashboardService.getSectorAllocation(),
            ])
            if (holdingsRes.success && holdingsRes.data) setHoldings(holdingsRes.data)
            if (sectorRes.success && sectorRes.data) setSectorAllocation(sectorRes.data)
        } catch (error) {
            toast.error("Failed to fetch stock data")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const totalInvested = holdings.reduce((s, h) => s + Number(h.investedAmount), 0)
    const totalCurrent = holdings.reduce((s, h) => s + Number(h.currentValue), 0)
    const totalReturn = totalCurrent - totalInvested
    const returnPct = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0

    const openModal = (
        assetId: number,
        assetName: string,
        transactionType: number,
        defaultPrice?: number,
        maxUnits?: number
    ) => {
        setModalState({
            open: true,
            assetId,
            assetName,
            transactionType,
            defaultPrice,
            maxUnits,
        })
    }

    const closeModal = () => setModalState(null)

    const handleExport = async () => {
        try {
            await exportService.downloadExport("stocks")
            toast.success("Export started")
        } catch (e) {
            toast.error("Export failed")
        }
    }

    if (isLoading) {
        return (
            <MainLayout title="Stocks">
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-28" />
                        ))}
                    </div>
                    <Skeleton className="h-64" />
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout title="Stocks">
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Current Value</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalCurrent)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Returns</CardTitle>
                            {totalReturn >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div
                                className={cn(
                                    "text-2xl font-bold",
                                    totalReturn >= 0 ? "text-green-600" : "text-red-600"
                                )}
                            >
                                {totalReturn >= 0 ? "+" : ""}
                                {formatCurrency(totalReturn)}
                                <span className="ml-1 text-sm font-normal">({returnPct.toFixed(2)}%)</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Holdings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{holdings.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {sectorAllocation.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Sector / Category Allocation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[260px]">
                                <AllocationChart data={sectorAllocation} title="Sector Allocation" />
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Your Stock Holdings</h2>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Avg Price</TableHead>
                                <TableHead className="text-right">Current</TableHead>
                                <TableHead className="text-right">Invested</TableHead>
                                <TableHead className="text-right">Value</TableHead>
                                <TableHead className="text-right">Returns</TableHead>
                                <TableHead className="w-[50px]" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {holdings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                        No stock holdings. Record buy transactions to see holdings here.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                holdings.map((h) => (
                                    <TableRow key={h.stockId}>
                                        <TableCell>
                                            <div>
                                                <span className="font-medium">{h.stockName}</span>
                                                <Badge variant="outline" className="ml-2 text-xs">
                                                    {h.symbol}
                                                </Badge>
                                            </div>
                                            <span className="text-muted-foreground text-xs">{h.exchangeName}</span>
                                        </TableCell>
                                        <TableCell className="text-right">{h.quantity}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(h.averagePrice)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(h.currentPrice)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(h.investedAmount)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(h.currentValue)}</TableCell>
                                        <TableCell className="text-right">
                                            <span
                                                className={cn(
                                                    "font-medium",
                                                    Number(h.totalReturn) >= 0 ? "text-green-600" : "text-red-600"
                                                )}
                                            >
                                                {Number(h.totalReturn) >= 0 ? "+" : ""}
                                                {formatCurrency(h.totalReturn)}
                                                <span className="text-xs"> ({Number(h.totalReturnPercentage).toFixed(2)}%)</span>
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            openModal(
                                                                h.stockId,
                                                                h.stockName,
                                                                1,
                                                                Number(h.currentPrice)
                                                            )
                                                        }
                                                    >
                                                        Buy
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            openModal(
                                                                h.stockId,
                                                                h.stockName,
                                                                2,
                                                                Number(h.currentPrice),
                                                                Number(h.quantity)
                                                            )
                                                        }
                                                    >
                                                        Sell
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            openModal(h.stockId, h.stockName, 3, 0)
                                                        }
                                                    >
                                                        Add Dividend
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {modalState && (
                <TransactionModal
                    open={modalState.open}
                    onOpenChange={(open) => !open && closeModal()}
                    assetTypeId={1}
                    assetId={modalState.assetId}
                    assetName={modalState.assetName}
                    transactionType={modalState.transactionType}
                    defaultPrice={modalState.defaultPrice}
                    maxUnits={modalState.maxUnits}
                    onSuccess={fetchData}
                />
            )}
        </MainLayout>
    )
}
