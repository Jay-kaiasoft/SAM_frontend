import React, {useState, useEffect} from "react";
import { Col, Row } from "reactstrap";
import {Button, IconButton, InputAdornment, Link, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import {myPageImageUrl} from "../../config/api";
import history from "../../history";
import FilterMyPages from "../shared/commonControlls/filterMyPages";
import {getMyPagesTags} from "../../services/myDesktopService";
import { searchIconTransparent } from "../../assets/commonFunctions";

const innerHeading = {
    fontSize: 18
}

const SelectPage = ({
    handleBack,
    handleNext,
    data,
    setData,
    globalAlert,
    title,
    mpId,
    user
}) => {
    const [filterPublishedValues, setFilterPublishedValues] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState([]);
    const [myDataPublished, setMyDataPublished] = useState([]);
    const [search, setSearch] = useState("");
    const handleChangeSelectedFilter = (filterName) => {
        if(selectedFilter.includes(filterName)){
            setSelectedFilter(selectedFilter.filter(x => x !== filterName));
        } else {
            setSelectedFilter([...selectedFilter,filterName]);
        }
    }
    const handlePageSelected = (value) => {
        setData((prev) => {
            return {
                ...prev,
                [mpId]: value
            }
        })
    }
    const handleOnNextClick = () => {
        if (data[mpId] !== "" && data[mpId] !== undefined && data[mpId] !== 0) {
            setSelectedFilter([]);
            if (data.testingType) {
                if (data.testingType === 2 || data.testingType === 5) {
                    handleNext(1)
                }
                else {
                    handleNext(2)
                }
            }
            else {
                handleNext(1)
            }
            setSelectedFilter([]);
            setMyDataPublished([]);
            setSearch("");
        }
        else {
            globalAlert({
                type: "Error",
                text: "Please Select A Page For Email Marking Campaign.",
                open: true
            })
        }
    }
    const renderPagesList = () => {
        let renderedPagesList = []
        for (let index = 0; index < myDataPublished.length; index += 2) {
            const page =
                <div className="col-lg-3 col-md-6 card-container" key={index}>
                    <div className={`card mb-3 ${myDataPublished[index].mpId === data[mpId] ? "active-tmpt" : ""}`} onClick={() => { handlePageSelected(myDataPublished[index].mpId) }}>
                        <div className="card-img-wrapper">
                            <img className="card-img-top" src={myPageImageUrl.replace("{{memberId}}", user.memberId).replace("{{folderName}}", "mypage").replace("{{myPageId}}", myDataPublished[index].mpId)} alt="tile" />
                        </div>
                        <div className="card-body">
                            <div className="card-title">{(myDataPublished[index].mpType === 2  && myDataPublished[index].groupName !== "") ? <i className="far fa-users fa-users-g" data-toggle="tooltip" title={myDataPublished[index].groupName}></i> : null}{myDataPublished[index].mpName}</div>
                        </div>
                    </div>
                    {index + 1 <= myDataPublished.length - 1 &&
                        <div className={`card mb-3 ${myDataPublished[index + 1].mpId === data[mpId] ? "active-tmpt" : ""}`} onClick={() => { handlePageSelected(myDataPublished[index + 1].mpId) }}>
                            <div className="card-img-wrapper">
                                <img className="card-img-top" src={myPageImageUrl.replace("{{memberId}}", user.memberId).replace("{{folderName}}", "mypage").replace("{{myPageId}}", myDataPublished[index+1].mpId)} alt="tile" />
                            </div>
                            <div className="card-body">
                                <div className="card-title">{(myDataPublished[index + 1].mpType === 2  && myDataPublished[index + 1].groupName !== "") ? <i className="far fa-users fa-users-g" data-toggle="tooltip" title={myDataPublished[index + 1].groupName}></i> : null}{myDataPublished[index + 1].mpName}</div>
                            </div>
                        </div>
                    }
                </div>
            renderedPagesList.push(page)
        }
        return renderedPagesList.length !== 0?renderedPagesList:0;
    }
    const handleChangeFilter = () => {
        if(selectedFilter.length > 0) {
            setMyDataPublished([]);
            data?.pagesList.filter((value) => (
                (value.mpTags !== null && value.mpTags !== "") ?
                    selectedFilter.map((filter) => (
                        value.mpTags.toLowerCase().split(", ").includes(filter) === true ?
                            setMyDataPublished((prev) => {
                                let t = 0;
                                prev.map((p)=>(
                                    t = p.mpId === value.mpId ? 1 : 0
                                ))
                                if(t === 0){
                                    if(search === "") {
                                        return [...prev, {...value, "id": value.mpId, "name": value.mpName}];
                                    } else if(search !== "" && value.mpName.toLowerCase().includes(search.toLocaleLowerCase())) {
                                        return [...prev, {...value, "id": value.mpId, "name": value.mpName}];
                                    } else {
                                        return [...prev];
                                    }
                                } else {
                                    return [...prev];
                                }
                            })
                        : null
                    ))
                : null
            ))
        } else {
            let t = [];
            data?.pagesList.map((v)=>(
                t.push({...v,id:v.mpId,name:v.mpName})
            ))
            if(search !== ""){
                t = t.filter((v)=>{return v.mpName.toLowerCase().includes(search.toLocaleLowerCase())});
            }
            setMyDataPublished(t);
        }
    }

    useEffect(()=> {
        getMyPagesTags(2).then(res => {
            if (res.result) {
                setFilterPublishedValues(res.result.tags);
            }
        });
        return () => {
            setFilterPublishedValues([]);
        };
    },[]);
    useEffect(()=>{
        handleChangeFilter();
        return () => {
            setMyDataPublished([]);
        };
    },[selectedFilter,data?.pagesList]);
    return (
        <Row>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                <p className="mb-0" style={innerHeading}><strong>{title}</strong></p>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3 text-right">
                <TextField
                    placeholder="Search"
                    name="search"
                    type="text"
                    value={search}
                    onChange={(event)=>{setSearch(event.target.value);}}
                    variant="standard"
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton sx={searchIconTransparent.root} onClick={handleChangeFilter}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                    }}
                />
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                <FilterMyPages filterValues={filterPublishedValues} handleChangeSelectedFilter={handleChangeSelectedFilter} selectedFilter={selectedFilter} />
            </Col>
            <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                <div className="pages-container">
                    {
                        renderPagesList() !== 0 ?
                            renderPagesList()
                        :
                            <Row style={{height:"50vh"}} className="row align-items-center w-100">
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                    <p className="mb-5">You have no page design available</p>
                                    <p>Create A Page Design</p>
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/addmypage")}}>
                                        <i className="far fa-plus-square"></i>
                                        <div className="bg-green"></div>
                                    </Link>
                                </Col>
                            </Row>
                    }
                </div>
                <div className="col-12 mt-3 mb-3" align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {setSelectedFilter([]); setMyDataPublished(data?.pagesList); setSearch(""); handleBack(1);}}
                    >
                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        className="ml-3"
                        onClick={() => handleOnNextClick()}
                    >
                        <i className="far fa-long-arrow-right mr-2"></i>NEXT
                    </Button>
                </div>
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => {
    return {
        user:state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectPage);