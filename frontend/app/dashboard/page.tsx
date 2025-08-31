import { CardsRow } from "@/components/dashboard/kpis"
import RevenueAreaChart from "@/components/dashboard/revenue-area-chart"
import SubscribersBarChart from "@/components/dashboard/subscribers-bar-chart"
import TicketsDonut from "@/components/dashboard/tickets-donut"
import SmsCreditsWidget from "@/components/dashboard/sms-credits-widget"
import RecentActivity from "@/components/dashboard/recent-activity"
import { getKpis, getMonthlySeries, type MonthDatum } from "@/components/dashboard/data"

export default async function Page() {
  // Build one consistent series on the server and pass to children
  const series: MonthDatum[] = getMonthlySeries()
  const { activeSubscribers, mrr, mrrDelta, churnRate, openTickets } = getKpis(series)

  return (
    <div className="mx-auto w-full max-w-screen-2xl 2xl:max-w-[1800px] px-2 sm:px-4 md:px-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold">Overview</h2>
        <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
      </div>

      <CardsRow
        activeSubscribers={activeSubscribers}
        mrr={mrr}
        mrrDelta={mrrDelta}
        churnRate={churnRate}
        openTickets={openTickets}
      />

      {/* Charts row */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <RevenueAreaChart data={series} />
        <SubscribersBarChart data={series} />
      </div>

      {/* Activity + right rail */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <TicketsDonut />
          <SmsCreditsWidget />
        </div>
      </div>

      <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
        <p>{"© 2025. Your Company Name. All Rights Reserved."}</p>
        <p>{"Created by: Your Name/Company"}</p>
      </div>
    </div>
  )
}
