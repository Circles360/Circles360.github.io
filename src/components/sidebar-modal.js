import React, { useState } from "react";
import { Modal, Button } from "semantic-ui-react";

const SidebarModal = () => {
    const [open, setOpen] = React.useState(false)
    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button>Need help?</Button>}
        >
            <Modal.Header>Welcome to Circles</Modal.Header>
            <Modal.Actions>
                <Button color="black" onClick={() => setOpen(false)}>
                    Okay
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default SidebarModal;
