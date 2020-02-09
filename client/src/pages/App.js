import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import history from "../history";
import asyncComponent from "./AsyncComponents";
import * as moment from "moment";
import Moment from "react-moment";
import Splash from "./splash/splash";
import SignUp from "./splash/signup";

// Sets the moment instance to use.
Moment.globalMoment = moment;

// Set the locale for every react-moment instance to French.
Moment.globalLocale = "en";

// Set the output format for every react-moment instance.
Moment.globalFormat = "MM/DD/YY h:mma";

// Set the output timezone for local for every instance.
Moment.globalLocal = true;

const AsyncHome = asyncComponent(() => import("./HomePage"));
const AsyncManager = asyncComponent(() => import("./funds/manager"));
const AsyncNewFund = asyncComponent(() => import("./funds/new"));
const AsyncFundShow = asyncComponent(() => import("./funds/show"));
const AsyncOrgIndex = asyncComponent(() => import("./orgs"));
const AsyncOrgShow = asyncComponent(() => import("./orgs/show"));
const AsyncNewClaim = asyncComponent(() => import("./orgs/claim"));
const AsyncNewGrant = asyncComponent(() => import("./funds/grants/new"));
const AsyncAdminPanel = asyncComponent(() => import("./admin"));

class App extends React.Component {
  componentDidMount() {
    require("dotenv").config();
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={Splash} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/alpha" exact component={AsyncHome} />
          <Route path="/funds" exact component={AsyncManager} />
          <Route path="/funds/new" exact component={AsyncNewFund} />
          <Route path="/funds/:address" exact component={AsyncFundShow} />
          <Route path="/orgs" exact component={AsyncOrgIndex} />
          <Route path="/orgs/:ein" exact component={AsyncOrgShow} />
          <Route path="/orgs/:ein/grants/new" exact component={AsyncNewGrant} />
          <Route path="/orgs/:ein/claim" exact component={AsyncNewClaim} />
          <Route path="/admin" exact component={AsyncAdminPanel} />
        </Switch>
      </Router>
    );
  }
}
export default App;
