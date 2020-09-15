import React from "react";
import { Container, Segment, Header, Label } from 'semantic-ui-react'

import Course from "./degreeplanner-course"

import { Droppable } from "react-beautiful-dnd"

const SUCCESS = "#FCFFF5";
const ERROR = "#FFF6F6";
const UNKNOWN = "#FFFAF3"

const checkTermAvailability = (props, courseId) => {
    const termId = props.term.id.substring(1, 3);
    const termAvailability = props.allCourses[courseId].termsAvailable;

    // return props.allCourses[courseId].placeholderTerms
    //     ? UNKNOWN
    //     : termAvailability.includes(termId)
    //     ? SUCCESS
    //     : ERROR;
    return termAvailability.includes(termId)
        ? props.allCourses[courseId].placeholderTerms
            ? UNKNOWN
            : SUCCESS
        : ERROR
}

const checkValidCourses = (props) => {
    const termId = props.term.id.substring(1, 3);

    for (const courseId of props.term.courseIds) {
        if (!props.allCourses[courseId].termsAvailable.includes(termId)) return ERROR;
        if (props.allCourses[courseId].placeholderTerms) return UNKNOWN;
    }
    return "white"
}

const showUnits = (props) => {
    const total = props.term.courseIds.filter(c => props.allCourses[c]).reduce((total, courseId) => total + props.allCourses[courseId].units, 0);
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

    return <Label color={colour} floating style={{transition: "0.2s ease"}}>{total}</Label>;
}

export default class Term extends React.Component {
    render () {
        return (
            <Container>
                <Droppable droppableId={this.props.term.id}>
                    {(provided, snapshot) => (
                        <Segment style={{backgroundColor: snapshot.isDraggingOver ? checkTermAvailability(this.props, snapshot.draggingOverWith) : checkValidCourses(this.props), transition: "0.2s ease"}}>
                            <Header as="h4">{this.props.term.title}</Header>
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