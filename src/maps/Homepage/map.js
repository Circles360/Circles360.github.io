import React, {useState} from 'react';


import SidebarModal from "../../components/sidebar-modal";
import TutorialModal from "../../components/tutorial-modal";
import { Icon, Button, Container, Header, Divider, Segment, Message, Label } from 'semantic-ui-react';

const Homepage = () => {
    return (
        <container>
            <modal> 
                <Message info>
                    <p>Circles is a <b>visual degree planner</b> for UNSW undergraduate students. Choose your program and degree to begin!</p>
                    <p>Please note that the UNSW 2021 handbook is still not yet complete, therefore there are some courses that you cannot select, please refer to the handbook for more information if needed.</p>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <SidebarModal />
                        <TutorialModal />
                    </div>
                </Message>
            </modal>
        </container>
    );
};

export default Homepage;