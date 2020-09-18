import React from 'react';
import { Container, Segment, Header, Message, Grid } from 'semantic-ui-react'

import dataJSON from "../maps/EngineeringHonoursSoftware/data.json"
import rawCoursesJSON from "../webscraper/courses.json"

import programsJSON from "../webscraper/programs.json"
import specialisationsJSON from "../webscraper/specialisations.json"

import { DragDropContext } from "react-beautiful-dnd"
import Term from "./degreeplanner-term"

const REGEX_COURSE_CODE = /[A-Z]{4}\d{4}/g;

const mapTermIds = (term) => {
    if (term === "Summer Term") return "TS";
    if (term === "Term 1") return "T1";
    if (term === "Term 2") return "T2";
    if (term === "Term 3") return "T3";
    return;
}

const mapTermFull = (term) => {
    if (term === "TS") return "Summer Term";
    if (term === "T1") return "Term 1";
    if (term === "T2") return "Term 2";
    if (term === "T3") return "Term 3";
}

const updateCourses = (coursesJSON, dataJSON) => {
    dataJSON.forEach(course => {
        if (!(course.id in coursesJSON)) return;
        coursesJSON[course.id].conditions.prereqs_executable = course.data.conditions.prereqs_executable
        coursesJSON[course.id].terms = course.data.terms;
    });
    return coursesJSON;
}

const coursesJSON = updateCourses(rawCoursesJSON, dataJSON);

const getCourses = (selectedCourses) => {
    const courses = {}

    selectedCourses.forEach(c => {
        if (!(c in coursesJSON)) return;

        let termsAvailable;
        if (!coursesJSON[c].terms) {
            termsAvailable = ["TS", "T1", "T2", "T3"];
        } else {
            termsAvailable = coursesJSON[c].terms.map(term => mapTermIds(term));
        }

        courses[c] = {
            id: c,
            content: `${c} - ${coursesJSON[c].course_name}`,
            termsAvailable: termsAvailable,
            placeholderTerms: !coursesJSON[c].terms,
            units: coursesJSON[c].units
        }
    })

    return courses
}

const generateTerms = (yearId) => {
    const terms = {}

    // Terms have id of <YEAR>T<TERM TYPE> eg: 1TS is 1st Year, Summer Term

    const TSKey = `${yearId}TS`;
    const T1Key = `${yearId}T1`;
    const T2Key = `${yearId}T2`;
    const T3Key = `${yearId}T3`;
    terms["termOrder"] = [TSKey, T1Key, T2Key, T3Key];

    terms[TSKey] = {
        id: TSKey,
        title: `Year ${yearId} - Summer Term`,
        courseIds: []
    }

    terms[T1Key] = {
        id: T1Key,
        title: `Year ${yearId} - Term One`,
        courseIds: []
    }

    terms[T2Key] = {
        id: T2Key,
        title: `Year ${yearId} - Term Two`,
        courseIds: []
    }

    terms[T3Key] = {
        id: T3Key,
        title: `Year ${yearId} - Term Three`,
        courseIds: []
    }

    return terms;
}

const addPriority = (priority, courseId, unlocksCourse) => {
    if (!(courseId in coursesJSON)) return priority;
    if (!coursesJSON[courseId].conditions.prerequisites) return priority;

    for (const prereq of coursesJSON[courseId].conditions.prerequisites) {
        if (!(prereq in priority)) continue;
        if (courseId === prereq) continue;

        priority[prereq].unlocks.push(unlocksCourse);
        priority = addPriority(priority, prereq, unlocksCourse);
    }

    return priority;
}

