import '../styles/sidebarStyles.css';
import React, {useState} from 'react';


export default function SideBarTestComp(props) {
    const [sidebarClass, setSidebarClass] = useState(props.sidebar);

    const closeHandler = (e) => {
        e.preventDefault();
        setSidebarClass("sidebar close");
        setTimeout(() => {
            props.close();
        }, 1000);
    }
    return (
        <div className={sidebarClass}>
            <h2>Sidebar</h2>
            <button id="close" onClick={closeHandler}>close</button>
        </div>
    );
}