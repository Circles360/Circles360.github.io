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

# COURSES = scrape.read_from_file("courses.json")
COURSES = {}
UNLOCKS = {}

def flatten_array(arr):
    flattened = []

    for a in arr:
        if isinstance(a, list):
            flattened.extend(flatten_array(a))
        else:
            flattened.append(a)

    return flattened

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
        return html.find(id="Overview").text.strip()

def split_conditions(raw):
    split = []

    for requisite in raw.split(";"):
        for cond in requisite.split(" AND "):
            no_white_space = cond.strip()
            if no_white_space == "":
                continue
            split.append(no_white_space)

    return split

def or_then_and(raw):
    # fuck me
    condition_set = re.split("\),? OR \(", raw)

    prerequisites = []

    for c_set in condition_set:
        course_set = []
        for cond in split_conditions(c_set):
            course_set.append(re.findall(REGEX_COURSE_CODE, cond))

        prerequisites.append(course_set)

    return [prerequisites]

@scrape.return_null_on_failure
def get_course_conditions(html):
    raw = html.find(id="ConditionsforEnrolment").find("div", class_="css-1l0t84s-Box-CardBody e1q64pes0").text.strip()

    if raw == None or raw == "None":
        return None

    # FILTER OUT IRRELEVANT CODES:
    for filter_code in FILTER_COURSE_CODES:
        raw.replace(filter_code, "")

    conditions = raw.split("\n")[0].upper()

    if "PLEASE REFER TO THE COURSE OVERVIEW SECTION FOR INFORMATION ON PREREQUISITE REQUIREMENTS" in conditions:
        # Treat as NULL
        return None

    if "EXCL" in raw:
        # Remove everything after "EXCL". If EXCL still in string (only condition), then skip
        conditions = conditions.split("EXCL", 1)[0].strip()
        if "EXCL" in conditions:
            return None

    if ", OR BOTH " in conditions:
        conditions = conditions.replace(", OR BOTH ", ") OR (")

    if re.search("\),? OR \(", conditions):
        # fml
        prerequisites = or_then_and(conditions)
        return {
            "prerequisites": prerequisites,
            "corequisites": None,
            "units_required": None,
            "level_for_units_required": None,
            "core_year": None,
            "other": None
        }

    if "," in conditions and ", OR" not in conditions and " AND " not in conditions:
        conditions = conditions.replace(",", " AND ")

    prerequisites = []
    corequisites = []
    units_required = None
    core_year = None
    level = None
    other = []

    for cond in split_conditions(conditions):
        if "ENROLMENT IN" in cond:
            continue

        if re.search("CO-?REQ", cond):
            corequisites.append(re.findall(REGEX_COURSE_CODE, cond))

        elif re.search(REGEX_COURSE_CODE, cond):
            prerequisites.append(re.findall(REGEX_COURSE_CODE, cond))

        elif re.search("COMPLETION OF.*[0-9]{4}", cond):
            # COURSE NUMBER ONLY
            all_code_numbers = re.findall("[0-9]{4}", cond)
            for code_number in all_code_numbers:
                code_faculty = re.search("[A-Z]{4}", get_course_code(html)).group(0)
                prerequisites.append(code_faculty + code_number)

        elif re.search("\d+ UNITS OF CREDIT IN LEVEL \d+", cond):
            match = re.search("(\d+) UNITS OF CREDIT IN LEVEL (\d+)", cond)
            units_required = match.group(1)
            level = match.group(2)

        elif re.search("(UOC)|(UNITS? OF CREDIT)", cond):
            try:
                units_required = int(re.search("\d+", cond).group(0))
            except:
                continue

        elif re.search("YEAR", cond):
            try:
                core_year = int(re.search("\d+", cond).group(0))
            except:
                continue

        elif "WAM" in cond:
            continue

        else:
            other.append(cond.strip())

    return {
        "prerequisites": prerequisites if prerequisites != [] else None,
        "corequisites": corequisites if corequisites != [] else None,
        "units_required": units_required,
        "level_for_units_required": level,
        "core_year": core_year,
        "other": other if other != [] else None
    }

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
        "unlocks": None
    }

def store_unlocks(unlocks, course_info):
    flattened = flatten_array(course_info["conditions"]["prerequisites"])

    for code in flattened:
        if code not in unlocks:
            unlocks[code] = []

        unlocks[code].append(course_info["course_code"])

    return unlocks

def update_unlocks(unlocks, courses):
    for code in unlocks:
        if code not in courses:
            continue

        if courses[code] == None:
            continue

        courses[code]["unlocks"] = unlocks[code]

    return courses

course_links = scrape.read_from_file("links_courses.json")
total = len(course_links)

# Open browser
browser = webdriver.Chrome(scrape.CHROME_DRIVER) # NEED TO BE CHROME VERSION 85

for idx, link in enumerate(course_links):
    if idx % 10 == 0:
        scrape.write_to_file("courses.json", COURSES)

    code_from_link = re.search(REGEX_COURSE_CODE, link).group(0)
    if code_from_link in COURSES:
        print(f" ~~ skipped {code_from_link}")
        continue

    random_int = random.randint(5, 10)
    print(f"{idx + 1}/{total} >>> waiting {random_int} seconds >>> {link}")

    # Get html
    browser.get(link)
    # browser.get("https://www.handbook.unsw.edu.au/undergraduate/courses/2021/ACTL4001")
    time.sleep(random_int)
    course_html = BeautifulSoup(browser.page_source, "html.parser")
    try:
        course_info = get_course_info(course_html)
        COURSES[course_info["course_code"]] = course_info

        # if course_info["conditions"]["prerequisites"] == None:
        #     continue

        # UNLOCKS = store_unlocks(UNLOCKS, course_info)
    except:
        # Update all data if possible
        print(f" @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ crashed on {code_from_link}")
        continue

# COURSES = update_unlocks(UNLOCKS, COURSES)
scrape.write_to_file("courses.json", COURSES)

browser.quit()