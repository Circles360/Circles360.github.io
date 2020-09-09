<<<<<<< HEAD
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
=======
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

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/SoftwareEngineering" component={BESengah} />
        <Route path="/Teaching" component={Teaching}/>
      </Router>
    )
  }
>>>>>>> a00b60dded967517e3f87e7ff66373631a5707f4
}

export default App;