const prioritiseCourses = (selectedCourses) => {
    // Initiate priorities
    var priority = {};
    for (const courseId of selectedCourses) {
        if (!(courseId in coursesJSON)) continue

        priority[courseId] = {
            courseId: courseId,
            level: Number(courseId[4]),
            unlocks: [],
            termsAvailable: coursesJSON[courseId].terms ? coursesJSON[courseId].terms.filter(t => t !== "Summer Term").length : 0
        }
    }

    // Calculate priorities
    for (const courseId of selectedCourses) {
        priority = addPriority(priority, courseId, courseId);
    }

    // Sort keys of priority into array to give into prioritised
    const prioritised = Object.values(priority);

    prioritised.sort((a, b) => {
        // Sort by:
        // 1. Level (ASC)
        // 2. Unlocks (DESC)
        // 3. Terms Available (ASC)

        if (a.level === b.level) {
            if (a.unlocks.length === b.unlocks.length) {
                return a.termsAvailable - b.termsAvailable; // Ascending
            }
            return b.unlocks.length - a.unlocks.length; // Descending
        }
        return a.level - b.level; // Ascending
    });

    return prioritised;
}

const checkPrereqsMet = (termPlan, termId, courseId) => {

    let runningTotalUnits = 0;
    let prereqsExecutable = coursesJSON[courseId].conditions.prereqs_executable;

    // Get courses taken up to termId
    const coursesTaken = [];
    for (const t in termPlan) {
        if (t === termId) break;
        coursesTaken.push(...termPlan[t].courseIds);
        runningTotalUnits += termPlan[t].courseIds.reduce((total, c) => total + (c in coursesJSON ? coursesJSON[c].units : 0), 0);
    }
    // console.log(courseId, "courses taken:", coursesTaken);

    if (coursesJSON[courseId].conditions.units_required) {
        if (runningTotalUnits < coursesJSON[courseId].conditions.units_required) return false;
    }

    if (!prereqsExecutable) return true; // No executable

    for (const course of coursesTaken) {
        prereqsExecutable = prereqsExecutable.replace(course, "1");
    }
    prereqsExecutable = prereqsExecutable.replace(REGEX_COURSE_CODE, "0");

    // eslint-disable-next-line
    return eval(prereqsExecutable);
}

const addCourseToPlan = (termPlan, courseId) => {
    const maxUOC = 18;

    for (const termId in termPlan) {
        if (termId.includes("TS")) continue;
        if (termPlan[termId].units >= maxUOC) continue;

        const courseUnits = coursesJSON[courseId].units;
        if (termPlan[termId].units + courseUnits > maxUOC) continue;

        let termsAvailable;
        if (!(coursesJSON[courseId].terms)) {
            termsAvailable = ["TS", "T1", "T2", "T3"];
        } else {
            termsAvailable = coursesJSON[courseId].terms.map(term => mapTermIds(term));
        }

        if (!(termsAvailable.includes(termId.substring(1, 3)))) continue;

        // Need to check prerequisites have been met here
        if (!checkPrereqsMet(termPlan, termId, courseId)) continue;

        // Add course to plan
        termPlan[termId].units += coursesJSON[courseId].units;
        termPlan[termId].courseIds.push(courseId);
        return termPlan;
    }

    // Default put in Year 1 Summer Term if cannot find a good position for it.
    // let termsAvailable;
    // if (!(coursesJSON[courseId].terms)) {
    //     termsAvailable = ["TS", "T1", "T2", "T3"];
    // } else {
    //     termsAvailable = coursesJSON[courseId].terms.map(term => mapTermIds(term));
    // }

    termPlan["1TS"].units += coursesJSON[courseId].units;
    termPlan["1TS"].courseIds.push(courseId);
    return termPlan;
}

const populateTerms = (maxYears, prioritisedCourses) => {
    const maxTerms = 3;

    const termPlan = {};
    for (let year = 1; year <= maxYears; year++) {
        termPlan[`${year}TS`] = {
            units: 0,
            courseIds: []
        };
        for (let term = 1; term <= maxTerms; term++) {
            const termId = `${year}T${term}`;
            termPlan[termId] = {
                units: 0,
                courseIds: []
            };
        }
    }

    // For each course in the prioritised, slot into earliest possible term
    for (const course of prioritisedCourses) {
        addCourseToPlan(termPlan, course.courseId);
    }

    return termPlan;
}

