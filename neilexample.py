import re
from collections import defaultdict
import argparse
import io


inputString = ' Lets roll out to Santa Monica\n I have an idea lets eat bbq\n I think thats alright\n Let us send out a memo saying that I hate Django Web Framework\n David you will be assigned the task of typing'




ideaPattern = 'I have an idea'

ideaReply = 'I think'

ideasDict = defaultdict(float)

"""Demonstrates how to make a simple call to the Natural Language API."""

import argparse

from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
with open("api-key.json") as f:
        GOOGLE_CLOUD_SPEECH_CREDENTIALS = f.read()

def analyze(textReply):
    """Run a sentiment analysis request on text within a passed filename."""
    client = language.LanguageServiceClient()
    content = textReply
    document = types.Document(
        content=content,
        type=PLAIN_TEXT)
    annotations = client.analyze_sentiment(document=document)

    # Print the results
    print_result(annotations)


    # idea
ideaList = re.findall(r'I have an idea ([\w+\s]+)\n I', inputString)

# response
ideaResponseList = re.findall(r'I have an idea [\w+\s]+\n (I.+)', inputString)

print(ideaList)

# for reply in ideaResponseList:
#     analyze(reply)

memoPattern = 'Let us send out a memo saying'
memoList = re.findall(r'Let us send out a memo saying that ([\w+\s]+)\n', inputString) 
import smtplib 
def send_email(to, subject, msg):
    try:
        server = smtplib.SMTP('smtp.gmail.com:587')
        server.ehlo()
        server.starttls()
        server.login("sbhackstest123@gmail.com", "sbhackstest1234")
        message = 'Subject: {}\n\n{}'.format(subject, msg)
        server.sendmail("sbhackstest123@gmail.com", to, message)
        server.quit()
        print("Success: Email sent!")
    except:
        print("Email failed to send.")

subject = "Test subject"
msg = 'Memos: \n' 
memoList += ["my dick is huge"]
for i in memoList:
    msg += '- ' + i + '\n' 
print(msg)
send_email("ddinata@ucsd.edu" ,subject, msg)

taskPattern = 'you will be assigned the task of'


taskList = re.findall(r'[A-Z][a-z]+ you will be assigned the task of (.+)',inputString)

nameTask = re.findall(r'([A-Z][a-z]+) you will be assigned the task of .+',inputString)
print(taskList)
print(nameTask)

uberPattern = 'Lets roll out to'

uberDestination = re.findall(r'Lets roll out to [\w\s+]',inputString)