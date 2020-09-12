import React from "react";
import { Icon, Button, Container, Segment, Header, Dropdown, Grid } from 'semantic-ui-react'

import Task from "./degreeplanner-task"

import { Droppable } from "react-beautiful-dnd"

export default class Column extends React.Component {
    render () {
        return (
            // <Container style={{margin: "8px", border: "1px solid lightgrey", borderRadius: "2px"}}>
            <Container>
                <Header as="h1">
                    {this.props.column.title}
                </Header>
                <Droppable droppableId={this.props.column.id}>
                    {provided => (
                        <Container
                            // style={{padding: "8px"}}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {this.props.tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)}
                            {provided.placeholder}
                        </Container>
                    )}
                </Droppable>
            </Container>
        )
    }
}