from .models import UserProgress
from .topics import TOPICS

def is_topic_unlocked(session_id, topic):
    prerequisite = TOPICS[topic]["unlock_requires"]
    if prerequisite is None:
        return True
    return UserProgress.objects.filter(
        session_id=session_id, topic=prerequisite, completed=True
    ).exists()