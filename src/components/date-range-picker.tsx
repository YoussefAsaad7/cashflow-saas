"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

interface DateRangePickerProps {
    dateRange: DateRange | undefined
    onDateRangeChange: (range: DateRange | undefined) => void
}

const presets = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 3 months", days: 90 },
    { label: "Last 6 months", days: 180 },
    { label: "Last 12 months", days: 365 },
    { label: "Year to date", days: -1 },
]

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    const handlePresetSelect = (days: number) => {
        const to = new Date()
        let from: Date

        if (days === -1) {
            // Year to date
            from = new Date(to.getFullYear(), 0, 1)
        } else {
            from = new Date()
            from.setDate(from.getDate() - days)
        }

        onDateRangeChange({ from, to })
        setIsOpen(false)
    }

    return (
        <div className="flex items-center gap-2">
            <Select onValueChange={(value) => handlePresetSelect(Number.parseInt(value))}>
                <SelectTrigger className="w-[160px] bg-secondary border-border">
                    <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                    {presets.map((preset) => (
                        <SelectItem key={preset.days} value={preset.days.toString()}>
                            {preset.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "justify-start text-left font-normal bg-secondary border-border",
                            !dateRange && "text-muted-foreground",
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                                </>
                            ) : (
                                format(dateRange.from, "MMM d, yyyy")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        autoFocus
                        mode="range" 
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={onDateRangeChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
