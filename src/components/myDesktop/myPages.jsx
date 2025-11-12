import React, {useCallback, useEffect, useState} from 'react';
import {Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {Tab, Tabs, Link, TextField, Button, InputAdornment, IconButton} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterMyPages from "../shared/commonControlls/filterMyPages";
import CustomCard from "../shared/commonControlls/customCard";
import History from "../../history";
import { cloneMyPage, deleteMyPage, getFreeTemplateList, getFreeTemplatesTags, getMyPageById, getMyPagesList, getMyPagesTags } from "../../services/myDesktopService";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import { connect } from 'react-redux';
import { setGlobalAlertAction } from '../../actions/globalAlertActions';
import { setConfirmDialogAction } from '../../actions/confirmDialogActions';
import { siteURL } from '../../config/api';
import history from "../../history";
import {TabPanel, a11yProps, handleClickHelp, searchIconTransparent} from "../../assets/commonFunctions";
import CopyLink from "../shared/commonControlls/copyLink";
import $ from "jquery";
import html2pdf from "html-to-pdf-js";
import { setLoader } from '../../actions/loaderActions';
import html2canvas from 'html2canvas';
import { canvastoFile, downloadFile } from 'image-conversion';

const MyPages = ({
    globalAlert,
    subUser,
    confirmDialog,
    setLoader
}) => {
    const [value, setValue] = useState(0);
    const [filterPublishedValues, setFilterPublishedValues] = useState([]);
    const [filterDraftedValues, setFilterDraftedValues] = useState([]);
    const [filterFreeTemplateValues, setFilterFreeTemplateValues] = useState([]);
    const [myDataPublished, setMyDataPublished] = useState([]);
    const [myDataPublishedDisplay, setMyDataPublishedDisplay] = useState([]);
    const [myDataDrafted, setMyDataDrafted] = useState([]);
    const [myDataDraftedDisplay, setMyDataDraftedDisplay] = useState([]);
    const [myDataFreeTemplates, setMyDataFreeTemplates] = useState([])
    const [myDataFreeTemplatesDisplay, setMyDataFreeTemplatesDisplay] = useState([])
    const [selectedFilter, setSelectedFilter] = useState([]);
    const [modalLink, setModalLink] = useState(false);
    const toggleLink = useCallback(() => setModalLink(!modalLink),[modalLink]);
    const [link, setLink] = useState("");
    const [search, setSearch] = useState("");

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setSelectedFilter([]);
        setSearch("");
        setMyDataPublishedDisplay(myDataPublished);
        setMyDataDraftedDisplay(myDataDrafted);
        setMyDataFreeTemplatesDisplay(myDataFreeTemplates);
    };
    const handleChangeSelectedFilter = (filterName) => {
        let t = [];
        if(selectedFilter.includes(filterName)){
            t = selectedFilter.filter(x => x !== filterName);
            setSelectedFilter(t);
        } else {
            t = [...selectedFilter,filterName];
            setSelectedFilter(t);
        }
        handleSelectedFilterData(t);
    }
    const addPage = () => {
        History.push('/addmypage');
    };
    useEffect(()=>{
        getMyPagesTags(2).then(res => {
            if (res.result) {
                setFilterPublishedValues(res.result.tags);
            }
        });
        getMyPagesTags(1).then(res => {
            if (res.result) {
                setFilterDraftedValues(res.result.tags);
            }
        });
        getMyPagesList(2).then(res => {
            if (res.result) {
                let t = [];
                res.result.mypage.map((v)=>(
                    t.push({...v,id:v.mpId,name:v.mpName})
                ))
                setMyDataPublished(t);
                setMyDataPublishedDisplay(t);
            }
        });
        getMyPagesList(1).then(res => {
            if (res.result) {
                let t = [];
                res.result.mypage.map((v)=>(
                    t.push({...v,id:v.mpId,name:v.mpName})
                ))
                setMyDataDrafted(t);
                setMyDataDraftedDisplay(t);
            }
        });
        getFreeTemplatesTags().then(res => {
            if (res.status === 200) {
                setFilterFreeTemplateValues(res?.result?.tags)
            }
        })
        getFreeTemplateList().then(res => {
            if (res.status === 200) {
                let t = [];
                res?.result?.freeTemplate?.map((v) => (
                    t.push({
                        ...v,
                        id: v.ftId,
                        name: v.ftName,
                        imgFtSrc: siteURL + `/freetemplate/${v.ftFolderName}/thumb.png`
                    })
                ))
                setMyDataFreeTemplates(t);
                setMyDataFreeTemplatesDisplay(t);
            }
        })
        return () => {
            setFilterPublishedValues([]);
            setFilterDraftedValues([]);
            setFilterFreeTemplateValues([]);
            setMyDataPublished([]);
            setMyDataPublishedDisplay([]);
            setMyDataDrafted([]);
            setMyDataDraftedDisplay([]);
            setMyDataFreeTemplates([]);
            setMyDataFreeTemplatesDisplay([]);
        };
    },[]);
    const handleSelectedFilterData = (selectedFilter) => {
        if(value === 0){
            if(selectedFilter.length > 0) {
                setMyDataPublishedDisplay([]);
                myDataPublished.filter((value) => (
                    (value.mpTags !== null && value.mpTags !== "") ?
                        selectedFilter.map((filter) => (
                            value.mpTags.toLowerCase().split(", ").includes(filter) === true ?
                                setMyDataPublishedDisplay((prev) => {
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
                myDataPublished.map((v)=>(
                    t.push({...v,id:v.mpId,name:v.mpName})
                ))
                if(search !== ""){
                    t = t.filter((v)=>{return v.mpName.toLowerCase().includes(search.toLocaleLowerCase())});
                }
                setMyDataPublishedDisplay(t);
            }
        }else if(value === 1){
            if(selectedFilter.length > 0) {
                setMyDataDraftedDisplay([]);
                myDataDrafted.filter((value) => (
                    (value.mpTags !== null && value.mpTags !== "") ?
                        selectedFilter.map((filter) => (
                            value.mpTags.toLowerCase().split(", ").includes(filter) === true ?
                                setMyDataDraftedDisplay((prev) => {
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
                myDataDrafted.map((v)=>(
                    t.push({...v,id:v.mpId,name:v.mpName})
                ))
                if(search !== ""){
                    t = t.filter((v)=>{return v.mpName.toLowerCase().includes(search.toLocaleLowerCase())});
                }
                setMyDataDraftedDisplay(t);
            }
        }
        else if (value === 2) {
            if (selectedFilter.length > 0) {
                setMyDataFreeTemplatesDisplay([]);
                myDataFreeTemplates.filter((value) => (
                    (value.ftTags !== null && value.ftTags !== "") ?
                        selectedFilter.map((filter) => (
                            value?.ftTags?.toLowerCase().split(", ").includes(filter) === true ?
                                setMyDataFreeTemplatesDisplay((prev) => {
                                    let t = 0;
                                    prev?.map((p) => (
                                        t = p.ftId === value.ftId ? 1 : 0
                                    ))
                                    if(t === 0){
                                        if(search === "") {
                                            return [...prev, {
                                                ...value, id: value.ftId,
                                                name: value.ftName,
                                                imgFtSrc: siteURL + `/freetemplate/${value.ftFolderName}/thumb.png`
                                            }];
                                        } else if(search !== "" && value.ftName.toLowerCase().includes(search.toLocaleLowerCase())) {
                                            return [...prev, {
                                                ...value, id: value.ftId,
                                                name: value.ftName,
                                                imgFtSrc: siteURL + `/freetemplate/${value.ftFolderName}/thumb.png`
                                            }];
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
                myDataFreeTemplates.map((v) => (
                    t.push({
                        ...v,
                        id: v.ftId,
                        name: v.ftName,
                        imgFtSrc: siteURL + `/freetemplate/${v.ftFolderName}/thumb.png`
                    })
                ));
                if(search !== ""){
                    t = t.filter((v)=>{return v.ftName.toLowerCase().includes(search.toLocaleLowerCase())});
                }
                setMyDataFreeTemplatesDisplay(t);
            }
        }
        $(".midleMain").animate({ scrollTop: 0 }, 1000);
    }
    const handleDeletePublishedPages = (id) => {
        confirmDialog({
            open: true,
            title: "Are you sure you want to delete selected published page?",
            onConfirm: () => {
                deleteMyPage(id).then(res => {
                    if (res.status === 200) {
                        setMyDataPublished(myDataPublished.filter((v) => v.id !== id));
                        setMyDataPublishedDisplay(myDataPublishedDisplay.filter((v) => v.id !== id));
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        })
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        })
                    }
                })
            }
        })
    }

    const handleClonePublishedPages = (id) => {
        const data = {
            id,
            subUserId: subUser.memberId
        }
        cloneMyPage(data).then(res => {
            if (res.status === 200) {
                const myPage = res?.result?.mypage || {}
                setMyDataPublished([...myDataPublished, { ...myPage, id: myPage.mpId, name: myPage.mpName }])
                setMyDataPublishedDisplay([...myDataPublishedDisplay, { ...myPage, id: myPage.mpId, name: myPage.mpName }])
                globalAlert({
                    type: "Success",
                    text: "Copy My Page Successfully",
                    open: true
                })
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
        })
    }
    const handleDeletedDraftedPages = (id) => {
        confirmDialog({
            open: true,
            title: "Are you sure you want to delete selected drafted page?",
            onConfirm: () => {
                deleteMyPage(id).then(res => {
                    if (res.status === 200) {
                        setMyDataDrafted(myDataDrafted.filter((v) => v.id !== id));
                        setMyDataDraftedDisplay(myDataDraftedDisplay.filter((v) => v.id !== id));
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        })
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        })
                    }
                })
            }
        })
    }
    const handleClickLink = useCallback((id, memberId) => {
        setLink(`${siteURL}/emailtemplate?v=${id}&w=${memberId}`);
        toggleLink();
    },[toggleLink])
    const handleClickEdit = (id) => {
        history.push("/addmypage?v="+id);
    }
    const handleClickView = (id) => {
        window.open(siteURL + "/viewtemplate?mpId=" + id);
    }
    const handleFreeTemplateUse = (ftFolderName) => {
        history.push("/addmypage?ftFolderName="+ftFolderName);
    }
    const handleFreeTemplateView = (ftFolderName) => {
        window.open(siteURL + "/viewtemplate?ftFolderName=" + ftFolderName)
    }
    const handleClickSearch = () => {
        handleSelectedFilterData(selectedFilter);
    }
    const handleClickExportToImage = (id, name) => {
        getMyPageById(id).then(res => {
            if (res.status === 200) {
                let div = document.createElement('div');
                div.id = "tempData";
                div.style.width = "auto";
                div.style.overflowX = "hidden";
                div.style.marginLeft = "15px";
                div.style.marginRight = "15px";
                div.innerHTML=res.result.mypage.allTempData;
                document.body.appendChild(div);
                setTimeout(()=>{
                    setLoader({
                        load: true,
                        text: "Please wait !!!"
                    });
                },1000);
                setTimeout(()=>{
                    html2canvas(document.querySelector("#tempData"), {
                        scrollX: 0,
                        scrollY: -window.scrollY,
                    }).then(async (canvas) => {
                        document.body.removeChild(div);
                        let fileName = `${name.replaceAll(/[^a-zA-Z0-9_]+/gi, "_")}.png`;
                        let tempBlob = await canvastoFile(canvas, 1, "image/png");
                        downloadFile(tempBlob, fileName);
                        setLoader({
                            load: false
                        });
                    });
                },2000);
            } else {
                globalAlert({
                    type: "Error",
                    text: "Something went wrong try again later",
                    open: true
                })
            }
        });
    }
    const handleClickExportToPDF = (id, name) => {
        getMyPageById(id).then(res => {
            if (res.status === 200) {
                let div = document.createElement('div');
                div.innerHTML=res.result.mypage.allTempData;
                document.body.appendChild(div);
                setTimeout(()=>{
                    let width = div.clientWidth;
                    let height = div.clientHeight+2;
                    document.body.removeChild(div);
                    let opt = {
                        filename: `${name.replaceAll(/[^a-zA-Z0-9_]+/gi, "_")}.pdf`,
                        jsPDF: { unit: 'px', format: [width, height], orientation: 'portrait' },
                    };
                    html2pdf().set(opt).from(res.result.mypage.allTempData).save();
                },2000);
            } else {
                globalAlert({
                    type: "Error",
                    text: "Something went wrong try again later",
                    open: true
                })
            }
        });
    }
    const handleClickExportToHTML = (id, name) => {
        getMyPageById(id).then(res => {
            if (res.status === 200) {
                const link = document.createElement('a');
                link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(res.result.mypage.allTempData);
                link.download = `${name.replaceAll(/[^a-zA-Z0-9_]+/gi, "_")}.html`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                globalAlert({
                    type: "Error",
                    text: "Something went wrong try again later",
                    open: true
                })
            }
        });
    }
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className="d-inline-block mb-0 align-middle">My Pages Design</h3>
                    <div className="icon-wrapper d-inline-block mx-5">
                        <CheckPermissionButton module="my pages" action="add">
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={addPage}>
                                <i className="far fa-plus-square"></i>
                                <div className="bg-green"></div>
                            </Link>
                        </CheckPermissionButton>
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Help Text" onClick={()=>{handleClickHelp("Functionality/Editor/mypage/MyPagesBestinClassEmaileditor.html")}}>
                            <i className="far fa-question-circle"></i>
                            <div className="bg-grey"></div>
                        </Link>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                    <Tabs
                        color="black"
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="My Published Pages" {...a11yProps(0)} />
                        <Tab label="My Drafted Pages" {...a11yProps(1)} />
                        <Tab label="Free Templates" {...a11yProps(2)} />
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TabPanel value={value} index={0}>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mb-3 text-right">
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
                                                <IconButton sx={searchIconTransparent.root} onClick={handleClickSearch}>
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                />
                            </Col>
                            <Col md={2}>
                                <FilterMyPages filterValues={filterPublishedValues} handleChangeSelectedFilter={handleChangeSelectedFilter} selectedFilter={selectedFilter} />
                            </Col>
                            <Col md={10}>
                                {
                                    myDataPublishedDisplay.length > 0 ?
                                        <Row>
                                            <CustomCard myData={myDataPublishedDisplay} handleDeletePublishedPages={handleDeletePublishedPages} handleClonePublishedPages={handleClonePublishedPages} handleClickView={handleClickView} handleClickEdit={handleClickEdit} handleClickLink={handleClickLink} handleClickExportToImage={handleClickExportToImage} handleClickExportToPDF={handleClickExportToPDF} handleClickExportToHTML={handleClickExportToHTML} type="myPublishedPages" folderName="mypage" />
                                        </Row>
                                    :
                                        <Row style={{height:"50vh"}} className="row align-items-center w-100">
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                                <p className="mb-5">You have no Published My Page available</p>
                                                <p>Create A My Page</p>
                                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/addmypage")}}>
                                                    <i className="far fa-plus-square"></i>
                                                    <div className="bg-green"></div>
                                                </Link>
                                            </Col>
                                        </Row>
                                }
                            </Col>
                        </Row>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mb-3 text-right">
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
                                                <IconButton sx={searchIconTransparent.root} onClick={handleClickSearch}>
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                />
                            </Col>
                            <Col md={2}>
                                <FilterMyPages filterValues={filterDraftedValues} handleChangeSelectedFilter={handleChangeSelectedFilter} selectedFilter={selectedFilter} />
                            </Col>
                            <Col md={10}>
                                {
                                    myDataDraftedDisplay.length > 0 ?
                                        <Row>
                                            <CustomCard myData={myDataDraftedDisplay} handleDeletedDraftedPages={handleDeletedDraftedPages} handleClickView={handleClickView} handleClickEdit={handleClickEdit} handleClickExportToImage={handleClickExportToImage} handleClickExportToPDF={handleClickExportToPDF} handleClickExportToHTML={handleClickExportToHTML} type="myDraftedPages" folderName="mypage" />
                                        </Row>
                                    :
                                        <Row style={{height:"50vh"}} className="row align-items-center w-100">
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                                <p className="mb-5">You have no Drafted My Page available</p>
                                                <p>Create A My Page</p>
                                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/addmypage")}}>
                                                    <i className="far fa-plus-square"></i>
                                                    <div className="bg-green"></div>
                                                </Link>
                                            </Col>
                                        </Row>
                                }
                            </Col>
                        </Row>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mb-3 text-right">
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
                                                <IconButton sx={searchIconTransparent.root} onClick={handleClickSearch}>
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                />
                            </Col>
                            <Col md={2}>
                                <FilterMyPages filterValues={filterFreeTemplateValues} handleChangeSelectedFilter={handleChangeSelectedFilter} selectedFilter={selectedFilter} />
                            </Col>
                            <Col md={10}>
                                <Row>
                                    <CustomCard myData={myDataFreeTemplatesDisplay} handleFreeTemplateUse={handleFreeTemplateUse} handleFreeTemplateView={handleFreeTemplateView} type="freeTemplates"/>
                                </Row>
                            </Col>
                        </Row>
                    </TabPanel>
                </Col>
            </Row>
            <Modal size="lg" isOpen={modalLink} toggle={toggleLink}>
                <ModalHeader toggle={toggleLink}>Public Link</ModalHeader>
                <ModalBody>
                    <p className="font-weight-bold">Send Public Link in Email or Text</p>
                    <TextField
                        name="link"
                        multiline
                        fullWidth
                        minRows={2}
                        value={link}
                        readOnly={true}
                        onFocus={event => event.target.select()}
                        InputProps={{endAdornment: <CopyLink elementName="link" iconSelector="copyLink"/> }}
                        variant="standard"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={()=>toggleLink()} className="ml-3 publishGTCancel">CLOSE</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
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
        },
        setLoader: (data) => {
            dispatch(setLoader(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyPages);