import json
import engineering

ENGINEERING_COURSES = {}

with open(engineering.CACHE_FILE, "r") as read_file:
    data = json.load(read_file)

engineering_degrees = data["degrees"]

for code in engineering_degrees:
    for level in engineering_degrees[code]["core_courses"]:
        for course in engineering_degrees[code]["core_courses"][level]:
            course_code = course["code"]
            course_link = course["link"]

            ENGINEERING_COURSES[course_code] = {
                "code": course_code,
                "link": course_link
            }

with open("courses.json", "w") as write_file:
    json.dump(ENGINEERING_COURSES, write_file)