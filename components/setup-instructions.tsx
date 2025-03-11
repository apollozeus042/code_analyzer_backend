"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function SetupInstructions() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mt-8">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center justify-between">
          <span>Server Setup Instructions</span>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <Tabs defaultValue="windows">
            <TabsList className="mb-4">
              <TabsTrigger value="windows">Windows</TabsTrigger>
              <TabsTrigger value="mac">macOS</TabsTrigger>
              <TabsTrigger value="linux">Linux</TabsTrigger>
            </TabsList>

            <TabsContent value="windows">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. Install Required Software</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      Install{" "}
                      <a
                        href="https://www.python.org/downloads/"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        Python 3.8+
                      </a>
                    </li>
                    <li>
                      Install{" "}
                      <a
                        href="https://github.com/UB-Mannheim/tesseract/wiki"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        Tesseract OCR for Windows
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">2. Create a Project Directory</h3>
                  <pre className="bg-muted p-3 rounded-lg text-sm">
                    <code>mkdir code-analyzer cd code-analyzer mkdir models</code>
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium mb-2">3. Copy Your Models</h3>
                  <p className="text-sm text-muted-foreground">Copy your model files to the models directory:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                    <li>readability_model.keras</li>
                    <li>buglocalize_model.keras</li>
                    <li>label_encoder.joblib</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">4. Install Python Dependencies</h3>
                  <pre className="bg-muted p-3 rounded-lg text-sm">
                    <code>
                      pip install flask flask-cors pillow pytesseract pandas tensorflow keras scikit-learn joblib
                    </code>
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium mb-2">5. Start the Server</h3>
                  <pre className="bg-muted p-3 rounded-lg text-sm">
                    <code>python server-portable.py</code>
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mac">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. Install Required Software</h3>
                  <pre className="bg-muted p-3 rounded-lg text-sm">
                    <code>brew install python tesseract</code>
                  </pre>
                  <p className="text-sm text-muted-foreground mt-1">
                    If you don't have Homebrew,{" "}
                    <a
                      href="https://brew.sh/"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                      rel="noreferrer"
                    >
                      install it first
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">2. Create a Project Directory</h3>
                  <pre className="bg-muted p-3 rounded-lg text-sm">
                    <code>mkdir code-analyzer cd code-analyzer mkdir models</code>
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium mb-2">3. Copy Your Models</h3>
                  <p className="text-sm text-muted-foreground">Copy your model files to the models directory:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                    <li>readability_model.keras</li>
                    <li>buglocalize_model.keras</li>
                    <li>label_encoder.joblib</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">4. Install Python Dependencies</h3>
                  <pre className="bg-muted p-3 rounded-lg text-sm">
                    <code>
                      pip3 install flask flask-cors pillow pytesseract pandas tensorflow keras scikit-learn joblib
                    </code>
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium mb-2">5. Start the Server</h3>
                  <pre className="bg-muted p-3 rounded-lg text-sm">
                    <code>python3 server-portable.py</code>
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="linux">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. Install Required Software</h3>
                  <pre className="bg-muted p-3 rounded-lg text-sm">
                    <code>sudo apt update sudo apt install python3 python3-pip tesseract-ocr</code>
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium mb-2">2. Create a Project Directory</h3>
                  <pre className="bg-muted p-3 rounded-lg text-sm">
                    <code>mkdir code-analyzer cd code-analyzer mkdir models</code>
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium mb-2">3. Copy Your Models</h3>
                  <p className="text-sm text-muted-foreground">Copy your model files to the models directory:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                    <li>readability_model.keras</li>
                    <li>buglocalize_model.keras</li>
                    <li>label_encoder.joblib</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">4. Install Python Dependencies</h3>
                  <pre className="bg-muted p-3 rounded-lg text-sm">
                    <code>
                      pip3 install flask flask-cors pillow pytesseract pandas tensorflow keras scikit-learn joblib
                    </code>
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium mb-2">5. Start the Server</h3>
                  <pre className="bg-muted p-3 rounded-lg text-sm">
                    <code>python3 server-portable.py</code>
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  )
}

