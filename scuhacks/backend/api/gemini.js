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
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the prompt for structured output
    const prompt = `Analyze this plant image and provide information in this exact JSON format, no additional text:
{
  "species": "[scientific name] ([common name])",
  "category": "[one of: bushes, fungi, flower, ferns, conifers, or gymnosperms]",
  "description": "[brief description of characteristics and care instructions]",
  "co2Reduced": "[how much does the plant reduce CO2 emissions (in CO2 g per day)]"
}`;

    // Send Base64 image to Gemini
    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    try {
      // Clean the response text to ensure it's valid JSON
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const jsonResponse = JSON.parse(cleanedText);
      
      // Validate the response has all required fields
      const requiredFields = ['species', 'category', 'description', 'co2Reduced'];
      const missingFields = requiredFields.filter(field => !jsonResponse[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      return jsonResponse;
    } catch (parseError) {
      console.error("Raw Gemini response:", text);
      console.error("Parse error:", parseError);
      throw new Error("Failed to parse Gemini response as valid JSON. Raw response: " + text.substring(0, 100));
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}