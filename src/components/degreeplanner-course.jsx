import React from "react";
import { Label, Container, Icon} from 'semantic-ui-react'

import { Draggable } from "react-beautiful-dnd"

const getCourseLink = (courseId) => {
    const handbookVersion = 2021;
    return <a style={{marginLeft: "5px", alignSelf: "flex-start"}} target="_blank" rel="noopener noreferrer" href={`https://www.handbook.unsw.edu.au/undergraduate/courses/${handbookVersion}/${courseId}`}><Icon name="external share"/></a>;
}

export default class Course extends React.Component {
    render () {
        return (
            <Container>
                <Draggable draggableId={this.props.course.id} index={this.props.index}>
                    {provided => (
                        <div>
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <Label style={{margin: "5px", display: "flex"}}>
                                    <span style={{flexGrow: "1"}}>
                                        {this.props.course.content}
                                    </span>
                                    {getCourseLink(this.props.course.id)}
                                </Label>
                            </div>
                            {provided.placeholder}
                        </div>
                    )}
                </Draggable>
            </Container>
        );
    }
}