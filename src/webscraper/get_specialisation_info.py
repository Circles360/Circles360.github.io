from selenium import webdriver
from bs4 import BeautifulSoup
import random
import scrape
import json
import time
import re

SUBJECT_AREAS = scrape.read_from_file("subject_areas.json")

SPECIALISATIONS = scrape.read_from_file("specialisations.json")
# SPECIALISATIONS = {}

LINKS = scrape.read_from_file("links_degrees.json")

WAIT = 20
REGEX_COURSE_CODE = "[A-Z]{4}\d{4}"
REGEX_SPECIALISATION_CODE = "[A-Z]{5}[H\d]"

@scrape.return_null_on_failure
def get_degree_name(html):
    return html.find("h2", class_="css-1b7bj3d-Heading-ComponentHeading-Heading-css-css ezav15i5").text

@scrape.return_null_on_failure
def get_degree_code(html):
    return html.find("h5", class_="introDetails__sub_heading css-ciwu9x-Subheading-css ezav15i1").text

@scrape.return_null_on_failure
def get_units_required(html):
    return html.find("h4", text=re.compile("Minimum Units of Credit")).find_next_sibling("div").text

@scrape.return_null_on_failure
def get_faculty(html):
    return html.find("div", class_="css-1cq5lls-Box-AttrContainer esd54cc0").find("a").text

@scrape.return_null_on_failure
def get_level_courses(level_html):
    courses = []
    course_tiles = level_html.find_all("a", class_="exq3dcx2")

    for tile in course_tiles:
        if "inactive" in tile["class"]:
            continue

        course_code = tile.find(text=re.compile(REGEX_COURSE_CODE))
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

        print(" //// cannot read:", tile.text)

    # Then group all the courses that are "One of the following:"
    choice_groups = level_html.find_all("strong", text=re.compile("One of the following:"))

    for group in choice_groups:
        choice_tiles = group.find_parent("div", class_="AccordionItem css-1dfs90h-Box-CardBody e1q64pes0").find_all("a", class_="exq3dcx2")

        one_of = []
        for tile in choice_tiles:
            course_code = tile.find(text=re.compile(REGEX_COURSE_CODE))
            one_of.append(course_code)
            courses.remove(course_code)

        courses.append(one_of)

    return courses if courses else None

@scrape.return_null_on_failure
def get_level_name(level_html):
    return level_html.find("strong").text

@scrape.return_null_on_failure
def get_level_requirements(level_html):
    return int(level_html.find("small").text.split(" ")[0])

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

def get_specialisation_info(html):
    return {
        "name": get_degree_name(html),
        "code": get_degree_code(html),
        "units": get_units_required(html),
        "faculty": get_faculty(html),
        "structure": get_degree_structure(html)
    }

def get_faculty_specialisations(browser, faculty_links):
    links = []
    try:
        links.extend(faculty_links["majors"])
    except:
        pass

    try:
        links.extend(faculty_links["minors"])
    except:
        pass

    try:
        links.extend(faculty_links["honours"])
    except:
        pass

    total = len(links)

    for idx, link in enumerate(links):
        print(f"{idx + 1} / {total} >>> scraping {link}")

        code_in_link = re.search(REGEX_SPECIALISATION_CODE, link).group(0)
        if code_in_link in SPECIALISATIONS:
            continue


        browser.get(link)
        time.sleep(random.randint(15, 25))
        html = BeautifulSoup(browser.page_source, "html.parser")

        specialisation_info = get_specialisation_info(html)
        SPECIALISATIONS[specialisation_info["code"]] = specialisation_info
        scrape.write_to_file("specialisations.json", SPECIALISATIONS)

browser = webdriver.Chrome(scrape.CHROME_DRIVER) # NEED TO BE CHROME VERSION 85

for faculty in LINKS:
    get_faculty_specialisations(browser, LINKS[faculty])

# get_faculty_specialisations(browser, LINKS["Engineering"])

browser.quit()
scrape.write_to_file("specialisations.json", SPECIALISATIONS)