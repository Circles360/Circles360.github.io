from selenium import webdriver
from bs4 import BeautifulSoup
import scrape
import time

FACULTY_OF_ENGINEERING = "https://www.handbook.unsw.edu.au/FacultyOfEngineering/browse?id=5fa56ceb4f0093004aa6eb4f0310c7af"

def get_links(browser, id):
    # Allow page to load
    time.sleep(1)

    html = BeautifulSoup(browser.page_source, "html.parser")
    specialisation_tiles = html.find(id=id).find_all("a")

    specialisation_links = []

    for a in specialisation_tiles:
        link = a["href"].replace("\n", "").strip()

        if "/search" in link:
            continue

        specialisation_links.append(scrape.HANDBOOK_URL + link)

    return specialisation_links

# Open browser
browser = webdriver.Chrome("./chromedriver") # NEED TO BE CHROME VERSION 85
browser.get(FACULTY_OF_ENGINEERING)

# Show all specialisation majors and scrape
see_more = browser.find_elements_by_xpath("//*[@id='aosUndergraduate1']/div/button")[0]
see_more.click()
specialisation_majors = get_links(browser, "aosUndergraduate1")

# Show all specialisation honours and scrape
honours_button = browser.find_elements_by_xpath("//*[@id='3Control']/button")[0]
honours_button.click()
see_more = browser.find_elements_by_xpath("//*[@id='aosUndergraduate2']/div/button")[0]
see_more.click()
specialisation_honours = get_links(browser, "aosUndergraduate2")

# Show all double degrees and scrape
see_more = browser.find_elements_by_xpath("//*[@id='multiCourseUndergraduate']/div/button")[0]
see_more.click()
double_degrees = get_links(browser, "multiCourseUndergraduate")

# Close browser
browser.quit()

SPECIALISATIONS = {
    "majors": specialisation_majors,
    "honours": specialisation_honours,
    "double_degrees": double_degrees
}

scrape.write_to_file("links_eng_degrees.json", SPECIALISATIONS)