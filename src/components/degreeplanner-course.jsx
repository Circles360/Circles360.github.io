import React from "react";
import { Label, Container } from 'semantic-ui-react'

import { Draggable } from "react-beautiful-dnd"

export default class Course extends React.Component {
    render () {
        return (
            <Container>
                <Draggable draggableId={this.props.course.id} index={this.props.index}>
                    {provided => (
                        <div>
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <Label style={{margin: "5px"}}>{this.props.course.content}</Label>
                            </div>
                            {provided.placeholder}
                        </div>
                    )}
                </Draggable>
            </Container>
        );
    }
}