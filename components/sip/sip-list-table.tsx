"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Play, Pause, XCircle, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SIP } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"

const FREQUENCY_LABEL: Record<number, string> = { 1: "Daily", 2: "Weekly", 3: "Monthly" }
const STATUS_LABEL: Record<number, string> = { 1: "Active", 2: "Paused", 3: "Cancelled", 4: "Deleted" }

interface SIPListTableProps {
    sips: SIP[]
    onPause: (id: number) => void
    onResume: (id: number) => void
    onCancel: (id: number) => void
    onDelete: (id: number) => void
}

export function SIPListTable({ sips, onPause, onResume, onCancel, onDelete }: SIPListTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Start / SIP Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sips.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No SIPs found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        sips.map((sip) => (
                            <TableRow key={sip.sipId}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{sip.assetName}</span>
                                        <span className="text-xs text-muted-foreground">{sip.assetTypeName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{formatCurrency(sip.sipAmount)}</TableCell>
                                <TableCell>{FREQUENCY_LABEL[sip.frequency] ?? sip.frequency}</TableCell>
                                <TableCell>
                                    <span className="text-muted-foreground text-xs">Start </span>
                                    {formatDate(sip.startDate)}
                                    <span className="text-muted-foreground text-xs ml-1"> · SIP day </span>
                                    {sip.sipDate ? formatDate(sip.sipDate) : "-"}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            sip.sipStatus === 1 ? "default" :
                                                sip.sipStatus === 2 ? "secondary" : "destructive"
                                        }
                                    >
                                        {STATUS_LABEL[sip.sipStatus] ?? sip.sipStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Actions</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(sip.sipId.toString())}>
                                                Copy ID
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            {sip.sipStatus === 1 && (
                                                <DropdownMenuItem onClick={() => onPause(sip.sipId)}>
                                                    <Pause className="mr-2 h-4 w-4" /> Pause SIP
                                                </DropdownMenuItem>
                                            )}
                                            {sip.sipStatus === 2 && (
                                                <DropdownMenuItem onClick={() => onResume(sip.sipId)}>
                                                    <Play className="mr-2 h-4 w-4" /> Resume SIP
                                                </DropdownMenuItem>
                                            )}
                                            {(sip.sipStatus === 1 || sip.sipStatus === 2) && (
                                                <DropdownMenuItem onClick={() => onCancel(sip.sipId)} className="text-destructive">
                                                    <XCircle className="mr-2 h-4 w-4" /> Cancel SIP
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem onClick={() => onDelete(sip.sipId)} className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
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
    )
}
