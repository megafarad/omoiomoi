import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Card, Container} from "react-bootstrap";
import {decrementMeetingPageNumber, incrementMeetingPageNumber} from "../redux/meetingsSlice";
import {decrementSearchPageNumber, incrementSearchPageNumber} from "../redux/searchSlice";

const PageBar = () => {
  const dispatch = useDispatch();
  const meetingsPage = useSelector((state) => state.meetings.page);
  const searchResults = useSelector((state) => state.search.page);
  const searchQuery = useSelector((state) => state.search.query);

  const resultsToRender = (searchQuery && searchResults) ? searchResults : meetingsPage;

  const pageSize = 10;

  return (resultsToRender &&
    <Container>
      <Card>
        <Card.Body>Page&nbsp;
          <Button onClick={() => {
            (searchQuery && searchResults) ? dispatch(decrementSearchPageNumber()) : dispatch(decrementMeetingPageNumber())
          }} disabled={resultsToRender.page <= 0}>-</Button>
          <span>{resultsToRender.page + 1}</span>
          <Button onClick={() => {
            (searchQuery && searchResults) ? dispatch(incrementSearchPageNumber()) : dispatch(incrementMeetingPageNumber())
          }}
                  disabled={Math.ceil(resultsToRender.total / pageSize) <= resultsToRender.page + 1}>+</Button>
          &nbsp;
          of {Math.ceil(resultsToRender.total / pageSize)}
        </Card.Body>
      </Card>
    </Container>);
};

export default PageBar;
