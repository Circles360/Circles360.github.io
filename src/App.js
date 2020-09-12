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
import Teaching from './components/teaching.js';

class App extends Component {
  render() {
    return (
      <HashRouter basename='/'>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/SoftwareEngineering">Software Engineering</Link></li>
          </ul>

          <hr />
          <Route path="/SoftwareEngineering" component={BESengah} />
          <Route path="/Teaching" component={Teaching}/>
        </div>
      </HashRouter>
    )
  }
}

export default App;
