import requests, json

url = "https://s3-us-west-2.amazonaws.com/mhc.cdn.content/vaccineAvailability.json"
response = requests.get(url)
api_data = response.json()

# ----- paste the data from the api to 'data.json' ------
json_file = open('data.json','w')
json_file.write(json.dumps(api_data))
json_file.close()

# ----- grab content from 'data.json' and add 'historic_data': [[]; 145] to each store -----
json_file = open('data.json')
data = json.loads(json_file.read())
for store in data:
    store['historic_data'] = []
for store in data:
    temp = store['historic_data']
    for i in range(145):
        temp.append([])
    store['historic_data'] = temp
json_file.close()

# ----- rewrite 'data.json' -----
json_file = open('data.json', 'w')  # this wipes data.json. might need to restore
json_file.write(json.dumps(data))
json_file.close()

# ----- now 'data.json' is all set up -----