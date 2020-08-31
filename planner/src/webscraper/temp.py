import json

TEMPLATE = {
    "prerequisites": None,
    "corequisites": None,
    "units_required": None,
    "level_for_units_required": None,
    "core_year": None,
    "other": None
}

with open("courses.json", "r", encoding="utf8") as read_file:
    courses = json.load(read_file)

for code in courses:
    if courses[code]["conditions"] == None:
        courses[code]["conditions"] = TEMPLATE


with open("courses.json", "w") as write_file:
    json.dump(courses, write_file)