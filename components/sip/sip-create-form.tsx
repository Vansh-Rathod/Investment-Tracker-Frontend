"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { sipService } from "@/services/sipService"
import { stockService } from "@/services/stockService"
import { mutualFundService } from "@/services/mutualFundService"
import { toast } from "sonner"
import type { StockViewModel, MutualFundViewModel } from "@/types"

const formSchema = z.object({
    assetTypeId: z.string().min(1, { message: "Asset type is required" }),
    assetId: z.string().min(1, { message: "Asset is required" }),
    sipAmount: z.coerce.number().min(100, { message: "Amount must be at least 100" }),
    frequency: z.string().min(1, { message: "Frequency is required" }),
    startDate: z.date({ required_error: "Start date is required" }),
    sipDate: z.date({ required_error: "SIP date is required" }),
})

interface SIPCreateFormProps {
    onSuccess: () => void
}

export function SIPCreateForm({ onSuccess }: SIPCreateFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [stocks, setStocks] = useState<StockViewModel[]>([])
    const [mutualFunds, setMutualFunds] = useState<MutualFundViewModel[]>([])

    useEffect(() => {
        async function loadAssets() {
            try {
                const [stocksRes, mfRes] = await Promise.all([
                    stockService.getMarketStocks({ page: 1, pageSize: 200 }),
                    mutualFundService.getMarketMutualFunds({ page: 1, pageSize: 200 }),
                ])
                if (stocksRes.success && stocksRes.data) setStocks(stocksRes.data)
                if (mfRes.success && mfRes.data) setMutualFunds(mfRes.data)
            } catch (e) {
                console.error("Failed to load assets", e)
            }
        }
        loadAssets()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            assetTypeId: "2",
            assetId: "",
            sipAmount: 5000,
            frequency: "3",
        },
    })

    const assetTypeId = form.watch("assetTypeId")
    const assets = assetTypeId === "1"
        ? stocks.map((s) => ({ id: String(s.stockId), name: s.stockName || s.symbol }))
        : mutualFunds.map((m) => ({ id: String(m.fundId), name: m.fundName }))

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            const requestData = {
                assetTypeId: parseInt(values.assetTypeId),
                assetId: parseInt(values.assetId),
                sipAmount: values.sipAmount,
                frequency: parseInt(values.frequency),
                startDate: values.startDate.toISOString(),
                sipDate: values.sipDate.toISOString(),
            }
            const res = await sipService.createSIP(requestData)
            if (res.success) {
                toast.success("SIP created successfully")
                onSuccess()
            } else {
                toast.error(res.message || "Failed to create SIP")
            }
        } catch (error) {
            toast.error("Failed to create SIP")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="assetTypeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select
                                    onValueChange={(v) => {
                                        field.onChange(v)
                                        form.setValue("assetId", "")
                                    }}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1">Stock</SelectItem>
                                        <SelectItem value="2">Mutual Fund</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="assetId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Asset</FormLabel>
                                <Select
                                    onValueChange={(v) => { field.onChange(v) }}
                                    value={field.value}
                                    disabled={assets.length === 0}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={assets.length === 0 ? "Loading..." : "Select asset"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {assets.map((a) => (
                                            <SelectItem key={a.id} value={a.id}>
                                                {a.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="sipAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Frequency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Frequency" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1">Daily</SelectItem>
                                        <SelectItem value="2">Weekly</SelectItem>
                                        <SelectItem value="3">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sipDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>SIP Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Creating..." : "Create SIP"}
                </Button>
            </form>
        </Form>
    )
}
