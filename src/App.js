import React, {Component} from 'react';
import { Route, HashRouter, Link } from 'react-router-dom';

import BESengah from './maps/EngineeringHonoursSoftware/map.js';
import ComputerScienceCOMPA1 from './maps/ComputerScienceCOMPA1/map.js';
import Teaching from './maps/EngineeringHonoursSoftware/teaching.js';

class App extends Component {
  render() {
    return (
      <HashRouter basename='/'>
        <div>
          {/* <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/SoftwareEngineering">Software Engineering</Link></li>
            <li><Link to="/ComputerScienceCOMPA1">Computer Science</Link></li>
          </ul> */}
          <Route path="/SoftwareEngineering" component={BESengah} />
          <Route path="/ComputerScienceCOMPA1" component={ComputerScienceCOMPA1} />
          <Route path="/James" component={Teaching}/>
        </div>
      </HashRouter>
    )
  }
}

export default App;

