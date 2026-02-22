
TOPICS = {
    "budgeting": {
        "display_name": "Budgeting Basics",
        "order": 1,  
        "levels": ["beginner", "intermediate", "advanced"],
        "unlock_requires": None  
    },
    "saving": {
        "display_name": "Saving Strategies",
        "order": 2,
        "levels": ["beginner", "intermediate", "advanced"],
        "unlock_requires": "budgeting"  
    },
    "credit": {
        "display_name": "Understanding Credit",
        "order": 3,
        "levels": ["beginner", "intermediate", "advanced"],
        "unlock_requires": "saving"
    },
    "investing": {
        "display_name": "Investing Fundamentals",
        "order": 4,
        "levels": ["beginner", "intermediate", "advanced"],
        "unlock_requires": "credit"
    },
    "taxes": {
        "display_name": "Taxes",
        "order": 5,
        "levels": ["beginner", "intermediate", "advanced"],
        "unlock_requires": "investing"
    },
}

QUESTIONS_PER_TOPIC = 6
PASSING_SCORE = 3

def get_difficulty_for_question(questions_answered: int) -> str:
    if questions_answered < 2:
        return "beginner"
    elif questions_answered < 4:
        return "intermediate"
    else:
        return "advanced"