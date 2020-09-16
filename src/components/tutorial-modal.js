import React from "react";
import { Button, Container, Modal } from 'semantic-ui-react'
import InteractiveTutorial from './interactivetutorial.js';

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
        size="mini"
        color="black"
        onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}
      >
        <text>Need Help?</text>  
      </Button>

      <Modal
        closeIcon
        dimmer={dimmer}
        open={open}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      >
        <Container>
          <InteractiveTutorial />
        </Container>
      </Modal>
    </div>
  )
}

export default TutorialModal

//DropdownDegrees.clickDone() 

//DropdownDegrees d = new DropdownDegrees(); 
//d.clickDone()