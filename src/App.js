import React, {Component} from 'react';
import { Route, HashRouter, Link } from 'react-router-dom';

import BESengah from './maps/EngineeringHonoursSoftware/map.js';
import ComputerScienceCOMPA1ACCTA2 from './maps/ComputerScienceCOMPA1ACCTA2/map.js';
import ComputerScienceCOMPA1PSYCM2 from './maps/ComputerScienceCOMPA1PSYCM2/map.js';

import Teaching from './maps/EngineeringHonoursSoftware/teaching.js';

class App extends Component {
  render() {
    return (
      <HashRouter basename='/'>
        <div>
          <Route path="/3707/SENGAH" component={BESengah} />
          <Route path="/3778/COMPA1" component={ComputerScienceCOMPA1ACCTA2} />
          <Route path="/3778/PSYCM2" component={ComputerScienceCOMPA1PSYCM2} />
          <Route path="/James" component={Teaching}/>
        </div>
      </HashRouter>
    )
  }
}

export default App;

