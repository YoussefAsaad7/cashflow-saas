"use client";
import { WorkdayStatus } from "@/domain/workday";

type MockWorkday = {
  date: string;
  status: WorkdayStatus;
  hoursWorked?: number;
};

function generateMockWorkdays(month: Date): Record<string, MockWorkday> {
  const result: Record<string, MockWorkday> = {};
  const year = month.getFullYear();
  const m = month.getMonth();
  const daysInMonth = new Date(year, m + 1, 0).getDate();

  const statuses: WorkdayStatus[] = [
    "WORKED",
    "HOLIDAY",
    "SICK",
    "VACATION",
    "UNPAID",
  ];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // randomize
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    result[date] = {
      date,
      status,
      hoursWorked: status === "WORKED" ? Math.floor(Math.random() * 8) + 1 : undefined,
    };
  }

  return result;
}


import { useState } from "react";
import WorkdayCalendar from "@/components/workday-calendar/WorkdayCalendar";

export default function CalendarDevPage() {
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const workdays = generateMockWorkdays(month);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <WorkdayCalendar
          currentMonth={month}
          onMonthChange={setMonth}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          workdays={workdays}
        />
      </div>
    </div>
  );
}
