import json
import re

COURSE_CODE_REGEX = "[A-Z]{4}[0-9]{4}"

def get_course_requisites(raw):
    # a course has been matched somewhere
    return re.findall(COURSE_CODE_REGEX, raw)

with open("courses.json", "r") as read_file:
    courses = json.load(read_file)

all_conditions = {}
for code in courses:
    conditions = courses[code]["conditions"]

    if conditions == None or conditions == "None":
        continue

    conditions = conditions.split("\n")[0].upper()

    if "PLEASE REFER TO THE COURSE OVERVIEW SECTION FOR INFORMATION ON PREREQUISITE REQUIREMENTS" in conditions:
        # Treat as NULL
        continue

    if "EXCL" in conditions:
        # Treat as NULL
        continue

    prerequisites = []
    corequisites = []
    units_required = None
    core_year = None
    other = []

    for requisite in conditions.split(";"):
        for cond in requisite.split(" AND "):
            if re.search("CO-?REQ", cond):
                corequisites.append(get_course_requisites(cond))

            elif re.search(COURSE_CODE_REGEX, cond):
                prerequisites.append(get_course_requisites(cond))

            elif re.search("[0-9]{4}", cond):
                # COURSE NUMBER ONLY
                all_code_numbers = re.findall("[0-9]{4}", cond)
                for code_number in all_code_numbers:
                    code_faculty = re.search("[A-Z]{4}", code).group(0)
                    prerequisites.append(code_faculty + code_number)

            elif "UOC" in cond or "UNITS OF CREDIT" in cond:
                units_required = re.search("\d+", cond).group(0)

            elif re.search("YEAR", cond):
                core_year = re.search("\d+", cond).group(0)

            elif "WAM" in cond:
                continue

            else:
                other.append(cond.strip())

    if prerequisites == []:
        prerequisites = None

    if corequisites == []:
        corequisites = None

    if other == []:
        other = None

    all_conditions[code] = {
        "prerequisites": prerequisites,
        "corequisites": corequisites,
        "units_required": units_required,
        "year": core_year,
        "other": other
    }

with open("conditions.json", "w") as write_file:
    json.dump(all_conditions, write_file)