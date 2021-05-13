import "./App.css";
import GoogleMap from "./components/GoogleMap";
import ReactGoogleMap from "./components/ReactGoogleMap";
import ReactMaps from "./components/ReactMaps";
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Navbar';

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={GoogleMap} />
        <Route exact path="/react-google-maps-1" component={ReactGoogleMap} />
        <Route exact path="/react-google-maps-2" component={ReactMaps} />
      </Switch>
    </Router>
  </>
  );
}

export default App;
