from selenium import webdriver
from bs4 import BeautifulSoup
import random
import scrape
import json
import time
import re

LINKS = scrape.read_from_file("links_degrees.json")

WAIT = 20
REGEX_COURSE_CODE = "[A-Z]{4}\d{4}"
REGEX_SPECIALISATION_CODE = "[A-Z]{5}[H\d]"
REGEX_PROGRAM_CODE = "\d{4}"

@scrape.return_null_on_failure
def get_program_name(html):
    pass

@scrape.return_null_on_failure
def get_program_code(html):
    pass

@scrape.return_null_on_failure
def get_program_desc(html):
    pass

@scrape.return_null_on_failure
def get_program_faculty(html):
    pass

@scrape.return_null_on_failure
def get_program_school(html):
    pass

@scrape.return_null_on_failure
def get_program_units(html):
    pass

