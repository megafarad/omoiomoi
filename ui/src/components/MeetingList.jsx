import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import commonRequestParameters from '../app/commonRequestParameters';
import {FadeLoader} from 'react-spinners';
import useGetToken from "../hooks/useGetToken";
import {setAreMeetingsLoading, setMeetingPage} from "../redux/meetingsSlice";
import {Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {BsFillArrowRightCircleFill} from 'react-icons/bs';

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


  return (isLoading || !meetingsPage) ? <FadeLoader/> :
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
      { meetingsPage.items.map((meeting, idx) =>
        <tr key={idx}>
          <td>
            {meeting.room_name}
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
