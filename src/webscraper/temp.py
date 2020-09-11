import scrape
import re

COURSES = scrape.read_from_file("courses.json")
FILTER_COURSE_CODES = scrape.read_from_file("filter_course_codes.json")

REGEX_COURSE_CODE = "[A-Z]{4}\d{4}"

OLD = scrape.read_from_file("courses_OLD.json")

for code in COURSES:
    if OLD[code]["unlocks"] == None:
        COURSES[code]["unlocks"] = OLD[code]["unlocks"]
    else:
        COURSES[code]["unlocks"] = [x for x in OLD[code]["unlocks"] if x not in FILTER_COURSE_CODES]
        if COURSES[code]["unlocks"] == []:
            COURSES[code]["unlocks"] = None

scrape.write_to_file("courses_with_unlocks.json", COURSES)