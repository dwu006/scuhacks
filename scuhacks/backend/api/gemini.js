import { GoogleGenerativeAI } from "@google/generative-ai";

// Convert Buffer to Base64 string
const bufferToBase64 = (buffer) => {
  return buffer.toString('base64');
};

// Function to analyze image using Gemini
export async function uploadImageAndAnalyze(imageBuffer) {
  try {
    if (!imageBuffer) throw new Error("No image buffer provided");

    // Convert buffer to Base64
    const base64Data = bufferToBase64(imageBuffer);

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // Prepare the prompt for structured output
    const prompt = `You are a master botanist. Analyze this plant image and provide information in the following JSON format:
    {
      "species": "Scientific name and common name",
      "category": "One of: bushes, fungi, flower, ferns, conifers, or gymnosperms",
      "description": "A detailed concise description of the plant including its characteristics and care instructions",
      "co2Reduced": "Estimated CO2 reduction per day (just the number)",
    }
    Only respond with valid JSON. Do not include any other text.`;

    // Send Base64 image to Gemini
    const result = await model.generateContent({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
              },
            },
          ],
        },
      ],
    });

    const response = result.response.text();
    
    try {
      // Parse the response as JSON
      const jsonResponse = JSON.parse(response);
      return jsonResponse;
    } catch (parseError) {
      console.error("Error parsing Gemini response as JSON:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}
