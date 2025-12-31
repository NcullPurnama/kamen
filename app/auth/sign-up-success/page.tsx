import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <CardTitle>Email Confirmation Sent</CardTitle>
          <CardDescription>Cek email Anda untuk confirm akun</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">Setelah confirm email, Anda bisa login dan upload film.</p>
          <Link href="/auth/login">
            <Button className="w-full">Kembali ke Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
