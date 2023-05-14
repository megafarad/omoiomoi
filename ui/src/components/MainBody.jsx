import React from 'react';
import {useAuth0} from '@auth0/auth0-react';

import 'react-datepicker/dist/react-datepicker.min.css';
import MeetingList from './MeetingList';
import {useSelector} from 'react-redux';
import FilterBar from "./FilterBar";
import {FadeLoader} from "react-spinners";
import PageBar from "./PageBar";
import SearchList from "./SearchList";

const MainBody = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const searchText = useSelector((state) => state.search.query);

  return (
    isAuthenticated  && (
      <>
        <FilterBar />
        { isLoading ? <FadeLoader/> : searchText.length > 0 ? <SearchList /> : <MeetingList /> }
        <PageBar />
      </>
    )
  );
};

export default MainBody;
