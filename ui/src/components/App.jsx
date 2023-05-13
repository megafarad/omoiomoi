import React, { Component } from "react";

import { Auth0Provider } from "@auth0/auth0-react";
import Main from "./Main";
import "../App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

  render() {
    return (
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
          <Main/>
      </Auth0Provider>
    );
  }
}

export default App;
