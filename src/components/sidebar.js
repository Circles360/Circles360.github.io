import React, {useState} from 'react';
import '../styles/sidebarStyles.css';

const SideBar = (props) => {
    const [sidebarClass, setSidebarClass] = useState(props.sidebar);

    const closeHandler = (e) => {
        e.preventDefault();
        setSidebarClass("sidebar close");
        setTimeout(() => {
            props.close();
        }, 500);
    }

    return (
        <div className={sidebarClass}>
            <button id="closeToggle" onClick={closeHandler}>close</button>
            <div className="sidebarHeader">
                Bachelor of Engineering (Software)
            </div>
            <div className="courseGroup">Level 1 Core Course</div>
            <div className="courseGroup">Level 2 Core Course</div>
        </div>
    );
}

export default SideBar;