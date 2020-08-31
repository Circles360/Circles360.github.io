import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from 'react-router-dom';

import BESengah from './maps/EngineeringHonoursSoftware/map.js';

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/SoftwareEngineering" component={BESengah} />
      </Router>
    )
  }
}

export default App;
