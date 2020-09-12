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
        "Summer Term": {
            id: "T1",
            title: "Summer Term",
            taskIds: ["COMP1511", "COMP1521", "COMP1531", "MATH1141", "MATH1241"]
        },
        "Term 1": {
            id: "T1",
            title: "Term 1",
            taskIds: ["COMP1511", "COMP1521", "COMP1531", "MATH1141", "MATH1241"]
        },
        "Term 2": {
            id: "T1",
            title: "Term 2",
            taskIds: ["COMP1511", "COMP1521", "COMP1531", "MATH1141", "MATH1241"]
        },
        "Term 3": {
            id: "T1",
            title: "Term 3",
            taskIds: ["COMP1511", "COMP1521", "COMP1531", "MATH1141", "MATH1241"]
        }
    },

    years: [1, 2, 3, 4, 5, 6],

    columnOrder: ["Summer Term", "Term 1", "Term 2", "Term 3"]
}

class DegreePlanner extends React.Component {
    state = initialData;

    onDragEnd = result => {
        console.log("drag finished")
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

                    {this.state.years.map(years => (
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Grid columns={4}>
                                {this.state.columnOrder.map(columnId => {
                                    const column = this.state.columns[columnId];
                                    const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

                                    return (
                                        <Grid.Column>
                                            <Segment>
                                                <Column key={column.id} column={column} tasks={tasks} />
                                            </Segment>
                                        </Grid.Column>
                                    );
                                })}
                            </Grid>
                        </DragDropContext>
                    ))}
                </Container>
            </Segment>
        );
    }
}

export default DegreePlanner