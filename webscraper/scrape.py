# Basic scrape functions

from bs4 import BeautifulSoup
import requests

HANDBOOK_URL = "https://www.handbook.unsw.edu.au"

def get_html(url):
    response = requests.get(url)
    print(" >>> scraping", url)
    if not response.ok:
        print(f"ERROR get_html {url}: status code {response.status_code}")
        return None

    return BeautifulSoup(response.content, "html.parser")