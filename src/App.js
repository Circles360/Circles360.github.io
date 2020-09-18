import React, {Component} from 'react';
import { Route, HashRouter, Link } from 'react-router-dom';

import BESengah from './maps/EngineeringHonoursSoftware/map.js';
import Homepage from "./maps/Homepage/map.js";
import ComputerScienceCOMPA1ACCTA2 from './maps/ComputerScienceCOMPA1ACCTA2/map.js';
import ComputerScienceCOMPA1FINSA2 from './maps/ComputerScienceCOMPA1FINSA2/map.js';
import ComputerScienceCOMPA1MARKA2 from './maps/ComputerScienceCOMPA1MARKA2/map.js';
import ComputerScienceCOMPA1INFSA2 from './maps/ComputerScienceCOMPA1INFSA2/map.js';
import ComputerScienceCOMPA1PSYCM2 from './maps/ComputerScienceCOMPA1PSYCM2/map.js';

import Teaching from './maps/EngineeringHonoursSoftware/teaching.js';

class App extends Component {
  render() {
    return (
      <HashRouter basename='/'>
        <div>
          <Route exact path="/3707/SENGAH" component={BESengah} />
          <Route exact path="/3778/COMPA1/ACCTA2" component={ComputerScienceCOMPA1ACCTA2} />
          <Route exact path="/3778/COMPA1/FINSA2" component={ComputerScienceCOMPA1FINSA2} />
          <Route exact path="/3778/COMPA1/MARKA2" component={ComputerScienceCOMPA1MARKA2} />
          <Route exact path="/3778/COMPA1/INFSA2" component={ComputerScienceCOMPA1INFSA2} />
          <Route exact path="/3778/COMPA1/PSYCM2" component={ComputerScienceCOMPA1PSYCM2} />
          <Route exact path="/James" component={Teaching}/>
          <Route path="/" component={Homepage} />
        </div>
      </HashRouter>
    )
  }
}

export default App;

