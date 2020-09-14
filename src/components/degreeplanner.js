import React from 'react';
import { Icon, Button, Container, Segment, Header, Label, Grid } from 'semantic-ui-react'

// import programsJSON from "../webscraper/programs.json"
// import specialisationsJSON from "../webscraper/specialisations.json"
import coursesJSON from "../webscraper/courses.json"
import specialisationsJSON from "../webscraper/specialisations.json"

import { DragDropContext } from "react-beautiful-dnd"
import Term from "./degreeplanner-term"


const getCourses = (selectedCourses) => {
    const courses = {}

    selectedCourses.forEach(c => {
        if (!(c in coursesJSON)) return;
        if (!(coursesJSON[c].terms)) {
            console.log("no terms offered for", c);
            return;
        }
        const termsAvailable = coursesJSON[c].terms.map(term => {
            if (term === "Summer Term") return "TS"
            if (term === "Term 1") return "T1"
            if (term === "Term 2") return "T2"
            if (term === "Term 3") return "T3"
        })

        courses[c] = {
            id: c,
            content: `${c} - ${coursesJSON[c].course_name}`,
            termsAvailable: termsAvailable,
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
            termsAvailable: coursesJSON[courseId].terms ? coursesJSON[courseId].terms.filter(t => t != "Summer Term").length : 0
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
    const REGEX_COURSE_CODE = /[A-Z]{4}\d{4}/g;

    let prereqsExecutable = coursesJSON[courseId].conditions.prereqs_executable;
    if (!prereqsExecutable) return true; // No executable

    // Get courses taken up to termId
    const coursesTaken = [];
    for (const t in termPlan) {
        if (t === termId) break;
        coursesTaken.push(...termPlan[t].courseIds);
    }

    for (const course of coursesTaken) {
        prereqsExecutable = prereqsExecutable.replace(course, "1");
    }
    prereqsExecutable = prereqsExecutable.replace(REGEX_COURSE_CODE, "0");
    return eval(prereqsExecutable);
}

const addCourseToPlan = (termPlan, courseId) => {
    const maxUOC = 18;

    for (const termId in termPlan) {
        if (termPlan[termId].units >= maxUOC) continue;

        const courseUnits = coursesJSON[courseId].units;
        if (termPlan[termId].units + courseUnits > maxUOC) continue;

        if (!(coursesJSON[courseId].terms)) {
            console.log("cannotfindterms for ", courseId);
            continue;
        }

        const termsAvailable = coursesJSON[courseId].terms.map(term => {
            if (term === "Summer Term") return "TS"
            if (term === "Term 1") return "T1"
            if (term === "Term 2") return "T2"
            if (term === "Term 3") return "T3"
        })
        if (!(termsAvailable.includes(termId.substring(1, 3)))) continue;

        // Need to check prerequisites have been met here
        if (!checkPrereqsMet(termPlan, termId, courseId)) continue;

        // Add course to plan
        termPlan[termId].units += coursesJSON[courseId].units;
        termPlan[termId].courseIds.push(courseId);
        return termPlan;
    }

    console.log("ERROR WITH ", courseId); // TODO: put in a "error" segment
}

const populateTerms = (maxYears, prioritisedCourses) => {
    const maxTerms = 3;

    const termPlan = {};
    for (let year = 1; year <= maxYears; year++) {
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
        plan: generatePlanScaffold(4, this.props.selectedCourses)
    };

    onDragStart = result => {
        const { draggableId } = result;
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

    render() {
        // this.state.courses = getCourses(this.props.selectedCourses);
        // this.state.plan = generatePlanScaffold(4, this.props.selectedCourses);
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

                    <p>Drag and drop the courses below to further customise your degree plan!</p>

                    <p><em>Please note that our data is scraped from the UNSW Handbook and may have some inconsistencies.</em></p>
                    <p><em>Also note, you can drag a course into a term even if it is not offered as our data may be out of date, please double check :) </em></p>

                    <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                        {Object.keys(this.state.plan).map(yearId => (
                            <Grid columns={4}>
                                {this.state.plan[yearId].termOrder.map(termId => {
                                    const term = this.state.plan[yearId][termId];
                                    const courses = term.courseIds.map(courseId => this.state.courses[courseId]);
                                    return (
                                        <Grid.Column>
                                            <Term key={term.id} term={term} courses={courses} allCourses={this.state.courses}/>
                                        </Grid.Column>
                                    );
                                })}
                            </Grid>
                        ))}
                    </DragDropContext>
                    <Segment style={{backgroundColor: "lightpink"}}>
                        <Header as="h3">Error messages</Header>
                        <p>None</p>
                    </Segment>
                </Container>
            </Segment>
        );
    }
}

export default DegreePlanner