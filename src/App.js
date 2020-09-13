import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  HashRouter
} from 'react-router-dom';

import BESengah from './maps/EngineeringHonoursSoftware/map.js';
import BESengah2 from './maps/EngineeringHonoursSoftware/map2.js';
import Teaching from './components/teaching.js';

class App extends Component {
  render() {
    return (
      <HashRouter basename='/'>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/SoftwareEngineering">Software Engineering</Link></li>
            <li><Link to="/SoftwareEngineeringStress">Software Engineering Stress</Link></li>
          </ul>

          <hr />
          <Route path="/SoftwareEngineering" component={BESengah} />
          <Route path="/SoftwareEngineeringStress" component={BESengah2} />
          <Route path="/Teaching" component={Teaching}/>
        </div>
      </HashRouter>
    )
  }
}

export default App;
