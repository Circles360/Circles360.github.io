import json

with open("list_of_courses.json", "r") as read_file:
    courses = json.load(read_file)

for code in courses:
    link = courses[code]["link"]

    if code == "null":
        continue

    if "courses" not in link:
        print(f"{code}: {link}")