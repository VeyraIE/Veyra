"use client"

import { authErrorMessage } from "@/lib/auth-errors"
import { useAuthAvailability } from "@/lib/use-auth-availability"
import { AuthServiceStatus } from "@/components/auth/service-status"
import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  ArrowRight,
  Loader2,
  Apple,
  Chrome,
  CheckCircle2
} from "lucide-react"

export default function SignUpPage() {
  return <Suspense fallback={<div className="min-h-screen bg-background p-8 text-muted-foreground">Loading account signup…</div>}><SignUpForm /></Suspense>
}

function SignUpForm() {
  const { status, retry } = useAuthAvailability()
  const searchParams = useSearchParams()
  const providerAccount = searchParams.get("type") === "provider"
  const destination = providerAccount ? "/provider/dashboard" : "/account"
  const loginLink = "/auth/login?redirect=" + encodeURIComponent(destination)
  function callbackUrl() {
    const callback = new URL(process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? window.location.origin + "/auth/callback")
    callback.searchParams.set("next", destination)
    return callback.toString()
  }
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isLoading || !status?.available || !status.email || !status.signup) return
    setIsLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(), password,
        options: { emailRedirectTo: callbackUrl(), data: { full_name: fullName.trim(), role: "user" } }
      })
      if (signUpError) throw signUpError
      if (data.session) { router.push(destination); router.refresh() }
      else setSuccess(true)
    } catch (issue) { setError(authErrorMessage(issue)) }
    finally { setIsLoading(false) }
  }

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    if (isLoading || !status?.available || !status[provider]) return
    setIsLoading(true)
    setError(null)
    try {
      const { error: issue } = await createClient().auth.signInWithOAuth({ provider, options: { redirectTo: callbackUrl() } })
      if (issue) throw issue
    } catch (issue) { setError(authErrorMessage(issue)) }
    finally { setIsLoading(false) }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
          <p className="text-muted-foreground mb-6">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>. 
            Please click the link to verify your account.
          </p>
          <Button variant="outline" onClick={() => router.push(loginLink)}>
            Back to Login
          </Button>
        </div>
      </div>
    )
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

          <h1 className="text-3xl font-bold text-foreground mb-2">{providerAccount ? "Create your provider account" : "Create your member account"}</h1>
          <p className="text-muted-foreground mb-8">
            {providerAccount ? "Verify your email, then apply to list your business. Approval is required before publishing." : "Create your free account, then subscribe for €4.99/month to unlock paid member benefits. No payment is taken on signup."}
          </p>

          <div className="mb-6 grid grid-cols-2 gap-2" aria-label="Account type"><Link aria-current={!providerAccount ? "page" : undefined} className={"rounded-full border px-4 py-3 text-center text-sm " + (!providerAccount ? "border-primary text-primary" : "border-border text-muted-foreground")} href="/auth/sign-up?type=member">Member account</Link><Link aria-current={providerAccount ? "page" : undefined} className={"rounded-full border px-4 py-3 text-center text-sm " + (providerAccount ? "border-primary text-primary" : "border-border text-muted-foreground")} href="/auth/sign-up?type=provider">Provider account</Link></div>
          <AuthServiceStatus status={status} retry={retry} signup />
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

          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div role="alert" className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="signup-name" className="text-sm font-medium text-foreground mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <Input
                  id="signup-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 pl-12"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="text-sm font-medium text-foreground mb-2 block">
                Email
              </label>
              <div className="relative">
                <Input
                  id="signup-email"
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
              <label htmlFor="signup-password" className="text-sm font-medium text-foreground mb-2 block">
                Password
              </label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="h-12 pl-12 pr-12"
                  required
                  minLength={8}
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
              <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
            </div>

            <Button type="submit" className="w-full h-12" disabled={isLoading || !status?.available || !status.email || !status.signup}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {providerAccount ? "Create Provider Account" : "Create Member Account"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By creating an account, you agree to our{" "}
            <Link href="/privacy" className="text-primary hover:underline">account and data information</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>

          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href={loginLink} className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-center text-primary-foreground">
          <h2 className="text-4xl font-bold mb-6">Start your journey today</h2>
          <p className="text-lg opacity-90 mb-8">
            {providerAccount ? "Create your provider account, verify your email and apply to join Veyra. Guests can book without an account." : "Member benefits, participating experience discounts and partner venue offers — €4.99 per month once you subscribe."}
          </p>
          <div className="space-y-4 text-left">
            {(providerAccount ? ["Apply to join our Ireland provider community", "Add services after approval", "Set your own prices and sessions", "Connect Stripe to receive payouts"] : ["Member-only benefits", "Discounts on participating experiences", "Partner venue offers", "€4.99/month · manage cancellation in your account"]).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

