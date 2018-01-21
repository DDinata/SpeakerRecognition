import re
from collections import defaultdict
import argparse
import io
import smtplib

import argparse

from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from googleapiclient import discovery
import httplib2
from oauth2client.client import GoogleCredentials

import requests
import json 
import urllib
from uber_rides.session import Session
from uber_rides.client import UberRidesClient

inputString = '\nI have an idea lets eat bbq\n I think thats alright\n Let us send out a memo saying that I hate Django Web Framework\n David you will be assigned the task of typing'

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

def ideas(inputString):
	http = httplib2.Http()

	credentials = GoogleCredentials.get_application_default().create_scoped(
	    ['https://www.googleapis.com/auth/cloud-platform'])

	http=httplib2.Http()
	credentials.authorize(http)

	DISCOVERY_URL = ('https://{api}.googleapis.com/'
	                '$discovery/rest?version={apiVersion}')


	service = discovery.build('language', 'v1beta1',
	                          http=http, discoveryServiceUrl=DISCOVERY_URL)
	ideaPattern = 'I have an idea'

	ideaReply = 'I think'

	ideasDict = defaultdict(float)

	# idea
	ideaList = re.findall(r'I have an idea ([\w+\s]+)\n I', inputString)

	# response
	responseList = re.findall(r'I have an idea [\w+\s]+\n (I.+)', inputString)

	for x,y in zip(ideaList,responseList):
		# analyze y
		service_request = service.documents().analyzeSentiment(
		  body={
		    'document': {
		       'type': 'PLAIN_TEXT',
		       'content': y
		    }
		  })

		response = service_request.execute()
		polarity = response['documentSentiment']['polarity']
		magnitude = response['documentSentiment']['magnitude']
		ideasDict[x] = polarity*magnitude
	return ideasDict


def sendMemo(inputString):
	memoPattern = 'Let us send out a memo saying'
	memoList = re.findall(r'Let us send out a memo saying that ([\w+\s]+)\n', inputString) 

	subject = "Test subject"
	msg = 'Memos: \n' 
	for i in memoList:
	    msg += '- ' + i + '\n' 
	print(msg)
	send_email("sbhackstest123@gmail.com" ,subject, msg)


def uberSearch(inputString):
	uberPattern = 'Lets roll out to'

	uberDestination = re.findall(r'Lets roll out to [\w\s+]',inputString)

	headers = {
	    'Accept': 'application/json',
	    'server_token': 'DA36VIywvzdAcUd7f9RhRA-JZp3R8H8dRbzA68YN',
	    'Client Secret': 'jdW4INDoXyd2-DXZUJueZhuoLEPeY3p0oxzlFqxg',
	    'Access Token': 'KA.eyJ2ZXJzaW9uIjoyLCJpZCI6Ik5jZDB0VVVEVFZtZ2IvY0xsWkt3U0E9PSIsImV4cGlyZXNfYXQiOjE1MTkxMDM4ODYsInBpcGVsaW5lX2tleV9pZCI6Ik1RPT0iLCJwaXBlbGluZV9pZCI6MX0.NpfNmxCfqBbtzOav7ofBa-IgT_DPbJK-svPxOePgNis'

	}
	# myBaseAPI = 'https://api.spotify.com/v1/search?'
	# url = myBaseAPI + urllib.urlencode({"q" : query, "type" : 'track'})	

	# r = requests.get(url, headers=headers)

	# json = r.json()

	# trackData = json['tracks']['items'][0]
	# # trackData = json['tracks']['items'][0]['uri']
	# return trackData



	session = Session(server_token='DA36VIywvzdAcUd7f9RhRA-JZp3R8H8dRbzA68YN')
	client = UberRidesClient(session)

	response = client.get_products(37.77, -122.41)
	products = response.json.get('products')


	response = client.get_price_estimates(
	start_latitude=37.770,
	start_longitude=-122.411,
	end_latitude=37.791,
	end_longitude=-122.405,
	seat_count=2
	)



	# json = r.json()

	estimate = response.json.get('prices')
	return estimate


