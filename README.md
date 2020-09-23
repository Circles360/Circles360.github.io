# Circles

## Overview

Circles is a **visual degree planner** for UNSW undergraduate students, available [here](circles360.github.io). By representing a degree as a flowchart, Circles makes it easy for anyone to choose and explore which direction they would like to take their degree in. Once students have chosen the courses that they would like to take, a degree plan is automatically generated for them, which takes into account course prerequisites and term availability. Students can then drag and drop courses as needed to customise their degree plan.

Our project can be split into 3 subprojects:
1. 2021 Handbook Scraper
2. Flowchart
3. Smart Degree Planner

**NOTE:** Currently only SENGAH (Software Engineering), and COMPA1 (Computer Science) with its optional minors are supported. This is because each degree requires a manual check to ensure there were no errors (many times the Handbook is missing information 😢). Since we were all learning React for the first time, we didn't have time for this task.

**NOTE:** The UNSW handbook is currently undergoing major updates for 2021. Although we try our best, some data may be incorrect or outdated, so some nodes on our flowchart may not be selectable. Please refer to the handbook for the latest update.

### 1. 2021 Handbook Scraper

The scraper is written in **python** and is located in `/src/webscraper`. It scrapes all faculty's programs, and each program's specialisations and honours degrees. It also scrapes all courses available to undergraduate students. This information is then dumped into the corresponding `.json` files to be read by the Flowchart.

The scraper ignores irrelevant faculties such as **DVC (Academic Board of Studies)**, **UNSW Canberra** and **UNSW Global** and their respective courses since Circles is for typical undergraduate students in Sydney.

To prevent `403 errors` from occuring, a random interval between 15 and 20 seconds is set between each page request. It takes just over 13 hours to accumulate all necessary data.

