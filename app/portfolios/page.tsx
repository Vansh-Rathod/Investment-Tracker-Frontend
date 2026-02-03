"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Edit } from "lucide-react"
import { usePortfolio } from "@/components/providers/portfolio-provider"
import { portfolioService } from "@/services/portfolioService"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

export default function PortfoliosPage() {
    const { portfolios, refreshPortfolios } = usePortfolio()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newPortfolioName, setNewPortfolioName] = useState("")
    const [loading, setLoading] = useState(false)

    const handleCreate = async () => {
        if (!newPortfolioName.trim()) return

        setLoading(true)
        try {
            const result = await portfolioService.createPortfolio({
                name: newPortfolioName,
                portfolioType: 1 // Default to Mixed
            })

            if (result.success) {
                toast.success("Portfolio created")
                setNewPortfolioName("")
                setIsCreateOpen(false)
                refreshPortfolios()
            } else {
                toast.error("Failed to create portfolio")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure? This will delete all transactions associated with this portfolio.")) return

        try {
            const result = await portfolioService.deletePortfolio(id)
            if (result.success) {
                toast.success("Portfolio deleted")
                refreshPortfolios()
            } else {
                toast.error(result.message || "Failed to delete portfolio")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    return (
        <MainLayout title="Manage Portfolios">
            <div className="space-y-6">
                <div className="flex justify-end">
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Create Portfolio
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create Portfolio</DialogTitle>
                                <DialogDescription>
                                    Create a new portfolio to track your investments separately.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={newPortfolioName}
                                        onChange={(e) => setNewPortfolioName(e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate} disabled={loading}>
                                    {loading ? "Creating..." : "Create"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {portfolios.map((portfolio) => (
                        <Card key={portfolio.portfolioId}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    {portfolio.name}
                                </CardTitle>
                                <CardDescription>Created on {formatDate(portfolio.createdDate)}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {/* Placeholder for total value if available in list DTO later */}
                                    {/* ₹ {portfolio.totalInvested} */}
                                </div>
                                <div className="text-xs text-muted-foreground mt-2">
                                    {portfolio.stockCount} Stocks • {portfolio.mutualFundCount} Mutual Funds
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-2" /> Rename
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(portfolio.portfolioId)}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}
