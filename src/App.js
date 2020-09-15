import React, {Component} from 'react';
import { Route, HashRouter } from 'react-router-dom';

import BESengah from './maps/EngineeringHonoursSoftware/map.js';
import Teaching from './components/teaching.js';

class App extends Component {
  render() {
    return (
      <HashRouter basename='/'>
        <div>
          <Route path="/" component={BESengah} />
          <Route path="/Teaching" component={Teaching}/>
        </div>
      </HashRouter>
    )
  }
}

export default App;
