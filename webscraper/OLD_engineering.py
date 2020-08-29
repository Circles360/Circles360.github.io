from bs4 import BeautifulSoup
import manual_fixes
import requests
import scrape
import json
import os

BACHELOR_DEGREES = "https://www.engineering.unsw.edu.au/study-with-us/undergraduate/bachelor-degrees"
DOUBLE_DEGREES = "https://www.engineering.unsw.edu.au/study-with-us/undergraduate/double-degrees"
QUERY = "?browseByFaculty=FacultyOfEngineering&"

CACHE_FILE = "engineering_cache.json"

def get_handbook_url_from_degrees(url):
    html = scrape.get_html(url)
    if html == None:
        return ""

    return html.find("a", class_="button button--secondary")["href"]

def get_handbook_url_from_engineering(url):
    html = scrape.get_html(url)
    if html == None:
        return ""

    link = html.find("img", title="See the latest handbook").find_parent("a")["href"]

    if "degrees.unsw.edu.au" in link:
        return get_handbook_url_from_degrees(link)

    return link

def get_handbook_url(url):
    if "handbook.unsw.edu.au" in url:
        return url

    if ("degrees.unsw.edu.au" in url):
        return get_handbook_url_from_degrees(url)

    return get_handbook_url_from_engineering(url)

def get_bachelor_degrees():
    html = scrape.get_html(BACHELOR_DEGREES)
    if html == None:
        exit(1)

    degree_tiles = html.find("ul", class_="links tile-large").find_all("a")

    bachelor_degrees = []
    for tile in degree_tiles:
        link = get_handbook_url(tile["href"])

        if link == "http://www.handbook.unsw.edu.au/ " or link == "":
            continue

        bachelor_degrees.append(link)

    return bachelor_degrees + get_manual_fixes(multi=False)

def get_double_degrees():
    html = scrape.get_html(DOUBLE_DEGREES)
    if html == None:
        exit(1)

    degree_tile_sets = html.find_all("ul", class_="links tile-small")

    double_degrees = []
    for idx, s in enumerate(degree_tile_sets):
        if idx > 1: # There are 3 sections: Engineering, Comp Sci and Application Info. We don't want Application Info.
            break

        degree_tiles = s.find_all("a")
        for tile in degree_tiles:
            link = get_handbook_url(tile["href"])

            if link == "http://www.handbook.unsw.edu.au/ " or link == "":
                continue

            double_degrees.append(link)

    return double_degrees + get_manual_fixes(multi=True)

def get_manual_fixes(multi):
    links = []
    for fix in manual_fixes.ENGINEERING:
        if fix["multi"] == multi:
            links.append(fix["link"])

    return links

if os.path.isfile(CACHE_FILE):
    with open(CACHE_FILE, "r") as read_file:
        data = json.load(read_file)

        BACHELOR_DEGREE_LINKS = data["bachelor_degree_links"]
        DOUBLE_DEGREE_LINKS = data["double_degree_links"]
else:
    BACHELOR_DEGREE_LINKS = get_bachelor_degrees()
    DOUBLE_DEGREE_LINKS = get_double_degrees()

    print("writing to cache...")
    data = {}
    data["bachelor_degree_links"] = BACHELOR_DEGREE_LINKS
    data["double_degree_links"] = DOUBLE_DEGREE_LINKS

    with open(CACHE_FILE, "w") as write_file:
        json.dump(data, write_file)