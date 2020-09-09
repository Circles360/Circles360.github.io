from bs4 import BeautifulSoup
import scrape
import json

SUBJECT_AREAS = {
    "code_to_subject": {},
    "subject_to_code": {}
}

html = scrape.get_html(scrape.HANDBOOK_URL)
subject_area_tiles = html.find(id="tab_educational_area").find_all("h3")

for tile in subject_area_tiles:
    code, subject = tile.text.split(": ")

    SUBJECT_AREAS["code_to_subject"][code] = subject
    SUBJECT_AREAS["subject_to_code"][subject] = code

scrape.write_to_file("subject_areas.json", SUBJECT_AREAS)