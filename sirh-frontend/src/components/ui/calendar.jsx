import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "../../lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-4 rounded-xl bg-white shadow-xl border border-gray-200",
        className
      )}
      classNames={{
        months:
          "flex flex-col sm:flex-row gap-6 justify-center items-start sm:items-center",
        month: "space-y-4 w-full sm:w-auto",
        caption: "flex justify-between items-center px-2",
        caption_label: "text-lg font-semibold text-gray-800",
        nav: "flex items-center gap-2",
        nav_button: cn(
          "h-8 w-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors",
          "disabled:opacity-50"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse",
        head_row: "",
        head_cell:
          "text-center text-xs text-gray-500 font-medium w-10 h-10",
        row: "",
        cell: cn(
          "w-10 h-10 text-center relative p-0",
          "[&:has([aria-selected])]:bg-blue-50",
          "[&:has([aria-selected].day-outside)]:bg-transparent"
        ),
        day: cn(
          "w-full h-full rounded-md flex items-center justify-center text-sm font-normal text-gray-800 hover:bg-blue-100 transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        ),
        day_today:
          "border border-blue-500 text-blue-600 font-semibold bg-blue-50",
        day_selected:
          "bg-blue-600 text-white font-medium hover:bg-blue-700",
        day_outside:
          "text-gray-400 opacity-40",
        day_disabled: "text-gray-300 opacity-50",
        day_range_end: "bg-blue-600 text-white",
        day_range_middle: "bg-blue-100 text-blue-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: (props) => (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        ),
        IconRight: (props) => (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
