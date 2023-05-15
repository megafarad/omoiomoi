import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useAuth0} from '@auth0/auth0-react';
import useGetToken from '../hooks/useGetToken';
import {Container} from 'react-bootstrap';
import {FadeLoader} from "react-spinners";
import MeetingEventCard from "./MeetingEventCard";

const Meeting = () => {
  const { meetingId } = useParams();
  const { isLoading } = useAuth0();
  const accessToken = useGetToken();
  const [meeting, setMeeting] = useState(null);

  useEffect(() => {
    if (accessToken) {
      const fetchUrl = `/api/meetings/${meetingId}`;
      fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => {
            console.log(response);
            if (response.ok) {
              return response;
            } else {
              const error = new Error(`Error ${response.status}: ${response.statusText}`);
              error.response = response;
              throw error;
            }
          },
          error => {
            throw error;
          })
        .then(response => response.json())
        .then(response => {
          setMeeting(response);
        })
        .catch(error => {
          console.log('get meeting', error.message);
        })
    }
  }, [accessToken, meetingId])

  return (!meeting || isLoading ? <FadeLoader/> :
    <Container>
      {meeting.events.map((meetingEvent, idx) => <MeetingEventCard id={idx} meetingEvent={meetingEvent}/>)}
    </Container>
  );
};

export default Meeting;
