// Displays hover text in top left corner which contains info about the course
import React from 'react';
import { Segment, Header } from "semantic-ui-react";

const style = {
    padding: "20px",
    margin: "10px",
    position: "absolute",
    top: "0",
    left: "0",
    zIndex: "10",
    maxWidth: "20%"
}

export default function HoverInfo(props) {
    return (
        <Segment raised id="hoverbox" style={style}>
            <Header as="h4" textAlign="center">{props.node.data.course_name}</Header>
            <p><b>Terms: </b>{(props.node.data.terms !== null) ? props.node.data.terms.join(", ") : <text>Unavailable</text>}</p>

            {props.node.data.conditions.raw !== null ?
            <p><b>Conditions: </b>{props.node.data.conditions.raw}</p> : <p><b>Conditions: </b> None</p>}

            {props.node.data.exclusions !== null &&
            <p><b>Exclusion courses: </b>{props.node.data.exclusions.join(", ")}</p>}
        </Segment>
    );
}