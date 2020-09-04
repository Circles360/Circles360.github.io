from selenium import webdriver
from bs4 import BeautifulSoup
import scrape
import time
import re

FACULTY_OF_ASS = "https://www.handbook.unsw.edu.au/browse/By%20Faculty/FacultyofArtsandSocialSciences"
FACULTY_OF_BE = "https://www.handbook.unsw.edu.au/browse/By%20Faculty/FacultyofBuiltEnvironment"
FACULTY_OF_AD = "https://www.handbook.unsw.edu.au/browse/By%20Faculty/FacultyofArt&Design"
FACULTY_OF_ENGINEERING = "https://www.handbook.unsw.edu.au/browse/By%20Faculty/FacultyofEngineering"
FACULTY_OF_LAW = "https://www.handbook.unsw.edu.au/browse/By%20Faculty/FacultyofLaw"
FACULTY_OF_MEDICINE = "https://www.handbook.unsw.edu.au/browse/By%20Faculty/FacultyofMedicine"
FACULTY_OF_SCIENCE = "https://www.handbook.unsw.edu.au/browse/By%20Faculty/FacultyofScience"
UNSW_BUSINESS_SCHOOL = "https://www.handbook.unsw.edu.au/browse/By%20Faculty/UNSWBusinessSchool"

WAIT = 2
LINKS = {}

def check_paginate(browser, section):
    html = BeautifulSoup(browser.page_source, "html.parser")
    try:
        return True if html.find("div", {"data-menu-title": section}).find_all(id="pagination-page-next") else False
    except:
        return False

def get_all_paginate(browser):
    return [s for s in ["Programs", "Double Degrees", "Specialisations", "Courses"] if check_paginate(browser, s)]

def paginate(browser, section):
    paginate_button_locations = get_all_paginate(browser)

    if section == "Major" or section == "Minor" or section == "Honours":
        section = "Specialisations"

    try:
        idx = paginate_button_locations.index(section)
    except:
        return None

    time.sleep(WAIT)
    next_page_button = browser.find_elements_by_xpath("//*[@id='pagination-page-next']")[idx]
    return next_page_button if next_page_button.is_enabled() else None

def convert_to_html_id(section):
    if section == "Programs":
        return "courseProgram-Programs"

    if section == "Double Degrees":
        return "courseDouble-Double Degrees"

    if section == "Major" or section == "Minor" or section == "Honours":
        return "aos-Specialisations"

    if section == "Courses":
        return "subject-Courses"

def get_section_links(html, section):
    html_id = convert_to_html_id(section)

    section_tiles = html.find(id=html_id).find_parent("div").find_next_sibling("nav").find_all("a")
    return [scrape.HANDBOOK_URL + tile["href"] for tile in section_tiles if "/search" not in tile["href"]]

def get_filter_button(browser, section):
    idx = ["", "Major", "Minor", "Honours"].index(section)

    try:
        filter_button = browser.find_elements_by_xpath(f"//*[@id='react-tabs-1']/div[3]/div/nav/button[{idx}]")[0]
    except:
        return None

    # Check if button is enabled
    return filter_button if filter_button.is_enabled() else None

@scrape.return_null_on_failure
def get_section(browser, section):
    links = []
    if section == "Major" or section == "Minor" or section == "Honours":
        filter_button = get_filter_button(browser, section)
        if not filter_button:
            return None

        browser.execute_script("arguments[0].click();", filter_button)
        time.sleep(WAIT)

    html = BeautifulSoup(browser.page_source, "html.parser")
    links.extend(get_section_links(html, section))

    next_page_button = paginate(browser, section)
    while (next_page_button):
        browser.execute_script("arguments[0].click();", next_page_button)
        time.sleep(WAIT)

        html = BeautifulSoup(browser.page_source, "html.parser")
        links.extend(get_section_links(html, section))
        next_page_button = paginate(browser, section)

    print(section, links)
    return links

def get_faculty_degrees(browser, link):
    browser.get(link)
    time.sleep(WAIT)

    print("\n", link.split("/")[-1])

    return {
        "programs": get_section(browser, "Programs"),
        "double_degrees": get_section(browser, "Double Degrees"),
        "majors": get_section(browser, "Major"),
        "minors": get_section(browser, "Minor"),
        "honours": get_section(browser, "Honours"),
    }


# Open browser
browser = webdriver.Chrome(scrape.CHROME_DRIVER) # NEED TO BE CHROME VERSION 85

LINKS["ASS"] = get_faculty_degrees(browser, FACULTY_OF_ASS)
LINKS["BE"] = get_faculty_degrees(browser, FACULTY_OF_BE)
LINKS["AD"] = get_faculty_degrees(browser, FACULTY_OF_AD)
LINKS["Engineering"] = get_faculty_degrees(browser, FACULTY_OF_ENGINEERING)
LINKS["Law"] = get_faculty_degrees(browser, FACULTY_OF_LAW)
LINKS["Medicine"] = get_faculty_degrees(browser, FACULTY_OF_MEDICINE)
LINKS["Science"] = get_faculty_degrees(browser, FACULTY_OF_SCIENCE)
LINKS["Business"] = get_faculty_degrees(browser, UNSW_BUSINESS_SCHOOL)

scrape.write_to_file("links_degrees.json", LINKS)

# Close browser
browser.quit()