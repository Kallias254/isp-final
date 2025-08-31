import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, UserX } from "lucide-react"

export default function SubscriberNotFound() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl 2xl:max-w-[1800px] px-4 md:px-6">
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <UserX className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>Subscriber Not Found</CardTitle>
            <CardDescription>The subscriber you're looking for doesn't exist or may have been removed.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/dashboard/subscribers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Subscribers
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
