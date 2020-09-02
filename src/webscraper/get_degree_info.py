from selenium import webdriver
from bs4 import BeautifulSoup
import scrape
import json
import time
import re

WAIT = 2
COURSE_CODE_REGEX = "[A-Z]{4}\d{4}"

def get_degree_name(html):
    return html.find("h2", class_="css-1b7bj3d-Heading-ComponentHeading-Heading-css-css ezav15i5").text

def get_degree_code(html):
    return html.find("h5", class_="introDetails__sub_heading css-ciwu9x-Subheading-css ezav15i1").text

def get_units_required(html):
    return html.find("h4", text=re.compile("Minimum Units of Credit")).find_next_sibling("div").text

def get_faculty(html):
    return html.find("div", class_="css-1cq5lls-Box-AttrContainer esd54cc0").find("a").text

def get_level_courses(level_html):
    courses = []
    course_tiles = level_html.find_all("a", class_="exq3dcx2")

    for tile in course_tiles:
        course_code = tile.find(text=re.compile(COURSE_CODE_REGEX))
        if course_code:
            courses.append(course_code)
            continue

        any_level = tile.find(text=re.compile("any level \d+ .* course"))
        if any_level:
            match = re.search("any level (\d) (.*) course", any_level)
            course_level = match.group(1)
            course_subject_code = SUBJECT_AREAS["subject_to_code"][match.group(2)]
            courses.append(course_subject_code + course_level)
            continue

        # Edge cases
        cse_school_course = tile.find(text=re.compile("School of Computer Science and Engineering"))
        if cse_school_course:
            print("cse school only")
            course_level = re.search("level (\d+)", cse_school_course).group(1)
            course_subject_code = "COMP"
            courses.append(course_subject_code + course_level)
            continue

        if tile.find(text=re.compile("any course")):
            courses.append("ANY COURSE")
            continue

    # Then group all the courses that are "One of the following:"
    choice_groups = level_html.find_all("strong", text=re.compile("One of the following:"))

    for group in choice_groups:
        choice_tiles = group.find_parent("div", class_="AccordionItem css-1dfs90h-Box-CardBody e1q64pes0").find_all("a", class_="exq3dcx2")

        one_of = []
        for tile in choice_tiles:
            course_code = tile.find(text=re.compile(COURSE_CODE_REGEX))
            one_of.append(course_code)
            courses.remove(course_code)

        courses.append(one_of)

    if courses == []:
        print("EMPTY COURSES")

    return courses

def get_level_name(level_html):
    return level_html.find("strong").text

def get_level_requirements(level_html):
    try:
        return int(level_html.find("small").text.split(" ")[0])
    except:
        return None

def get_degree_structure(html):
    degree_structure = {}
    specialisation_structure = html.find(id="SpecialisationStructure").find_all(class_="css-8x1vkg-Box-Card-EmptyCard-css-SAccordionContainer e1450wuy4")

    for level in specialisation_structure:
        level_name = get_level_name(level)

        degree_structure[level_name] = {
            "name": level_name,
            "units_required": get_level_requirements(level),
            "courses": get_level_courses(level)
        }

    return degree_structure

def get_degree_info(html):
    return {
        "name": get_degree_name(html),
        "code": get_degree_code(html),
        "units": get_units_required(html),
        "faculty": get_faculty(html),
        "structure": get_degree_structure(html)
    }


# Engineering honours only for now
SUBJECT_AREAS = scrape.read_from_file("subject_areas.json")

ENG_DEGREES = {}

ENG_LINKS = scrape.read_from_file("links_eng_degrees.json")
ENG_MAJOR_LINKS = ENG_LINKS["majors"]
ENG_HONOUR_LINKS = ENG_LINKS["honours"]
ENG_DOUBLE_DEGREE_LINKS = ENG_LINKS["double_degrees"]

# Only honour links for now
browser = webdriver.Chrome("./chromedriver") # NEED TO BE CHROME VERSION 85
for link in ENG_HONOUR_LINKS:
    browser.get(link)

    print(" >>> scraping" + link)
    time.sleep(WAIT)

    degree_html = BeautifulSoup(browser.page_source, "html.parser")
    degree_info = get_degree_info(degree_html)

    # print(json.dumps(degree_info, indent=2))

    ENG_DEGREES[degree_info["code"]] = degree_info

browser.quit()
scrape.write_to_file("fac_eng_degrees.json", ENG_DEGREES)