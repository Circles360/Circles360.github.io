import json
import re

def read_from_file(filename):
    with open(filename, "r", encoding="utf8") as read_file:
        return json.load(read_file)

def write_to_file(filename, data):
    with open(filename, "w") as write_file:
        json.dump(data, write_file)

def hex_to_rgb(hex):
    hex = hex.lstrip('#')
    return [int(hex[x:x+2], 16) for x in [0, 2, 4]]

def rgb_to_hex(rgb):
    r = rgb[0]
    g = rgb[1]
    b = rgb[2]
    return "#%02x%02x%02x" % (r, g, b)

def lighten_hex(hex, factor):
    rgb = hex_to_rgb(hex)

    rgb = [int(255 - (255-x)*(1-factor)) for x in rgb]

    return rgb_to_hex(rgb)

data = read_from_file("old_data.json")

new_data = []
for elem in data:
    if re.search("e[A-Z]{4}\d{4}-[A-Z]{4}\d{4}", elem["id"]):
        new_data.append(elem)
        continue

    elem["style"]["transition"] = "0.3s ease"
    elem["style"].pop('filter', None)

    if re.search("[A-Z]{5}[H\d]", elem["id"]):
        elem["style"]["color"] = "black"
        elem["style"]["background"] = "lightgrey"
        elem["style"]["border"] = "2px solid black"
        elem["style"]["filter"] = None
        elem["style"]["box-shadow"] = "0px 0px 2px 0px grey"

        elem["cannotSelect"] = elem["style"].copy()
        elem["selected"] = elem["style"].copy()
        elem["canSelect"] = elem["style"].copy()
    else:
        # course
        colour_theme = elem["style"]["background"]
        # colour_theme_lighter = lighten_hex(colour_theme, 0.95)

        elem["style"]["color"] = colour_theme
        elem["style"]["background"] = "white"
        elem["style"]["border"] = "1px solid " + colour_theme
        elem["style"]["box-shadow"] = "0px 0px 2px 0px grey"

        elem["cannotSelect"] = elem["style"].copy()
        elem["selected"] = elem["style"].copy()
        elem["canSelect"] = elem["style"].copy()

        elem["selected"]["color"] = "white"
        elem["selected"]["background"] = colour_theme

        elem["canSelect"]["color"] = colour_theme
        elem["canSelect"]["background"] = lighten_hex(colour_theme, 0.70)


    new_data.append(elem)

write_to_file("data.json", new_data)