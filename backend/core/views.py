from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .agent import generate_question, explain_answer
from .models import UserProgress
from .topics import TOPICS, QUESTIONS_PER_TOPIC, PASSING_SCORE, get_difficulty_for_question
from .utils import is_topic_unlocked

@api_view(['POST'])
def get_question(request):
    topic = request.data.get('topic')
    session_id = request.data.get('session_id')

    if not topic or not session_id:
        return Response({'error': 'topic and session_id are required'}, status=400)

    if not is_topic_unlocked(session_id, topic):
        return Response({'error': 'Topic is locked'}, status=403)

    progress, _ = UserProgress.objects.get_or_create(session_id=session_id, topic=topic)
    difficulty = get_difficulty_for_question(progress.questions_answered)

    result = generate_question(topic, difficulty)
    result['difficulty'] = difficulty  
    return Response(result)


@api_view(['POST'])
def get_explanation(request):
    data = request.data
    required = ['question', 'options', 'user_answer', 'correct_answer', 'user_explanation', 'session_id', 'topic']

    if not all(k in data for k in required):
        return Response({'error': 'Missing fields'}, status=400)

    progress, _ = UserProgress.objects.get_or_create(
        session_id=data['session_id'],
        topic=data['topic']
    )

    result = explain_answer(
        data['question'],
        data['options'],
        data['user_answer'],
        data['correct_answer'],
        data['user_explanation']
    )

    progress.questions_answered += 1
    if result.get('is_correct'):
        progress.questions_correct += 1

    if (progress.questions_answered >= QUESTIONS_PER_TOPIC
            and progress.questions_correct >= PASSING_SCORE
            and not progress.completed):
        progress.completed = True
        result['level_complete'] = True
    else:
        result['level_complete'] = False

    result['questions_answered'] = progress.questions_answered
    result['questions_correct'] = progress.questions_correct
    result['questions_total'] = QUESTIONS_PER_TOPIC

    progress.save()
    return Response(result)


@api_view(['GET'])
def get_topics(request):
    session_id = request.query_params.get('session_id')
    if not session_id:
        return Response({'error': 'session_id required'}, status=400)

    topics_state = []
    for topic_key, topic_data in TOPICS.items():
        progress = UserProgress.objects.filter(session_id=session_id, topic=topic_key).first()
        topics_state.append({
            'topic': topic_key,
            'display_name': topic_data['display_name'],
            'order': topic_data['order'],
            'unlocked': is_topic_unlocked(session_id, topic_key),
            'completed': progress.completed if progress else False,
            'questions_answered': progress.questions_answered if progress else 0,
            'questions_correct': progress.questions_correct if progress else 0,
            'questions_total': QUESTIONS_PER_TOPIC,
        })

    return Response(topics_state)
