import scrape
import re

COURSES = scrape.read_from_file("courses.json")
FILTER_COURSE_CODES = scrape.read_from_file("filter_course_codes.json")

REGEX_COURSE_CODE = "[A-Z]{4}\d{4}"

OLD = scrape.read_from_file("courses_OLD.json")

for code in COURSES:
    COURSES[code]["unlocks"] = OLD[code]["unlocks"]

scrape.write_to_file("courses_with_unlocks.json", COURSES)