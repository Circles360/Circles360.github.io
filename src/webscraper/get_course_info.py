from selenium import webdriver
from bs4 import BeautifulSoup
import scrape
import time
import json
import re

WAIT = 2
REGEX_COURSE_CODE = "[A-Z]{4}\d{4}"


COURSES = {}
BUILDS_INTO = {}

def flatten_array(arr):
    flattened = []

    for a in arr:
        if isinstance(a, list):
            flattened.extend(flatten_array(a))
        else:
            flattened.append(a)

    return flattened

def get_side_bar_element(html, element_header):
    side_bar = html.find_all(class_="css-1cq5lls-Box-AttrContainer esd54cc0")
    return [s for s in side_bar if element_header in s.text]

def get_course_name(html):
    return html.find("h2", class_="css-1b7bj3d-Heading-ComponentHeading-Heading-css-css ezav15i5").text.strip()

def get_course_code(html):
    return html.find("h5", class_="introDetails__sub_heading css-ciwu9x-Subheading-css ezav15i1").text.strip()

def get_course_units(html):
    return int(html.find_all("h5", class_="introDetails__sub_heading css-ciwu9x-Subheading-css ezav15i1")[1].text.strip().split(" ")[0])

def get_course_terms(html):
    try:
        return get_side_bar_element(html, "Offering Terms")[0].find("div", class_="css-z2gihx-AttrBody esd54cc2").text.strip().split(", ")
    except:
        return None
    # may have to use try except here

def get_course_faculty(html):
    return get_side_bar_element(html, "Faculty")[0].find("div", class_="css-z2gihx-AttrBody esd54cc2").text.strip()

def get_course_school(html):
    return get_side_bar_element(html, "School")[-1].find("div", class_="css-z2gihx-AttrBody esd54cc2").text.strip()

def get_course_desc(html):
    return html.find(id="Overview").find("p").text.strip()
    # could use try except here for weird cases



def split_conditions(raw):
    pass

def or_then_and(raw):
    pass

def get_course_conditions(raw):
    pass

def get_course_equivalents(html):
    pass

def get_course_exclusions(html):
    exclusion_tiles = html.find(id="ExclusionCourses").find_all("a")
    return [re.search(REGEX_COURSE_CODE, tile.text).group(0) for tile in exclusion_tiles if re.search(REGEX_COURSE_CODE, tile.text)]

def get_course_info(html):
    course_code = get_course_code(html)

    return {
        "course_name": get_course_name(html),
        "course_code": course_code,
        "course_level": int(course_code[4]),
        "units": get_course_units(html),
        "terms": get_course_terms(html),
        "faculty": get_course_faculty(html),
        "school": get_course_school(html),
        "desc": get_course_desc(html),
        # "conditions": get_course_conditions(html),
        # "equivalents": get_course_equivalents(html),
        "exclusions": get_course_exclusions(html),
        "unlocks": None
    }

course_links = scrape.read_from_file("links_courses.json")
total = len(course_links)

# Open browser
browser = webdriver.Chrome(scrape.CHROME_DRIVER) # NEED TO BE CHROME VERSION 85

for idx, link in enumerate(course_links):
    print(f"{idx + 1}/{total} >>> {link}")
    time.sleep(WAIT)

    # Get html
    # browser.get(link)
    browser.get("https://www.handbook.unsw.edu.au/undergraduate/courses/2021/COMP2911")
    course_html = BeautifulSoup(browser.page_source, "html.parser")

    course_info = get_course_info(course_html)

    print(json.dumps(course_info, indent=2))

    COURSES[course_info["course_code"]] = course_info

    break