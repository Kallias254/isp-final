export interface MonthDatum {
  month: string
  mrr: number
  adds: number
  churn: number
  netAdds: number
}

export function getMonthlySeries(): MonthDatum[] {
  return [
    { month: "Jan", mrr: 125000, adds: 45, churn: 12, netAdds: 33 },
    { month: "Feb", mrr: 132000, adds: 52, churn: 15, netAdds: 37 },
    { month: "Mar", mrr: 128000, adds: 38, churn: 18, netAdds: 20 },
    { month: "Apr", mrr: 135000, adds: 48, churn: 14, netAdds: 34 },
    { month: "May", mrr: 142000, adds: 55, churn: 16, netAdds: 39 },
    { month: "Jun", mrr: 138000, adds: 42, churn: 19, netAdds: 23 },
    { month: "Jul", mrr: 145000, adds: 58, churn: 13, netAdds: 45 },
    { month: "Aug", mrr: 152000, adds: 62, churn: 17, netAdds: 45 },
    { month: "Sep", mrr: 148000, adds: 49, churn: 21, netAdds: 28 },
    { month: "Oct", mrr: 155000, adds: 65, churn: 15, netAdds: 50 },
    { month: "Nov", mrr: 162000, adds: 68, churn: 18, netAdds: 50 },
    { month: "Dec", mrr: 158000, adds: 54, churn: 22, netAdds: 32 },
  ]
}

export function getKpis(series: MonthDatum[]) {
  const latest = series[series.length - 1]
  const previous = series[series.length - 2]

  return {
    activeSubscribers: 2847,
    mrr: latest.mrr,
    mrrDelta: (latest.mrr - previous.mrr) / previous.mrr,
    churnRate: 0.035,
    openTickets: 23,
  }
}

export function getTicketsBreakdown() {
  return [
    { name: "Open", value: 12 },
    { name: "Pending", value: 8 },
    { name: "Closed", value: 156 },
  ]
}
