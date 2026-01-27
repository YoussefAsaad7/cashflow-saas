
import { Button } from "@/components/ui/button";
import CalendarCell from "@/components/workday-calendar/CalendarCell";
import CountPill from "@/components/ui/CountPill";
import StatusBadge from "@/components/ui/StatusBadge";
import Image from "next/image";
import CalendarHeader from "@/components/workday-calendar/CalendarHeader";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <h1 className="text-primary">Hello world</h1>
      <p> lbala labla blka</p>
      <p className="text-success-500"> lbala labla blka</p>
      <p className="text-danger-500"> lbala labla blka</p>
      <br />
      <p className="text-primary-500"> lbala labla blka</p>

      <div className="flex gap-2 mb-2">
        <Button variant="default"><span>+</span> Add Expense</Button>

        <Button variant="secondary">Secondary</Button>

        <Button variant="link">Default</Button>
      </div>

      <div className="flex gap-2 mb-4">
        <CountPill status="WORKED" count={5} />
        <CountPill status="HOLIDAY" count={5} />
        <CountPill status="UNPAID" count={5} />
        <CountPill status="SICK" count={5} />
        <CountPill status="VACATION" count={5} />
      </div>

      <div className="flex gap-2">
        <StatusBadge status="WORKED" />
        <StatusBadge status="HOLIDAY" />
        <StatusBadge status="UNPAID" />
        <StatusBadge status="SICK" />
        <StatusBadge status="VACATION" />
      </div>



      <div>

      </div>
    </div>
  );
}
