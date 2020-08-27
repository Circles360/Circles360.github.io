from bs4 import BeautifulSoup
import requests
import manual_fixes

BACHELOR_DEGREES = "https://www.engineering.unsw.edu.au/study-with-us/undergraduate/bachelor-degrees"
DOUBLE_DEGREES = "https://www.engineering.unsw.edu.au/study-with-us/undergraduate/double-degrees"

def get_html(url):
    response = requests.get(url)
    if not response.ok:
        print(f"ERROR get_html for {url}: status code {response.status_code}")
        return None

    return BeautifulSoup(response.content, "html.parser")

def get_handbook_url_from_degrees(url):
    html = get_html(url)
    if html == None:
        return ""

    return html.find("a", class_="button button--secondary")["href"]

def get_handbook_url_from_engineering(url):
    html = get_html(url)
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
    html = get_html(BACHELOR_DEGREES)
    if html == None:
        exit(1)

    degree_tiles = html.find("ul", class_="links tile-small").find_all("a")

    bachelor_degrees = []
    for tile in degree_tiles:
        link = get_handbook_url(tile["href"])

        if link == "http://www.handbook.unsw.edu.au/" or link == "":
            continue

        bachelor_degrees.append(link)

    return bachelor_degrees

def get_double_degrees():
    html = get_html(DOUBLE_DEGREES)
    if html == None:
        exit(1)

    degree_tile_sets = html.find_all("ul", class_="links tile-small")

    double_degrees = []
    for idx, s in enumerate(degree_tile_sets):
        if idx > 1:
            break

        degree_tiles = s.find_all("a")
        for tile in degree_tiles:
            link = get_handbook_url(tile["href"])

            if link == "http://www.handbook.unsw.edu.au/" or link == "":
                continue

            double_degrees.append(link)

    return double_degrees

def get_manual_fixes():
    links = []
    for fix in manual_fixes.ENGINEERING:
        links.append(fix["link"])

    return links

bachelor_degrees = get_bachelor_degrees()
double_degrees = get_double_degrees()
more_degrees = get_manual_fixes()

DEGREES = bachelor_degrees + double_degrees + more_degrees