import React from "react";
import { Icon, Button, Container, Segment, Header, Dropdown, Grid } from 'semantic-ui-react'

import Task from "./degreeplanner-task"

import { Droppable } from "react-beautiful-dnd"

export default class Column extends React.Component {
    render () {
        return (
            <Container>
                <Droppable droppableId={this.props.column.id}>
                    {(provided, snapshot) => (
                        <Segment style={{backgroundColor: snapshot.isDraggingOver ? "#e8fbe8" : "white", transition: "0.2s ease"}}>
                            <Header as="h3">{this.props.column.title}</Header>
                            <div ref={provided.innerRef} {...provided.droppableProps} style={{minHeight: "100px"}}>
                                {this.props.tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)}
                                {provided.placeholder}
                            </div>
                        </Segment>
                    )}
                </Droppable>
            </Container>
        )
    }
}