import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from 'react-router-dom';

import BESengah from './maps/EngineeringHonoursSoftware/map.js';
import Teaching from './components/teaching.js';
import SidebarTest from './components/sidebartest.js';

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/SoftwareEngineering" component={BESengah} />
        <Route path="/Teaching" component={Teaching}/>
        <Route path="/SidebarTest" component={SidebarTest}/>
      </Router>
    )
  }
}

export default App;
