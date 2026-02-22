"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { transactionService } from "@/services/transactionService"
import { Transaction } from "@/types"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const TX_TYPE: Record<number, string> = { 1: "Buy", 2: "Sell", 3: "Dividend", 4: "Split", 5: "Bonus" }

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterType, setFilterType] = useState<"all" | "stocks" | "mutual_funds">("all")

    const fetchTransactions = async () => {
        setIsLoading(true)
        try {
            const assetTypeId = filterType === "stocks" ? 1 : filterType === "mutual_funds" ? 2 : 0
            const response = await transactionService.getTransactions(
                assetTypeId ? { assetTypeId } : undefined
            )
            if (response.success && response.data) {
                setTransactions(response.data)
            }
        } catch (error) {
            console.error("Failed to fetch transactions", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [filterType])

    return (
        <MainLayout title="Transactions">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Transaction History</h2>
                    <Tabs value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="stocks">Stocks</TabsTrigger>
                            <TabsTrigger value="mutual_funds">Mutual Funds</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Asset</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Units</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Source</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            No transactions found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((t) => (
                                        <TableRow key={t.transactionId}>
                                            <TableCell>{formatDate(t.transactionDate)}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{t.assetName}</span>
                                                    <span className="text-xs text-muted-foreground">{t.assetTypeName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={t.transactionType === 1 ? "default" : "secondary"}>
                                                    {TX_TYPE[t.transactionType] ?? t.transactionType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{t.units}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(t.price)}</TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(t.amount)}</TableCell>
                                            <TableCell>
                                                {t.sourceType === "SIP" ? (
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">SIP</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">Manual</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </MainLayout>
    )
}
