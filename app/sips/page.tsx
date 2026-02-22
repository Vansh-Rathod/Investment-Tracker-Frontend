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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SIPListTable } from "@/components/sip/sip-list-table"
import { SIPCreateForm } from "@/components/sip/sip-create-form"
import { sipService } from "@/services/sipService"
import { SIP, SipExecution } from "@/types"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function SIPPage() {
    const [sips, setSips] = useState<SIP[]>([])
    const [executions, setExecutions] = useState<SipExecution[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [actionSipId, setActionSipId] = useState<number | null>(null)
    const [actionType, setActionType] = useState<"pause" | "cancel" | null>(null)

    const fetchSIPs = async () => {
        setIsLoading(true)
        try {
            const response = await sipService.getSIPs()
            if (response.success && response.data) {
                setSips(response.data)
            }
        } catch (error) {
            toast.error("Failed to fetch SIPs")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchExecutions = async () => {
        try {
            const res = await sipService.getSipExecutions()
            if (res.success && res.data) setExecutions(res.data)
        } catch (e) {
            console.error("Failed to fetch SIP executions", e)
        }
    }

    useEffect(() => {
        fetchSIPs()
    }, [])

    useEffect(() => {
        fetchExecutions()
    }, [sips.length])

    const handlePause = (id: number) => {
        setActionSipId(id)
        setActionType("pause")
    }

    const handleResume = async (id: number) => {
        try {
            const res = await sipService.resumeSIP(id)
            if (res.success) {
                toast.success("SIP resumed successfully")
                fetchSIPs()
            } else {
                toast.error(res.message || "Failed to resume SIP")
            }
        } catch (error) {
            toast.error("Failed to resume SIP")
        }
    }

    const handleCancel = (id: number) => {
        setActionSipId(id)
        setActionType("cancel")
    }

    const confirmAction = async () => {
        if (actionSipId == null || actionType == null) return
        try {
            const fn = actionType === "pause" ? sipService.pauseSIP : sipService.cancelSIP
            const res = await fn(actionSipId)
            if (res.success) {
                toast.success(actionType === "pause" ? "SIP paused successfully" : "SIP cancelled successfully")
                fetchSIPs()
            } else {
                toast.error(res.message || `Failed to ${actionType} SIP`)
            }
        } catch (error) {
            toast.error(`Failed to ${actionType} SIP`)
        } finally {
            setActionSipId(null)
            setActionType(null)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const res = await sipService.deleteSIP(id)
            if (res.success) {
                toast.success("SIP deleted successfully")
                fetchSIPs()
            } else {
                toast.error(res.message || "Failed to delete SIP")
            }
        } catch (error) {
            toast.error("Failed to delete SIP")
        }
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

                <Card>
                    <CardHeader>
                        <CardTitle>SIP Executions</CardTitle>
                        <p className="text-muted-foreground text-sm">Recent SIP installment executions</p>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Asset</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Units</TableHead>
                                    <TableHead>NAV</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {executions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-16 text-center text-muted-foreground text-sm">
                                            No executions yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    executions.slice(0, 20).map((e) => (
                                        <TableRow key={e.sipExecutionId}>
                                            <TableCell>{formatDate(e.executedDate)}</TableCell>
                                            <TableCell>
                                                <span className="font-medium">{e.assetName}</span>
                                                <span className="text-muted-foreground text-xs ml-1">{e.assetTypeName}</span>
                                            </TableCell>
                                            <TableCell>{formatCurrency(e.sipAmount)}</TableCell>
                                            <TableCell>{e.unitsAllocated}</TableCell>
                                            <TableCell>{formatCurrency(e.navAtExecution)}</TableCell>
                                            <TableCell>
                                                <Badge variant={e.executionStatus === 1 ? "default" : e.executionStatus === 2 ? "secondary" : "destructive"}>
                                                    {e.executionStatusName}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <AlertDialog open={actionSipId != null && actionType != null} onOpenChange={(open) => { if (!open) { setActionSipId(null); setActionType(null) } }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{actionType === "pause" ? "Pause SIP?" : "Cancel SIP?"}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {actionType === "pause"
                                    ? "This SIP will be paused. You can resume it later."
                                    : "This will cancel the SIP. This action cannot be undone."}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>No</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmAction}>Yes</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </MainLayout>
    )
}
