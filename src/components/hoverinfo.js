// Displays hover text in top left corner which contains info about the course
import React from 'react';
import '../styles/hover.css';

export default function HoverInfo(props) {
    console.log(props);
    return (
        <div id="hoverbox">
            <div id="header">
                {props.node.data.course_name}
            </div>
            {props.node.data.conditions.raw !== null &&             
            <div id="exclusion">
                <b>Prereqs: </b>{props.node.data.conditions.raw}
            </div>}
            {props.node.data.exclusions !== null &&             
            <div id="exclusion">
                <b>Excl: </b>{props.node.data.exclusions.join(", ")}
            </div>}
            {props.node.data.corequisites !== null &&             
            <div id="corequisites">
                <b>Coreqs: </b>{props.node.data.conditions.corequisites}
            </div>}
        </div>
    );
}