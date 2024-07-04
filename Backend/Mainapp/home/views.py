

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from googletrans import Translator
from collections import defaultdict
from .models import Speech
from .serializers import SpeechSerializer,OutputSerializer,UniquePhraseSerializer, MostFrequentWordSerializer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter
import numpy as np
from nltk.util import ngrams
from collections import Counter
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import re
translator = Translator()
stop_words = set(stopwords.words('english'))
# def get_top_3_unique_phrases(speech_texts):
#     combined_text = ' '.join(speech['speech_text'] for speech in speech_texts)
#     words = combined_text.lower().split()
#     word_occurrences = Counter(words)
#     min_frequency = min(word_occurrences.values())
#     unique_words_with_min_freq = [word for word, count in word_occurrences.items() if count == min_frequency]
#     print(unique_words_with_min_freq[:3])
#     return unique_words_with_min_freq[:3]
from collections import Counter

def get_top_3_unique_phrases(input_text):
    words = re.findall(r'\b\w+\b', input_text.lower())  # Extract words using regex
    word_counts = Counter(words)

    # Find words with the minimum frequency (likely unique phrases)
    min_frequency = min(word_counts.values(), default=0)
    unique_words = [word for word, count in word_counts.items() if count == min_frequency]

    # Select the top 3 unique phrases (handle potential edge cases)
    return unique_words[:3] if len(unique_words) >= 3 else []


# def get_most_frequent_word(speech_texts):
#     combined_text = ' '.join(speech['speech_text'] for speech in speech_texts)
#     words = combined_text.lower().split()
#     word_counts = Counter(words)
#     most_frequent_word = max(word_counts, key=word_counts.get)
#     print(most_frequent_word)
#     return most_frequent_word

def get_most_frequent_word(input_text):
    words = re.findall(r'\b\w+\b', input_text.lower())  # Extract words using regex
    if not words:
        return ''  # Handle empty input

    word_counts = Counter(words)
    most_frequent_word = word_counts.most_common(1)[0][0]  # Get top word directly

    return most_frequent_word


@api_view(['POST'])
def save_speech(request):
    try:
        
        serializer = SpeechSerializer(data=request.data)
        
        if serializer.is_valid():
            print("jjfjfjf")
            # Save the Speech object
            speech = serializer.save()

            print(speech.speech_text)

            # Calculate most frequent word
            mostFrequentWord = get_most_frequent_word(speech.speech_text)
            # mostFrequentWord="jdjjdd"
            
            # Identify top phrases
            top_phrases = get_top_3_unique_phrases(speech.speech_text)
            # top_phrases ="lkkkk"
            
            # Update the speech object with calculated values
            speech.unique_phrase = ', '.join(top_phrases)
            speech.mostFrequentWord = mostFrequentWord
            
            # Save the updated speech object
            speech.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_speeches(request):
    try:
        speeches = Speech.objects.all()
        serializer = SpeechSerializer(speeches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['DELETE'])
def delete_speech(request, speech_id):
    try:
        speech = Speech.objects.get(id=speech_id)
        speech.delete()
        return Response({'message': 'Speech deleted successfully'}, status=status.HTTP_200_OK)
    except Speech.DoesNotExist:
        return Response({'error': 'Speech not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def unique_phrase(request, speech_id):
    try:
        speech = Speech.objects.get(id=speech_id)
        serializer = UniquePhraseSerializer(speech)
        return Response(serializer.data)
    except Speech.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def mostFrequentWord(request, speech_id):
    try:
        speech = Speech.objects.get(id=speech_id)
        serializer = MostFrequentWordSerializer(speech)
        return Response(serializer.data)
    except Speech.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
