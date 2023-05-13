import React from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import MainBody from './MainBody';
import { useAuth0 } from '@auth0/auth0-react';
const Main = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <>
      <MainBody/>
      <div>
        {isAuthenticated ? <LogoutButton/> : <LoginButton/>}
      </div>
    </>);
};

export default Main
