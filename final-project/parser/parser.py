# note: running 'parser.py' more than once will duplicate last entry and require rerunning 'settup.py' to reset 'data.json' 

import requests, json
from datetime import datetime

# ----- get the time and map to correct index (out of 145) -----
now = datetime.now()
current_time = now.strftime('%H:%M')
print('current time = ', current_time)
hours = int(current_time[0:2])
minutes = int(current_time[3])
index = (hours * 6) + minutes
print(index)

# ----- pull the api data -----
url = "https://s3-us-west-2.amazonaws.com/mhc.cdn.content/vaccineAvailability.json"
response = requests.get(url)
api_data = response.json()

# ----- record availabiltiy data for all stores in corresponding historic_data time index -----
json_file = open('data.json')
local_data = json.loads(json_file.read())
for i in range(len(api_data)):
    if api_data[i]['availability'] == 'yes':
        local_data[i]['historic_data'][index].append(1)
    else:   # availability == 'no'
        local_data[i]['historic_data'][index].append(0)
json_file.close()

# # ----- write updated data to test file -----
# json_file = open('test.json', 'w')
# json_file.write(json.dumps(local_data))
# json_file.close()

# ----- write updated data to 'data.json' -----
json_file = open('data.json', 'w')
json_file.write(json.dumps(local_data))
json_file.close()
