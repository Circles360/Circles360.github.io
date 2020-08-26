from bs4 import BeautifulSoup
import requests

HANDBOOK_URL = "https://www.handbook.unsw.edu.au"

def get_faculties():
    response = requests.get(HANDBOOK_URL)

    if not response.ok:
        print(f"ERROR get summoner_id: status code {response.status_code}")
        exit(1)

    home_page = BeautifulSoup(response.content, "html.parser")

    faculties_elem = home_page.find(id="tab_OrgUnits").find_all("a", class_="a-browse-tile")

    faculties = []
    for f in faculties_elem:
        link = f["href"]
        faculty = f.find("h3", class_="h4").text

        print(link, faculty)
        faculties.append({
            "faculty": faculty,
            "link": link
        })

    return faculties

HANDBOOK_FACULTIES = get_faculties()

print(HANDBOOK_FACULTIES)
