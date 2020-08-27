# from selenium import webdriver
from bs4 import BeautifulSoup
import requests
import scrape
import time
import json
import os

import engineering

def get_course_name(handbook_html):
    return handbook_html.find("h1", class_="o-ai-overview__h1").find("span").text

def get_course_code(handbook_html):
    return handbook_html.find("div", class_="m-ai-overview-details__cell code p-left-0").find("strong").text

def get_course_units(handbook_html):
    return handbook_html.find("div", class_="m-ai-overview-details__cell code").find("span").find("strong").text.split()[0]

def get_course_desc(handbook_html):
    desc = handbook_html.find("div", class_="readmore__wrapper").text.strip()
    first_sentence = desc.split(".")[0] + "."

    return first_sentence

def get_course_terms(handbook_html):
    element = handbook_html.find(text="Offering Terms")
    if element == None:
        return None

    offering_terms = element.find_parent("div").find("p").text.split(", ")
    return offering_terms

def get_course_prerequisites(handbook_html):
    course_prerequisites = handbook_html.find(id="readMoreSubjectConditions")
    if course_prerequisites == None:
        return None

    return course_prerequisites.find("div", class_="a-card-text m-toggle-text has-focus").text.strip()

def get_course_equivalents(handbook_html):
    equivalence_rules = handbook_html.find(id="equivalence-rules")
    if equivalence_rules == None:
        return None

    course_tiles = equivalence_rules.find_all("div", class_="m-single-course-wrapper")

    equivalent_courses = []
    for tile in course_tiles:
        link = scrape.HANDBOOK_URL + tile.find("a")["href"]
        link = link.replace("\n", "") # remove trailing new lines

        code = tile.find("div", class_="m-single-course-top-row").find("span").text
        name = tile.find("div", class_="m-single-course-bottom-row").find("p").text

        equivalent_courses.append({
            "code": code,
            "name": name,
            "link": link
        })

    return equivalent_courses

# test = scrape.get_html("https://www.handbook.unsw.edu.au/undergraduate/courses/2020/ELEC2134/")
# test = scrape.get_html("https://www.handbook.unsw.edu.au/undergraduate/courses/2020/MATH1241/")
# test = scrape.get_html("https://www.handbook.unsw.edu.au/undergraduate/courses/2020/ELEC1111/")

# print("name", get_course_name(test))
# print("code", get_course_code(test))
# print("units", get_course_units(test))
# print("desc", get_course_desc(test))
# print("prerequisites", get_course_prerequisites(test))
# print("equivalents", get_course_equivalents(test))
# print("offering terms", get_course_terms(test))


ENGINEERING_COURSES = {}
with open("list_of_courses.json", "r") as read_file:
    list_of_courses = json.load(read_file)

total = len(list_of_courses.keys())

for idx, code in enumerate(list_of_courses):
    print(f"{idx}/{total}", end="")

    time.sleep(2)

    link = list_of_courses[code]["link"]
    if "/search?" in link:
        continue

    html = scrape.get_html(link)

    if html == None:
        (name, code, units, terms, desc, prerequisites, equivalents) = None, None, None, None, None, None, None
    else:
        name = get_course_name(html)
        code = get_course_code(html)
        units = get_course_units(html)
        terms = get_course_terms(html)
        desc = get_course_desc(html)
        prerequisites = get_course_prerequisites(html)
        equivalents = get_course_equivalents(html)

    ENGINEERING_COURSES[code] = {
        "name": name,
        "code": code,
        "units": units,
        "terms": terms,
        "desc": desc,
        "prerequisites": prerequisites,
        "equivalents": equivalents
    }

with open("courses.json", "w") as write_file:
        json.dump(ENGINEERING_COURSES, write_file)