import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {TablePagination, Table, TableBody, TableRow, TableCell, TableHead, TableFooter, styled} from '@mui/material';
import {getUninvoicedList} from "../../../services/profileService";

const TablePaginationNew = styled(TablePagination)(({theme})=>({
    "& p": {
        marginTop: "revert"
    }
}));
const UnInvoiced = (props) => {
    const countryPriceSymbol = props.user.countryPriceSymbol;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [data, setData] = useState([]);
    const onChangePage = (event, nextPage) => {
        setPage(nextPage);
    }
    const onChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
    }
    useEffect(()=>{
        getUninvoicedList().then(res => {
            if (res.result.uninvoiced) {
                setData(res.result.uninvoiced);
            }
        });
    },[]);
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell width="5%" className="text-center">No</TableCell>
                    <TableCell width="10%" className="text-center">Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell width="10%" className="text-center">Type</TableCell>
                    <TableCell width="15%" className="text-center">Total Members / Responses</TableCell>
                    <TableCell width="10%" className="text-center">Approx Cost</TableCell>
                    <TableCell width="10%" className="text-center">Bills Type</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    data.length > 0 ?
                        data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((value, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-center">{index+1}</TableCell>
                                <TableCell className="text-center">{value.tranCampaignDate}</TableCell>
                                <TableCell style={{whiteSpace:"pre-line"}}>{value.tranCampaignName}</TableCell>
                                <TableCell className="text-center" style={{textTransform: 'capitalize'}}>{value.tranType.toLowerCase().replaceAll("sms","SMS")}</TableCell>
                                <TableCell className="text-center">{value.tranTotalMember}</TableCell>
                                <TableCell className="text-center">{countryPriceSymbol}{value.tranTotalAmount.toFixed(2)}</TableCell>
                                <TableCell className="text-center">{value.tranBillType}</TableCell>
                            </TableRow>
                        ))
                    :
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">No Records Found.</TableCell>
                        </TableRow>
                }
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePaginationNew rowsPerPageOptions={[25,50,75,100]} count={data.length} rowsPerPage={rowsPerPage} page={page} onPageChange={onChangePage} onRowsPerPageChange={onChangeRowsPerPage} className={`tablePageSelect`} SelectProps={{variant: "standard"}}/>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}
export default connect(mapStateToProps,null)(UnInvoiced);