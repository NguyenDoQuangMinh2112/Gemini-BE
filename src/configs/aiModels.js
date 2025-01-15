import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    "AIzaSyBkqgFzSJgCbvaNPwgo-ITeYQg-3RF84Qw"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt =
    "How much is the [Account Number (600001)] approved budget for ACPD in FY [2023]?";

  const result = await model.generateContent(prompt, {
    maxOutputTokens: 100,
  });
  console.log(result.response.text());