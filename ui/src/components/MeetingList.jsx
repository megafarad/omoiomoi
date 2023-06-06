import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FadeLoader} from 'react-spinners';
import useGetToken from '../hooks/useGetToken';
import {Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {BsFillArrowRightCircleFill} from 'react-icons/bs';
import MeetingRoomName from './MeetingRoomName';
import {fetchMeetings} from "../redux/meetingsSlice";

const MeetingList = () => {
  const dispatch = useDispatch();
  const accessToken = useGetToken();
  const meetingsPage = useSelector((state) => state.meetings.page);
  const meetingsPageNumber = useSelector((state) => state.meetings.pageNumber);
  const fromDate = useSelector((state) => state.dateRange.fromDate);
  const toDate = useSelector((state) => state.dateRange.toDate);
  const isLoading = useSelector((state) => state.meetings.isLoading);
  const error = useSelector((state) => state.meetings.error);
  const pageSize = 10;

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchMeetings({
        pageNumber: meetingsPageNumber,
        pageSize: pageSize,
        fromDate: fromDate,
        toDate: toDate,
        token: accessToken,
      }));
    }
  }, [dispatch, fromDate, toDate, meetingsPageNumber, accessToken]);


  return (isLoading) ? <FadeLoader/> :
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>
            Room
          </th>
          <th>
            Date
          </th>
          <th>
            Go to meeting
          </th>
        </tr>
      </thead>
      <tbody>
      { (error) ? <tr><td colSpan={3}><i>Error getting meetings: {error}</i></td></tr> :
        (!meetingsPage || meetingsPage.items.length === 0) ? <tr><td colSpan={3}><i>No meetings</i></td></tr> : meetingsPage.items.map((meeting, idx) =>
        <tr key={idx}>
          <td>
            <MeetingRoomName roomName={meeting.room_name}/>
          </td>
          <td>
            {Intl.DateTimeFormat(navigator.language, {weekday: 'long', month: 'short',
            day: 'numeric', year: 'numeric', hour: 'numeric', hour12: true, minute: 'numeric'}).format(
            new Date(meeting.start_time))}
          </td>
          <td className='go-to-mtg-td'>
            <Link to={`/meetings/${meeting.id}`}><BsFillArrowRightCircleFill/></Link>
          </td>
        </tr>
      )
      }
      </tbody>
    </Table>
};

export default MeetingList;
