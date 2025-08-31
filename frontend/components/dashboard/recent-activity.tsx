import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    type: "payment",
    user: "John Doe",
    action: "Payment received",
    amount: "KES 2,500",
    time: "2 minutes ago",
    status: "success",
  },
  {
    id: 2,
    type: "ticket",
    user: "Jane Smith",
    action: "New support ticket",
    description: "Internet connectivity issue",
    time: "15 minutes ago",
    status: "pending",
  },
  {
    id: 3,
    type: "subscriber",
    user: "Mike Johnson",
    action: "New subscriber registered",
    plan: "Premium Plan",
    time: "1 hour ago",
    status: "success",
  },
  {
    id: 4,
    type: "payment",
    user: "Sarah Wilson",
    action: "Payment failed",
    amount: "KES 1,800",
    time: "2 hours ago",
    status: "error",
  },
  {
    id: 5,
    type: "ticket",
    user: "David Brown",
    action: "Ticket resolved",
    description: "Router configuration",
    time: "3 hours ago",
    status: "success",
  },
]

export default function RecentActivity() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
        <CardDescription>Latest updates from your ISP operations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`/placeholder-icon.png?height=32&width=32&text=${activity.user
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}`}
              />
              <AvatarFallback>
                {activity.user
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{activity.user}</p>
                <Badge
                  variant={
                    activity.status === "success"
                      ? "default"
                      : activity.status === "error"
                        ? "destructive"
                        : "secondary"
                  }
                  className="text-xs"
                >
                  {activity.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{activity.action}</p>
              {activity.amount && <p className="text-sm font-semibold">{activity.amount}</p>}
              {activity.plan && <p className="text-sm text-blue-600">{activity.plan}</p>}
              {activity.description && <p className="text-sm text-muted-foreground">{activity.description}</p>}
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
