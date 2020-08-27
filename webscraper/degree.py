from bs4 import BeautifulSoup
import selenium
import requests
import scrape

import engineering

def get_course_name(handbook_html):
    return handbook_html.find_all("h1")

def get_course_code(handbook_html):
    return

def get_units_required(handbook_html):
    return

def get_core_courses(handbook_html):
    
    return


# for link in engineering.BACHELOR_DEGREE_LINKS:
#     html = scrape.get_html(link)

first = engineering.BACHELOR_DEGREE_LINKS[0]
first_html = scrape.get_html(first)

first_course_name = get_course_name(first_html)
# first_course_code = get_course_code(first_html)
# first_units = get_units_required(first_html)

print("NAME:", first_course_name)
# print("CODE:", first_course_code)
# print("UOCs:", first_units)