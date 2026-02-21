from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .agent import generate_question, explain_answer

@api_view(['POST'])
def get_question(request):
    topic = request.data.get('topic')
    difficulty = request.data.get('difficulty', 'beginner')

    if not topic:
        return Response({'error': 'topic is required'}, status=status.HTTP_400_BAD_REQUEST)

    result = generate_question(topic, difficulty)
    return Response(result)


@api_view(['POST'])
def get_explanation(request):
    data = request.data
    required = ['question', 'options', 'user_answer', 'correct_answer', 'user_explanation']
    
    if not all(k in data for k in required):
        return Response({'error': 'Missing fields'}, status=status.HTTP_400_BAD_REQUEST)

    result = explain_answer(
        data['question'],
        data['options'],
        data['user_answer'],
        data['correct_answer'],
        data['user_explanation']
    )
    return Response(result)