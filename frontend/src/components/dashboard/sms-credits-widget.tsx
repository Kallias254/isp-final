import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Plus } from "lucide-react"

export default function SmsCreditsWidget() {
  const totalCredits = 1000
  const usedCredits = 650
  const remainingCredits = totalCredits - usedCredits
  const usagePercentage = (usedCredits / totalCredits) * 100

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base sm:text-lg">SMS Credits</CardTitle>
          </div>
        </div>
        <CardDescription>Remaining message credits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Used</span>
            <span>
              {usedCredits.toLocaleString()} / {totalCredits.toLocaleString()}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-green-600">{remainingCredits}</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{usedCredits}</p>
            <p className="text-xs text-muted-foreground">Used</p>
          </div>
        </div>

        <div className="space-y-2">
          <Button className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Buy More Credits
          </Button>
          <p className="text-xs text-center text-muted-foreground">KES 0.50 per SMS</p>
        </div>
      </CardContent>
    </Card>
  )
}
