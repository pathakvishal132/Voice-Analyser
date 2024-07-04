from home.views import save_speech, get_speeches, delete_speech, unique_phrase, mostFrequentWord
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('save_speech/', save_speech),  # POST request to save a speech
    path('get_speeches/', get_speeches), # GET request to retrieve all speeches
    path('delete_speech/<int:speech_id>/', delete_speech),  # DELETE request with speech ID
    path('unique_phrase/<int:speech_id>/',unique_phrase),
    path('mostFrequentWord/<int:speech_id>/',mostFrequentWord)
]