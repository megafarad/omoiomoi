import React from 'react';
import {Link} from "react-router-dom";
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
const SearchResult = ({meetingEvent, meetingId}) => {
  const transcript = meetingEvent.transcript[0].text;
  return (
    <tr>
      <td>
        <img className='meeting-event-avtar' src={meetingEvent.participant.avatar_url} alt='' width='50'
             height='50'/>
      </td>
      <td>
        {meetingEvent.participant.name}
      </td>
      <td>
        {transcript}
      </td>
      <td className='go-to-mtg-td'>
        <Link to={`/meetings/${meetingId}`}><BsFillArrowRightCircleFill/></Link>
      </td>
    </tr>
  );

};

export default SearchResult;
