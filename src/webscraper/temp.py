import scrape
import re

COURSES = scrape.read_from_file("courses.json")
FILTER_COURSE_CODES = scrape.read_from_file("filter_course_codes.json")

REGEX_COURSE_CODE = "[A-Z]{4}\d{4}"

for code in COURSES:
    conditions = COURSES[code]["conditions"]["raw"]
    if conditions == None:
        continue

    conditions = conditions.upper()
    if "[" in conditions:
        print(code, conditions)

# scrape.write_to_file("courses.json", COURSES)
