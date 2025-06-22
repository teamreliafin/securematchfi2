"use client"

import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

interface LandingPageProps {
  onNext: (email: string) => void
}

export function LandingPage({ onNext }: LandingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Logo in top corner */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex items-center gap-3">
        <img src="/images/logo.png" alt="Company Logo" className="w-12 h-12 md:w-16 md:h-16" />
        <div className="text-xl md:text-2xl font-bold">
          <span className="text-[#0C648A] font-extrabold">Securematch</span>
        </div>
      </div>
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 mt-16 md:mt-20">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            Calculate Your Student Loan Retirement Match
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Turn your student loan payments into retirement savings. The SECURE 2.0 Act allows employers to match your
            student loan payments as if they were 401(k) contributions.
          </p>

          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4" />
            SECURE 2.0 Act Compliant
          </div>
        </div>

        {/* Calculate My Match Button (No Card Wrapper) */}
        <div className="flex justify-center mb-12">
          <Button
            onClick={() => onNext("")}
            className="h-32 text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-24 py-10 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            Calculate My Match
          </Button>
        </div>

        {/* How It Works */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How Student Loan Matching Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Make Loan Payments</h3>
              <p className="text-gray-600">Continue paying your student loans as usual</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Employer Matches</h3>
              <p className="text-gray-600">Your employer contributes to your 401(k) based on loan payments</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Retirement Grows</h3>
              <p className="text-gray-600">Your retirement savings compound over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
