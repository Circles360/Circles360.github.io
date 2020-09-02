# Basic scrape functions

from bs4 import BeautifulSoup
import requests
import json

CHROME_DRIVER = "./drivers/chromedriver"
HANDBOOK_URL = "https://www.handbook.unsw.edu.au"


def get_html(url):
    response = requests.get(url)
    print(" >>> scraping", url)
    if not response.ok:
        print(f"ERROR get_html {url}: status code {response.status_code}")
        return None

    return BeautifulSoup(response.content, "html.parser")

def read_from_file(filename):
    with open(filename, "r", encoding="utf8") as read_file:
        return json.load(read_file)

def write_to_file(filename, data):
    with open(filename, "w") as write_file:
        json.dump(data, write_file)