const makePlan = (plan, maxYears, selectedCourses) => {
    const prioritisedCourses = prioritiseCourses(selectedCourses);

    const termPlan = populateTerms(maxYears, prioritisedCourses);

    for (const termId in termPlan) {
        const year = termId[0];
        plan[year][termId].courseIds = termPlan[termId].courseIds
    }

    return plan;
}

const generatePlanScaffold = (years, selectedCourses) => {
    let plan = {};

    for (let year = 1; year <= years; year++) {
        plan[year.toString()] = generateTerms(year)
    }

    plan = makePlan(plan, years, selectedCourses)

    return plan;
}

class DegreePlanner extends React.Component {
    state = {
        courses: getCourses(this.props.selectedCourses),
        selectedCourses: this.props.selectedCourses,
        plan: generatePlanScaffold(4, this.props.selectedCourses),
        program: this.props.program,
        specialisations: this.props.specialisations
    };

    onDragEnd = result => {
        const { destination, source, draggableId } = result;

        // Null destination means label was not dragged into a droppable
        if (!destination) return;

        // Label was dragged into the same position
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const sourceYear = source.droppableId[0];
        const start = this.state.plan[sourceYear][source.droppableId];
        const destinationYear = destination.droppableId[0];
        const finish = this.state.plan[destinationYear][destination.droppableId];

        if (start === finish) {
            const newCourseIds = Array.from(start.courseIds);
            newCourseIds.splice(source.index, 1); // Remove 1 item at source.index
            newCourseIds.splice(destination.index, 0, draggableId); // Insert dragggableId into destination
            const newTerm = {
                ...start,
                courseIds: newCourseIds
            };

            const newState = {
                ...this.state,
                plan: {
                    ...this.state.plan,
                    [sourceYear]: {
                        ...this.state.plan[sourceYear],
                        [newTerm.id]: newTerm,
                    }
                }
            }

            this.setState(newState);
            return;
        }

        // Moving from one list to another
        const startCourseIds = Array.from(start.courseIds)
        startCourseIds.splice(source.index, 1);

        const newStart = {
            ...start,
            courseIds: startCourseIds,
        }

        const finishCourseIds = Array.from(finish.courseIds)
        finishCourseIds.splice(destination.index, 0, draggableId);

        const newFinish = {
            ...finish,
            courseIds: finishCourseIds
        }

        const newState = this.state;
        newState.plan[sourceYear][newStart.id] = newStart;
        newState.plan[destinationYear][newFinish.id] = newFinish;

        this.setState(newState);
    }

