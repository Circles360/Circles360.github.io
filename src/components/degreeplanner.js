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
        "TS": {
            id: "TS",
            title: "Summer Term",
            taskIds: []
        },
        "T1": {
            id: "T1",
            title: "Term 1",
            taskIds: ["COMP1511"]
        },
        "T2": {
            id: "T2",
            title: "Term 2",
            taskIds: ["COMP1521", "COMP1531"]
        },
        "T3": {
            id: "T3",
            title: "Term 3",
            taskIds: ["MATH1141", "MATH1241"]
        }
    },

    // years: [1, 2, 3, 4, 5, 6],
    years: [1],

    columnOrder: ["TS", "T1", "T2", "T3"]
}

class DegreePlanner extends React.Component {
    state = initialData;

    onDragEnd = result => {
        const {destination, source, draggableId} = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1); // Remove 1 item at source.index
            newTaskIds.splice(destination.index, 0, draggableId); // Insert dragggableId into destination
            const newColumn = {
                ...start,
                taskIds: newTaskIds
            };

            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn,
                }
            }

            this.setState(newState);
            return;
        }

        // Moving from one list to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        }

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds
        }

        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
            }
        }

        this.setState(newState);

    }

    render() {
        return (
            <Segment>
                <Container>
                    <Header as="h2" textAlign="center" style={{marginTop: "50px"}}>Plan your degree</Header>
                    <p>The following degree plan has been generated based on the courses you have selected above. By default, our algorithm:</p>
                    <ul>
                        <li>allocates 18 UOC per term</li>
                        <li>does not allocate courses in Summer Term</li>
                        <li>ensures courses have their prerequisites met</li>
                        <li>ensures courses can be taken in allocated terms</li>
                    </ul>

                    <p>Drag and drop the courses below to further customise your degree plan!</p>

                    <p><em>Please note that our data is scraped from the UNSW Handbook and may have some inconsistencies.</em></p>

                    <DragDropContext onDragEnd={this.onDragEnd}>
                        {this.state.years.map(years => (
                            <Grid columns={4}>
                                {this.state.columnOrder.map(columnId => {
                                    const column = this.state.columns[columnId];
                                    const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

                                    return (
                                        <Grid.Column>
                                            <Column key={column.id} column={column} tasks={tasks} />
                                        </Grid.Column>
                                    );
                                })}
                            </Grid>
                        ))}
                    </DragDropContext>
                    <Segment style={{backgroundColor: "lightpink"}}>
                        <Header as="h2">Error messages</Header>
                        <p>None</p>
                    </Segment>
                </Container>
            </Segment>
        );
    }
}

export default DegreePlanner