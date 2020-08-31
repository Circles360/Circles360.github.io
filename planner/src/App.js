import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from 'react-router-dom';

import BESengah from './maps/EngineeringHonoursSoftware/map.js';

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/Software-Engineering" component={BESengah} />
      </Router>
    </div>
  );
}

export default App;
