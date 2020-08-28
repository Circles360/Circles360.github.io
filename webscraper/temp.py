import json


ENGINEERING_DEGREES = {}
with open("engineering_cache.json", "r") as read_file:
    a = json.load(read_file)
    degrees = a["degrees"]

    for code in degrees:
        degree_name = degrees[code]["degree_name"]
        degree_code = degrees[code]["degree_code"]
        degree_units = degrees[code]["degree_units"]

        core_courses = {}
        for segment in degrees[code]["core_courses"]:
            core_courses[segment] = []
            for course in  degrees[code]["core_courses"][segment]:
                if course["code"] == None:
                    core_courses[segment].append(course["name"])
                    continue
                core_courses[segment].append(course["code"])

        ENGINEERING_DEGREES[code] = {
            "degree_name": degree_name,
            "degree_code": degree_code,
            "degree_units": degree_units,
            "core_courses": core_courses
        }

with open("engineering_degrees.json", "w") as write_file:
        json.dump(ENGINEERING_DEGREES, write_file)