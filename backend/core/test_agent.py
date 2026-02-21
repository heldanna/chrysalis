from agent import generate_question, explain_answer

# Test 1: Question generation
print("--- Testing generate_question ---")
question = generate_question("budgeting", "beginner")
print(question)
print()

# Test 2: Explanation
print("--- Testing explain_answer ---")
feedback = explain_answer(
    question=question["question"],
    options=question["options"],
    user_answer="A",
    correct_answer=question["correct_answer"],
    user_explanation="I chose A because I think spending less than you earn is the main point of budgeting"
)
print(feedback)