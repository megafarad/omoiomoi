import React from 'react';


const MeetingRoomName = ({roomName}) => {
  const [roomPart, hostPart] = roomName.split('@');

  return(
    <>
      {roomPart}<br/>@{hostPart}
    </>
  );

}

export default MeetingRoomName;
