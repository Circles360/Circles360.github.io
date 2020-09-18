import React from 'react';
import SidebarModal from "./sidebar-modal.js";
import TutorialModal from "./tutorial-modal.js";
import { Icon, Button, Container, Header, Divider, Segment, Message, Label } from 'semantic-ui-react';
import ScrollTo from "react-scroll-into-view";
import specialisationsJSON from "../webscraper/specialisations.json";
import coursesJSON from "../webscraper/courses.json";

const REGEX_COURSE_CODE = /[A-Z]{4}\d{4}/g;

const getCoursesInLevel = (rawList) => {
    rawList = rawList.flat().filter(c => c !== "ANY COURSE");
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

const getTotalUnitsTaken = (selectedNodes) => {
    const selectedCourses = Object.keys(selectedNodes).filter(c => c.match(REGEX_COURSE_CODE));
    return selectedCourses.reduce((total, c) => total + (c in coursesJSON ? coursesJSON[c].units : 0), 0);
}

const getSelectedCourses = (specialisationCodes, selectedNodes) => {
    // console.log(specialisationCodes);
    return specialisationCodes.map(specId => {
        const levels = Object.keys(specialisationsJSON[specId].structure);
        const coreCourses = [];

        return levels.filter(levelName => {
            const courseList = specialisationsJSON[specId].structure[levelName].courses;
            if (!courseList) return false;
            if (courseList.length === 1 && courseList.includes("ANY COURSE")) return false;
            return true;
        }).map(levelName => {
            const rawList = specialisationsJSON[specId].structure[levelName].courses;
            const courseList = getCoursesInLevel(rawList);
            const minUnits = specialisationsJSON[specId].structure[levelName].units_required;
            const style = {
                transition: "0.3s ease"
            }
            if (levelName.match(/[Cc]ore/g)) {
                // CORE COURSE
                courseList.forEach(c => coreCourses.push(c));
                const unitsTaken = courseList.reduce((total, c) => total + (c in selectedNodes ? coursesJSON[c].units : 0), 0);
                const showUnits = minUnits
                    ? <Label horizontal style={{transition: "0.3s ease", alignSelf: "flex-start"}} color={unitsTaken >= minUnits ? "green" : "red"}>{unitsTaken}/{minUnits}</Label>
                    : null;
                return (
                    <Segment key={levelName} color="red">
                        <div style={{display: "flex"}}>
                            <Header style={{flexGrow: "1"}} as="h5">{specId} - {levelName}</Header>
                            {showUnits}
                        </div>
                        {courseList.map(c => c in selectedNodes ? <Label key={c} size="small" color="grey" style={style}>{c}</Label> : <Label key={c} size="small" style={style}>{c}</Label>)}
                    </Segment>
                )
            } else {
                // Not core course. Render segment with chosen electives only.
                const unitsTaken = courseList.reduce((total, c) => total + (c in selectedNodes && !coreCourses.includes(c) ? coursesJSON[c].units : 0), 0);
                const showUnits = minUnits
                    ? <Label horizontal style={{transition: "0.3s ease", alignSelf: "flex-start"}} color={unitsTaken >= minUnits ? "green" : "red"}>{unitsTaken}/{minUnits}</Label>
                    : null;
                return (
                    <Segment key={levelName} style={{minHeight: "70px"}}>
                        <div style={{display: "flex"}}>
                            <Header style={{flexGrow: "1"}} as="h5">{specId} - {levelName}</Header>
                            {showUnits}
                        </div>
                        {courseList.filter(c => (c in selectedNodes && !coreCourses.includes(c))).map(c => <Label key={c} size="small" color="grey" style={style}>{c}</Label>)}
                    </Segment>
                )
            }
        })
    });
}
class Sidebar extends React.Component {
    render() {
        return (
            <Container style={{paddingLeft: "10px", paddingRight: "20px"}}>
                <Header as="h1" textAlign="center" style={{marginTop: "10px"}}>Circles</Header>
                <Message info>
                    <p>Circles is a <b>visual degree planner</b> for UNSW undergraduate students. Choose your program and degree to begin!</p>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <SidebarModal />
                        <TutorialModal />
                    </div>
                </Message>
                <Divider></Divider>
                <Container>
                    <div style={{display: "flex"}}>
                        <Header style={{flexGrow: "1", marginTop: "5px"}} as="h3">
                            Your selected courses
                        </Header>
                        <Label style={{alignSelf: "flex-start"}} color="black" basic>{getTotalUnitsTaken(this.props.selectedNodes)} UOC</Label>
                    </div>
                    {getSelectedCourses(this.props.specialisations, this.props.selectedNodes)}
                </Container>
                <Container textAlign="center">
                    <ScrollTo selector="#DegreePlanner">
                        <Button
                            animated="vertical"
                            color="red"
                            style={{marginTop: "10px", marginBottom: "10px"}}
                        >
                            <Button.Content visible>Generate degree planner</Button.Content>
                            <Button.Content hidden>
                                <Icon name="arrow down" />
                            </Button.Content>
                        </Button>
                    </ScrollTo>

                </Container>
            </Container>

        );
    }
}


export default Sidebar