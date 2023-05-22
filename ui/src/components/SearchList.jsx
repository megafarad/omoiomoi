import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import useGetToken from '../hooks/useGetToken';
import {FadeLoader} from 'react-spinners';
import {setIsSearchLoading, setSearchPage} from '../redux/searchSlice';
import commonRequestParameters from '../app/commonRequestParameters';
import {Table} from 'react-bootstrap';
import SearchResult from './SearchResult';

const SearchList = () => {
  const dispatch = useDispatch();
  const accessToken = useGetToken();
  const searchPage = useSelector((state) => state.search.page);
  const query = useSelector((state) => state.search.query);
  const searchPageNumber = useSelector((state) => state.search.pageNumber);
  const isLoading = useSelector((state) => state.search.isLoading);
  const fromDate = useSelector((state) => state.dateRange.fromDate);
  const toDate = useSelector((state) => state.dateRange.toDate);
  const pageSize = 10;

  useEffect(() => {
    if (accessToken) {
      dispatch(setIsSearchLoading(true));
      const fetchUrl = '/api/meetingEvent?' + commonRequestParameters(searchPageNumber, pageSize, fromDate, toDate) +
        '&' + new URLSearchParams({
          query: query
        });
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
          dispatch(setSearchPage(response));
          dispatch(setIsSearchLoading(false));
        })
        .catch(error => {
          console.log("search meetings", error.message);
        });
    }
  }, [dispatch, accessToken, fromDate, toDate, query, searchPageNumber]);
  return (isLoading || !searchPage) ? <FadeLoader/> :
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
        { searchPage.items.length === 0 ? <tr><td colSpan={4}><i>No results found</i></td></tr> : searchPage.items.map((searchResult, idx) =>
          <SearchResult key={idx} meetingEvent={searchResult.meeting_event} meetingId={searchResult.meeting_id}/>
        )}
      </tbody>
    </Table>
};

export default SearchList;
