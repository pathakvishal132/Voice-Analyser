# serializers.py

from rest_framework import serializers
from .models import Speech

class SpeechSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speech
        fields = ('id', 'speech_text', 'language')  
class OutputSerializer(serializers.ModelSerializer):
    class Meta:
        model=Speech
        fields=('id', 'unique_phrase', 'mostFrequentWord')  
class UniquePhraseSerializer(serializers.Serializer):
    unique_phrase = serializers.CharField(max_length=200)

class MostFrequentWordSerializer(serializers.Serializer):
    mostFrequentWord = serializers.CharField(max_length=200)