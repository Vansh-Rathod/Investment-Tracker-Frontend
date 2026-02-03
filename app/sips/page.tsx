"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SIPListTable } from "@/components/sip/sip-list-table"
import { SIPCreateForm } from "@/components/sip/sip-create-form"
import { sipService } from "@/services/sipService"
import { usePortfolio } from "@/components/providers/portfolio-provider"
import { SIP } from "@/types"
import { toast } from "sonner"

export default function SIPPage() {
    const { selectedPortfolioId } = usePortfolio()
    const [sips, setSips] = useState<SIP[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const fetchSIPs = async () => {
        setIsLoading(true)
        try {
            const response = await sipService.getSIPs({ portfolioId: selectedPortfolioId })
            if (response.success) {
                setSips(response.data)
            }
        } catch (error) {
            toast.error("Failed to fetch SIPs")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSIPs()
    }, [selectedPortfolioId])

    const handlePause = async (id: number) => {
        try {
            await sipService.pauseSIP(id)
            toast.success("SIP paused successfully")
            fetchSIPs()
        } catch (error) {
            toast.error("Failed to pause SIP")
        }
    }

    const handleResume = async (id: number) => {
        try {
            await sipService.resumeSIP(id)
            toast.success("SIP resumed successfully")
            fetchSIPs()
        } catch (error) {
            toast.error("Failed to resume SIP")
        }
    }

    const handleCancel = async (id: number) => {
        try {
            await sipService.cancelSIP(id)
            toast.success("SIP cancelled successfully")
            fetchSIPs()
        } catch (error) {
            toast.error("Failed to cancel SIP")
        }
    }

    const handleDelete = async (id: number) => {
        // TODO: Implement delete
    }

    return (
        <MainLayout title="SIP Management">
            <div className="space-y-6">
                <div className="flex justify-end">
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Start New SIP
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Start New SIP</DialogTitle>
                                <DialogDescription>
                                    Set up a Systematic Investment Plan for Stocks or Mutual Funds.
                                </DialogDescription>
                            </DialogHeader>
                            <SIPCreateForm onSuccess={() => {
                                setIsCreateOpen(false)
                                fetchSIPs()
                            }} />
                        </DialogContent>
                    </Dialog>
                </div>

                <SIPListTable
                    sips={sips}
                    onPause={handlePause}
                    onResume={handleResume}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                />
            </div>
        </MainLayout>
    )
}
