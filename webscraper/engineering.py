from selenium import webdriver
from bs4 import BeautifulSoup
import manual_fixes
import scrape
import json
import os

FACULTY_OF_ENGINEERING = "https://www.handbook.unsw.edu.au/FacultyOfEngineering/browse?id=5fa56ceb4f0093004aa6eb4f0310c7af"
SPECIALISATIONS = []

def get_links(browser, id):
    html = BeautifulSoup(browser.page_source, "html.parser")

    specialisation_tiles = html.find(id=id).find_all("a")

    specialisation_links = []

    for a in specialisation_tiles:
        link = a["href"].replace("\n", "").strip()

        if "/search" in link:
            continue

        specialisation_links.append(link)
        print(link)

    return specialisation_links

# Open browser
browser = webdriver.Chrome("./chromedriver") # NEED TO BE CHROME VERSION 85
browser.get(FACULTY_OF_ENGINEERING)

# Click show more button
see_more = browser.find_elements_by_xpath("//*[@id='aosUndergraduate1']/div/button")[0]
see_more.click()

# Scrape all specialisation majors
specialisation_majors = get_links(browser, "aosUndergraduate1")

# Click Honours button
honours_button = browser.find_elements_by_xpath("//*[@id='3Control']/button")[0]
honours_button.click()

# Click show more button
see_more = browser.find_elements_by_xpath("//*[@id='aosUndergraduate2']/div/button")[0]
see_more.click()

# Scrape all specialisation honours
specialisation_honours = get_links(browser, "aosUndergraduate2")

# Close browser
browser.quit()

SPECIALISATIONS = specialisation_majors + specialisation_honours

print(SPECIALISATIONS)