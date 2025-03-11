"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function DeploymentGuide() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mt-8">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center justify-between">
          <span>Deployment Guide</span>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <Tabs defaultValue="render">
            <TabsList className="mb-4">
              <TabsTrigger value="render">Render</TabsTrigger>
              <TabsTrigger value="heroku">Heroku</TabsTrigger>
              <TabsTrigger value="pythonanywhere">PythonAnywhere</TabsTrigger>
            </TabsList>

            <TabsContent value="render">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. Deploy the Flask Backend to Render</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>
                      Create a new account on{" "}
                      <a
                        href="https://render.com"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        Render
                      </a>{" "}
                      if you don't have one
                    </li>
                    <li>Click "New" and select "Web Service"</li>
                    <li>Connect your GitHub repository or upload your code</li>
                    <li>
                      Set the following configuration:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Name: code-analyzer-backend</li>
                        <li>Environment: Python 3</li>
                        <li>
                          Build Command: <code>pip install -r requirements.txt</code>
                        </li>
                        <li>
                          Start Command: <code>python server-portable.py</code>
                        </li>
                      </ul>
                    </li>
                    <li>
                      Create a <code>requirements.txt</code> file with all dependencies
                    </li>
                    <li>Make sure to include your models in the repository or upload them separately</li>
                    <li>Click "Create Web Service"</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2">2. Deploy the React Frontend to Vercel</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>
                      Create a new account on{" "}
                      <a
                        href="https://vercel.com"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        Vercel
                      </a>{" "}
                      if you don't have one
                    </li>
                    <li>Click "New Project" and import your GitHub repository</li>
                    <li>
                      Add the following environment variable:
                      <ul className="list-disc pl-5 mt-1">
                        <li>NEXT_PUBLIC_API_URL: (Your Render backend URL)</li>
                      </ul>
                    </li>
                    <li>Click "Deploy"</li>
                  </ol>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-sm">
                  <p className="font-medium">Important Note:</p>
                  <p className="mt-1">
                    Make sure to update the CORS configuration in your Flask app to allow requests from your Vercel
                    domain:
                  </p>
                  <pre className="bg-muted p-2 rounded-md mt-2 text-xs">
                    <code>{`from flask_cors import CORS
app = Flask(__name__)
CORS(app, origins=["https://your-vercel-app.vercel.app"])`}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="heroku">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. Deploy the Flask Backend to Heroku</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>
                      Create a new account on{" "}
                      <a
                        href="https://heroku.com"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        Heroku
                      </a>{" "}
                      if you don't have one
                    </li>
                    <li>
                      Install the{" "}
                      <a
                        href="https://devcenter.heroku.com/articles/heroku-cli"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        Heroku CLI
                      </a>
                    </li>
                    <li>
                      Create the following files in your project:
                      <ul className="list-disc pl-5 mt-1">
                        <li>
                          <code>Procfile</code> with content: <code>web: gunicorn server-portable:app</code>
                        </li>
                        <li>
                          <code>requirements.txt</code> with all dependencies including <code>gunicorn</code>
                        </li>
                      </ul>
                    </li>
                    <li>
                      Initialize a Git repository if you haven't already:
                      <pre className="bg-muted p-2 rounded-md mt-1 text-xs">
                        <code>git init git add . git commit -m "Initial commit"</code>
                      </pre>
                    </li>
                    <li>
                      Create and deploy to Heroku:
                      <pre className="bg-muted p-2 rounded-md mt-1 text-xs">
                        <code>heroku create code-analyzer-backend git push heroku main</code>
                      </pre>
                    </li>
                    <li>Make sure to include your models in the repository</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2">2. Deploy the React Frontend to Vercel</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>Follow the same steps as in the Render tab for deploying to Vercel</li>
                    <li>Use your Heroku app URL as the NEXT_PUBLIC_API_URL</li>
                  </ol>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-sm">
                  <p className="font-medium">Important Notes:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Heroku's free tier has been discontinued. You'll need a paid plan.</li>
                    <li>
                      Heroku has an ephemeral filesystem, so any files written during runtime will be lost. Store your
                      models in the repository.
                    </li>
                    <li>
                      Update your server to use the PORT environment variable:{" "}
                      <code>port = os.environ.get("PORT", "5000")</code>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pythonanywhere">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. Deploy the Flask Backend to PythonAnywhere</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>
                      Create a new account on{" "}
                      <a
                        href="https://www.pythonanywhere.com"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        PythonAnywhere
                      </a>
                    </li>
                    <li>Go to the "Files" tab and upload your server file and models</li>
                    <li>Go to the "Consoles" tab and start a new Bash console</li>
                    <li>
                      Install the required packages:
                      <pre className="bg-muted p-2 rounded-md mt-1 text-xs">
                        <code>
                          pip install --user flask flask-cors pillow pytesseract pandas tensorflow keras scikit-learn
                          joblib
                        </code>
                      </pre>
                    </li>
                    <li>Go to the "Web" tab and create a new web app</li>
                    <li>Select "Flask" and the appropriate Python version</li>
                    <li>Configure the WSGI file to point to your Flask app</li>
                    <li>Reload the web app</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2">2. Deploy the React Frontend to Vercel</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>Follow the same steps as in the Render tab for deploying to Vercel</li>
                    <li>Use your PythonAnywhere URL as the NEXT_PUBLIC_API_URL</li>
                  </ol>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-sm">
                  <p className="font-medium">Important Notes:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>
                      PythonAnywhere free accounts have CPU and memory limitations that might affect model performance
                    </li>
                    <li>
                      You may need to whitelist your Vercel domain in PythonAnywhere's "Web" tab under "Allow CORS"
                    </li>
                    <li>Tesseract OCR might need additional configuration on PythonAnywhere</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  )
}

