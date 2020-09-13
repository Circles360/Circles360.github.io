import React, {useState} from 'react';
import DropdownDegrees from "./dropdownDegrees.js"
import SidebarModal from "./sidebar-modal.js"
import { Icon, Button, Container, Modal, Header, Dropdown, Grid, Message } from 'semantic-ui-react'
import ScrollTo from "react-scroll-into-view"

const example = [
    { key: 'af', value: 'af', flag: 'af', text: 'Afghanistan' },
    { key: 'ax', value: 'ax', flag: 'ax', text: 'Aland Islands' },
    { key: 'al', value: 'al', flag: 'al', text: 'Albania' },
    { key: 'dz', value: 'dz', flag: 'dz', text: 'Algeria' },
    { key: 'as', value: 'as', flag: 'as', text: 'American Samoa' },
    { key: 'ad', value: 'ad', flag: 'ad', text: 'Andorra' },
    { key: 'ao', value: 'ao', flag: 'ao', text: 'Angola' },
    { key: 'ai', value: 'ai', flag: 'ai', text: 'Anguilla' },
    { key: 'ag', value: 'ag', flag: 'ag', text: 'Antigua' },
    { key: 'ar', value: 'ar', flag: 'ar', text: 'Argentina' },
    { key: 'am', value: 'am', flag: 'am', text: 'Armenia' },
    { key: 'aw', value: 'aw', flag: 'aw', text: 'Aruba' },
    { key: 'au', value: 'au', flag: 'au', text: 'Australia' },
    { key: 'at', value: 'at', flag: 'at', text: 'Austria' },
    { key: 'az', value: 'az', flag: 'az', text: 'Azerbaijan' },
    { key: 'bs', value: 'bs', flag: 'bs', text: 'Bahamas' },
    { key: 'bh', value: 'bh', flag: 'bh', text: 'Bahrain' },
    { key: 'bd', value: 'bd', flag: 'bd', text: 'Bangladesh' },
    { key: 'bb', value: 'bb', flag: 'bb', text: 'Barbados' },
    { key: 'by', value: 'by', flag: 'by', text: 'Belarus' },
    { key: 'be', value: 'be', flag: 'be', text: 'Belgium' },
    { key: 'bz', value: 'bz', flag: 'bz', text: 'Belize' },
    { key: 'bj', value: 'bj', flag: 'bj', text: 'Benin' }
]

const Sidebar = (props) => {
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
                        <Header as="h3" textAlign="center" style={{marginTop: "5px"}}>Choose your degree</Header>
                        <DropdownDegrees />
                    </Container>
                </Grid.Row>

                <Grid.Row>
                    <Container>
                        <Header as="h3" textAlign="center">Choose your courses</Header>
                        <Header as="h4" style={{marginBottom: 0}}>Level 1 Core Courses</Header>
                        <Dropdown
                            fluid
                            selection
                            search
                            multiple
                            options={example}
                            placeholder="Select courses"
                        />

                        <Header as="h4" style={{marginBottom: 0}}>Level 2 Core Courses</Header>
                        <Dropdown
                            fluid
                            selection
                            search
                            multiple
                            options={example}
                            placeholder="Select courses"
                        />

                        <Header as="h4" style={{marginBottom: 0}}>Level 3 Core Courses</Header>
                        <Dropdown
                            fluid
                            selection
                            search
                            multiple
                            options={example}
                            placeholder="Select courses"
                        />
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


export default Sidebar