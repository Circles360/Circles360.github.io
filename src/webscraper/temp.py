import scrape
import json
import re

with open("fac_eng_degrees.json", "r", encoding="utf8") as read_file:
    eng_degrees = json.load(read_file)

def translate_requirements(req):
    match = re.search("Students must ((complete )|(take )|(take at least )|(complete a minimum of ))(\d+) UOC", req)
    if match:
        min_uoc = match.group(5)
        return f" >>> MIN UOC {min_uoc}"

    match = re.search("Students can take up to (a maximum of )?(\d+) UOC", req)
    if match:
        max_uoc = match.group(2)
        return f" >>> MAX UOC {max_uoc}"

    match = re.search("Students must take at least (\d+) UOC, up to a maximum of (\d+) UOC", req)
    if match:
        min_uoc = match.group(1)
        max_uoc = match.group(2)
        return f" >>> BETWEEN {min_uoc} AND {max_uoc} UOC"

    return req

for code in eng_degrees:
    for s in eng_degrees[code]["structure"]:
        translated = translate_requirements(eng_degrees[code]["structure"][s]["requirements"])
        if translated == eng_degrees[code]["structure"][s]["requirements"]:
            print(code, s, "//", translated, "\n")

