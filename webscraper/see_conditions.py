import json
import re

COURSE_CODE_REGEX = "[A-Z]{4}[0-9]{4}"

def split_conditions(raw):
    split = []

    for requisite in raw.split(";"):
        for cond in requisite.split(" AND "):
            no_white_space = cond.strip()
            if no_white_space == "":
                continue
            split.append(no_white_space)

    return split

def or_then_and(raw):
    # fuck me
    condition_set = re.split("\),? OR \(", raw)

    prerequisites = []

    for c_set in condition_set:
        course_set = []
        for cond in split_conditions(c_set):
            course_set.append(re.findall(COURSE_CODE_REGEX, cond))

        prerequisites.append(course_set)

    return [prerequisites]

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
        # Remove everything after "EXCL". If EXCL still in string (only condition), then skip
        conditions = conditions.split("EXCL", 1)[0].strip()
        if "EXCL" in conditions:
            continue

    if ", OR BOTH " in conditions:
        conditions = conditions.replace(", OR BOTH ", ") OR (")

    if re.search("\),? OR \(", conditions):
        # fml
        prerequisites = or_then_and(conditions)
        all_conditions[code] = {
            "prerequisites": prerequisites,
            "corequisites": None,
            "units_required": None,
            "level_for_units_required": None,
            "core_year": None,
            "other": None
        }

        continue

    if "," in conditions and ", OR" not in conditions and " AND " not in conditions:
        conditions = conditions.replace(",", " AND ")

    prerequisites = []
    corequisites = []
    units_required = None
    core_year = None
    level = None
    other = []

    for cond in split_conditions(conditions):
        if re.search("CO-?REQ", cond):
            corequisites.append(re.findall(COURSE_CODE_REGEX, cond))

        elif re.search(COURSE_CODE_REGEX, cond):
            prerequisites.append(re.findall(COURSE_CODE_REGEX, cond))

        elif re.search("[0-9]{4}", cond):
            # COURSE NUMBER ONLY
            all_code_numbers = re.findall("[0-9]{4}", cond)
            for code_number in all_code_numbers:
                code_faculty = re.search("[A-Z]{4}", code).group(0)
                prerequisites.append(code_faculty + code_number)

        elif re.search("\d+ UNITS OF CREDIT IN LEVEL \d+", cond):
            match = re.search("(\d+) UNITS OF CREDIT IN LEVEL (\d+)", cond)
            units_required = match.group(1)
            level = match.group(2)

        elif "UOC" in cond or "UNITS OF CREDIT" in cond:
            units_required = int(re.search("\d+", cond).group(0))

        elif re.search("YEAR", cond):
            core_year = int(re.search("\d+", cond).group(0))

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
        "level_for_units_required": level,
        "core_year": core_year,
        "other": other
    }

with open("conditions.json", "w") as write_file:
    json.dump(all_conditions, write_file)