import scrape
import re

REGEX_COURSE_CODE = "[A-Z]{4}\d{4}"
FILTER_COURSE_CODES = scrape.read_from_file("filter_course_codes.json")

def get_all_course_codes():
    all_course_links = scrape.read_from_file("links_courses.json")
    return [re.search(REGEX_COURSE_CODE, x).group(0) for x in all_course_links]
ALL_COURSE_CODES = get_all_course_codes()

def filter_irrelevant(code):
    return False if code in FILTER_COURSE_CODES else True

def map_executable(elem):
    if elem == " OR ":
        return "||"
    if elem == " AND " or elem == "&":
        return "&&"
    if "(" in elem or "[" in elem:
        return "("
    if ")" in elem or "]" in elem:
        return ")"
    if re.search(REGEX_COURSE_CODE, elem):
        if elem in FILTER_COURSE_CODES or elem not in ALL_COURSE_CODES:
            return "0"
    return elem

def clean_up(arr):
    original = " ".join(arr)

    # Remove ""
    arr = [x for x in arr if x != ""]

    # From the back
    arr.reverse()
    while arr and (arr[0] == "&&" or arr[0] == "||" or arr[0] == "("):
        arr.pop(0)

    # From the front
    arr.reverse()
    while arr and (arr[0] == "&&" or arr[0] == "||" or arr[0] == ")"):
        arr.pop(0)

    string = " ".join(arr)
    string = string.replace("&& &&", "&&")               # && && ==> &&
    string = string.replace("|| ||", "||")               # || || ==> ||
    string = string.replace("|| &&", "&&")               # || && ==> &&
    string = string.replace("&& ||", "||")               # && || ==> ||
    string = re.sub("\( ((&& )|(\|\| ))*\)", "", string) # remove any ( ), ( || ) or ( && ), ...
    string = re.sub("\(\s+&&", "(", string)              # ( &&  ==> (
    string = re.sub("\(\s+\|\|", "(", string)            # ( ||  ==> (
    string = re.sub("&&\s+\)", ")", string)              # && )  ==> )
    string = re.sub("\|\|\s+\)", ")", string)            # || )  ==> )
    string = re.sub("\)\s+\(", ") && (", string)              # ) (   ==> ) && (

    # Insert || if there exists "CODE CODE"
    match = re.search(f"(({REGEX_COURSE_CODE} {REGEX_COURSE_CODE})|({REGEX_COURSE_CODE} 0)|(0 {REGEX_COURSE_CODE})|(0 0))", string)
    if match:
        adjacent_codes = match.group(0)
        separated_codes = adjacent_codes.replace(" ", " || ")
        string = string.replace(adjacent_codes, separated_codes)

    if string == original:
        return string
    return clean_up(string.split(" "))

def process_course_conditions(raw, code):
    prereqs_executable = None
    prerequisites = None
    corequisites = []
    units_required = None
    core_year = None
    level = None
    other = []

    conditions = raw.upper().split("\n")[0].split("EXCL")[0].split("EQUIV")[0].strip()

    # Get corequisites
    if re.search("CO-?REQ", conditions):
        split_conditions = re.split("CO-?REQ", conditions)
        corequisites = list(filter(filter_irrelevant, re.findall(REGEX_COURSE_CODE, split_conditions[1])))
        conditions = split_conditions[0] # Remove co-reqs

    # If specifies prerequisites or DOES NOT SPECIFY EITHER PREREQ OR COREQ --> then treat as prereq
    if re.search("PRE-?REQ(UISITE)?S?", conditions) or (not re.search("PRE(-?REQ(UISITE)?S?)?", conditions) and not re.search("CO-?REQ", conditions) and re.search(REGEX_COURSE_CODE, conditions) and not re.search("[A-Z]{5}\d{4}", conditions)):
        # Need to deal with commas
        if "," in conditions:
            # see if "," = "OR"
            if re.search(f", ?{REGEX_COURSE_CODE},? OR ", conditions):
                conditions = conditions.replace(",", " OR ")
            elif re.search(f", ?{REGEX_COURSE_CODE},?( AND )?", conditions):
                conditions = conditions.replace(",", " AND ")

        raw_array = re.findall(f"(\(|\)|\[|\]|&|( OR )|( AND )|({REGEX_COURSE_CODE}))", conditions)
        raw_array = [x[0] for x in raw_array]
        executable_array = map(map_executable, raw_array)
        executable_array = list(filter(filter_irrelevant, executable_array))

        prereqs_executable = clean_up(executable_array)
        prerequisites = re.findall(REGEX_COURSE_CODE, prereqs_executable)

    if re.search("(UOC)|(UNITS? OF CREDIT)", conditions):
        match = re.search("(\d+) ?((UOC)|(UNITS? OF CREDIT))( ((IN)|(AT)) LEVEL (\d+))?", conditions)
        try:
            units_required = int(match.group(1))
        except:
            pass

        try:
            level = int(match.group(9))
        except:
            pass

    if "YEAR" in conditions:
        if "FIRST YEAR" in conditions or "1ST YEAR" in conditions:
            core_year = 1
        elif "SECOND YEAR" in conditions or "2ND YEAR" in conditions:
            core_year = 2
        elif "THIRD YEAR" in conditions or "3RD YEAR" in conditions:
            core_year = 3
        elif "FOURTH YEAR" in conditions or "4TH YEAR" in conditions:
            core_year = 4
        elif "FIFTH YEAR" in conditions or "5TH YEAR" in conditions:
            core_year = 5
        elif "SIXTH YEAR" in conditions or "6TH YEAR" in conditions:
            core_year = 6

    if re.search("COMPLETION OF RESEARCH THESIS (A|B) \((\d{4})\)", conditions):
        prereqs_executable = code[:4] + re.search("COMPLETION OF RESEARCH THESIS (A|B) \((\d{4})\)", conditions).group(2)
        prerequisites = [prereqs_executable]

    return {
        "raw": raw,
        "prereqs_executable": prereqs_executable if prereqs_executable != "" else None,
        "prerequisites": prerequisites if prerequisites != [] else None,
        "corequisites": corequisites if corequisites != [] else None,
        "units_required": units_required,
        "level_for_units_required": level,
        "core_year": core_year,
        "other": other if other != [] else None
    }

def fix_conditions():
    COURSES = scrape.read_from_file("courses.json")

    for code in COURSES:
        raw = COURSES[code]["conditions"]["raw"]
        if raw == None:
            continue

        COURSES[code]["conditions"] = process_course_conditions(raw, code)

    scrape.write_to_file("courses_better.json", COURSES)

# fix_conditions()