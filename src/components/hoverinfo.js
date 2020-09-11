// Displays hover text in top left corner which contains info about the course
import React from 'react';
import '../styles/hover.css';

export default function HoverInfo(props) {
    console.log(props);
    return (
        <div id="hoverbox">
            <div id="header">
                {props.node.id}
            </div>
        </div>
    );
}