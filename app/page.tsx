"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { CalculatorForm } from "@/components/calculator-form"
import { ResultsDashboard } from "@/components/results-dashboard"

export interface FormData {
  email: string // Still collected for simulation purposes
  annualSalary: number
  monthlyLoanPayment: number
  current401kContribution: number
  age: number
  employerMatchRule: string
  hasQSLPMatching: boolean
  totalStudentDebtBalance: number
}

export interface CalculationResults {
  monthlyMatchEligible: number
  annualMatchEligible: number
  thirtyYearProjection: number
  contributionLimitUsed: number // Percentage as a decimal (e.g., 0.25 for 25%)
  contributionLimitAvailable: number
  companyParticipants: number // Simulated
  totalCompanyEmployees?: number // Simulated
  participationRate?: number // Simulated
  tier1Match: number
  tier2Match: number
  totalLoanPaymentsUsed: number
}

export default function QSLPCalculator() {
  const [currentSection, setCurrentSection] = useState(1) // 1: Landing, 2: Form, 3: Results
  const [formData, setFormData] = useState<FormData | null>(null)
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [userEmail, setUserEmail] = useState<string>("") // Store email from landing page

  const handleLandingNext = (email: string) => {
    setUserEmail(email)
    setCurrentSection(2)
  }

  const handleFormSubmit = async (calculatorData: Omit<FormData, "email">) => {
    const fullFormData: FormData = {
      ...calculatorData,
      email: userEmail, // Add the stored email
    }
    setFormData(fullFormData)

    const calculatedResults = await calculateQSLPResults(fullFormData)
    setResults(calculatedResults)

    setCurrentSection(3)
  }

  const handleStartOver = () => {
    setFormData(null)
    setResults(null)
    setUserEmail("")
    setCurrentSection(1)
  }

  const calculateQSLPMatch = (
    annualSalary: number,
    monthlyLoanPayment: number,
    matchRule: string,
    current401kContribution = 0,
    age = 25,
  ) => {
    const annualLoanPayments = monthlyLoanPayment * 12
    const annual401kContribution = current401kContribution * 12

    const contributionLimit = age >= 50 ? 31000 : 23500 // 2025 IRS limits
    const remainingContributionRoom = contributionLimit - annual401kContribution

    let annualMatch = 0
    let tier1Match = 0
    let tier2Match = 0

    let maxMatchPercentage = 0.05
    let tier1Rate = 1.0
    let tier1Threshold = 0.03 // Default to the common "Dollar-for-dollar up to 3%, then 50% up to 5%"
    let tier2Rate = 0.5
    let tier2Threshold = 0.05

    switch (matchRule) {
      case "100% match up to 5% of salary":
        maxMatchPercentage = 0.05
        tier1Rate = 1.0
        tier1Threshold = 0.05
        tier2Rate = 0 // No second tier for this rule
        tier2Threshold = 0.05
        break
      case "50% match up to 6% of salary":
        maxMatchPercentage = 0.06
        tier1Rate = 0.5
        tier1Threshold = 0.06
        tier2Rate = 0 // No second tier for this rule
        tier2Threshold = 0.06
        break
      case "Dollar-for-dollar up to 3%, then 50% up to 5%":
        // Default values are already set for this
        break
      // "Custom" or other rules would mean we can't calculate precisely without more info.
      // For simplicity, we'll use the default if "Custom" is selected, or you could add specific logic.
    }

    const salaryBasedTier1Limit = annualSalary * tier1Threshold
    const salaryBasedTier2Limit = annualSalary * tier2Threshold

    if (annualLoanPayments > 0) {
      // Tier 1
      const tier1EligibleLoanPayment = Math.min(annualLoanPayments, salaryBasedTier1Limit)
      tier1Match = tier1EligibleLoanPayment * tier1Rate
      annualMatch += tier1Match

      // Tier 2 (if applicable and loan payments exceed tier 1 limit)
      if (tier2Rate > 0 && annualLoanPayments > salaryBasedTier1Limit) {
        const remainingLoanPaymentForTier2 = annualLoanPayments - salaryBasedTier1Limit
        const tier2EligibleSalaryPortion = salaryBasedTier2Limit - salaryBasedTier1Limit
        const tier2EligibleLoanPayment = Math.min(remainingLoanPaymentForTier2, tier2EligibleSalaryPortion)

        if (tier2EligibleLoanPayment > 0) {
          tier2Match = tier2EligibleLoanPayment * tier2Rate
          annualMatch += tier2Match
        }
      }
    }

    const totalLoanPaymentsConsideredForMatch = Math.min(annualLoanPayments, salaryBasedTier2Limit)

    const finalMatch = Math.max(0, Math.min(annualMatch, remainingContributionRoom))

    // Ensure tier matches don't exceed finalMatch
    const actualTier1 = Math.min(tier1Match, finalMatch)
    const actualTier2 = Math.min(tier2Match, Math.max(0, finalMatch - actualTier1))

    return {
      monthlyMatch: Math.round(finalMatch / 12),
      annualMatch: Math.round(finalMatch),
      contributionUsage: finalMatch > 0 ? Math.round((finalMatch / contributionLimit) * 100) : 0,
      remainingCapacity: Math.max(0, contributionLimit - annual401kContribution - finalMatch),
      tier1Match: Math.round(actualTier1),
      tier2Match: Math.round(actualTier2),
      totalLoanPaymentsUsed: Math.round(totalLoanPaymentsConsideredForMatch),
      contributionLimit,
    }
  }

  const calculateQSLPResults = async (data: FormData): Promise<CalculationResults> => {
    const { annualSalary, monthlyLoanPayment, current401kContribution, age, employerMatchRule } = data

    const matchResults = calculateQSLPMatch(
      annualSalary,
      monthlyLoanPayment,
      employerMatchRule,
      current401kContribution,
      age,
    )

    const retirementAge = 65
    const yearsToRetirement = Math.max(0, retirementAge - age)
    const monthsToRetirement = yearsToRetirement * 12
    let futureValue = 0

    if (matchResults.monthlyMatch > 0 && monthsToRetirement > 0) {
      const monthlyReturn = 0.07 / 12 // 7% annual return
      futureValue = matchResults.monthlyMatch * (((1 + monthlyReturn) ** monthsToRetirement - 1) / monthlyReturn)
    }

    // Company participation simulation (can be simplified or removed if email is not used)
    const companyParticipants = Math.floor(Math.random() * 50) + 10 // Example simulation
    const totalCompanyEmployees = Math.floor(Math.random() * 200) + 100 // Example simulation

    return {
      monthlyMatchEligible: matchResults.monthlyMatch,
      annualMatchEligible: matchResults.annualMatch,
      thirtyYearProjection: Math.round(futureValue),
      contributionLimitUsed: matchResults.contributionUsage / 100, // Convert to decimal for progress bar
      contributionLimitAvailable: matchResults.remainingCapacity,
      companyParticipants,
      totalCompanyEmployees,
      participationRate: (companyParticipants / totalCompanyEmployees) * 100,
      tier1Match: matchResults.tier1Match,
      tier2Match: matchResults.tier2Match,
      totalLoanPaymentsUsed: matchResults.totalLoanPaymentsUsed,
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {currentSection === 1 && <LandingPage onNext={handleLandingNext} />}
      {currentSection === 2 && (
        <CalculatorForm onSubmit={handleFormSubmit} onBack={() => setCurrentSection(1)} initialEmail={userEmail} />
      )}
      {currentSection === 3 && results && formData && (
        <ResultsDashboard results={results} formData={formData} onStartOver={handleStartOver} />
      )}
    </div>
  )
}
