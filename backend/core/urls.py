from django.urls import path
from . import views

urlpatterns = [
    path('question/', views.get_question),
    path('explain/', views.get_explanation),
]