Manual fixes are documented in `manual_fixes.txt` when we found an error (such as missing prerequisites not listed by the Handbook, e.g. [DESN2000](https://www.handbook.unsw.edu.au/undergraduate/courses/2021/DESN2000/))

| File name                | Purpose                                                                                                                        |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| courses.json             | Data for all undergraduate courses.                                                                                                                           |
| programs.json            | Data for all undergraduate programs.                                                                                                                          |
| specialisations.json     | Data for all majors, minors and honours in each program.                                                                                                      |
| subject_areas.json       | Translation for `/[A-Z]{4}/` and the corresponding subject area.                                                                                              |
| links_courses.json       | All links for all undergraduate courses. Used to generate courses.json.                                                                                       |
| links_degrees.json       | All links for all undergraduate degrees. Used to generate programs.json and specialisations.json.                                                             |
| filter_course_codes.json | Union of courses that are in the faculties **DVC (Academic Board of Studies)**, **UNSW Canberra** and **UNSW Global**. Used to filter out irrelevant courses. |

### 2. Flowchart

Our flowchart is rendered using the `react-flow-renderer` npm library. Data from our webscraper is put through the corresponding generator file in **src/generatedata** which formats node/edge data appropriately and adds any custom changes specific to that degree. This data is stored in **data.json** and then read by **map.js** to render the entire flowchart.

Courses are represented by cicular nodes and connecting edges represent a prerequisite->unlock relationship. Courses are unlocked when you meet all its prerequisites. Clicking on a course will add it to your plan and potentially unlock future courses on the flowchart.

We have implemented many advanced algorithms to accurately update the state of the flowchart and to improve the user experience, all of which will be explained below. For further clarity, examples will be provided. These examples refer to the flowchart of **Engineering (Honours) - Software Engineering.**

#### Selecting Courses
Clicking on an unselected course will select it. This adds it to your plan and can potentially unlock other courses.

*For example, selecting COMP1511 will unlock COMP2521*

#### Unselecting Courses
Clicking on a selected course will unselect it. This removes it from your plan. Furthermore, any courses whose prerequisites are no longer met will also be unselected.

*For example, if both COMP1511 and COMP2521 are selected, unselecting COMP1511 will also unselect COMP2511. This is because COMP2511 requires COMP1511 as a prerequisite course.*

#### Selectable Courses
Courses will partially light up if they are selectable. A course becomes selectable if you clear all its conditions, whether that be prerequisite courses, units taken, etc.

*For example, selecting COMP1511 will unlock COMP2521, making it selectable. This is because COMP2511 requires COMP1511 as a prerequisite course.*

#### Toggling Exclusion/Equivalent Courses
Some courses come with an advanced alternative to cater to students who wish to challenge themselves (e.g. MATH1131/MATH1141). UNSW refers to these as *exclusion* or *equivalent* courses. Double clicking on these courses (marked by a black swap symbol) will toggle between them.

There are some cases where toggling between courses is not so straight forward. *For example, COMP6441/COMP6841. COMP6841 requires COMP2521 to unlock it whereas COMP6441 does not. COMP6841 can unlock COMP6448 whereas COMP6441 cannot*. However, you do not have to worry about this as our flowchart will update to intuitively and accurately reflect all changes. Try it yourself! 

#### Hovering Over Nodes
Hovering over a node will light up paths (edges) you can take to unlock it. It will also display additional informatino in the top left corner such as course name, term availability, conditions, etc.

#### Search Bar
If you can't find a course, our search bar in the top right will take you directly to any course you are looking for (if it exists on the flowchart).

#### Side Bar
UNSW provides further requirements which need to be fulfilled when planning a degree. This usually involves some combination of **Core Courses** and **Electives**. You must meet the unit requirements for each of them. Our side bar reflects this information and will update accordingly when you select/unselect courses.

#### Free Electives/General Education
At the bottom of the flowchart, you can select from thousands of courses which do not exist on the flowchart (in other words, free electives and general education courses). Selecting these courses will add them to your Smart Degree Planner at the bottom of the page.

**NOTE:** These courses are not currently linked to the flowchart or side bar. This is because UNSW's handbook has many inconsistencies and is also currently undergoing major updates for 2021. Whilst we can ensure that the data on the flowchart has been manually checked and are very reliable (especially Software Engineering), we cannot guarantee the same for free electives/general education units. Due to both the competition's deadline and UNSW's current handbook renovations, we did not have the manpower/time to manually check all of UNSW's thousands of courses.

#### Future Plans
Once the 2021 updates are finalised, we plan on fully integrating free electives and general education units into the flowchart. This will mean that you can select from **any** one of UNSW's thousands of courses **and have their impact reflected on the flowchart**.

### 3. Smart Degree Planner

The smart degree planner was designed with the `react-beautiful-dnd` npm library and takes all the courses selected by the Flowchart and allocates them a term to be taken in during your degree. As explained on the page, our algorithm:
- allocates 18 UOC per term
- ensures courses have their prerequisites met
- ensures courses are offered in allocated terms
- does not allocate courses in Summer term

The smart degree planner updates everytime a course is added or removed (selected or deselected from the Flowchart).

Once courses have been allocated, students can drag and drop courses to personalise their degree plan. Each time a course is moved, the algorithm will ensure all prerequisites are met and that each course is offered in the enrolled term. If not, a consideration message will appear at the top.

**Note:** These messages are called *considerations* and not *errors* because there is always the possibility our data is incorrect due to limited information provided by the Handbook. We want to allow students to still be able to use the degree planner even if we have made a mistake.

## Hasn't this been done before?

Yeah, it has, but not well. We wanted to create a product that was both visually informative and easy to use. These qualities were not present in our competitors:

- [CSESoc's Degree Planner](https://github.com/csesoc/degree-planner): isn't deployed, and when run locally only has data for 4 degrees. Circles has data ready for all programs and degrees.
- [UPlanner](https://uplanner.bopa.ng/): doesn't exist anymore and also did not consider prerequisites.
- [Joebangles](https://joebangles.tobinsmit.com/): an outdated service and also does not check prerequisites.
- [Triangles](https://triangles.tobinsmit.com/): does not check prerequisties and courses have to be manually added.
