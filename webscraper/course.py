# from selenium import webdriver
from bs4 import BeautifulSoup
import requests
import scrape
import time
import json
import re
import os

import engineering

COURSE_CODE_REGEX = "[A-Z]{4}[0-9]{4}"

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
            course_set.append(re.findall(COURSE_CODE_REGEX, cond))

        prerequisites.append(course_set)

    return [prerequisites]

def get_course_conditions(handbook_html):
    course_conditions = handbook_html.find(id="readMoreSubjectConditions")
    if course_conditions == None:
        return None

    raw = course_conditions.find("div", class_="a-card-text m-toggle-text has-focus").text.strip()

    if raw == None or raw == "None":
        return None

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
        if re.search("CO-?REQ", cond):
            corequisites.append(re.findall(COURSE_CODE_REGEX, cond))

        elif re.search(COURSE_CODE_REGEX, cond):
            prerequisites.append(re.findall(COURSE_CODE_REGEX, cond))

        elif re.search("[0-9]{4}", cond):
            # COURSE NUMBER ONLY
            all_code_numbers = re.findall("[0-9]{4}", cond)
            for code_number in all_code_numbers:
                code_faculty = re.search("[A-Z]{4}", code).group(0)
                prerequisites.append(code_faculty + code_number)

        elif re.search("\d+ UNITS OF CREDIT IN LEVEL \d+", cond):
            match = re.search("(\d+) UNITS OF CREDIT IN LEVEL (\d+)", cond)
            units_required = match.group(1)
            level = match.group(2)

        elif "UOC" in cond or "UNITS OF CREDIT" in cond:
            units_required = int(re.search("\d+", cond).group(0))

        elif re.search("YEAR", cond):
            core_year = int(re.search("\d+", cond).group(0))

        elif "WAM" in cond:
            continue

        else:
            other.append(cond.strip())

    if prerequisites == []:
        prerequisites = None

    if corequisites == []:
        corequisites = None

    if other == []:
        other = None

    return {
        "prerequisites": prerequisites,
        "corequisites": corequisites,
        "units_required": units_required,
        "level_for_units_required": level,
        "core_year": core_year,
        "other": other
    }

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


ENGINEERING_COURSES = {}
with open("list_of_courses.json", "r") as read_file:
    list_of_courses = json.load(read_file)

total = len(list_of_courses.keys())

for idx, code in enumerate(list_of_courses):

    print(f"{idx}/{total}", end="")

    # time.sleep(2)

    link = list_of_courses[code]["link"]
    if "/search?" in link:
        continue

    html = scrape.get_html(link)

    if html == None:
        (name, code, units, terms, desc, conditions, equivalents) = None, None, None, None, None, None, None
    else:
        name = get_course_name(html)
        code = get_course_code(html)
        units = get_course_units(html)
        terms = get_course_terms(html)
        desc = get_course_desc(html)
        conditions = get_course_conditions(html)
        equivalents = get_course_equivalents(html)

    ENGINEERING_COURSES[code] = {
        "name": name,
        "code": code,
        "units": units,
        "terms": terms,
        "desc": desc,
        "conditions": conditions,
        "equivalents": equivalents
    }

with open("courses.json", "w") as write_file:
        json.dump(ENGINEERING_COURSES, write_file)