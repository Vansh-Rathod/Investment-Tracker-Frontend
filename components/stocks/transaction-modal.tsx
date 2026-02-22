"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { transactionService } from "@/services/transactionService"
import { toast } from "sonner"

const schema = z.object({
    units: z.coerce.number().min(0.0001, "Required"),
    price: z.coerce.number().min(0, "Required"),
    transactionDate: z.date({ required_error: "Date is required" }),
})
type FormValues = z.infer<typeof schema>

interface TransactionModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    assetTypeId: number
    assetId: number
    assetName: string
    transactionType: number // 1=Buy, 2=Sell, 3=Dividend
    defaultPrice?: number
    maxUnits?: number
    onSuccess: () => void
}

const TX_LABEL: Record<number, string> = { 1: "Buy", 2: "Sell", 3: "Add Dividend" }

export function TransactionModal({
    open,
    onOpenChange,
    assetTypeId,
    assetId,
    assetName,
    transactionType,
    defaultPrice = 0,
    maxUnits,
    onSuccess,
}: TransactionModalProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            units: 0,
            price: defaultPrice,
            transactionDate: new Date(),
        },
    })

    const onSubmit = async (values: FormValues) => {
        try {
            const amount = values.units * values.price
            const res = await transactionService.insertTransaction({
                assetTypeId,
                assetId,
                transactionType,
                units: values.units,
                price: values.price,
                amount,
                transactionDate: values.transactionDate.toISOString(),
                sourceType: "Manual",
            })
            if (res.success) {
                toast.success(`${TX_LABEL[transactionType]} recorded successfully`)
                onOpenChange(false)
                form.reset()
                onSuccess()
            } else {
                toast.error(res.message || "Failed to save transaction")
            }
        } catch (error) {
            toast.error("Failed to save transaction")
        }
    }

    const label = TX_LABEL[transactionType] ?? "Transaction"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>{label} – {assetName}</DialogTitle>
                    <DialogDescription>
                        {transactionType === 3
                            ? "Record dividend received (use units as 0 or 1, amount = dividend value)."
                            : `Enter ${label.toLowerCase()} details.`}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="units"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{transactionType === 3 ? "Quantity (e.g. 1)" : "Units"}</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="any" {...field} />
                                    </FormControl>
                                    {maxUnits != null && transactionType === 2 && (
                                        <p className="text-muted-foreground text-xs">Max: {maxUnits}</p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{transactionType === 3 ? "Dividend amount" : "Price per unit"}</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="any" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="transactionDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                >
                                                    {field.value ? format(field.value, "PPP") : "Pick date"}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
