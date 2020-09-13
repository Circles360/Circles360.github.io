import scrape
import re

COURSES = scrape.read_from_file("courses.json")
FILTER_COURSE_CODES = scrape.read_from_file("filter_course_codes.json")

REGEX_COURSE_CODE = "[A-Z]{4}\d{4}"

for code in COURSES:
    terms = COURSES[code]["terms"]
    if terms == None:
        continue
    if "Summer Term" in terms:
        terms.remove("Summer Term")
    if "Term 1" in terms:
        terms.remove("Term 1")
    if "Term 2" in terms:
        terms.remove("Term 2")
    if "Term 3" in terms:
        terms.remove("Term 3")

    if terms == []:
        continue

    print(code, terms)

# scrape.write_to_file("courses.json", COURSES)
