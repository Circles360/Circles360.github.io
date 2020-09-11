import process_course_conditions
from selenium import webdriver
from bs4 import BeautifulSoup
import random
import scrape
import time
import json
import re

WAIT = 5
REGEX_COURSE_CODE = "[A-Z]{4}\d{4}"

FILTER_COURSE_CODES = scrape.read_from_file("filter_course_codes.json")

COURSES = scrape.read_from_file("courses.json")
# COURSES = {}

@scrape.return_null_on_failure
def get_side_bar_element(html, element_header):
    side_bar = html.find_all(class_="css-1cq5lls-Box-AttrContainer esd54cc0")
    return [s for s in side_bar if element_header in s.text]

@scrape.return_null_on_failure
def get_course_name(html):
    return html.find("h2", class_="css-1b7bj3d-Heading-ComponentHeading-Heading-css-css ezav15i5").text.strip()

@scrape.return_null_on_failure
def get_course_code(html):
    return html.find("h5", class_="introDetails__sub_heading css-ciwu9x-Subheading-css ezav15i1").text.strip()

@scrape.return_null_on_failure
def get_course_units(html):
    return int(html.find_all("h5", class_="introDetails__sub_heading css-ciwu9x-Subheading-css ezav15i1")[1].text.strip().split(" ")[0])

@scrape.return_null_on_failure
def get_course_terms(html):
    return get_side_bar_element(html, "Offering Terms")[0].find("div", class_="css-z2gihx-AttrBody esd54cc2").text.strip().split(", ")

@scrape.return_null_on_failure
def get_course_faculty(html):
    return get_side_bar_element(html, "Faculty")[0].find("div", class_="css-z2gihx-AttrBody esd54cc2").text.strip()

@scrape.return_null_on_failure
def get_course_school(html):
    return get_side_bar_element(html, "School")[-1].find("div", class_="css-z2gihx-AttrBody esd54cc2").text.strip()

@scrape.return_null_on_failure
def get_course_desc(html):
    try:
        return html.find(id="Overview").find("p").text.strip()
    except:
        return html.find(id="Overview").text.split("Overview")[1].strip()

@scrape.return_null_on_failure
def get_raw_course_conditions(html):
    raw = html.find(id="ConditionsforEnrolment").find("div", class_="css-1l0t84s-Box-CardBody e1q64pes0").text.strip()
    if raw == None or raw == "None" or raw == "":
        return None

    # Fix PHY\d{4} TYPOS
    if re.search("PHY\d{4}", raw):
        incorrect_code = re.search("PHY\d{4}", raw).group(0)
        correct_code = "PHYS" + incorrect_code[3:]
        raw = raw.replace(incorrect_code, correct_code)

    return raw

@scrape.return_null_on_failure
def get_course_conditions(html):
    raw = get_raw_course_conditions(html)
    return process_course_conditions.process_course_conditions(raw, get_course_code(html))

@scrape.return_null_on_failure
def get_related_courses(html, relation):
    related_tiles = html.find(id=relation).find_all("a")

    related_courses = []
    for tile in related_tiles:
        if "inactive" in tile["class"]:
            continue

        match = re.search(REGEX_COURSE_CODE, tile.text)

        if not match:
            continue

        code = match.group(0)
        if code in FILTER_COURSE_CODES:
            continue

        related_courses.append(code)

    return related_courses if related_courses != [] else None

def get_course_info(html):
    NO_CONDITIONS = {
        "raw": None,
        "prereqs_executable": None,
        "prerequisites": None,
        "corequisites": None,
        "units_required": None,
        "level_for_units_required": None,
        "core_year": None,
        "other": None
    }

    course_code = get_course_code(html)
    conditions = get_course_conditions(html)

    return {
        "course_name": get_course_name(html),
        "course_code": course_code,
        "course_level": int(course_code[4]),
        "units": get_course_units(html),
        "terms": get_course_terms(html),
        "faculty": get_course_faculty(html),
        "school": get_course_school(html),
        "desc": get_course_desc(html),
        "conditions": conditions if conditions != None else NO_CONDITIONS,
        "equivalents": get_related_courses(html, "EquivalentCourses"),
        "exclusions": get_related_courses(html, "ExclusionCourses"),
        "unlocks": []
    }

def update_unlocks(courses):
    for code in courses:
        courses[code]["unlocks"] = []

    # Update the "unlocks" field for each course object
    for code in courses:
        if not courses[code]["conditions"]["prerequisites"]:
            continue
        for prereq in courses[code]["conditions"]["prerequisites"]:
            try:
                if code not in courses[prereq]["unlocks"]:
                    courses[prereq]["unlocks"].append(code)
            except:
                print(f"## {prereq} not in database")

    # Reset "unlocks" to None if empty array
    for code in courses:
        if courses[code]["unlocks"] == []:
            courses[code]["unlocks"] = None

    return courses

def check_contaminated(arr):
    if not arr:
        return False

    intersection = [x for x in arr if x in FILTER_COURSE_CODES]
    return True if intersection else False

def check_if_need_updating(course):
    return check_contaminated(course["conditions"]["prerequisites"]) or check_contaminated(course["conditions"]["corequisites"]) or check_contaminated(course["equivalents"]) or check_contaminated(course["exclusions"])

course_links = scrape.read_from_file("links_courses.json")
total = len(course_links)

# Open browser
browser = webdriver.Chrome(scrape.CHROME_DRIVER) # NEED TO BE CHROME VERSION 85

for idx, link in enumerate(course_links):
    code_from_link = re.search(REGEX_COURSE_CODE, link).group(0)
    if code_from_link in COURSES:
        print(f" ~~ skipped {code_from_link}")
        continue

    random_int = random.randint(15, 20)
    print(f"{idx + 1}/{total} >>> waiting {random_int} seconds >>> {link}")

    # Get html
    browser.get(link)
    time.sleep(random_int)
    course_html = BeautifulSoup(browser.page_source, "html.parser")
    try:
        course_info = get_course_info(course_html)
        COURSES[course_info["course_code"]] = course_info
        scrape.write_to_file("courses.json", COURSES)
    except:
        # note crash
        print(f"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        print(f"@@@                             @@@")
        print(f"@@@     crashed on {code_from_link}     @@@")
        print(f"@@@                             @@@")
        print(f"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        continue

# Update unlocks
COURSES = update_unlocks(COURSES)

scrape.write_to_file("courses.json", COURSES)
browser.quit()