    getConsiderationMessages = (state) => {
        const plan = state.plan;
        const courses = state.courses;
        const selectedCourses = state.selectedCourses;
        const program = state.program;
        const programUnits = programsJSON[program].units;
        const specialisations = state.specialisations;

        const considerationMessages = [];
        const handbookVersion = 2021;

        const getCourseLink = (courseId) => {
            return <a target="_blank" rel="noopener noreferrer" href={`https://www.handbook.unsw.edu.au/undergraduate/courses/${handbookVersion}/${courseId}`}>{courseId}</a>;
        }

        const getProgramLink = (programId) => {
            return <a target="_blank" rel="noopener noreferrer" href={`https://www.handbook.unsw.edu.au/undergraduate/programs/${handbookVersion}/${programId}`}>{programId} - {programsJSON[programId].name}</a>;
        }

        const getSpecialisationsLink = (specialisationId) => {
            return <a target="_blank" rel="noopener noreferrer" href={`https://www.handbook.unsw.edu.au/undergraduate/specialisations/${handbookVersion}/${specialisationId}`}>{specialisationId} - {specialisationsJSON[specialisationId].name}</a>;
        }

        const getCoursesInLevel = (rawList) => {
            rawList = rawList.flat().filter(c => c !== "ANY COURSE");
            const allCourseIds = Object.keys(coursesJSON);
            const courseList = [];
            rawList.forEach(courseId => {
                if (courseId.match(REGEX_COURSE_CODE)) {
                    courseList.push(courseId);
                } else if (courseId.match(/^[A-Z]{4}\d$/)) {
                    const relevantCourses = allCourseIds.filter(c => c.includes(courseId));
                    relevantCourses.forEach(c => {
                        if (courseList.includes(c)) return;
                        courseList.push(c);
                    });
                }
            });
            return courseList;
        }

        let totalUnits = 0;
        const termPlan = {}
        for (const year in plan) {
            for (const term in plan[year]) {
                if (term === "termOrder") continue;
                termPlan[term] = plan[year][term]
                totalUnits += termPlan[term].courseIds.reduce((total, c) => total + (c in coursesJSON ? coursesJSON[c].units : 0), 0);
            }
        }

        if (totalUnits < programUnits) {
            considerationMessages.push(
                <Message.Item>
                    {getProgramLink(program)} requires {programUnits} units. You have taken {totalUnits} units.
                </Message.Item>
            )
        }
        specialisations.forEach(degree => {
            const coursesInDegree = [];
            for (const levelName in specialisationsJSON[degree].structure) {
                const level = specialisationsJSON[degree].structure[levelName];
                if (!level.courses) continue;
                coursesInDegree.push(...getCoursesInLevel(level.courses))
            }
            const degreeUnitsRequired = specialisationsJSON[degree].units
            let degreeUnitsTaken = 0;
            for (const term in termPlan) {
                degreeUnitsTaken += termPlan[term].courseIds.reduce((total, c) => total + ((c in coursesJSON && coursesInDegree.includes(c)) ? coursesJSON[c].units : 0), 0);
            }

            if (degreeUnitsTaken < degreeUnitsRequired) {
                considerationMessages.push(
                    <Message.Item>
                        {getSpecialisationsLink(degree)} requires {degreeUnitsRequired} units. You have taken {degreeUnitsTaken} units.
                    </Message.Item>
                )
            }
        })


        totalUnits = 0;
        for (const year in plan) {
            for (const term in plan[year]) {
                if (term === "termOrder") continue;
                for (const courseId of termPlan[term].courseIds) {
                    const conditions = coursesJSON[courseId].conditions
                    if (!conditions.units_required) continue;
                    if (totalUnits < conditions.units_required) {
                        considerationMessages.push(
                            <Message.Item>
                                {getCourseLink(courseId)} prerequisites have not been met: {conditions.units_required} UOC required.
                            </Message.Item>
                        )
                    }
                }

                totalUnits += termPlan[term].courseIds.reduce((total, c) => total + (c in coursesJSON ? coursesJSON[c].units : 0), 0);
            }
        }

        // Check levels for each
        specialisations.forEach(degree => {
            const coreCourses = []
            for (const levelName in specialisationsJSON[degree].structure) {
                const level = specialisationsJSON[degree].structure[levelName];
                if (!level.units_required) continue;
                if (level.courses.filter(c => c !== "ANY COURSE").length === 0) continue;
                if (level.name.match(/[Cc]ore/g)) level.courses.flat().forEach(c => coreCourses.push(c));

                let levelCourses = getCoursesInLevel(level.courses);
                if (!level.name.match(/[Cc]ore/g)) levelCourses = levelCourses.filter(c => !coreCourses.includes(c))
                const selectedInLevel = levelCourses.filter(c => selectedCourses.includes(c));
                const selectedUnits = selectedInLevel.reduce((total, c) => total + (c in coursesJSON ? coursesJSON[c].units : 0), 0);

                if (selectedUnits < level.units_required) {
                    considerationMessages.push(
                        <Message.Item>
                            {degree} - {level.name} requires {level.units_required} units. You have taken {selectedUnits} units.
                        </Message.Item>
                    );
                }
            }
        })

        for (const year in plan) {
            for (const term in plan[year]) {
                if (term === "termOrder") continue;
                for (const courseId of plan[year][term].courseIds) {
                    if (!checkPrereqsMet(termPlan, term, courseId)) {
                        if (coursesJSON[courseId].conditions.prereqs_executable) {
                            considerationMessages.push(
                                <Message.Item>
                                    {getCourseLink(courseId)} prerequisites have not been met: {coursesJSON[courseId].conditions.prereqs_executable
                                        .replaceAll("|| 0 ||", "||")
                                        .replaceAll("&& 0 &&", "&&")
                                        .replaceAll("&& 0 ||", "||")
                                        .replaceAll("|| 0 &&", "&&")
                                        .replaceAll("&&", "and")
                                        .replaceAll("||", "or")
                                    }
                                </Message.Item>
                            )
                        }
                    }
                }
            }
        }

        // Check terms
        for (const yearId in plan) {
            for (let termId in plan[yearId]) {
                if (termId === "termOrder") continue;
                const term = termId.substring(1, 3)
                for (const courseId of plan[yearId][termId].courseIds) {
                    // if (!courses[courseId].termsAvailable) {
                    if (!courses[courseId]) {
                        considerationMessages.push(
                            <Message.Item>
                                {getCourseLink(courseId)}: could not retrieve course. Check handbook for more details.
                            </Message.Item>
                        )
                    } else if (courses[courseId].placeholderTerms) {
                        considerationMessages.push(
                            <Message.Item>
                                {getCourseLink(courseId)}: unknown term availability. Check handbook for more details.
                            </Message.Item>
                        )
                    } else if (!courses[courseId].termsAvailable.includes(term)) {
                        considerationMessages.push(
                            <Message.Item>
                                {getCourseLink(courseId)} is only available in {courses[courseId].termsAvailable.map(term => mapTermFull(term)).join(", ")}
                            </Message.Item>
                        )
                    }
                }
            }
        }

        const style = {
            marginBottom: "20px",
            transition: "0.3s ease"
        }

        if (considerationMessages.length === 0) {
            return (
                <Message style={style} positive>
                    <Message.Header>Considerations</Message.Header>
                    <Message.List>
                        Looks good to me!
                    </Message.List>
                </Message>
            )
        }

        return (
            <Message style={style} error>
                <Message.Header>Considerations</Message.Header>
                <Message.List>
                    {considerationMessages}
                </Message.List>
            </Message>
        );
    }

