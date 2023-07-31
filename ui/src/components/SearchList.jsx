import React, {useDeferredValue, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import useGetToken from '../hooks/useGetToken';
import {FadeLoader} from 'react-spinners';
import {searchMeetings} from '../redux/searchSlice';
import {Table} from 'react-bootstrap';
import SearchResult from './SearchResult';

const SearchList = () => {
  const dispatch = useDispatch();
  const accessToken = useGetToken();
  const searchPage = useSelector((state) => state.search.page);
  const query = useSelector((state) => state.search.query);
  const deferredQuery = useDeferredValue(query);
  const searchPageNumber = useSelector((state) => state.search.pageNumber);
  const fromDate = useSelector((state) => state.dateRange.fromDate);
  const toDate = useSelector((state) => state.dateRange.toDate);
  const isLoading = useSelector((state) => state.search.isLoading);
  const error = useSelector((state) => state.search.error);
  const pageSize = 10;

  useEffect(() => {
    if (accessToken) {
      dispatch(searchMeetings({
        pageNumber: searchPageNumber,
        pageSize: pageSize,
        fromDate: fromDate,
        toDate: toDate,
        query: deferredQuery,
        token: accessToken,
      }));
    }
  }, [dispatch, accessToken, fromDate, toDate, searchPageNumber, deferredQuery]);
  return (isLoading) ? <FadeLoader/> :
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>
            Avatar
          </th>
          <th>
            Participant Name
          </th>
          <th>
            Transcript
          </th>
          <th>
            Go to meeting
          </th>
        </tr>
      </thead>
      <tbody>
      </tbody>
      { (error) ? <tr><td colSpan={4}><i>Problem getting results: {error}</i></td></tr> :
        (!searchPage || searchPage.items.length === 0) ? <tr><td colSpan={4}><i>No results found</i></td></tr> : searchPage.items.map((searchResult, idx) =>
          <SearchResult key={idx} meetingEvent={searchResult.meeting_event} meetingId={searchResult.meeting_id}/>
        )}
    </Table>
};

export default SearchList;
