"use client";

import * as React from "react";
import { addMonths, format, startOfMonth, isAfter, setMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface MonthRangePickerProps {
  onChange?: (range: { from: Date; to: Date }) => void;
  className?: string;
  defaultValue?: { from: Date; to: Date };
}

export function MonthRangePicker({
  onChange,
  className,
  defaultValue,
}: MonthRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [fromYear, setFromYear] = React.useState<number>(defaultValue?.from.getFullYear() || new Date().getFullYear());
  const [toYear, setToYear] = React.useState<number>(defaultValue?.to.getFullYear() || new Date().getFullYear());
  const [selectedRange, setSelectedRange] = React.useState<{
    from: Date;
    to: Date;
  }>(defaultValue || {
    from: startOfMonth(addMonths(new Date(), -1)), // Previous month
    to: startOfMonth(new Date()), // Current month
  });

  // Generate arrays of months for both calendars
  const fromMonths = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(fromYear, i, 1);
      return date;
    });
  }, [fromYear]);

  const toMonths = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(toYear, i, 1);
      return date;
    });
  }, [toYear]);

  const handleMonthSelect = (date: Date, type: 'from' | 'to') => {
    const newRange = { ...selectedRange };
    
    if (type === 'from') {
      if (isAfter(date, selectedRange.to)) {
        newRange.to = date;
      }
      newRange.from = date;
    } else {
      if (isAfter(selectedRange.from, date)) {
        newRange.from = date;
      }
      newRange.to = date;
    }

    setSelectedRange(newRange);
    onChange?.(newRange);
  };

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !selectedRange.from && "text-muted-foreground"
            )}
          >
            {selectedRange.from ? (
              selectedRange.to ? (
                <>
                  {format(selectedRange.from, "MMMM yyyy")} -{" "}
                  {format(selectedRange.to, "MMMM yyyy")}
                </>
              ) : (
                format(selectedRange.from, "MMMM yyyy")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[600px] p-0 bg-white dark:bg-neutral-800" 
          align="end" 
          sideOffset={8}
          style={{ zIndex: 1000 }}
        >
          <div className="flex p-3 gap-3">
            {/* From Month Calendar */}
            <div className="flex-1">
              <div className="mb-4">
                <div className="mb-2 text-sm font-medium">From</div>
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="outline"
                    className="h-7 w-7 p-0"
                    onClick={() => setFromYear(fromYear - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="font-medium">
                    {fromYear}
                  </div>
                  <Button
                    variant="outline"
                    className="h-7 w-7 p-0"
                    onClick={() => setFromYear(fromYear + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {fromMonths.map((month, i) => {
                    const isFutureMonth = isAfter(month, new Date());
                    return (
                      <Button
                        key={i}
                        variant={selectedRange.from && month.getTime() === selectedRange.from.getTime() ? "default" : "ghost"}
                        className={cn(
                          "h-9 p-0",
                          isFutureMonth && "text-muted-foreground opacity-50 hover:bg-transparent cursor-not-allowed"
                        )}
                        onClick={() => !isFutureMonth && handleMonthSelect(month, 'from')}
                        disabled={isFutureMonth}
                      >
                        <time dateTime={format(month, "yyyy-MM")}>
                          {format(month, "MMM")}
                        </time>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="h-auto" />

            {/* To Month Calendar */}
            <div className="flex-1">
              <div className="mb-4">
                <div className="mb-2 text-sm font-medium">To</div>
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="outline"
                    className="h-7 w-7 p-0"
                    onClick={() => setToYear(toYear - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="font-medium">
                    {toYear}
                  </div>
                  <Button
                    variant="outline"
                    className="h-7 w-7 p-0"
                    onClick={() => setToYear(toYear + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {toMonths.map((month, i) => {
                    const isFutureMonth = isAfter(month, new Date());
                    return (
                      <Button
                        key={i}
                        variant={selectedRange.to && month.getTime() === selectedRange.to.getTime() ? "default" : "ghost"}
                        className={cn(
                          "h-9 p-0",
                          isFutureMonth && "text-muted-foreground opacity-50 hover:bg-transparent cursor-not-allowed"
                        )}
                        onClick={() => !isFutureMonth && handleMonthSelect(month, 'to')}
                        disabled={isFutureMonth}
                      >
                        <time dateTime={format(month, "yyyy-MM")}>
                          {format(month, "MMM")}
                        </time>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 