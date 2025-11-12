import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {TablePagination, Table, TableBody, TableRow, TableCell, TableHead, TableFooter, styled} from '@mui/material';
import {getInvoiceList} from "../../../services/profileService";
const TablePaginationNew = styled(TablePagination)(({theme})=>({
    "& p": {
        marginTop: "revert"
    }
}));
const Invoice = (props) => {
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
    const handlePrint = (invNo,memberId) => {
        window.open("/invoicepdf?v="+invNo+"&d="+memberId,"_blank");
    }
    useEffect(()=>{
        getInvoiceList().then(res => {
            if (res.result.invoice) {
                setData(res.result.invoice);
            }
        });
    },[]);
    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className="text-center">Invoice No</TableCell>
                        <TableCell className="text-center">Invoice Date</TableCell>
                        <TableCell className="text-center">Amount</TableCell>
                        <TableCell className="text-center">Status</TableCell>
                        <TableCell className="text-center">Print Pdf</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data.length > 0 ?
                            data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">{value.invNo}</TableCell>
                                    <TableCell className="text-center">{value.invDate}</TableCell>
                                    <TableCell className="text-center">{countryPriceSymbol}{value.invTotalAmount.toFixed(2)}</TableCell>
                                    <TableCell className="text-center" style={{textTransform: 'capitalize'}}>{value.invStatus}</TableCell>
                                    <TableCell className="text-center"><i className="far fa-print" onClick={()=>{handlePrint(value.eptInvId,value.eptMemberId)}}></i></TableCell>
                                </TableRow>
                            ))
                        :
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No Records Found.</TableCell>
                            </TableRow>
                    }
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePaginationNew rowsPerPageOptions={[25,50,75,100]} count={data.length} rowsPerPage={rowsPerPage} page={page} onPageChange={onChangePage} onRowsPerPageChange={onChangeRowsPerPage} className={`tablePageSelect`} SelectProps={{variant: "standard"}}/>
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}
export default connect(mapStateToProps,null)(Invoice);