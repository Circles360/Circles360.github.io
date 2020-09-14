import React from 'react';
import SidebarModal from "./sidebar-modal.js";
import { Icon, Button, Container, Header, Divider, Grid, Segment, Message, Label } from 'semantic-ui-react';
import ScrollTo from "react-scroll-into-view";
import specialisationsJSON from "../webscraper/specialisations.json";
import coursesJSON from "../webscraper/courses.json";

const REGEX_COURSE_CODE = /[A-Z]{4}\d{4}/g;

const getCoursesInLevel = (rawList) => {
    rawList = rawList.filter(c => c != "ANY COURSE");
    const allCourseIds = Object.keys(coursesJSON);
    const courseList = [];
    rawList.forEach(courseId => {
        if (courseId.match(REGEX_COURSE_CODE)) {
            courseList.push(courseId);
        } else if (courseId.match(/^[A-Z]{4}\d$/)) {
            const relevantCourses = allCourseIds.filter(c => c.includes(courseId));
            relevantCourses.forEach(c => {
                if (courseList.includes(c)) return;
                courseList.push(c);
            });
        }
    });

    return courseList;
}

const getSelectedCourses = (specialisationCode, selectedNodes) => {
    const levels = Object.keys(specialisationsJSON[specialisationCode].structure);
    const coreCourses = [];

    return levels.filter(levelName => {
        const courseList = specialisationsJSON[specialisationCode].structure[levelName].courses;
        if (!courseList) return false;
        if (courseList.length === 1 && courseList.includes("ANY COURSE")) return false;
        return true;
    }).map(levelName => {
        const rawList = specialisationsJSON[specialisationCode].structure[levelName].courses.flat();
        const courseList = getCoursesInLevel(rawList);
        if (levelName.match(/[Cc]ore/g)) {
            // CORE COURSE
            courseList.forEach(c => coreCourses.push(c));
            return (
                <Segment color="red">
                    <Header as="h5">{levelName}</Header>
                    {courseList.map(c => c in selectedNodes ? <Label compact color="grey">{c}</Label> : <Label compact color="grey" basic>{c}</Label>)}
                </Segment>
            )
        } else {
            // Not core course. Render segment with chosen electives only.
            return (
                <Segment>
                    <Header as="h5">{levelName}</Header>
                    {courseList.filter(c => (c in selectedNodes && !coreCourses.includes(c))).map(c => <Label compact color="grey">{c}</Label>)}
                </Segment>
            )
        }
    })

    // return coursesInThisSpecialisation.map(c => (c in selectedNodes) ? (<Label color="teal" style={{margin: "2px"}}>{c}</Label>) : (<Label style={{margin: "2px"}}>{c}</Label>));
}

class Sidebar extends React.Component {

    handleClick = () => {
        console.log("CLICKED!")
    }

    render() {
        return (
            <Container style={{paddingLeft: "10px", paddingRight: "10px"}}>
                <Header as="h1" textAlign="center" style={{marginTop: "10px"}}>Circles</Header>
                <Message info>
                    <p>Circles is a visual degree planner for UNSW students. Choose your program and degree below to begin!</p>
                    <SidebarModal />
                </Message>
                <Divider></Divider>
                <Grid stretched>
                    <Grid.Row>
                        <Container>
                            <Header as="h3" textAlign="center">Your selected courses</Header>
                            {getSelectedCourses("SENGAH", this.props.selectedNodes)}
                        </Container>
                    </Grid.Row>

                    <Container textAlign="center">
                        <ScrollTo selector="#DegreePlanner">
                            <Button
                                animated="vertical"
                                color="red"
                                onClick={this.handleClick}
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