import React from 'react';
import { Icon, Button, Container, Segment, Header, Dropdown, Grid } from 'semantic-ui-react'

// import programsJSON from "../webscraper/programs.json"
// import specialisationsJSON from "../webscraper/specialisations.json"
import coursesJSON from "../webscraper/courses.json"

import { DragDropContext } from "react-beautiful-dnd"
import Term from "./degreeplanner-term"

const selectedCourses = ["COMP1511", "COMP1521", "COMP1531", "MATH1141", "MATH1241"]

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

const initialData = {

    courses: getCourses(selectedCourses),

    terms: {
        "TS": {
            id: "TS",
            title: "Summer Term",
            courseIds: []
        },
        "T1": {
            id: "T1",
            title: "Term 1",
            courseIds: ["COMP1511"]
        },
        "T2": {
            id: "T2",
            title: "Term 2",
            courseIds: ["COMP1521", "COMP1531"]
        },
        "T3": {
            id: "T3",
            title: "Term 3",
            courseIds: ["MATH1141", "MATH1241"]
        }
    },

    // years: [1, 2, 3, 4, 5, 6],
    years: [1],

    termOrder: ["TS", "T1", "T2", "T3"]
}

class DegreePlanner extends React.Component {
    state = initialData;

    onDragEnd = result => {
        const {destination, source, draggableId} = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const start = this.state.terms[source.droppableId];
        const finish = this.state.terms[destination.droppableId];
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
                terms: {
                    ...this.state.terms,
                    [newTerm.id]: newTerm,
                }
            }

            this.setState(newState);
            return;
        }

        // Moving from one list to another
        const startCourseIds = Array.from(start.courseIds);
        startCourseIds.splice(source.index, 1);
        const newStart = {
            ...start,
            courseIds: startCourseIds,
        }

        const finishCourseIds = Array.from(finish.courseIds);
        finishCourseIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            courseIds: finishCourseIds
        }

        const newState = {
            ...this.state,
            terms: {
                ...this.state.terms,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
            }
        }

        this.setState(newState);

    }

    populateTerms = () => {
        
    }

    render() {
        this.populateTerms()

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

                    <DragDropContext onDragEnd={this.onDragEnd}>
                        {this.state.years.map(years => (
                            <Grid columns={4}>
                                {this.state.termOrder.map(termId => {
                                    const term = this.state.terms[termId];
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