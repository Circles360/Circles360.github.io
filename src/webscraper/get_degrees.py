from selenium import webdriver
from bs4 import BeautifulSoup
import requests
import scrape
import json
import os

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

browser.quit()