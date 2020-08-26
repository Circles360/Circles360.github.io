from bs4 import BeautifulSoup
import requests

response = requests.get("https://www.handbook.unsw.edu.au")

if not response.ok:
    print(f"ERROR get summoner_id: status code {response.status_code}")
    exit(1)

home_page = BeautifulSoup(response.content, "html.parser")

faculties = home_page.find(id="tab_OrgUnits").find_all("a", class_="a-browse-tile")

for f in faculties:
    link = f["href"]
    faculty = f.find("h3", class_="h4").text

    print(link, faculty)
