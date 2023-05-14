import React from "react";
import {Card} from "react-bootstrap";

const MeetingEventCard = (props) => {
  const time = new Date(props.meetingEvent.timestamp);
  switch (props.meetingEvent.event) {
    case 'START':
      return (
        <Card>
          <Card.Body>Meeting started at: {time.toString()} </Card.Body>
        </Card>);
    case 'JOIN':
      return (
        <Card>
          <Card.Body>
            <img className='meeting-event-avtar' src={props.meetingEvent.participant.avatar_url} alt='' width='50'
                 height='50'/>
            <b>{props.meetingEvent.participant.name}</b> joined the meeting
          </Card.Body>
        </Card>
      );
    case 'SPEECH':
      const transcript = props.meetingEvent.transcript[0].text;
      return (
        <Card>
          <Card.Body>
            <img className='meeting-event-avtar' src={props.meetingEvent.participant.avatar_url} alt='' width='50'
                 height='50'/>
            <b>{props.meetingEvent.participant.name}</b>: {transcript}
          </Card.Body>
        </Card>
      );
    case 'LEAVE':
      return (
        <Card>
          <Card.Body>
            <img className='meeting-event-avtar' src={props.meetingEvent.participant.avatar_url} alt='' width='50'
                 height='50'/>
            <b>{props.meetingEvent.participant.name}</b> left the meeting
          </Card.Body>
        </Card>
      );
    case 'END':
      return (
        <Card>
          <Card.Body>Meeting ended at: {time.toString()} </Card.Body>
        </Card>);
    default:
      return (
        <Card>
          <Card.Body>Unknown Event Type: {JSON.stringify(props.meetingEvent)}</Card.Body>
        </Card>
      );

  }
};

export default MeetingEventCard;
