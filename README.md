# Circles

## Overview

Circles is a **visual degree planner** for UNSW undergraduate students, available [here](circles360.github.io). By representing a degree as a flowchart, Circles makes it easy for anyone to choose and explore which direction they would like to take their degree in. Once students have chosen the courses that they would like to take, a degree plan is automatically generated for them, which takes into account course prerequisites and term availability. Students can then drag and drop courses as needed to customise their degree plan.

Our project can be split into 3 subprojects:
1. 2021 Handbook Scraper
2. Flowchart
3. Smart Degree Planner

**NOTE:** Currently only SENGAH (Software Engineering), and COMPA1 (Computer Science) with its optional minors are supported. This is because each degree requires a manual check to ensure there were no errors (many times the Handbook is missing information 😢). Since we were all learning React for the first time, we didn't have time for this task.

**NOTE:** The UNSW handbook is currently undergoing updates for 2021. Although we try our best, some data may be incorrect or outdated, so some nodes on our flowchart may not be selectable. Please refer to the handbook for the latest update.

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

Our flowchart is rendered using the `react-flow-renderer` npm library. It reads all the data scraped by the web scraper and displays relevant courses and their prerequisites onto the screen. Coures are represented by circular nodes, and prerequisites are represented by edges. Clicking a course will add it to your plan and unlock future courses. We implement many advanced algorithms to accurately update the state of the flowchart and to improve the user experience, all of which will be explained below. All examples provided refer to the flowchart of Engineering (Honours) - Software Engineering.

#### Selecting Courses
Click on an unselected course to select it. This will add it to your plan and can potentially unlock other courses. 

For example, selecting COMP1511 will unlock COMP2521.

#### Unselecting Courses
Click on a selected course to unselect it. This will remove it from your plan. Furthermore, any courses which relied on that course as a prerequisite will be unselected. 

For example, if both COMP1511 and COMP2521 are selected, unselecting COMP1511 will also unselect COMP2511. This is because COMP2511 requires you to have taken COMP1511.

#### Selectable Courses
Courses will partially light up if they can be selected. A course can be selected if you meet all its conditions, whether that be prerequisite courses, units taken, etc.

#### Toggling Exclusion/Equivalent Courses
UNSW provides more advanced options for some courses to cater to students who wish to challenge themselves. For example, Math1131/Math1141. Double clicking on these courses (marked by a black swap symbol) will toggle between them.

Sometimes, toggling between courses is not as straight forward. For example, COMP6841/COMP6441. COMP6841 requires COMP2521 to unlock it whereas COMP6441 does not. COMP6841 can unlock COMP6448 whereas COMP6441 cannot. However you do not have to worry about that as our flowchart will dynamically update to intuitively and accurately reflect all changes. Try it yourself!

#### Hovering Over Nodes
Hovering over a node will light up paths you can take to unlock it. It will also display information about it in the top left corner such as name, term availability, prerequisites, units required, exclusion courses, etc.

#### Search Bar
Our seach bar in the top right will take you directly to any course you are looking for provided it exists on the flowchart. 


#### Side Bar
UNSW provides further requirements which need to be fulfilled when planning a degree. This usually involves some combination of **Core Courses** and **Electives**. You must take enough courses to satisfy the units required. Our side bar reflects this information and will be updated accordingly when you select/unselect courses.

Currently, the side bar does not deal with Free Electives and General Education units.

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
