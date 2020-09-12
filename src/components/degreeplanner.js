import React from 'react';
import { Icon, Button, Container, Segment, Header, Dropdown, Grid } from 'semantic-ui-react'

import programsJSON from "../webscraper/programs.json"
import specialisationsJSON from "../webscraper/specialisations.json"

import { DragDropContext } from "react-beautiful-dnd"
import Column from "./degreeplanner-column"

const initialData = {
    tasks: {
        "COMP1511": {id: "COMP1511", content: "COMP1511"},
        "COMP1521": {id: "COMP1521", content: "COMP1521"},
        "COMP1531": {id: "COMP1531", content: "COMP1531"},
        "MATH1141": {id: "MATH1141", content: "MATH1141"},
        "MATH1241": {id: "MATH1241", content: "MATH1241"}
    },

    columns: {
        "Term 1": {
            id: "T1",
            title: "Term 1",
            taskIds: ["COMP1511", "COMP1521", "COMP1531", "MATH1141", "MATH1241"]
        }
    },

    columnOrder: ["Term 1"]
}

class DegreePlanner extends React.Component {
    state = initialData;

    onDragEnd = result => {

    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {this.state.columnOrder.map(columnId => {
                    const column = this.state.columns[columnId];
                    const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

                    return <Column key={column.id} column={column} tasks={tasks} />;
                })}
            </DragDropContext>
        );
    }
}

export default DegreePlanner