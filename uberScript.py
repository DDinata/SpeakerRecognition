import requests
import json 
import urllib
from uber_rides.session import Session
from uber_rides.client import UberRidesClient
def uberSearch():
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
	print estimate

uberSearch()


def orderUber():
	headers = {
	    'Accept': 'application/json',
	    'server_token': 'DA36VIywvzdAcUd7f9RhRA-JZp3R8H8dRbzA68YN',
	    'Client Secret': 'jdW4INDoXyd2-DXZUJueZhuoLEPeY3p0oxzlFqxg',
	    'Authorization': 'Bearer KA.eyJ2ZXJzaW9uIjoyLCJpZCI6Im9oOTcvMENxUlFpUmZhMlVqbHlNSGc9PSIsImV4cGlyZXNfYXQiOjE1MTkxMDY1ODcsInBpcGVsaW5lX2tleV9pZCI6Ik1RPT0iLCJwaXBlbGluZV9pZCI6MX0.vj7eUx5AjKrYZnYOpari2uUBsnL2zt9VJIz0l-hauxg'

	}	
	# Get products for a location
	session = Session(server_token='DA36VIywvzdAcUd7f9RhRA-JZp3R8H8dRbzA68YN')
	client = UberRidesClient(session,sandbox_mode=True)
	url = 'https://sandbox-api.uber.com/<version>'	

	# r = requests.get(url, headers=headers)
	print 'here'
	response = client.get_products(37.77, -122.41)
	products = response.json.get('products')
	print 'here'
	product_id = products[0].get('product_id')
	print 'here'
	# Get upfront fare and start/end locations
	estimate = client.estimate_ride(
	    product_id=product_id,
	    start_latitude=37.77,
	    start_longitude=-122.41,
	    end_latitude=10.79,
	    end_longitude=-122.41,
	    seat_count=1
	)
	fare = estimate.json.get('fare')

	# # Request a ride with upfront fare and start/end locations
	# response = client.request_ride(
	#     product_id=product_id,
	#     start_latitude=37.77,
	#     start_longitude=-122.41,
	#     end_latitude=37.79,
	#     end_longitude=-122.41,
	#     seat_count=2,
	#     fare_id=fare['fare_id']
	# )

	# request = response.json
	# request_id = request.get('request_id')

	# # Request ride details using `request_id`
	# response = client.get_ride_details(request_id)
	# ride = response.json

	# # Cancel a ride
	# response = client.cancel_ride(request_id)
	# ride = response.json

# orderUber()