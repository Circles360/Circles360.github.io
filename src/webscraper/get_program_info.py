from selenium import webdriver
from bs4 import BeautifulSoup
import random
import scrape
import json
import time
import re

LINKS = scrape.read_from_file("links_degrees.json")

PROGRAMS = {}

WAIT = 20
REGEX_COURSE_CODE = "[A-Z]{4}\d{4}"
REGEX_SPECIALISATION_CODE = "[A-Z]{5}[H\d]"
REGEX_PROGRAM_CODE = "\d{4}"

@scrape.return_null_on_failure
def get_program_name(html):
    return html.find("h2", class_="css-1b7bj3d-Heading-ComponentHeading-Heading-css-css ezav15i5").text

@scrape.return_null_on_failure
def get_program_code(html):
    return html.find("h5", class_="introDetails__sub_heading css-ciwu9x-Subheading-css ezav15i1").text

@scrape.return_null_on_failure
def get_program_desc(html):
    try:
        return html.find(id="Overview").find("p").text.strip()
    except:
        return html.find(id="Overview").text.strip()

@scrape.return_null_on_failure
def get_program_faculty(html):
    return html.find("div", attrs={"data-testid": "attributes-table"}).find("a").text

@scrape.return_null_on_failure
def get_program_units(html):
    return int(html.find("h4", text=re.compile("Minimum Units of Credit")).find_next_sibling("div").text)

@scrape.return_null_on_failure
def get_program_duration(html):
    return int(html.find("h4", text=re.compile("Typical duration")).find_next_sibling("div").text.split(" ")[0])

@scrape.return_null_on_failure
def get_level_degrees(level_html):
    pass

@scrape.return_null_on_failure
def get_level_name(level_html):
    return level_html.find("strong").text

@scrape.return_null_on_failure
def get_level_requirements(level_html):
    return int(level_html.find("small").text.split(" ")[0])

@scrape.return_null_on_failure
def get_program_structure(html):
    degree_structure = {}
    program_structure = html.find(id="ProgramStructure").find_all(class_="css-8x1vkg-Box-Card-EmptyCard-css-SAccordionContainer e1450wuy4")

    for level in program_structure:
        level_name = get_level_name(level)

        degree_structure[level_name] = {
            "name": level_name,
            "units_required": get_level_requirements(level)
            # "courses": get_level_courses(level)
        }

    return degree_structure

def get_program_info(html):
    return {
        "name": get_program_name(html),
        "code": get_program_code(html),
        "desc": get_program_desc(html),
        "faculty": get_program_faculty(html),
        "units": get_program_units(html),
        "duration": get_program_duration(html),
        "structure": get_program_structure(html)
    }

def get_programs(browser, faculty_links):
    if not faculty_links["programs"]:
        return None

    total = len(faculty_links["programs"])

    for idx, link in enumerate(faculty_links["programs"]):
        print(f"{idx + 1} / {total} >>> scraping {link}")

        browser.get(link)
        time.sleep(random.randint(2, 3))
        html = BeautifulSoup(browser.page_source, "html.parser")

        program_info = get_program_info(html)
        PROGRAMS[program_info["code"]] = program_info
        scrape.write_to_file("programs.json", PROGRAMS)

browser = webdriver.Chrome(scrape.CHROME_DRIVER)

# for faculty in LINKS:
#     get_programs(browser, LINKS[faculty])
get_programs(browser, LINKS["Engineering"])

browser.quit()
scrape.write_to_file("programs.json", PROGRAMS)