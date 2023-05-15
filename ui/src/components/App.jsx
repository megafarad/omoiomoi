import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import Main from './Main';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import ErrorPage from './ErrorPage';
import Meeting from "./Meeting";

const App = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main/>,
      errorElement: <ErrorPage/>,
    },
    {
      path:'/meetings/:meetingId',
      element: <Meeting />
    }
  ]);

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <RouterProvider router={router}/>
    </Auth0Provider>
  );
}

export default App;
