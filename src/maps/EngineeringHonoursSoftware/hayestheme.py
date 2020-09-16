import json
import re

def read_from_file(filename):
    with open(filename, "r", encoding="utf8") as read_file:
        return json.load(read_file)

def write_to_file(filename, data):
    with open(filename, "w") as write_file:
        json.dump(data, write_file)

data = read_from_file("old_data.json")

new_data = []
for node in data:

    node["style"]["transition"] = "0.2s ease"
    if re.search("[A-Z]{5}[H\d]", node["id"]):
        node["style"]["color"] = "black"
        node["style"]["background"] = "white"
        node["style"]["border"] = "2px solid black"
        node["style"]["filter"] = None
    elif re.search("e[A-Z]\d{4}-[A-Z]\d{4}"):
        # edge
        pass
    else:
        # course

    new_data.append(node)

write_to_file("data.json", new_data)