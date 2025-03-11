"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface CodeDisplayProps {
  code: string
  isLoading: boolean
  onCodeUpdate?: (code: string) => void
  onAnalyze?: () => void
  hasAnalyzed?: boolean
  isAnalyzing?: boolean
}

export default function CodeDisplay({
  code,
  isLoading,
  onCodeUpdate,
  onAnalyze,
  hasAnalyzed = false,
  isAnalyzing = false,
}: CodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
  }

  // Handle tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const target = e.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd

      // Insert tab at cursor position
      const newValue = code.substring(0, start) + "\t" + code.substring(end)
      if (onCodeUpdate) {
        onCodeUpdate(newValue)
      }

      // Move cursor after the inserted tab
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1
      }, 0)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!code}>
          <Copy className="h-4 w-4 mr-1" />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      <div className="relative border rounded-lg overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => onCodeUpdate && onCodeUpdate(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-[300px] p-4 font-mono text-sm bg-muted resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          spellCheck="false"
          placeholder="Extracted code will appear here. You can edit it before analysis."
        />
      </div>

      {onAnalyze && (
        <div className="flex justify-end">
          <Button onClick={onAnalyze} disabled={!code || hasAnalyzed || isAnalyzing} className="w-full sm:w-auto">
            {isAnalyzing ? "Analyzing..." : hasAnalyzed ? "Analyzed" : "Analyze Code"}
          </Button>
        </div>
      )}
    </div>
  )
}

