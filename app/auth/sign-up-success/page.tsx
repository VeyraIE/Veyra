"use client";

import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">A</span>
            </div>
            <span className="text-xl font-bold text-foreground">Activio</span>
          </Link>

          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-10 w-10 text-primary" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Check Your Email
          </h1>
          <p className="text-muted-foreground mb-8">
            We&apos;ve sent a confirmation link to your email address. 
            Click the link to verify your account and get started.
          </p>

          <div className="bg-muted/50 rounded-xl p-4 mb-8 text-left">
            <h3 className="font-medium text-foreground mb-2">What&apos;s next?</h3>
            <ol className="text-sm text-muted-foreground space-y-2">
              <li>1. Check your inbox (and spam folder)</li>
              <li>2. Click the verification link</li>
              <li>3. Start discovering activities!</li>
            </ol>
          </div>

          <div className="space-y-3">
            <Button className="w-full rounded-full" asChild>
              <Link href="/auth/login">
                Continue to Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full rounded-full">
              Resend Verification Email
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Need help? <Link href="/about" className="text-primary hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-background to-accent/10 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mx-auto mb-8 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-card shadow-xl flex items-center justify-center">
              <Mail className="h-20 w-20 text-primary/50" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Almost There!
          </h2>
          <p className="text-muted-foreground">
            Your account is being created. Just one more step to start exploring amazing activities across Ireland.
          </p>
        </div>
      </div>
    </div>
  );
}
