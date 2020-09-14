import React, {useState} from 'react';
import SidebarModal from "./sidebar-modal.js";
import { Icon, Button, Container, Header, Dropdown, Grid, Segment, Message, Label } from 'semantic-ui-react';
import ScrollTo from "react-scroll-into-view";
import specialisationsJSON from "../webscraper/specialisations.json";
import coursesJSON from "../webscraper/courses.json";

const REGEX_COURSE_CODE = /[A-Z]{4}\d{4}/g;

const getSelectedCourses = (specialisationCode) => {
    const levels = Object.keys(specialisationsJSON[specialisationCode].structure);

    const rawCourses = levels.filter(levelName => {
        const coursesInLevel = specialisationsJSON[specialisationCode].structure[levelName].courses;
        if (coursesInLevel == null) return false;
        if (coursesInLevel.length === 1 && coursesInLevel.includes("ANY COURSE")) return false;
        return true;
    }).map(levelName => specialisationsJSON[specialisationCode].structure[levelName].courses.flat().filter(c => c != "ANY LEVEL")).flat();

    console.log(rawCourses);
    const allCourseIds = Object.keys(coursesJSON);

    const coursesInThisSpecialisation = [];
    rawCourses.forEach(courseId => {
        if (courseId.match(REGEX_COURSE_CODE)) {
            coursesInThisSpecialisation.push(courseId);
        } else if (courseId.match(/^[A-Z]{4}\d$/)) {
            const relevantCourses = allCourseIds.filter(c => c.includes(courseId));
            console.log("relevant", relevantCourses);
            relevantCourses.forEach(c => {
                if (coursesInThisSpecialisation.includes(c)) return;
                coursesInThisSpecialisation.push(c);
            })
        }
    });

    return coursesInThisSpecialisation.map(c => (<Label style={{margin: "2px"}}>{c}</Label>));
}
class Sidebar extends React.Component {
    state = {

    };

    render() {

        return (
            <Container style={{paddingLeft: "10px", paddingRight: "10px"}}>
                <Header as="h1" textAlign="center" style={{marginTop: "10px"}}>Circles</Header>
                <Message info>
                    <p>Circles is a visual degree planner for UNSW students. Choose your program and degree below to begin!</p>
                    <SidebarModal />
                </Message>
                <Grid stretched>
                    <Grid.Row>
                        <Container>
                            <Header as="h3" textAlign="center">Choose your courses</Header>
                            {getSelectedCourses("SENGAH")}
                        </Container>
                    </Grid.Row>

                    <Container textAlign="center">
                        <ScrollTo selector="#DegreePlanner">
                            <Button
                                animated="vertical"
                                color="red"
                            >
                                <Button.Content visible>Generate degree planner</Button.Content>
                                <Button.Content hidden>
                                    <Icon name="arrow down" />
                                </Button.Content>
                            </Button>
                        </ScrollTo>

                    </Container>
                </Grid>
            </Container>

        );
    }
}


export default Sidebar