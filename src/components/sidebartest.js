import React, {useState} from 'react';
import SidebarTestComp from './sidebartestcomp.js';
// import Toggle from './toggle';

export default function Layout() {
    const [sidebarOpen, setSideBarOpen] = useState(false);

    const openHandler = () => {
        if (!sidebarOpen) {
            setSideBarOpen(true);
        } else {
            setSideBarOpen(false);
        }
    }

    const sidebarCloseHandler = () => {
        setSideBarOpen(false);
    }
    let sidebar;
    if (sidebarOpen) {
        sidebar = <SidebarTestComp close={sidebarCloseHandler} sidebar={"sidebar"}/>
    }

    return (
        <div>
            {sidebar}
        </div>
    );
}