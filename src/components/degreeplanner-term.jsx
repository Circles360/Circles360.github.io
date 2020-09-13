import React from "react";
import { Container, Segment, Header } from 'semantic-ui-react'

import Course from "./degreeplanner-course"

import { Droppable } from "react-beautiful-dnd"

const checkTermAvailability = (props, courseId) => {
    const termId = props.term.id;
    const termAvailability = props.allCourses[courseId].termsAvailable;

    return termAvailability.includes(termId) ? "#e5fbe5" : "#ffebeb";
}

export default class Term extends React.Component {
    render () {
        return (
            <Container>
                <Droppable droppableId={this.props.term.id}>
                    {(provided, snapshot) => (
                        <Segment style={{backgroundColor: snapshot.isDraggingOver ? checkTermAvailability(this.props, snapshot.draggingOverWith) : "white", transition: "0.2s ease"}}>
                            <Header as="h3">{this.props.term.title}</Header>
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