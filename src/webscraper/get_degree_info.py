from selenium import webdriver
from bs4 import BeautifulSoup
import scrape
import json
import time
import re

def get_degree_name(html):
    return html.find("h1", class_="o-ai-overview__h1").find("span").text

def get_degree_code(html):
    return html.find("div", class_="m-ai-overview-details__cell code p-left-0").find("strong").text

def get_units_required(html):
    return html.find("div", class_="m-ai-overview-details__cell code").find("span").find("strong").text.split()[0]

def get_faculty(html):
    return html.find(class_="a-column a-column-df-12 a-column-md-6 a-column-sm-12").find("a").text

def get_degree_desc(html):
    try:
        return html.find(id="readMoreToggle1").find("p").text
    except:
        return html.find(id="readMoreToggle1").find("div", class_="readmore__wrapper").text

def get_level_courses(level_html):
    courses = []
    course_tiles = level_html.find(class_="m-accordion-body-inner has-focus").find_all(class_="m-single-course-wrapper")

    for tile in course_tiles:
        try:
            course_code = tile.find("span", class_="align-left").text
        except:
            any_course = tile.find("p", class_="text-color-blue-400 no-margin").text

            # Hard code
            if re.search("course offered by Faculty of Engineering", any_course):
                continue

            if re.search("any course", any_course):
                continue

            if re.search("School of Computer Science and Engineering", any_course):
                course_level = re.search("level (\d)", any_course).group(1)
                course_subject_code = "COMP"
            else:
                match = re.search("any level (\d) (.*) course", any_course)
                course_level = match.group(1)
                course_subject_code = SUBJECT_AREAS["subject_to_code"][match.group(2)]

            course_code = course_subject_code + course_level

        print(course_code)
        courses.append(course_code)

    # Then group all the courses that are "one of the following"
    choice_groups = level_html.find_all(text="One of the following:")

    for group in choice_groups:
        course_choices = []
        choice_tiles = group.find_parent("div").find_next_sibling("div").find_all(class_="m-single-course-wrapper")

        for tile in choice_tiles:
            course_code = tile.find("span", class_="align-left").text
            course_choices.append(course_code)
            courses.remove(course_code)

        courses.append(course_choices)

    return courses

def get_level_name(level_html):
    return level_html.find("h4").text

def get_level_requirements(level_html):
    return level_html.find("p", class_="no-margin").find("p").text

def get_degree_structure(html):
    degree_structure = {}
    specialisation_structure = html.find(id="structure").find_all(class_="a-card a-card--has-body")

    for level in specialisation_structure:
        level_name = get_level_name(level)

        degree_structure[level_name] = {
            "name": level_name,
            "requirements": get_level_requirements(level),
            "courses": get_level_courses(level)
        }

    return degree_structure

def get_degree_info(link):
    html = scrape.get_html(link)

    return {
        "name": get_degree_name(html),
        "code": get_degree_code(html),
        "units": get_units_required(html),
        "faculty": get_faculty(html),
        "desc": get_degree_desc(html),
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
for link in ENG_HONOUR_LINKS:
    degree_info = get_degree_info(link)

    ENG_DEGREES[degree_info["code"]] = degree_info

scrape.write_to_file("fac_eng_degrees.json", ENG_DEGREES)