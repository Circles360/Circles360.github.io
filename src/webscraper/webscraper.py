# Gets faculty links from Handbook home page

from bs4 import BeautifulSoup
import engineering
import requests
import scrape

########################################################################################################################
# OLD FILE - DO NOT USE
# NOT RELEVANT
########################################################################################################################

def get_faculties():
    homepage_html = scrape.get_html(scrape.HANDBOOK_URL)

    faculties_elem = homepage_html.find(id="tab_OrgUnits").find_all("a", class_="a-browse-tile")

    faculties = []
    for f in faculties_elem:
        link = f["href"]
        faculty = f.find("h3", class_="h4").text

        faculties.append({
            "faculty": faculty,
            "link": scrape.HANDBOOK_URL + link
        })

    return faculties

HANDBOOK_FACULTIES = get_faculties()