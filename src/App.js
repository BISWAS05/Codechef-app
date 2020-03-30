import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ContestDetails from './ContestDetails';
import Problems from './Problems';
import Contests from './Contests';
import Rankings from './Rankings';
import login from './login';
import LoginCallback from './LoginCallback';
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFound from './NotFound';
import Home from './Home';

function App () {
    return (
        <React.Fragment>
            <Router>
                <Switch>
                    <Route exact path="/" component={ Home } />
                    <Route exact path="/login" component={ login } />
                    <Route exact path="/login/callback" component={ LoginCallback } />
                    <Route exact path="/contests" component={ Contests } />
                    <Route exact path="/contests/:contestCode" component={ ContestDetails } />
                    <Route exact path="/rankings/:contestCode" component={ Rankings } />
                    <Route exact path="/contests/:contestCode/problems/:problemCode" component={ Problems } />
                    <Route exact path="*" component={ NotFound } />
                </Switch>
            </Router>
        </React.Fragment>
    );
}

export default App;