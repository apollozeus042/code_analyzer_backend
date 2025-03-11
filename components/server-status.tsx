"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function ServerStatus() {
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking")

  useEffect(() => {
    checkServerStatus()
  }, [])

  const checkServerStatus = async () => {
    try {
      // Add a simple health check endpoint to your Flask server
      const response = await fetch("http://localhost:5000/health", {
        method: "GET",
        // Adding a timeout to prevent long waiting
        signal: AbortSignal.timeout(3000),
      })

      if (response.ok) {
        setServerStatus("online")
      } else {
        setServerStatus("offline")
      }
    } catch (error) {
      setServerStatus("offline")
      console.error("Server check failed:", error)
    }
  }

  if (serverStatus === "checking") {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Checking server status...</AlertTitle>
        <AlertDescription>Verifying connection to the analysis server.</AlertDescription>
      </Alert>
    )
  }

  if (serverStatus === "online") {
    return (
      <Alert className="mb-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle>Server is online</AlertTitle>
        <AlertDescription>Connected to the code analysis server.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Server is offline</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <span>The code analysis server is not running. Please start the Python Flask server.</span>
        <div className="bg-muted p-2 rounded text-sm font-mono">python server.py</div>
        <Button size="sm" onClick={checkServerStatus} className="self-start mt-1">
          Check Again
        </Button>
      </AlertDescription>
    </Alert>
  )
}

