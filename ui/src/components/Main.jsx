import React from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import MainBody from './MainBody';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, Container } from 'react-bootstrap';
import { GiBrainDump } from 'react-icons/gi';
const Main = () => {
  const { isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    return (
      <Container>
        <MainBody/>
        <Card>
          <LogoutButton/>
        </Card>
      </Container>
    );
  } else {
    return (
      <Container className='login'>
        <GiBrainDump size={70}/>
        <div>To see transcripts, log in with email you provided to Jitsi Meet</div>
        <LoginButton/>
      </Container>
    );
  }
};

export default Main
