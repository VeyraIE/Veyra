"use client"

import { authErrorMessage } from "@/lib/auth-errors"
import { useAuthAvailability } from "@/lib/use-auth-availability"
import { AuthServiceStatus } from "@/components/auth/service-status"
import { useState } from "react"
import Link from "next/link"
import { authDestination } from "@/lib/auth-destination"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Loader2,
  Apple,
  Chrome
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { status, retry } = useAuthAvailability()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isLoading || !status?.available || !status.email) return
    setIsLoading(true)
    setError(null)
    try {
      const { error: issue } = await createClient().auth.signInWithPassword({ email: email.trim(), password })
      if (issue) throw issue
      const requested = new URLSearchParams(window.location.search).get("redirect")
      router.push(authDestination(requested))
      router.refresh()
    } catch (issue) { setError(authErrorMessage(issue)) }
    finally { setIsLoading(false) }
  }

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    if (isLoading || !status?.available || !status[provider]) return
    setIsLoading(true)
    setError(null)
    try {
      const callback = new URL(process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? window.location.origin + "/auth/callback")
      callback.searchParams.set("next", authDestination(new URLSearchParams(window.location.search).get("redirect")))
      const { error: issue } = await createClient().auth.signInWithOAuth({ provider, options: { redirectTo: callback.toString() } })
      if (issue) throw issue
    } catch (issue) { setError(authErrorMessage(issue)) }
    finally { setIsLoading(false) }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">V</span>
            </div>
            <span className="text-xl font-bold text-foreground">VEYRA</span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to continue to Veyra
          </p>

          <AuthServiceStatus status={status} retry={retry} />
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button 
              variant="outline" 
              className="w-full h-12 justify-center gap-3"
              disabled={isLoading || !status?.available || !status.google}
              onClick={() => handleOAuthLogin("google")}
            >
              <Chrome className="h-5 w-5" />
              Continue with Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 justify-center gap-3"
              disabled={isLoading || !status?.available || !status.apple}
              onClick={() => handleOAuthLogin("apple")}
            >
              <Apple className="h-5 w-5" />
              Continue with Apple
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div role="alert" className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="text-sm font-medium text-foreground mb-2 block">
                Email
              </label>
              <div className="relative">
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 pl-12"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 pl-12 pr-12"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12" disabled={isLoading || !status?.available || !status.email}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up?type=member" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>

          <p className="text-center text-muted-foreground mt-4">
            <Link href="/providers" className="text-primary font-medium hover:underline">
              Create a provider account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-center text-primary-foreground">
          <h2 className="text-4xl font-bold mb-6">Extraordinary experiences start here</h2>
          <p className="text-lg opacity-90 mb-8">
            Discover experiences, join Veyra Membership for €4.99 a month, or manage your approved provider business.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {["Discover", "Create", "Connect"].map((stat, idx) => (
              <Card key={idx} className="bg-white/10 border-0">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{stat}</p>
                  <p className="text-sm opacity-75">
                    {idx === 0 ? "Experiences" : idx === 1 ? "Services" : "People"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

