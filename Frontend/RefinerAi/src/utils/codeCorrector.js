// src/utils/codeCorrector.js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";

// Load environment variables from .env file
// dotenv.config();

const code = "import math prit('heeelo workds')"; // Code to be corrected
const changes = "correct the syntax";

const model = new ChatGoogleGenerativeAI({
    modelName: "gemini-1.5-flash-latest",
    apiKey: "AIzaSyBlY6dGU0u7iBlHle52xkat64VrNKKldL8", // Use env variable for security
});

const parser = new JsonOutputParser();

const promptTemplate = PromptTemplate.fromTemplate(
    `I have the following code:\n${code}\nI want you to correct the syntax and make the following changes:\n${changes}\nReturn the corrected code in JSON format.`
);

export async function getCorrectedCode() {
    try {
        const prompt = await promptTemplate.format({});
        const response = await model.call([ { role: "user", content: prompt } ]);
        const correctedCode = await parser.parse(response.text); 
        return correctedCode; // Return the corrected code
    } catch (error) {
        console.error("Error in getCorrectedCode:", error);
        return "Error in getting corrected code.";
    }
}
