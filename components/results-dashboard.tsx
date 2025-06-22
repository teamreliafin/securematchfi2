"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Calendar, AlertCircle, DollarSign, Target, Info } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { FormData, CalculationResults } from "@/app/page" // Assuming these types are defined in app/page.tsx

interface ResultsDashboardProps {
  results: CalculationResults
  formData: FormData
  onStartOver: () => void
}

export function ResultsDashboard({ results, formData, onStartOver }: ResultsDashboardProps) {
  // Generate chart data for 30-year projection
  const chartData = Array.from({ length: 31 }, (_, year) => {
    const monthlyReturn = 0.07 / 12
    const months = year * 12
    const value =
      months === 0 ? 0 : results.monthlyMatchEligible * (((1 + monthlyReturn) ** months - 1) / monthlyReturn)

    return {
      year,
      value: Math.round(value),
    }
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const currentIRSLimit = formData.age >= 50 ? 31000 : 23500

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* Logo in top corner */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex items-center gap-3">
        <img src="/images/logo.png" alt="Company Logo" className="w-12 h-12 md:w-16 md:h-16" />
        <div className="text-xl md:text-2xl font-bold">
          <span className="text-[#0C648A] font-extrabold">Securematch</span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Your QSLP Results
          </h1>
          <p className="text-xl text-gray-600">
            Here's how your student loan payments can boost your retirement savings
          </p>
        </div>

        {/* SECURE 2.0 Compliance Notice */}
        <Card className="bg-blue-50 border-blue-200 shadow-xl mb-8">
          <CardContent className="p-6 mt-6">
            {" "}
            {/* Adjusted mt-10 to mt-6 as CardHeader is removed */}
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2">SECURE 2.0 Act Compliant Calculation</h3>
                <p className="text-blue-800 mb-2">
                  This calculation follows the official SECURE 2.0 Act guidelines for Qualified Student Loan Payment
                  (QSLP) matching, using the tiered formula: 100% match up to 3% of salary, then 50% match from 3% to 5%
                  of salary.
                </p>
                <p className="text-blue-700 text-sm">
                  ✓ 2025 IRS contribution limits applied ({formData.age >= 50 ? "$31,000" : "$23,500"} annual limit)
                  <br />✓ Employer match rules properly tiered
                  <br />✓ Student loan payment verification requirements included
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Match Eligible */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5" />
                Monthly Match Eligible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">{formatCurrency(results.monthlyMatchEligible)}</div>
              <p className="text-blue-100">Based on your {formatCurrency(formData.monthlyLoanPayment)} loan payment</p>
            </CardContent>
          </Card>

          {/* 30-Year Projection */}
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5" />
                30-Year Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">{formatCurrency(results.thirtyYearProjection)}</div>
              <p className="text-green-100">Assuming 7% annual return</p>
            </CardContent>
          </Card>

          {/* Company Participants */}
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5" />
                Company Participation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">{results.companyParticipants}</div>
              <p className="text-purple-100">Colleagues have calculated their match (simulated)</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Calculation Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Tier Breakdown Chart */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                QSLP Match Tier Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-blue-900">Tier 1: Dollar-for-Dollar</div>
                    <div className="text-sm text-blue-700">
                      Up to 3% of salary ({formatCurrency(formData.annualSalary * 0.03)})
                    </div>
                  </div>
                  <div className="text-xl font-bold text-blue-600">{formatCurrency(results.tier1Match)}</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-green-900">Tier 2: 50% Match</div>
                    <div className="text-sm text-green-700">
                      From 3% to 5% of salary ({formatCurrency(formData.annualSalary * 0.02)})
                    </div>
                  </div>
                  <div className="text-xl font-bold text-green-600">{formatCurrency(results.tier2Match)}</div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">Total Annual Match</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(results.annualMatchEligible)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Loan Payments Used:</strong> {formatCurrency(results.totalLoanPaymentsUsed)} of{" "}
                  {formatCurrency(formData.monthlyLoanPayment * 12)} annual payments
                </p>
                <p>
                  Your student loan payments are being maximized under the SECURE 2.0 Act tiered matching structure.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Growth Chart */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                30-Year Compound Growth Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), "Portfolio Value"]} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown */}
        <Card className="shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Complete Calculation Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Input Parameters</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Salary</span>
                    <span className="font-semibold">{formatCurrency(formData.annualSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Loan Payment</span>
                    <span className="font-semibold">{formatCurrency(formData.monthlyLoanPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Student Debt</span>
                    <span className="font-semibold">{formatCurrency(formData.totalStudentDebtBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Loan Payments</span>
                    <span className="font-semibold">{formatCurrency(formData.monthlyLoanPayment * 12)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current 401(k) Contribution</span>
                    <span className="font-semibold">{formatCurrency(formData.current401kContribution * 12)}/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age</span>
                    <span className="font-semibold">{formData.age}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">QSLP Match Results</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tier 1 Match (100%)</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(results.tier1Match)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tier 2 Match (50%)</span>
                    <span className="font-semibold text-green-600">{formatCurrency(results.tier2Match)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Total Annual Match</span>
                    <span className="font-semibold text-purple-600">{formatCurrency(results.annualMatchEligible)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Match</span>
                    <span className="font-semibold">{formatCurrency(results.monthlyMatchEligible)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* IRS Contribution Limit */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">IRS Contribution Limit Remaining</span>
                <span className="font-semibold">
                  {Math.round((results.contributionLimitAvailable / currentIRSLimit) * 100)}%
                </span>
              </div>
              <Progress value={(results.contributionLimitAvailable / currentIRSLimit) * 100} className="h-3" />
              <p className="text-sm text-gray-500 mt-2">
                {formatCurrency(results.contributionLimitAvailable)} remaining capacity (2025 limit:{" "}
                {formatCurrency(formData.age >= 50 ? 31000 : 23500)})
              </p>
            </div>

            {/* QSLP Status */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={formData.hasQSLPMatching ? "default" : "secondary"}>
                  {formData.hasQSLPMatching ? "QSLP Available" : "QSLP Not Available"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {formData.hasQSLPMatching
                  ? "Your employer offers QSLP matching - you can start benefiting immediately!"
                  : "Your employer doesn't offer QSLP yet. Consider discussing this benefit with your HR department."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Annual Certification Reminder */}
        <Card className="bg-amber-50 border-amber-200 shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 mb-2">Important: Annual Certification Required</h3>
                <p className="text-amber-800 mb-4">
                  To receive QSLP matching, you must certify your student loan payments annually with your employer.
                  This typically involves providing loan statements or payment records to HR.
                </p>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-700">Set a calendar reminder for next year!</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Over Button */}
        <div className="text-center">
          <Button
            onClick={onStartOver}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-4"
          >
            Calculate Again
          </Button>
        </div>
      </div>
    </div>
  )
}
