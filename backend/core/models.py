from django.db import models

class UserProgress(models.Model):
    session_id = models.CharField(max_length=100)
    topic = models.CharField(max_length=50)
    questions_answered = models.IntegerField(default=0)
    questions_correct = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('session_id', 'topic')