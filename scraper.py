import requests

response = requests.get("https://www.handbook.unsw.edu.au")

if not response.ok:
    print(f"ERROR get summoner_id: status code {response.status_code}")
    exit(1)

print(response)

data = response.json()

print(data)