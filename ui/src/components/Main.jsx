import React from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, Container } from 'react-bootstrap';
import { GiBrainDump } from 'react-icons/gi';
import { useSelector } from 'react-redux';
import FilterBar from './FilterBar';
import { FadeLoader } from 'react-spinners';
import SearchList from './SearchList';
import MeetingList from './MeetingList';
import PageBar from './PageBar';
const Main = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const searchText = useSelector((state) => state.search.query);

  if (isAuthenticated) {
    return (
      <Container>
        <FilterBar />
        { isLoading ? <FadeLoader/> : searchText.length > 0 ? <SearchList /> : <MeetingList /> }
        <PageBar />
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
