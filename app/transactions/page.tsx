"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { transactionService } from "@/services/transactionService"
import { usePortfolio } from "@/components/providers/portfolio-provider"
import { Transaction } from "@/types"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function TransactionsPage() {
    const { selectedPortfolioId } = usePortfolio()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterType, setFilterType] = useState<string>("all")

    const fetchTransactions = async () => {
        setIsLoading(true)
        try {
            let response;
            if (filterType === "stocks") {
                response = await transactionService.getStockTransactions(selectedPortfolioId || undefined);
            } else if (filterType === "mutual_funds") {
                response = await transactionService.getMutualFundTransactions(selectedPortfolioId || undefined);
            } else if (filterType === "sips") {
                response = await transactionService.getSIPTransactions(selectedPortfolioId || undefined);
            } else {
                response = await transactionService.getTransactions({ portfolioId: selectedPortfolioId || undefined });
            }

            if (response.success) {
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
    }, [selectedPortfolioId, filterType])

    return (
        <MainLayout title="Transactions">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Transaction History</h2>
                    <div className="flex gap-2">
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Transactions</SelectItem>
                                <SelectItem value="stocks">Stocks</SelectItem>
                                <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                                <SelectItem value="sips">SIPs</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

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
                                    <TableCell colSpan={7} className="h-24 text-center">
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
                                                {t.transactionTypeName}
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
            </div>
        </MainLayout>
    )
}
