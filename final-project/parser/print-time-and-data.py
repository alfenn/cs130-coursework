# For debugging to make sure parser updates 'data.json' correctly
import json

json_data = json.loads(open('parser/data.json').read())
print(type(json_data))
historic_data = json_data[len(json_data) - 1]['historic_data']
for i in range(len(historic_data)):     # for the last store in json_data
    print(f'{i // 6}:{i % 6}0 => {historic_data[i]}')