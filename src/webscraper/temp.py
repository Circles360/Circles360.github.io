import scrape
import re

COURSES = scrape.read_from_file("courses.json")
FILTER_COURSE_CODES = scrape.read_from_file("filter_course_codes.json")

REGEX_COURSE_CODE = "[A-Z]{4}\d{4}"

def filter_irrelevant(code):
    return False if code in FILTER_COURSE_CODES else True

def map_executable(elem):
    if elem == " OR ":
        return "||"
    if elem == " AND ":
        return "&&"
    if "(" in elem:
        return "("
    if ")" in elem:
        return ")"
    if re.search(REGEX_COURSE_CODE, elem):
        if elem in FILTER_COURSE_CODES:
            return "0"
    return elem

def clean_up(arr):
    original = " ".join(arr)

    # Remove ""
    arr = [x for x in arr if x != ""]

    arr.reverse()
    while arr and (arr[0] == "&&" or arr[0] == "||"):
        arr.pop(0)
    arr.reverse()
    while arr and (arr[0] == "&&" or arr[0] == "||"):
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

    # Insert || if there exists "CODE CODE"
    match = re.search(f"(({REGEX_COURSE_CODE} {REGEX_COURSE_CODE})|({REGEX_COURSE_CODE} 0)|(0 {REGEX_COURSE_CODE})|(0 0))", string)
    if match:
        adjacent_codes = match.group(0)
        separated_codes = adjacent_codes.replace(" ", " || ")
        string = string.replace(adjacent_codes, separated_codes)

    if string == original:
        return string
    return clean_up(string.split(" "))






for code in COURSES:
    raw = COURSES[code]["conditions"]["raw"]
    if raw == None:
        continue

    conditions = raw.upper().split("\n")[0].split("EXCL")[0].split("EQUIV")[0].strip()

    if re.search("PRE-?REQ(UISITE)?S?", conditions):
        # Need to deal with commas
        if "," in conditions:
            # see if "," = "OR"
            if re.search(f", ?{REGEX_COURSE_CODE},? OR ", conditions):
                conditions = conditions.replace(",", " OR ")
            elif re.search(f", ?{REGEX_COURSE_CODE},?( AND )?", conditions):
                conditions = conditions.replace(",", " AND ")

        raw_array = re.findall(f"(\(|\)|( OR )|( AND )|({REGEX_COURSE_CODE}))", conditions)
        raw_array = [x[0] for x in raw_array]
        executable_array = map(map_executable, raw_array)
        executable_array = list(filter(filter_irrelevant, executable_array))

        prereqs_executable = clean_up(executable_array)

        if prereqs_executable:
            print(code, prereqs_executable)

        # if match:
        #     prereqs_executable = match.group(0)
        #     print(code, prereqs_executable)
        # else:
        #     prereqs_executable = None

# scrape.write_to_file("updated_courses.json")
