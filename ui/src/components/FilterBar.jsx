import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import {setFromDate, setToDate} from "../redux/dateRangeSlice";
import {setSearchQuery} from "../redux/searchSlice";


const FilterBar = () => {
  const dispatch = useDispatch();
  const fromDate = useSelector((state) => state.dateRange.fromDate);
  const toDate = useSelector((state) => state.dateRange.toDate);
  const onSearchChange = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(e.target.value));
  }
  return(
    <Card>
      <Card.Body>
        <Form>
          <Row>
            <Col md={2}>From: <DatePicker selected={fromDate ? new Date(fromDate) : null}
                                          onChange={(date) => dispatch(setFromDate(date.toISOString()))}/>
            </Col>
            <Col md={2}>To: <DatePicker selected={toDate ? new Date(toDate) : null}
                                        onChange={(date) => dispatch(setToDate(date.toISOString()))}/>
            </Col>
            <Col md={8}>Search: <Form.Control placeholder='Search...' onChange={onSearchChange}/></Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>);
};

export default FilterBar;
