import React, {useCallback, useEffect, useState} from "react";
import {connect} from "react-redux";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import {IconButton, InputAdornment, MenuItem, Select, TextField} from "@mui/material";
import history from "../../history";
import SearchIcon from "@mui/icons-material/Search";
import {Col, Row, Table} from "reactstrap";
import { Pagination } from "@mui/material"
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {getCustomFormListPages} from "../../services/customFormService";
import {searchIconTransparent} from "../../assets/commonFunctions";

const MyFormData = ({globalAlert,handleClickLink}) => {
    const [perPage,setPerPage] = useState(25);
    const [totalPages,setTotalPages] = useState(0);
    const [selectedPage,setSelectedPage] = useState(0);
    const [sort,setSort] = useState("cfCreateDate,desc");
    const [sortBox, setSortBox] = useState([false]);
    const [search,setSearch] = useState("");
    const [searchSend,setSearchSend] = useState("");
    const [dataForm, setDataForm] = useState([]);
    const [totalData,setTotalData] = useState(0);
    const handleChangePagination = (event,value) => {
        setSelectedPage(value-1);
    }
    const handleChangePerPage = (event) => {
        setSelectedPage(0);
        setPerPage(event.target.value);
    }
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    }
    const handleClickSearch = () => {
        setSelectedPage(0);
        setSearchSend(search);
    }
    const handleClickSort = (name,index) => {
        if(sortBox[index] === true) {
            name += ",desc";
            const newSortBox = [...sortBox];
            newSortBox[index] = !newSortBox[index];
            setSortBox(newSortBox);
        } else {
            name += ",asc";
            const newSortBox = [];
            newSortBox[index] = !newSortBox[index];
            setSortBox(newSortBox);
        }
        setSelectedPage(0);
        setSort(name);
    }
    const displayFormList = useCallback(() => {
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setDataForm([]);
        getCustomFormListPages(data).then(res => {
            if(res.status === 200){
                if (res.result) {
                    setDataForm(res.result.customFormList);
                    setTotalPages(res.result.getTotalPages);
                    setTotalData(res.result.totalCustomForm);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    },[searchSend,selectedPage,perPage,sort,globalAlert]);
    useEffect(()=>{
        displayFormList();
    },[displayFormList,selectedPage,perPage,searchSend]);
    return(
        <>
            <div className="top-button mb-3">
                <div>
                    <span className="align-middle">Show</span>
                    <Select
                        variant="standard"
                        name="perPage"
                        onChange={handleChangePerPage}
                        value={perPage}
                        className="mx-2 align-middle"
                    >
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={75}>75</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                    <span className="align-middle">entries</span>
                </div>
                <div>
                    <TextField
                        placeholder="Search"
                        variant="standard"
                        name="search"
                        type="text"
                        value={search}
                        onChange={handleChangeSearch}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton sx={searchIconTransparent.root} onClick={handleClickSearch}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                </div>
            </div>
            <div className="table-content-wrapper height-58 overflow-auto">
                <Table striped>
                    <thead>
                        <tr>
                            <th key={0} onClick={()=>{handleClickSort("cfId",0)}} className="text-center" width="10%">Id
                                <span>
                                    {typeof sortBox[0] !== "undefined"
                                        ? (sortBox[0] === true
                                            ? <i className="fad fa-sort-up ml-1"></i>
                                            : <i className="fad fa-sort-down ml-1"></i> )
                                        : <i className="fad fa-sort ml-1"></i>}
                                </span>
                            </th>
                            <th key={1} onClick={()=>{handleClickSort("cfFormName",1)}}>Name
                                <span>
                                            {typeof sortBox[1] !== "undefined"
                                                ? (sortBox[1] === true
                                                    ? <i className="fad fa-sort-up ml-1"></i>
                                                    : <i className="fad fa-sort-down ml-1"></i> )
                                                : <i className="fad fa-sort ml-1"></i>}
                                        </span>
                            </th>
                            <th width="15%">Created</th>
                            <th className="text-center" width="15%">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        dataForm.length > 0 ?
                            dataForm.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td align="center">{value.cfId}</td>
                                        <td>{value.cfFormName}</td>
                                        <td>{value.cfCreateDate}</td>
                                        <td align="center">
                                            <CheckPermissionButton module="custom form" action="report">
                                                <i className="far fa-chart-pie mr-3" data-toggle="tooltip" title="Report" onClick={()=>{history.push("/formreport?v="+value.id)}}></i>
                                            </CheckPermissionButton>
                                            <CheckPermissionButton module="custom form" action="link">
                                                <i className="far fa-link" data-toggle="tooltip" title="Published Link" onClick={()=>{handleClickLink(value.customFormUrl)}}></i>
                                            </CheckPermissionButton>
                                        </td>
                                    </tr>
                                );
                            })
                            :
                            <tr>
                                <td colSpan={4} className="text-center">No Form Found.</td>
                            </tr>
                    }
                    </tbody>
                </Table>
            </div>
            <Row className="mt-3">
                <Col xs={6}><span className="align-middle pt-2">{`Showing ${dataForm.length > 0 ? (perPage*selectedPage)+1 : 0} to ${((perPage*selectedPage)+1)+dataForm.length-1} of ${totalData} entries`}</span></Col>
                <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage+1} showFirstButton showLastButton onChange={handleChangePagination}/></Col>
            </Row>
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null,mapDispatchToProps)(MyFormData);