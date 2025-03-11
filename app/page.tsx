"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CodeUploader from "@/components/code-uploader"
import CodeDisplay from "@/components/code-display"
import AnalysisResults from "@/components/analysis-results"
import ServerStatus from "@/components/server-status"
import { UploadIcon } from "lucide-react"
import { analyzeCodeImage, analyzeCodeText } from "@/lib/api"

export default function Home() {
  const [extractedCode, setExtractedCode] = useState<string>("")
  const [readabilityScore, setReadabilityScore] = useState<number | null>(null)
  const [bugType, setBugType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isExtracting, setIsExtracting] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false)

  // Function to handle image selection
  const handleImageSelected = (file: File | null, preview: string | null) => {
    setSelectedFile(file)
    setImageUrl(preview)
    // Reset other states when a new image is selected
    setExtractedCode("")
    setReadabilityScore(null)
    setBugType(null)
    setHasAnalyzed(false)
  }

  // Function to extract code from the selected image
  const handleExtractCode = async () => {
    if (!selectedFile) return

    setIsExtracting(true)
    try {
      const data = await analyzeCodeImage(selectedFile)
      setExtractedCode(data.extracted_text)
    } catch (error) {
      console.error("Error extracting code:", error)
    } finally {
      setIsExtracting(false)
    }
  }

  // Function to handle code updates
  const handleCodeUpdate = (newCode: string) => {
    setExtractedCode(newCode)
    // Reset analysis when code is changed
    if (readabilityScore !== null || bugType !== null) {
      setReadabilityScore(null)
      setBugType(null)
      setHasAnalyzed(false)
    }
  }

  // Function to analyze the code
  const handleAnalyzeCode = async () => {
    if (!extractedCode) return

    setIsLoading(true)
    try {
      const data = await analyzeCodeText(extractedCode)
      setReadabilityScore(data.readability)
      setBugType(data.bugs)
      setHasAnalyzed(true)
    } catch (error) {
      console.error("Error analyzing code:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Code Analyzer</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="h-5 w-5" />
              Upload Code Image
            </CardTitle>
            <CardDescription>Upload an image containing code to extract and analyze</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeUploader
              onImageSelected={handleImageSelected}
              onExtractCode={handleExtractCode}
              imageUrl={imageUrl}
              isExtracting={isExtracting}
            />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Code Editor</CardTitle>
            <CardDescription>Edit the extracted code and analyze it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CodeDisplay
              code={extractedCode}
              isLoading={isExtracting}
              onCodeUpdate={handleCodeUpdate}
              onAnalyze={handleAnalyzeCode}
              hasAnalyzed={hasAnalyzed}
              isAnalyzing={isLoading}
            />

            {(readabilityScore !== null || bugType !== null || isLoading) && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
                <AnalysisResults readabilityScore={readabilityScore} bugType={bugType} isLoading={isLoading} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <footer className="text-center mt-8 text-gray-600">
        Developed by Zeus Espinosa and Rafael Ogot
        <br />
        BCS44
      </footer>
    </main>
  )
}

