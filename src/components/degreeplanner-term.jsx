import React from "react";
import { Container, Segment, Header, Label } from 'semantic-ui-react'

import Course from "./degreeplanner-course"

import { Droppable } from "react-beautiful-dnd"

const SUCCESS = "#e5fbe5";
const ERROR = "#ffebeb";

const checkTermAvailability = (props, courseId) => {
    const termId = props.term.id.substring(1, 3);
    const termAvailability = props.allCourses[courseId].termsAvailable;

    return termAvailability.includes(termId) ? SUCCESS : ERROR;
}

const checkValidCourses = (props) => {
    const termId = props.term.id.substring(1, 3);

    for (const courseId of props.term.courseIds) {
        if (!props.allCourses[courseId].termsAvailable.includes(termId)) {
            return ERROR
        }
    }
    return "white"
}

const getUnits = (props) => props.term.courseIds.reduce((total, courseId) => total + props.allCourses[courseId].units, 0);

const showUnits = (props) => {
    const total = props.term.courseIds.reduce((total, courseId) => total + props.allCourses[courseId].units, 0);
    const partTime = 12;
    const fullTime = 18;

    let colour = ""
    if (total === 0) {
        colour = "grey";
    } else if (total < partTime) {
        colour = "orange";
    } else if (total < fullTime) {
        colour = "blue";
    } else if (total === fullTime) {
        colour = "teal";
    } else {
        colour = "red";
    }

    return <Label color={colour} floating>{total}</Label>;
}

export default class Term extends React.Component {
    render () {
        return (
            <Container>
                <Droppable droppableId={this.props.term.id}>
                    {(provided, snapshot) => (
                        <Segment style={{backgroundColor: snapshot.isDraggingOver ? checkTermAvailability(this.props, snapshot.draggingOverWith) : checkValidCourses(this.props), transition: "0.2s ease"}}>
                            <Header as="h3">{this.props.term.title}</Header>
                            {showUnits(this.props)}
                            {/* {getTermTitle(this.props)} */}
                            <div ref={provided.innerRef} {...provided.droppableProps} style={{minHeight: "150px"}}>
                                {this.props.courses.map((course, index) => <Course key={course.id} course={course} index={index} />)}
                                {provided.placeholder}
                            </div>
                        </Segment>
                    )}
                </Droppable>
            </Container>
        )
    }
}