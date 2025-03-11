"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UploadCloud, FileCode } from "lucide-react"

interface CodeUploaderProps {
  onImageSelected: (file: File | null, preview: string | null) => void
  onExtractCode: () => void
  imageUrl: string | null
  isExtracting: boolean
}

export default function CodeUploader({ onImageSelected, onExtractCode, imageUrl, isExtracting }: CodeUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState<boolean>(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Create a preview URL for the image
      const url = URL.createObjectURL(file)
      onImageSelected(file, url)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)

      // Create a preview URL for the image
      const url = URL.createObjectURL(file)
      onImageSelected(file, url)
    }
  }

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Uploaded code"
              className="w-full object-contain max-h-[300px]"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setSelectedFile(null)
                onImageSelected(null, null)
              }}
              variant="outline"
              className="flex-1"
            >
              Upload New Image
            </Button>
            <Button onClick={onExtractCode} disabled={isExtracting} className="flex-1">
              {isExtracting ? "Extracting..." : "Extract Code"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <UploadCloud className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Drag and drop your code image here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Supports PNG, JPG, JPEG</p>
              </div>
              <Input
                type="file"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
              />
              <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                Browse Files
              </Button>
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileCode className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

