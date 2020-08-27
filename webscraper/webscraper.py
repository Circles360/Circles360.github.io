from bs4 import BeautifulSoup
import engineering
import requests

HANDBOOK_URL = "https://www.handbook.unsw.edu.au"

def get_html(url):
    response = requests.get(url)
    if not response.ok:
        print(f"ERROR get_html: status code {response.status_code}")
        exit(1)

    return BeautifulSoup(response.content, "html.parser")

def get_faculties():
    homepage_html = get_html(HANDBOOK_URL)

    faculties_elem = homepage_html.find(id="tab_OrgUnits").find_all("a", class_="a-browse-tile")

    faculties = []
    for f in faculties_elem:
        link = f["href"]
        faculty = f.find("h3", class_="h4").text

        faculties.append({
            "faculty": faculty,
            "link": HANDBOOK_URL + link
        })

    return faculties

HANDBOOK_FACULTIES = get_faculties()