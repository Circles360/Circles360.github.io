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

def flatten_array(arr):
    if arr == None:
        return []

    flattened = []

    for a in arr:
        if isinstance(a, list):
            flattened.extend(flatten_array(a))
        else:
            flattened.append(a)

    return flattened

def filter_irrelevant(code):
    return False if code in FILTER_COURSE_CODES else True

def map_executable(elem):
    if elem == " OR ":
        return "||"
    if elem == " AND " or elem == "&":
        return "&&"
    if "(" in elem:
        return "("
    if ")" in elem:
        return ")"
    if re.search(REGEX_COURSE_CODE, elem):
        if elem in FILTER_COURSE_CODES:
            return "0"
    return elem

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

def clean_up(arr):
    original = " ".join(arr)

    # Remove ""
    arr = [x for x in arr if x != ""]

    # From the back
    arr.reverse()
    while arr and (arr[0] == "&&" or arr[0] == "||" or arr[0] == "("):
        arr.pop(0)

    # From the front
    arr.reverse()
    while arr and (arr[0] == "&&" or arr[0] == "||" or arr[0] == ")"):
        arr.pop(0)

    string = " ".join(arr)
    string = string.replace("&& &&", "&&")               # && && ==> &&
    string = string.replace("|| ||", "||")               # || || ==> ||
    string = string.replace("|| &&", "&&")               # || && ==> &&
    string = string.replace("&& ||", "||")               # && || ==> ||
    string = re.sub("\( ((&& )|(\|\| ))*\)", "", string) # remove any ( ), ( || ) or ( && ), ...
    string = re.sub("\(\s+&&", "(", string)              # ( &&  ==> (
    string = re.sub("\(\s+\|\|", "(", string)            # ( ||  ==> (
    string = re.sub("&&\s+\)", ")", string)              # && )  ==> )
    string = re.sub("\|\|\s+\)", ")", string)            # || )  ==> )
    string = re.sub("\)\s+\(", ") && (", string)              # ) (   ==> ) && (

    # Insert || if there exists "CODE CODE"
    match = re.search(f"(({REGEX_COURSE_CODE} {REGEX_COURSE_CODE})|({REGEX_COURSE_CODE} 0)|(0 {REGEX_COURSE_CODE})|(0 0))", string)
    if match:
        adjacent_codes = match.group(0)
        separated_codes = adjacent_codes.replace(" ", " || ")
        string = string.replace(adjacent_codes, separated_codes)

    if string == original:
        return string
    return clean_up(string.split(" "))

@scrape.return_null_on_failure
def get_course_conditions(html):
    try:
        raw = html.find(id="ConditionsforEnrolment").find("div", class_="css-1l0t84s-Box-CardBody e1q64pes0").text.strip()
        if raw == None or raw == "None" or raw == "":
            return None
    except:
        return None

    prereqs_executable = None
    prerequisites = None
    corequisites = []
    units_required = None
    core_year = None
    level = None
    other = []

    conditions = raw.upper().split("\n")[0].split("EXCL")[0].split("EQUIV")[0].strip()

    if re.search("CO-?REQ", conditions):
        split_conditions = re.split("CO-?REQ", conditions)
        corequisites = list(filter(filter_irrelevant, re.findall(REGEX_COURSE_CODE, split_conditions[1])))
        conditions = split_conditions[0] # Remove co-reqs

    if re.search("PRE-?REQ(UISITE)?S?", conditions):
        # Need to deal with commas
        if "," in conditions:
            # see if "," = "OR"
            if re.search(f", ?{REGEX_COURSE_CODE},? OR ", conditions):
                conditions = conditions.replace(",", " OR ")
            elif re.search(f", ?{REGEX_COURSE_CODE},?( AND )?", conditions):
                conditions = conditions.replace(",", " AND ")

        raw_array = re.findall(f"(\(|\)|&|( OR )|( AND )|({REGEX_COURSE_CODE}))", conditions)
        raw_array = [x[0] for x in raw_array]
        executable_array = map(map_executable, raw_array)
        executable_array = list(filter(filter_irrelevant, executable_array))

        prereqs_executable = clean_up(executable_array)

    if re.search("(UOC)|(UNITS? OF CREDIT)", conditions):
        match = re.search("(\d+) ?((UOC)|(UNITS? OF CREDIT))( ((IN)|(AT)) LEVEL (\d+))?", conditions)
        try:
            units_required = int(match.group(1))
        except:
            pass

        try:
            level = int(match.group(9))
        except:
            pass

    if re.search("YEAR", conditions):
        try:
            core_year = int(re.search("\d+", conditions).group(0))
        except:
            pass

    return {
        "raw": raw,
        "prereqs_executable": prereqs_executable if prereqs_executable != "" else None,
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
        for prereq in courses[code]["conditions"]["prerequisites"]:
            try:
                courses[prereq]["unlocks"].append(code)
            except:
                print(f"## {prereq} not in database")

    # Reset "unlocks" to None if empty array
    for code in courses:
        if courses[code]["unlocks"] == []:
            courses[code]["unlocks"] = None

    return courses

def check_contaminated(arr):
    intersection = [x for x in arr if x in FILTER_COURSE_CODES]
    if intersection:
        return True

    return False

def check_if_need_updating(course):
    if course["conditions"]["prerequisites"]:
        flattened = flatten_array(course["conditions"]["prerequisites"])
        if check_contaminated(flattened):
            return True

    if course["conditions"]["corequisites"]:
        flattened = flatten_array(course["conditions"]["corequisites"])
        if check_contaminated(flattened):
            return True

    if course["equivalents"]:
        flattened = flatten_array(course["equivalents"])
        if check_contaminated(flattened):
            return True

    if course["exclusions"]:
        flattened = flatten_array(course["exclusions"])
        if check_contaminated(flattened):
            return True

    return False


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
    # browser.get("https://www.handbook.unsw.edu.au/undergraduate/courses/2021/ACTL4001")
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
# COURSES = update_unlocks(COURSES)

scrape.write_to_file("courses.json", COURSES)
browser.quit()