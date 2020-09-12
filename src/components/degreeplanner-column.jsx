import React from "react";
import { Icon, Button, Container, Segment, Header, Dropdown, Grid } from 'semantic-ui-react'

import Task from "./degreeplanner-task"

import { Droppable } from "react-beautiful-dnd"

export default class Column extends React.Component {
    render () {
        return (
            <Container>
                <Header as="h3">
                    {this.props.column.title}
                </Header>
                <Droppable droppableId={this.props.column.id}>
                    {provided => (
                        <div
                            // style={{padding: "8px"}}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {this.props.tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </Container>
        )
    }
}