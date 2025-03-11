"use client"

import { CheckCircle, AlertTriangle, HelpCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface AnalysisResultsProps {
  readabilityScore: number | null
  bugType: string | null
  isLoading: boolean
}

export default function AnalysisResults({ readabilityScore, bugType, isLoading }: AnalysisResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (readabilityScore === null || bugType === null) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <HelpCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
        <p>No analysis results yet. Click "Analyze Code" to begin.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-2">
          <h3 className="text-lg font-medium">Code Readability</h3>
          {readabilityScore === 1 ? (
            <CheckCircle className="h-5 w-5 ml-2 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 ml-2 text-amber-500" />
          )}
        </div>
        <div className="bg-muted rounded-md p-3">
          <p>
            {readabilityScore === 1
              ? "Your code is readable and follows good practices."
              : "Your code could be improved for better readability."}
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-2">
          <h3 className="text-lg font-medium">Potential Bug Type</h3>
          {bugType === "No bug found" ? (
            <CheckCircle className="h-5 w-5 ml-2 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 ml-2 text-amber-500" />
          )}
        </div>
        <div className="bg-muted rounded-md p-3">
          <p className="font-medium">
            {bugType === "No bug found"
              ? "No Identified Bugs"
              : `Identified Issue: ${bugType}`}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {bugType === "0"
              ? ""
              : "The model has identified this potential issue in your code. Please review your code"}
          </p>
        </div>
      </div>
    </div>
  )
}

