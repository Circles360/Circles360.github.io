from selenium import webdriver
from bs4 import BeautifulSoup
import scrape
import json
import time
import re


# THIS FILE TO GO THROUGH ALL IRRELEVANT COURSES:
# DVC (ACADEMIC) BOARD OF STUDIES
# UNSW CANBERRA AT ADFA
# UNSW GLOBAL

REGEX_COURSE_CODE = "[A-Z]{4}\d{4}"

DVC_LINK = "https://www.handbook.unsw.edu.au/browse/By%20Faculty/DVCAcademicBoardofStudies"
CANBERRA_LINK = "https://www.handbook.unsw.edu.au/browse/By%20Faculty/UNSWCanberraatADFA"
GLOBAL_LINK = "https://www.handbook.unsw.edu.au/browse/By%20Faculty/UNSWGlobal"

CO_OP_SEARCH_LINK = "https://www.handbook.unsw.edu.au/search?q=co-op"
PLACEMENT_SEARCH_LINK = "https://www.handbook.unsw.edu.au/search?q=placement"

WAIT = 2

def get_next_page(browser):
    # -1 index because we want the "next page" button at the bottom of the web page
    next_page_button = browser.find_elements_by_xpath("//*[@id='pagination-page-next']")[-1]
    return next_page_button if next_page_button.is_enabled() else None

def read_page(browser):
    html = BeautifulSoup(browser.page_source, "html.parser")
    course_codes = re.findall(REGEX_COURSE_CODE, html.get_text())
    print(course_codes)
    return course_codes

def get_course_codes(browser, link, wait):
    codes = []
    browser.get(link)
    time.sleep(2)

    codes.extend(read_page(browser))

    next_page_button = get_next_page(browser)
    while (next_page_button):
        browser.execute_script("arguments[0].click();", next_page_button)
        time.sleep(wait)

        codes.extend(read_page(browser))
        next_page_button = get_next_page(browser)

    print("")
    return codes

def filter_course_links(filter_array):
    course_links = scrape.read_from_file("links_courses.json")
    filtered_links = []

    for link in course_links:
        code = re.search(REGEX_COURSE_CODE, link).group(0)
        if code in filter_array:
            print(code)
        else:
            filtered_links.append(link)

    scrape.write_to_file("links_courses.json", filtered_links)

def get_filter_course_codes():
    browser = webdriver.Chrome(scrape.CHROME_DRIVER) # NEED TO BE CHROME VERSION 85

    DVC_COURSE_CODES = get_course_codes(browser, DVC_LINK, 0.5)
    CANBERRA_COURSE_CODES = get_course_codes(browser, CANBERRA_LINK, 0.5)
    GLOBAL_COURSE_CODES = get_course_codes(browser, GLOBAL_LINK, 0.5)

    CO_OP_COURSE_CODES = get_course_codes(browser, CO_OP_SEARCH_LINK, 2)
    PLACEMENT_COURSE_CODES = get_course_codes(browser, PLACEMENT_SEARCH_LINK, 2)

    browser.quit()

    return list(set().union(DVC_COURSE_CODES, CANBERRA_COURSE_CODES, GLOBAL_COURSE_CODES, CO_OP_COURSE_CODES, PLACEMENT_COURSE_CODES))

# FILTER_COURSE_CODES = get_filter_course_codes()
# scrape.write_to_file("filter_course_codes.json", FILTER_COURSE_CODES)

FILTER_COURSE_CODES = scrape.read_from_file("filter_course_codes.json")
filter_course_links(FILTER_COURSE_CODES)
