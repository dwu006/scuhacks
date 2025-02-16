import { GoogleGenerativeAI } from "@google/generative-ai";

// Convert File object to Base64 string
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // Remove "data:image/png;base64," part
    reader.onerror = (error) => reject(error);
  });
};

// Function to analyze image using Gemini
export async function uploadImageAndAnalyze(imageFile) {
  try {
    if (!imageFile) throw new Error("No image file provided");

    // Convert image to Base64
    const base64Data = await fileToBase64(imageFile);

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI("AIzaSyDxNbeQxgqx3pEVmQ9-cWcd5D67gbOE1Pk");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Send Base64 image to Gemini
    const result = await model.generateContent({
      contents: [
        {
          parts: [
            { text: "You are a master botanist. Identify the plant species and categorize it as bushes, fungi, flower, ferns, conifers, or gymnosperms. Output species, category, description, and amount of CO2 reduced as a number." },
            {
              inlineData: {
                data: base64Data,
                mimeType: imageFile.type, // Preserve MIME type
              },
            },
          ],
        },
      ],
    });

    console.log("Gemini API Response:", result.response.text()); // Log response
    return result.response.text();
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
