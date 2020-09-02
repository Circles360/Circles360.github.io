from selenium import webdriver
from bs4 import BeautifulSoup
import scrape
import json
import time

SEARCH_LINK = "https://www.handbook.unsw.edu.au/search"
WAIT = 2
LINKS = []

def get_next_page(browser):
    time.sleep(WAIT)
    next_page_button = browser.find_elements_by_xpath("//*[@id='pagination-page-next']")[0]
    return next_page_button if next_page_button.is_enabled() else None

def get_links(browser):
    time.sleep(WAIT)
    html = BeautifulSoup(browser.page_source, "html.parser")

    course_tiles = html.find(id="search-results").find_all("a")

    course_links = []
    for a in course_tiles:
        link = a["href"]
        course_links.append(scrape.HANDBOOK_URL + link)
        print(scrape.HANDBOOK_URL + link)

    return course_links

# Open browser
browser = webdriver.Chrome(scrape.CHROME_DRIVER) # NEED TO BE CHROME VERSION 85
browser.get(SEARCH_LINK)

# Show all courses
show_course = browser.find_elements_by_xpath("//*[@id='react-tabs-6']")[0]
show_course.click()

# Scrape page for links
LINKS = LINKS + get_links(browser)

# Keep clicking next page
next_page_button = get_next_page(browser)
while (next_page_button):
    browser.execute_script("arguments[0].click();", next_page_button)

    # Scrape page for links
    LINKS.extend(get_links(browser))
    # Get next page
    next_page_button = get_next_page(browser)

with open("course_links.json", "w") as write_file:
        json.dump(LINKS, write_file)