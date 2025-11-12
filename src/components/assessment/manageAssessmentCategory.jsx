import React, {createRef, useCallback, useEffect, useRef, useState} from "react";
import {connect} from "react-redux";
import {Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import {Button, IconButton, InputAdornment, Link, MenuItem, Select, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination } from "@mui/material"
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import InputField from "../shared/commonControlls/inputField";
import {deleteAssessmentCategory, getAssessmentCategoryListPages, saveAssessmentCategory} from "../../services/assessmentService";
import {searchIconTransparent} from "../../assets/commonFunctions";
import history from "../../history";

const ManageAssessmentCategory = ({subUser,globalAlert,confirmDialog}) => {
    const [data, setData] = useState({});
    const [search,setSearch] = useState("");
    const [selectedPage,setSelectedPage] = useState(0);
    const [searchSend,setSearchSend] = useState("");
    const [perPage,setPerPage] = useState(25);
    const [sort,setSort] = useState("id,asc");
    const [totalData,setTotalData] = useState(0);
    const [totalPages,setTotalPages] = useState(0);
    const [sortBox, setSortBox] = useState([false]);
    const [categoryModal, setCategoryModal] = useState(false);
    const toggleCategoryModal =  () => setCategoryModal(!categoryModal);
    const [category,setCategory] = useState("");
    const [editCategory,setEditCategory] = useState({id:"",catName:""});
    const inputRefs = useRef([createRef()]);
    const handleChangePagination = (event,value) => {
        setSelectedPage(value-1);
    }
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    }
    const handleClickSearch = () => {
        setSelectedPage(0);
        setSearchSend(search);
    }
    const handleChangePerPage = (event) => {
        setSelectedPage(0);
        setPerPage(event.target.value);
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
    const handleClickEdit = (id) => {
        let t = data.filter((v)=>{ return v.id === id })[0];
        setEditCategory(t);
        setCategory(t.catName);
        toggleCategoryModal();
    }
    const handleClickDelete = (id) => {
        confirmDialog({
            open: true,
            title: 'Are you sure you want to delete category?',
            onConfirm: () => {
                let requestData = {
                    "id": [id]
                }
                deleteAssessmentCategory(requestData).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        setData((prev)=>{ return prev.filter((v)=>{ return v.id !== id}); });
                        setTotalData((prev) => { return prev-1 });
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
        });
    }
    const handleClickCreate = () => {
        let isValid = true;
        for (let i = 0; i < inputRefs.current.length; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        if (!isValid) {
            return
        }
        let requestData = {
            "id": editCategory.id === "" ? 0 : editCategory.id,
            "catName":category,
            "subMemberId":subUser.memberId
        }
        saveAssessmentCategory(requestData).then(res => {
            if (res.status === 200) {
                toggleCategoryModal();
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayCategory();
                setEditCategory({id:"",catName:""});
                setCategory("");
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const displayCategory = useCallback(()=>{
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        getAssessmentCategoryListPages(data).then(res => {
            if (res.result) {
                setData(res.result.assessmentCategoryList);
                setTotalPages(res.result.getTotalPages);
                setTotalData(res.result.totalAssessmentCategory);
            }
        });
    }, [searchSend,selectedPage,perPage,sort]);
    useEffect(()=>{
        displayCategory();
    },[displayCategory, selectedPage,perPage,searchSend]);
    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="icon-wrapper d-inline-block mr-5">
                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Back" onClick={()=>{history.push("/myassessmenttemplates")}}>
                        <i className="far fa-long-arrow-left"></i>
                        <div className="bg-dark-grey"></div>
                    </Link>
                </div>
                <h3 className="d-inline-block mb-0 align-middle">Assessment Category</h3>
                <div className="icon-wrapper d-inline-block mx-5">
                    <CheckPermissionButton module="assessment category" action="add">
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{toggleCategoryModal()}}>
                            <i className="far fa-plus-square"></i>
                            <div className="bg-green"></div>
                        </Link>
                    </CheckPermissionButton>
                </div>
                <div className="top-button my-3">
                    <div>
                        <span className="align-middle">Show</span>
                        <Select
                            name="perPage"
                            onChange={handleChangePerPage}
                            value={perPage}
                            className="mx-2 align-middle"
                            variant="standard"
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
                            name="search"
                            type="text"
                            value={search}
                            onChange={handleChangeSearch}
                            variant="standard"
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
                            <th style={{width:80}}>No</th>
                            <th onClick={()=>{handleClickSort("catName",1)}}>Name
                                <span>
                                    {typeof sortBox[1] !== "undefined"
                                        ? (sortBox[1] === true
                                            ? <i className="fad fa-sort-up ml-1"></i>
                                            : <i className="fad fa-sort-down ml-1"></i> )
                                        : <i className="fad fa-sort ml-1"></i>}
                                </span>
                            </th>
                            <th className="text-center" style={{width:150}}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            data.length > 0 ?
                                data.map((dataV, dataI)=>{
                                    return (
                                        <tr key={dataI}>
                                            <td>{((perPage*selectedPage)+1)+dataI}</td>
                                            <td>{dataV.catName}</td>
                                            <td className="text-center">
                                                {
                                                    dataV.memberId !== 0 &&
                                                    <>
                                                        <CheckPermissionButton module="assessment category" action="edit">
                                                            <i className="far fa-pencil-alt mr-3" data-toggle="tooltip" title="Edit" onClick={()=>{handleClickEdit(dataV.id)}}></i>
                                                        </CheckPermissionButton>
                                                        <CheckPermissionButton module="assessment category" action="delete">
                                                            <i className="far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={()=>{handleClickDelete(dataV.id)}}></i>
                                                        </CheckPermissionButton>
                                                    </>
                                                }
                                            </td>
                                        </tr>
                                    );
                                })
                                : <tr><td colSpan={3} className="text-center">No Data Found</td></tr>
                        }
                        </tbody>
                    </Table>
                </div>
                <Row className="mt-3">
                    <Col xs={6}><span className="align-middle pt-2">{`Showing ${data.length > 0 ? (perPage*selectedPage)+1 : 0} to ${((perPage*selectedPage)+1)+data.length-1} of ${totalData} entries`}</span></Col>
                    <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage+1} showFirstButton showLastButton onChange={handleChangePagination}/></Col>
                </Row>
            </Col>
            <Modal isOpen={categoryModal} toggle={()=> { toggleCategoryModal();setEditCategory({id:"",catName:""});setCategory(""); }}>
                <ModalHeader toggle={()=> { toggleCategoryModal();setEditCategory({id:"",catName:""});setCategory(""); }}>{ editCategory.id === "" ? "Add" : "Edit" } Category</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={10} className="mx-auto">
                            <FormGroup>
                                <InputField
                                    ref={inputRefs.current[0]}
                                    type="text"
                                    id="category"
                                    name="category"
                                    label="Category Name"
                                    onChange={(name,value)=>{setCategory(value)}}
                                    value={category}
                                    validation={"required"}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={handleClickCreate} className="mr-3">{ editCategory.id === "" ? "CREATE" : "SAVE" }</Button>
                    <Button variant="contained" color="primary" onClick={()=> { toggleCategoryModal();setEditCategory({id:"",catName:""});setCategory(""); }}>CLOSE</Button>
                </ModalFooter>
            </Modal>
        </Row>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        subUser: state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ManageAssessmentCategory);