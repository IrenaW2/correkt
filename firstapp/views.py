from django.shortcuts import render
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
from django.template import loader
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
import re, string
import emoji
import nltk
import pickle
from nltk.stem import WordNetLemmatizer,PorterStemmer
from nltk.corpus import stopwords
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')
stop_words = set(stopwords.words('english'))
from django.conf import settings
import os
import json
import random
from enum import Enum
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response

class types(Enum):
    Religion = 1
    Age = 2
    Gender = 3
    Ethnicity = 4
    Not_Cyberbullying = 5

# Create your views here.

def home(request):
    return render(request, 'firstapp/home.html')

def second(request):
    return render(request, 'firstapp/second.html')
    



@api_view(['POST'])
def data(request): 
    misinfo = False
    num = random.randint(1,10)
    if(num < 6):
        misinfo = True
    data = {
        'misinfo': misinfo,
        'tweet': request.query_params['tweet']
    }
    return JsonResponse(data, safe=False, status=status.HTTP_200_OK)
    return JsonResponse(data, safe=False, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_data(request):
    return HttpResponse("hi")

@api_view(['GET'])
def results(request):
    input = request.GET['input']
    print(input)
    # texts_cleaned = []
    # for t in df.text:
    input = preprocess(input)
    input=[input]

    # df['text_clean'] = texts_cleaned

    # df["text_clean"].duplicated().sum()

    # df.drop_duplicates("text_clean", inplace=True)

    # text_len = []
    # for text in df.text_clean:
    #     tweet_len = len(text.split())
    #     text_len.append(tweet_len)

    # df['text_len'] = text_len

    # df = df[df['text_len'] > 3]
    # df = df[df['text_len'] < 100]

    from sklearn.feature_extraction.text import CountVectorizer
    from sklearn.feature_extraction.text import TfidfTransformer
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.pipeline import Pipeline

    models_folder = settings.BASE_DIR / 'models'
    file_path = os.path.join(models_folder, os.path.basename('Vectorizer.sav'))
    vectorizer = pickle.load(open(file_path,'rb'))
    file_path = os.path.join(models_folder, os.path.basename('Transformer.sav'))
    transformer = pickle.load(open(file_path,'rb'))

    ## model = torch.load("transformer_cyberbullying_model")
    ## b = torch.IntTensor(tokenizer([input], truncation = True)['attention_mask'])
    ## a = torch.IntTensor(tokenizer([input], truncation = True)['input_ids'])
    ## outputs = model(a, b)
    ## _, predictions = torch.max(outputs, 1)
    ## result = np.array(predictions).tolist()[0]
    ##if result == 1:
    ##    return HttpResponse("Religion")
    ##elif result == 2:
    ##   return HttpResponse("Age")
    ##elif result == 3:
    ##    return HttpResponse("Gender")
    ##elif result == 4:
    ##    return HttpResponse("Ethnicity")
    ##else: 
    ##    return HttpResponse("Not Cyberbullying")

    # tfidf = TfidfTransformer()
    # clf = CountVectorizer()

    print(input)
    X_cv =  input
    X_cv = vectorizer.transform(input)
    X_tf = transformer.transform(X_cv)

    file_path = os.path.join(models_folder, os.path.basename('RFCBModel 2.sav'))
    myModel = pickle.load(open(file_path, 'rb'))

    result = myModel.predict(X_tf)
    if result == 1:
        return HttpResponse("Religion")
    elif result == 2:
        return HttpResponse("Age")
    elif result == 3:
        return HttpResponse("Gender")
    elif result == 4:
        return HttpResponse("Ethnicity")
    else: 
        return HttpResponse("Not Cyberbullying")
    


# #Clean emojis from text
def strip_emoji(text):
    return emoji.demojize(text) #remove emoji

#Remove punctuations, links, stopwords, mentions and \r\n new line characters
def strip_all_entities(text): 
    text = text.replace('\r', '').replace('\n', ' ').lower() #remove \n and \r and lowercase
    text = re.sub(r"(?:\@|https?\://)\S+", "", text) #remove links and mentions
    text = re.sub(r'[^\x00-\x7f]',r'', text) #remove non utf8/ascii characters such as '\x9a\x91\x97\x9a\x97'
    banned_list= string.punctuation
    table = str.maketrans('', '', banned_list)
    text = text.translate(table)
    text = [word for word in text.split() if word not in stop_words]
    text = ' '.join(text)
    text =' '.join(word for word in text.split() if len(word) < 14) # remove words longer than 14 characters
    return text

#remove contractions
def decontract(text):
    text = re.sub(r"can\'t", "can not", text)
    text = re.sub(r"n\'t", " not", text)
    text = re.sub(r"\'re", " are", text)
    text = re.sub(r"\'s", " is", text)
    text = re.sub(r"\'d", " would", text)
    text = re.sub(r"\'ll", " will", text)
    text = re.sub(r"\'t", " not", text)
    text = re.sub(r"\'ve", " have", text)
    text = re.sub(r"\'m", " am", text)
    return text

#clean hashtags at the end of the sentence, and keep those in the middle of the sentence by removing just the "#" symbol
def clean_hashtags(tweet):
    new_tweet = " ".join(word.strip() for word in re.split('#(?!(?:hashtag)\b)[\w-]+(?=(?:\s+#[\w-]+)*\s*$)', tweet)) #remove last hashtags
    new_tweet2 = " ".join(word.strip() for word in re.split('#|_', new_tweet)) #remove hashtags symbol from words in the middle of the sentence
    return new_tweet2

#Filter special characters such as "&" and "$" present in some words
def filter_chars(a):
    sent = []
    for word in a.split(' '):
        if ('$' in word) | ('&' in word):
            sent.append('')
        else:
            sent.append(word)
    return ' '.join(sent)

#Remove multiple sequential spaces
def remove_mult_spaces(text):
    return re.sub("\s\s+" , " ", text)

#Stemming
def stemmer(text):
    tokenized = nltk.word_tokenize(text)
    ps = PorterStemmer()
    return ' '.join([ps.stem(words) for words in tokenized])

#Lemmatization 
def lemmatize(text):
    tokenized = nltk.word_tokenize(text)
    lm = WordNetLemmatizer()
    return ' '.join([lm.lemmatize(words) for words in tokenized])

#Then we apply all the defined functions in the following order
def preprocess(text):
    text = strip_emoji(text)
    text = decontract(text)
    text = strip_all_entities(text)
    text = clean_hashtags(text)
    text = filter_chars(text)
    text = remove_mult_spaces(text)
    text = stemmer(text)
    return text


# def home(request):
#     context = {'data': [1,1,1,1,1]}
#     return render(request, 'firstapp/home.html', context)