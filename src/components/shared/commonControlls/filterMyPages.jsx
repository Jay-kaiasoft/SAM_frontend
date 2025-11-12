import React from 'react';
import {Checkbox, FormControlLabel} from "@mui/material";
import titleize from 'titleize';
import {Col, Row} from "reactstrap";

const FilterMyPages = (props) => {
    const filterValues = props.filterValues;
    const handleChangeSelectedFilter = props.handleChangeSelectedFilter;
    const selectedFilter = props.selectedFilter;
    return (
        <>
            <strong>Filter</strong>
            <Row>
                {
                    filterValues.map((fval,i) => (
                        <Col key={i} xs={12}><FormControlLabel className="m-0" control={ <Checkbox className="tSelected" color="primary" value={fval} onChange={()=>{handleChangeSelectedFilter(fval)}} checked={selectedFilter.includes(fval)} /> } label={titleize(fval)} /></Col>
                    ))
                }
            </Row>
        </>
    );
}

export default FilterMyPages;