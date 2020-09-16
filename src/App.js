import React, {Component} from 'react';
import { Route, HashRouter, Link } from 'react-router-dom';

import BESengah from './maps/EngineeringHonoursSoftware/map.js';
import Teaching from './maps/EngineeringHonoursSoftware/teaching.js';

class App extends Component {
  render() {
    return (
      <HashRouter basename='/'>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/SoftwareEngineering">Software Engineering</Link></li>
            <li><Link to="/James">James's Playground</Link></li>
          </ul>
          <Route path="/SoftwareEngineering" component={BESengah} />
          <Route path="/James" component={Teaching}/>
        </div>
      </HashRouter>
    )
  }
}

export default App;

