import React, {Fragment} from "react"
import "../styles/sidebarStyles.css"

const Toggle = (props) => {
    return(
        <Fragment>
            <button id="toggle" onClick={props.click}>Click</button>
        </Fragment>
    )
}

export default Toggle