    render() {
        return (
            <Segment>
                <Container>
                    <Header as="h2" textAlign="center" style={{marginTop: "50px"}}>Plan your degree</Header>
                    <p>The following degree plan has been generated based on the courses you have selected above. By default, our algorithm:</p>
                    <ul>
                        <li>allocates 18 UOC per term</li>
                        <li>ensures courses have their prerequisites met</li>
                        <li>ensures courses are offered in allocated terms</li>
                        <li>does not allocate courses in Summer Term</li>
                    </ul>
                    <p>If the algorithm cannot place the course in a valid term, then it will place it <em>Year 1 - Semmmer Term</em> for you.</p>

                    <p><b>Drag and drop the courses below to customise your degree plan!</b></p>

                    <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                        {this.getConsiderationMessages(this.state)}
                        {Object.keys(this.state.plan).map(yearId => (
                            <Grid key={yearId} columns={4}>
                                {this.state.plan[yearId].termOrder.map(termId => {
                                    const term = this.state.plan[yearId][termId];
                                    const courses = term.courseIds.map(courseId => this.state.courses[courseId]);
                                    return (
                                        <Grid.Column key={termId}>
                                            <Term key={term.id} term={term} courses={courses} allCourses={this.state.courses}/>
                                        </Grid.Column>
                                    );
                                })}
                            </Grid>
                        ))}
                    </DragDropContext>
                </Container>
                <Container fluid style={{textAlign: "center", marginTop: "50px", height: "auto", padding: "20px"}}>
                    <p><b>Disclaimer:</b> While we try our best, Circles is not an official UNSW website and does not guarantee accuracy or reliability (e.g. a course may not have its term availability published on the Handbook)</p>
                    <p>Made by SRKO, 2020</p>
                    <div>
                        <a style={{margin: "5px"}} href="/">Home</a>
                        <a style={{margin: "5px"}} href="https://github.com/Circles360/Circles360.github.io" target="_blank" rel="noopener noreferrer">GitHub</a>
                    </div>
                </Container>
            </Segment>
        );
    }
}

export default DegreePlanner