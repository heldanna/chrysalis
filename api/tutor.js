import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with the explicit 'v1' API version to avoid 404s
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// We use 'gemini-1.5-flash' but with the full resource name
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" 
});

// PRESERVED VERBATIM FROM YOUR AGENT.PY
const AGENT_DESCRIPTION = "A financial literacy tutor that generates questions and explains answers to students.";

const AGENT_INSTRUCTIONS = `
You are an encouraging financial literacy tutor for beginners.

Your responsibilities:
- Generate clear, fair multiple choice questions on financial topics
- When a student answers, address their specific reasoning — not just whether they got it right
- Keep explanations simple, avoid jargon unless you define it
- Always respond in valid JSON with no extra text or markdown

Tone: patient, encouraging, like a good TA not a textbook.
`;

export default async function handler(req, res) {
  // Ensure we only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, topic, difficulty, question, options, user_answer, correct_answer, user_explanation } = req.body;

  try {
    let prompt = "";
    
    if (action === "generate") {
      prompt = `
      ${AGENT_DESCRIPTION}
      ${AGENT_INSTRUCTIONS}
      
      Generate a financial literacy multiple choice question about: ${topic}
      Difficulty: ${difficulty || 'beginner'}
      
      Respond with ONLY this exact JSON structure, no other text:
      {
          "question": "the question text",
          "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
          "correct_answer": "A",
          "topic": "${topic}"
      }
      `;
    } else {
      prompt = `
      ${AGENT_DESCRIPTION}
      ${AGENT_INSTRUCTIONS}
      
      Question: ${question}
      Options: ${options}
      Correct answer: ${correct_answer}
      Student chose: ${user_answer}
      Student's reasoning: ${user_explanation}
      
      Was the student correct? Give them feedback on their reasoning specifically.
      
      Respond with this exact JSON structure:
      {
          "is_correct": true or false,
          "feedback": "personalized feedback addressing their specific reasoning",
          "explanation": "the full explanation of the correct answer",
          "encouragement": "a short motivating message"
      }
      `;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Exact parsing logic from your agent.py
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    res.status(200).json(JSON.parse(cleanJson));

  } catch (error) {
    console.error("API Error:", error);
    // Return the specific error to help us debug in the browser
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}