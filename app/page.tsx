"use client";

import {
  SignInButton,
  SignUpButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="text-center space-y-8 max-w-3xl px-4">
        <h1 className="text-5xl font-bold tracking-tight">Welcome to Nexora</h1>
        <p className="text-xl text-muted-foreground">
          Your AI-powered academic assistant that helps you understand and learn
          from your documents.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <SignedOut>
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </SignUpButton>

            <SignInButton mode="modal">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div>
              <Link href="/chat">
                <Button size="lg" className="text-lg px-8">
                  Go to Workspace
                </Button>
              </Link>
              <SignOutButton>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </SignedIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 rounded-xl bg-card">
            <h3 className="text-xl font-semibold mb-2">Upload Documents</h3>
            <p className="text-muted-foreground">
              Easily upload your study materials and get instant access to
              AI-powered analysis.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card">
            <h3 className="text-xl font-semibold mb-2">Smart Assistance</h3>
            <p className="text-muted-foreground">
              Get intelligent answers and explanations based on your uploaded
              content.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card">
            <h3 className="text-xl font-semibold mb-2">Learn Better</h3>
            <p className="text-muted-foreground">
              Understand complex topics with detailed explanations and examples.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
