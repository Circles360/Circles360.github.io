import React, { useState } from "react";
import { Icon, Button, Container, Modal, Header, Dropdown, Grid, Message } from 'semantic-ui-react'

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

function TutorialModal() {
  const [state, dispatch] = React.useReducer(exampleReducer, {
    open: false,
    dimmer: undefined,
  })
  const { open, dimmer } = state

  return (
    <div>
      <Button
        onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}
      >
        Open Tutorial! 
      </Button>

      <Modal
        closeIcon
        dimmer={dimmer}
        open={open}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      >
        <Container>
            {/* Put in the Tutorial here! */}
        </Container>
      </Modal>
    </div>
  )
}

export default TutorialModal

//DropdownDegrees.clickDone() 

//DropdownDegrees d = new DropdownDegrees(); 
//d.clickDone()