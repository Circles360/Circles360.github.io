import React from "react";
import { Label } from 'semantic-ui-react'

import { Draggable } from "react-beautiful-dnd"

export default class Task extends React.Component {
    render () {
        return (
            <Draggable draggableId={this.props.task.id} index={this.props.index}>
                {provided => (
                    <Label
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        {this.props.task.content}
                    </Label>
                )}
            </Draggable>
        );
    }
}