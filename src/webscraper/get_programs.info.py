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

