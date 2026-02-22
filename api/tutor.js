import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// EXACT INSTRUCTIONS FROM YOUR AGENT.PY
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

const model = genAI.getGenerativeModel({ 
  model: "models/gemini-1.5-flash",
  systemInstruction: `${AGENT_DESCRIPTION}\n\n${AGENT_INSTRUCTIONS}`
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { action, topic, difficulty, question, options, user_answer, correct_answer, user_explanation } = req.body;

  try {
    let prompt = "";
    
    if (action === "generate") {
      prompt = `Generate a financial literacy multiple choice question about: ${topic}. Difficulty: ${difficulty || 'beginner'}. 
                Respond with ONLY this exact JSON structure: { "question": "text", "options": ["A) ", "B) ", "C) ", "D) "], "correct_answer": "A", "topic": "${topic}" }`;
    } else {
      prompt = `Question: ${question}\nOptions: ${options}\nCorrect answer: ${correct_answer}\nStudent chose: ${user_answer}\nStudent's reasoning: ${user_explanation}\n
                Was the student correct? Give them feedback on their reasoning specifically. 
                Respond with this exact JSON structure: { "is_correct": true/false, "feedback": "", "explanation": "", "encouragement": "" }`;
    }

    const result = await model.generateContent(prompt);
    // Remove markdown code blocks if the AI accidentally includes them
    const cleanJson = result.response.text().replace(/```json|```/g, "").trim();
    res.status(200).json(JSON.parse(cleanJson));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}