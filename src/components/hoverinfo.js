// Displays hover text in top left corner which contains info about the course
import React from 'react';
import '../styles/hover.css';
import { Segment, Header } from "semantic-ui-react";

export default function HoverInfo(props) {
    console.log(props);
    return (
        <Segment raised id="hoverbox" style={{paddingTop: "20px", maxWidth: "20%"}}>
            <Header as="h4" textAlign="center">{props.node.data.course_name}</Header>
            <p id="terms"><b>Terms: </b>{(props.node.data.terms !== null) ? props.node.data.terms.join(", ") : <text>Unavailable</text>}</p>

            {props.node.data.conditions.raw !== null &&
            <p id="prereq"><b>Conditions: </b>{props.node.data.conditions.raw}</p>}

            {props.node.data.exclusions !== null &&
            <p id="exclusion"><b>Exclusion courses: </b>{props.node.data.exclusions.join(", ")}</p>}

        </Segment>

    );
}