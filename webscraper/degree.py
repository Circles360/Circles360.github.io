from selenium import webdriver
from bs4 import BeautifulSoup
import requests
import scrape
import json
import os

import engineering

def get_degree_name(handbook_html):
    return handbook_html.find("h1", class_="o-ai-overview__h1").find("span").text

def get_degree_code(handbook_html):
    return handbook_html.find("div", class_="m-ai-overview-details__cell code p-left-0").find("strong").text

def get_units_required(handbook_html):
    return handbook_html.find("div", class_="m-ai-overview-details__cell code").find("span").find("strong").text.split()[0]

def get_core_courses(handbook_html):
    structure = handbook_html.find_all("div", class_="a-card a-card--has-body")

    core_courses = {}
    for level in structure:
        level_name = level.find("h4").text
        core_courses[level_name] = []

        course_tiles = level.find_all("div", class_="m-single-course-wrapper")
        for tile in course_tiles:
            link = scrape.HANDBOOK_URL + tile.find("a")["href"]
            link = link.replace("\n", "") # remove trailing new lines

            if "/search?" in link:
                # This tile says to take any course in this level
                code = None
                name = tile.find("p").text

            else:
                # This tile specifies a course to take
                code = tile.find("div", class_="m-single-course-top-row").find("span").text
                name = tile.find("div", class_="m-single-course-bottom-row").find("p").text

            core_courses[level_name].append({
                "code": code,
                "name": name,
                "link": link
            })

    return core_courses


browser = webdriver.Chrome("./chromedriver") # NEED TO BE CHROME VERSION 85


if os.path.isfile(engineering.CACHE_FILE):
    with open(engineering.CACHE_FILE, "r") as read_file:
        ENGINEERING = json.load(read_file)
        ENGINEERING["degrees"] = {}

# else:

#     ENGINEERING = {}
    for link in engineering.BACHELOR_DEGREE_LINKS:
        browser.get(link)
        html = BeautifulSoup(browser.page_source, "html.parser")
        # browser.close()

        degree_name = get_degree_name(html)
        degree_code = get_degree_code(html)
        degree_units = get_units_required(html)
        core_courses = get_core_courses(html)

        if degree_code in ENGINEERING["degrees"]:
            print(degree_name, degree_code, "already in ENGINEERING")
            continue

        ENGINEERING["degrees"][degree_code] = {
            "degree_name": degree_name,
            "degree_code": degree_code,
            "degree_units": degree_units,
            "core_courses": core_courses
        }


    browser.quit()

    with open(engineering.CACHE_FILE, "w") as write_file:
        json.dump(ENGINEERING, write_file)