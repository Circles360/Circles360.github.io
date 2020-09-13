import React from 'react';
import { Icon, Button, Container, Segment, Header, Dropdown, Grid } from 'semantic-ui-react'

// import programsJSON from "../webscraper/programs.json"
// import specialisationsJSON from "../webscraper/specialisations.json"
import coursesJSON from "../webscraper/courses.json"

import { DragDropContext } from "react-beautiful-dnd"
import Term from "./degreeplanner-term"

const selectedCourses = ["COMP1511", "COMP1521", "COMP1531", "MATH1141", "MATH1241", "ENGG1000", "COMP3331", "MATH1081", "COMP2521"];

const getCourses = (selectedCourses) => {
    const courses = {}

    selectedCourses.forEach(c => {
        const termsAvailable = coursesJSON[c].terms.map(term => {
            if (term === "Summer Term") return "TS"
            if (term === "Term 1") return "T1"
            if (term === "Term 2") return "T2"
            if (term === "Term 3") return "T3"
        })

        courses[c] = {
            id: c,
            content: `${c} - ${coursesJSON[c].course_name}`,
            termsAvailable: termsAvailable
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
        title: "Summer Term",
        courseIds: []
    }

    terms[T1Key] = {
        id: T1Key,
        title: "Term 1",
        courseIds: []
    }

    terms[T2Key] = {
        id: T2Key,
        title: "Term 2",
        courseIds: []
    }

    terms[T3Key] = {
        id: T3Key,
        title: "Term 3",
        courseIds: []
    }

    return terms;
}

const populateTerms = (plan) => {
    plan["1"]["1T2"].courseIds = ["COMP1521", "MATH1241", "COMP2521"];
    plan["1"]["1T1"].courseIds = ["COMP1511", "MATH1141", "ENGG1000"];
    plan["1"]["1T3"].courseIds = ["MATH1081", "COMP3331", "COMP1531"];

    return plan;
}

const generatePlan = (years) => {
    let plan = {};

    for (let year = 1; year <= years; year++) {
        console.log(year)
        plan[year.toString()] = generateTerms(year)
    }
    console.log("generated years", plan)

    plan = populateTerms(plan)

    return plan;
}

class DegreePlanner extends React.Component {
    state = {
        courses: getCourses(selectedCourses),
        plan: generatePlan(4),
    };

    onDragEnd = result => {
        const {destination, source, draggableId} = result;

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
            // console.log("before", newCourseIds)
            newCourseIds.splice(source.index, 1); // Remove 1 item at source.index
            newCourseIds.splice(destination.index, 0, draggableId); // Insert dragggableId into destination
            // console.log("after", newCourseIds)
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

    populateTerms = () => {
        this.state.plan["1"]["1T2"].courseIds = ["COMP1521", "MATH1241", "COMP2521"];
        this.state.plan["1"]["1T1"].courseIds = ["COMP1511", "MATH1141", "ENGG1000"];
        this.state.plan["1"]["1T3"].courseIds = ["MATH1081", "COMP3331", "COMP1531"];
    }

    render() {
        return (
            <Segment>
                <Container>
                    <Header as="h2" textAlign="center" style={{marginTop: "50px"}}>Plan your degree</Header>
                    <p>The following degree plan has been generated based on the courses you have selected above. By default, our algorithm:</p>
                    <ul>
                        <li>allocates 18 UOC per term</li>
                        <li>does not allocate courses in Summer Term</li>
                        <li>ensures courses have their prerequisites met</li>
                        <li>ensures courses can be taken in allocated terms</li>
                    </ul>

                    <p>Drag and drop the courses below to further customise your degree plan!</p>

                    <p><em>Please note that our data is scraped from the UNSW Handbook and may have some inconsistencies.</em></p>
                    <p><em>Also note, you can drag a course into a term even if it is not offered as our data may be out of date, please double check :) </em></p>

                    <DragDropContext onDragEnd={this.onDragEnd}>
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