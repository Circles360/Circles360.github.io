import React from "react";
import DropdownDegrees from "./dropdownDegrees.js"
import { Button, Container, Modal, Header } from 'semantic-ui-react'

function exampleReducer(state, action) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { open: true, dimmer: action.dimmer }
    case 'CLOSE_MODAL':
      return { open: false }
    default:
      throw new Error()
  }
}

function SideBarModal() {
  const [state, dispatch] = React.useReducer(exampleReducer, {
    open: false,
    dimmer: undefined,
  })
  const { open, dimmer } = state

  return (
    <div>
      <Button
        size="mini"
        color="blue"
        onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}
      >
        Click on Me :) 
      </Button>

      <Modal
        closeIcon
        dimmer={dimmer}
        open={open}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      >
        <Modal.Header textAlign="center">Degree Planner</Modal.Header>
        <Container>
            <Header as="h3" textAlign="center" style={{marginTop: "5px"}}>Choose your degree</Header>
            <DropdownDegrees />
        </Container>
      </Modal>
    </div>
  )
}

export default SideBarModal

//DropdownDegrees.clickDone() 

//DropdownDegrees d = new DropdownDegrees(); 
//d.clickDone()