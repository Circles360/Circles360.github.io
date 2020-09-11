import scrape
import re

COURSES = scrape.read_from_file("courses.json")
FILTER_COURSE_CODES = scrape.read_from_file("filter_course_codes.json")

REGEX_COURSE_CODE = "[A-Z]{4}\d{4}"

for code in COURSES:
    conditions = COURSES[code]["conditions"]["raw"]
    if conditions == None:
        continue
    if re.search("PHY\d{4}", conditions):
        incorrect_code = re.search("PHY\d{4}", conditions).group(0)
        correct_code = "PHYS" + incorrect_code[3:]
        COURSES[code]["conditions"]["raw"] = COURSES[code]["conditions"]["raw"].replace(incorrect_code, correct_code)

scrape.write_to_file("courses.json", COURSES)

