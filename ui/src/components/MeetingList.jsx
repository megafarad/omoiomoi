import React, {useEffect} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import MeetingEventCard from './MeetingEventCard';
import {useDispatch, useSelector} from 'react-redux';
import commonRequestParameters from '../app/commonRequestParameters';
import {FadeLoader} from "react-spinners";
import useGetToken from "../hooks/useGetToken";
import {setAreMeetingsLoading, setMeetingPage} from "../redux/meetingsSlice";
import {Container} from "react-bootstrap";

const MeetingList = () => {
  const dispatch = useDispatch();
  const accessToken = useGetToken();
  const meetingsPage = useSelector((state) => state.meetings.page);
  const meetingsPageNumber = useSelector((state) => state.meetings.pageNumber);
  const isLoading = useSelector((state) => state.meetings.isLoading);
  const fromDate = useSelector((state) => state.dateRange.fromDate);
  const toDate = useSelector((state) => state.dateRange.toDate);
  const pageSize = 10;

  useEffect(() => {
    if (accessToken) {
      dispatch(setAreMeetingsLoading(true));
      const fetchUrl ='/api/meetings?' + commonRequestParameters(meetingsPageNumber, pageSize, fromDate, toDate);
      fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => {
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
          dispatch(setMeetingPage(response));
          dispatch(setAreMeetingsLoading(false));
        })
        .catch(error => {
          console.log("load meetings", error.message);
        });
    }
  }, [dispatch, fromDate, toDate, meetingsPageNumber, accessToken]);


  return (isLoading || !meetingsPage) ? <FadeLoader/> : <Container>
    <Accordion defaultActiveKey="0">
      {meetingsPage.items.map((currentMeeting, idx) =>
        <Accordion.Item eventKey={idx} key={idx}>
          <Accordion.Header><i>{currentMeeting.room_name}</i>&nbsp;at&nbsp;
            {Intl.DateTimeFormat(navigator.language, {weekday: 'long', month: 'short',
              day: 'numeric', year: 'numeric', hour: 'numeric', hour12: true, minute: 'numeric'}).format(
              new Date(currentMeeting.start_time))}
          </Accordion.Header>
          <Accordion.Body>{currentMeeting.events.map((currentEvent,evtIdx) =>
            <MeetingEventCard key={evtIdx} meetingEvent={currentEvent}/>)}
          </Accordion.Body>
        </Accordion.Item>)}
    </Accordion>
  </Container>
};

export default MeetingList;
