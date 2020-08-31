from selenium import webdriver
from bs4 import BeautifulSoup
import scrape
import json
import os
import time

ALL_COURSES = "https://www.handbook.unsw.edu.au/search?q=&ct=subject&study_level=ugrd"
WAIT = 0.5
LINKS = []

def get_next_page(browser, first):
    time.sleep(WAIT)
    next_page = browser.find_elements_by_xpath("//*[@aria-label='Go to next search result page']")

    if not next_page:
        return None

    return next_page[-1]

def get_links(browser):
    time.sleep(WAIT)
    html = BeautifulSoup(browser.page_source, "html.parser")

    course_tiles = html.find(id="advanced-search__suggestions").find_all("a", class_="m-advanced-search-result-link m-advanced-search-result-link")

    course_links = []
    for a in course_tiles:
        link = a["href"]
        course_links.append(scrape.HANDBOOK_URL + link)
        print(scrape.HANDBOOK_URL + link)

    return course_links

# Open browser
browser = webdriver.Chrome("./chromedriver") # NEED TO BE CHROME VERSION 85
browser.get(ALL_COURSES)

# Scrape page for links
LINKS = LINKS + get_links(browser)

# Keep clicking next page
button = get_next_page(browser, first=True)
while (button):
    button.click()

    # Scrape page for links
    LINKS = LINKS + get_links(browser)
    # Get next page
    button = get_next_page(browser, first=False)

# print("\n\n")
# for l in LINKS:
#     print(l)

with open("course_links.json", "w") as write_file:
        json.dump(LINKS, write_file)