"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { FormData } from "@/app/page" // Assuming FormData is defined in app/page.tsx

interface CalculatorFormProps {
  onSubmit: (data: Omit<FormData, "email">) => void // Email is already set
  onBack: () => void
  initialEmail: string // To pre-fill or use if needed, though not directly in form fields now
}

export function CalculatorForm({ onSubmit, onBack, initialEmail }: CalculatorFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  // Email is managed by the parent, so it's not part of this component's direct formData state
  const [formData, setFormData] = useState<Omit<FormData, "email">>({
    annualSalary: 0,
    monthlyLoanPayment: 0,
    current401kContribution: 0,
    age: 25,
    employerMatchRule: "",
    hasQSLPMatching: false,
    totalStudentDebtBalance: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 7
  const progress = (currentStep / totalSteps) * 100

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.annualSalary || formData.annualSalary <= 0) {
          newErrors.annualSalary = "Annual salary is required"
        }
        break
      case 2:
        if (!formData.monthlyLoanPayment || formData.monthlyLoanPayment < 0) {
          newErrors.monthlyLoanPayment = "Monthly loan payment is required"
        }
        break
      case 3:
        if (!formData.totalStudentDebtBalance || formData.totalStudentDebtBalance < 0) {
          newErrors.totalStudentDebtBalance = "Total student debt balance is required"
        }
        break
      case 4:
        if (formData.current401kContribution < 0) {
          newErrors.current401kContribution = "401(k) contribution cannot be negative"
        }
        break
      case 5:
        if (!formData.age || formData.age < 22 || formData.age > 70) {
          newErrors.age = "Please select a valid age"
        }
        break
      case 6:
        if (!formData.employerMatchRule) {
          newErrors.employerMatchRule = "Please select your employer match rule"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      } else {
        onSubmit(formData)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, "")
    return new Intl.NumberFormat("en-US").format(Number.parseInt(number) || 0)
  }

  const handleCurrencyChange = (field: keyof Omit<FormData, "email">, value: string) => {
    const number = Number.parseInt(value.replace(/[^\d]/g, "")) || 0
    setFormData((prev) => ({ ...prev, [field]: number }))
  }

  return (
    <TooltipProvider>
      {/* Logo in top corner */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex items-center gap-3">
        <img src="/images/logo.png" alt="Company Logo" className="w-12 h-12 md:w-16 md:h-16" />
        <div className="text-xl md:text-2xl font-bold">
          <span className="text-[#0C648A] font-extrabold">Securematch</span>
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="max-w-2xl w-full">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">QSLP Calculator</h1>
              <span className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="backdrop-blur-lg bg-white/90 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">
                {currentStep === 1 && "What's your annual salary?"}
                {currentStep === 2 && "Monthly student loan payment?"}
                {currentStep === 3 && "What's your total student debt balance?"}
                {currentStep === 4 && "Current 401(k) contribution?"}
                {currentStep === 5 && "What's your age?"}
                {currentStep === 6 && "Employer match rule?"}
                {currentStep === 7 && "QSLP matching available?"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Annual Salary */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="salary" className="text-lg">
                      Annual Salary
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter your gross annual salary before taxes</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">$</span>
                    <Input
                      id="salary"
                      type="text"
                      value={formatCurrency(formData.annualSalary.toString())}
                      onChange={(e) => handleCurrencyChange("annualSalary", e.target.value)}
                      className="pl-8 h-16 text-xl text-center"
                      placeholder="75,000"
                    />
                  </div>
                  {errors.annualSalary && <p className="text-red-500 text-sm">{errors.annualSalary}</p>}
                </div>
              )}

              {/* Step 2: Monthly Loan Payment */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="loanPayment" className="text-lg">
                      Monthly Student Loan Payment
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total monthly payment across all student loans</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">$</span>
                    <Input
                      id="loanPayment"
                      type="text"
                      value={formatCurrency(formData.monthlyLoanPayment.toString())}
                      onChange={(e) => handleCurrencyChange("monthlyLoanPayment", e.target.value)}
                      className="pl-8 h-16 text-xl text-center"
                      placeholder="500"
                    />
                  </div>
                  {errors.monthlyLoanPayment && <p className="text-red-500 text-sm">{errors.monthlyLoanPayment}</p>}
                </div>
              )}

              {/* Step 3: Total Student Debt Balance */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="totalDebt" className="text-lg">
                      Total Student Debt Balance
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your total outstanding student loan balance</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">$</span>
                    <Input
                      id="totalDebt"
                      type="text"
                      value={formatCurrency(formData.totalStudentDebtBalance.toString())}
                      onChange={(e) => handleCurrencyChange("totalStudentDebtBalance", e.target.value)}
                      className="pl-8 h-16 text-xl text-center"
                      placeholder="30,000"
                    />
                  </div>
                  {errors.totalStudentDebtBalance && (
                    <p className="text-red-500 text-sm">{errors.totalStudentDebtBalance}</p>
                  )}
                </div>
              )}

              {/* Step 4: Current 401k Contribution */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="contribution" className="text-lg">
                      Current Monthly 401(k) Contribution
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your current monthly contribution (can be $0)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">$</span>
                    <Input
                      id="contribution"
                      type="text"
                      value={formatCurrency(formData.current401kContribution.toString())}
                      onChange={(e) => handleCurrencyChange("current401kContribution", e.target.value)}
                      className="pl-8 h-16 text-xl text-center"
                      placeholder="0"
                    />
                  </div>
                  {errors.current401kContribution && (
                    <p className="text-red-500 text-sm">{errors.current401kContribution}</p>
                  )}
                </div>
              )}

              {/* Step 5: Age */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-lg">Your Age</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Used to calculate contribution limits and retirement timeline</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={formData.age.toString()}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, age: Number.parseInt(value) }))}
                  >
                    <SelectTrigger className="h-16 text-xl">
                      <SelectValue placeholder="Select your age" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 49 }, (_, i) => i + 22).map((age) => (
                        <SelectItem key={age} value={age.toString()}>
                          {age}
                        </SelectItem>
                      ))}
                      <SelectItem value="70">65+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                </div>
              )}

              {/* Step 6: Employer Match Rule */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-lg">Employer Match Rule</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Check your employee handbook or ask HR</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={formData.employerMatchRule}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, employerMatchRule: value }))}
                  >
                    <SelectTrigger className="h-16 text-lg">
                      <SelectValue placeholder="Select your employer's match rule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100% match up to 5% of salary">100% match up to 5% of salary</SelectItem>
                      <SelectItem value="50% match up to 6% of salary">50% match up to 6% of salary</SelectItem>
                      <SelectItem value="Dollar-for-dollar up to 3%, then 50% up to 5%">
                        Dollar-for-dollar up to 3%, then 50% up to 5%
                      </SelectItem>
                      <SelectItem value="Custom">Custom / Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.employerMatchRule && <p className="text-red-500 text-sm">{errors.employerMatchRule}</p>}
                </div>
              )}

              {/* Step 7: QSLP Matching */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Label className="text-lg">Does your employer offer QSLP matching?</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>QSLP = Qualified Student Loan Payment matching under SECURE 2.0</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <RadioGroup
                    value={formData.hasQSLPMatching.toString()}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, hasQSLPMatching: value === "true" }))}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="true" id="yes" />
                      <Label htmlFor="yes" className="text-lg cursor-pointer flex-1">
                        Yes, my employer offers QSLP matching
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="false" id="no" />
                      <Label htmlFor="no" className="text-lg cursor-pointer flex-1">
                        No, or I'm not sure
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={handlePrevious} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {currentStep === 1 ? "Back to Start" : "Previous"}
                </Button>

                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  {currentStep === totalSteps ? "Calculate Results" : "Next"}
                  {currentStep < totalSteps && <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
