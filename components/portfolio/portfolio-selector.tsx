"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { usePortfolio } from "@/components/providers/portfolio-provider"
import { useRouter } from "next/navigation"

export function PortfolioSelector() {
    const { portfolios, selectedPortfolio, setSelectedPortfolioId } = usePortfolio()
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[250px] justify-between"
                >
                    {selectedPortfolio?.name || "Select portfolio..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder="Search portfolio..." />
                    <CommandList>
                        <CommandEmpty>No portfolio found.</CommandEmpty>
                        <CommandGroup heading="Portfolios">
                            {portfolios.map((portfolio) => (
                                <CommandItem
                                    key={portfolio.portfolioId}
                                    value={portfolio.name}
                                    onSelect={() => {
                                        setSelectedPortfolioId(portfolio.portfolioId)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedPortfolio?.portfolioId === portfolio.portfolioId
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {portfolio.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false)
                                    router.push("/portfolios")
                                }}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Manage Portfolios
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
