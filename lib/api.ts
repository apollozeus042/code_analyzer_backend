// API integration with the Flask backend

// Use environment variable if available, otherwise default to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function analyzeCodeImage(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error analyzing code image:", error)
    throw error
  }
}

export async function analyzeCodeText(code: string) {
  const formData = new FormData()
  formData.append("code", code)

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error analyzing code text:", error)
    throw error
  }
}

