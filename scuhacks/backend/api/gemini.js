import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const fileManager = new GoogleAIFileManager('AIzaSyDxNbeQxgqx3pEVmQ9-cWcd5D67gbOE1Pk');

const uploadResult = await fileManager.uploadFile(
  `flower.png`,
  {
    mimeType: "image/png",
    displayName: "flower",
  },
);
console.log(
  `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
);


const genAI = new GoogleGenerativeAI('AIzaSyDxNbeQxgqx3pEVmQ9-cWcd5D67gbOE1Pk');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent([
  "You are a master botanist. Figure out what species the plant is. Put the plant into one of these categories: bushes, fungi, flower, ferns, conifers, gymnosperms. Output species, category, description, and amount of CO2 reduced as a number.",
  {
    fileData: {
      fileUri: uploadResult.file.uri,
      mimeType: uploadResult.file.mimeType,
    },
  },
]);
console.log(result.response.text());