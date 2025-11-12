import React, {useEffect, useState} from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {Button, FormControlLabel, Link, Radio, RadioGroup} from "@mui/material";
import {
    getReportLinkedinCommentsReport,
    getReportLinkedinPageDetails,
    getReportLinkedinPageList,
    getReportLinkedinReactionReport,
    getReportLinkedinWallDetails
} from "../../../services/socialMediaService";

const LinkedInReport = ({ smId, encSsId, setSmName }) => {
    const [selectedPage,setSelectedPage] = useState(0);
    const [dataWall,setDataWall] = useState({});
    const [dataPage,setDataPage] = useState([]);
    const [dataPageDetails,setDataPageDetails] = useState({});
    const [modalTitle, setModalTitle] = useState("");
    const [modalData, setModalData] = useState({});
    const [type, setType] = useState("");
    const [modalLink, setModalLink] = useState(false);
    const toggleLink = () => setModalLink(!modalLink);
    const handleChangePageList = (smpId,pageId,responseId) => {
        setSelectedPage(pageId);
        const data = `smpId=${smpId}&pageId=${pageId}&responseId=${responseId}`;
        getReportLinkedinPageDetails(data).then(res => {
            if (res?.status === 200) {
                setDataPageDetails(res?.result);
            }
        });
    }
    const handleClickLikesLI = (postId, flagType) => {
        const data = `postId=${postId}&flagType=${flagType}`;
        getReportLinkedinReactionReport(data).then(res => {
            if (res?.status === 200) {
                setModalData(res?.result);
                setModalTitle(`Reaction details of ${flagType}`);
                setType("like");
                toggleLink();
            }
        });
    }
    const handleClickCommentsLI = (postId, flagType) => {
        const data = `postId=${postId}&flagType=${flagType}`;
        getReportLinkedinCommentsReport(data).then(res => {
            if (res?.status === 200) {
                setModalData(res?.result);
                setModalTitle(`Comment details of ${flagType}`);
                setType("comment");
                toggleLink();
            }
        });
    }
    useEffect(() => {
        const data = `smId=${smId}&encSsId=${encSsId}`
        getReportLinkedinWallDetails(data).then(res => {
            if (res?.status === 200) {
                setDataWall(res?.result);
                setSmName(res?.result?.smName);
            }
        });
        getReportLinkedinPageList(data).then(res => {
            if (res?.status === 200) {
                if(res?.result?.linkedinPageList){
                    setDataPage(res?.result?.linkedinPageList);
                }
                setSmName(res?.result?.smName);
            }
        });
    }, [smId, encSsId, setSmName]);
    return (
        <>
            {
                !(dataWall && Object.keys(dataWall).length === 0 && Object.getPrototypeOf(dataWall) === Object.prototype) &&
                    <>
                        <p className="w-50 mx-auto"><strong>Your LinkedIn Wall</strong></p>
                        <div className="table-content-wrapper height-58 w-50 mx-auto mt-4 overflow-auto">
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th width="20%" className="text-center">Likes</th>
                                        <th width="20%" className="text-center">Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    !(dataWall.today && Object.keys(dataWall.today).length === 0 && Object.getPrototypeOf(dataWall.today) === Object.prototype) &&
                                        dataWall.today.msg === "" ?
                                            <tr>
                                                <td>Today</td>
                                                <td className="text-center"><Link component="a" className="custom-link" onClick={()=>{handleClickLikesLI(dataWall.today.postId,"today")}}><i className="far fa-heart mr-2"></i>{dataWall.today.totalReactions}</Link></td>
                                                <td className="text-center"><Link component="a" className="custom-link" onClick={()=>{handleClickCommentsLI(dataWall.today.postId,"today")}}><i className="far fa-comments mr-2"></i>{dataWall.today.totalComments}</Link></td>
                                            </tr>
                                        :
                                            <tr>
                                                <td>Today</td>
                                                <td colSpan={2}>{dataWall.today.msg}</td>
                                            </tr>
                                }
                                {
                                    dataWall.linkedinPostList.length > 0 ?
                                        dataWall.linkedinPostList.map((value, index)=>{
                                            return (
                                                <tr key={index}>
                                                    <td>{value.date}</td>
                                                    <td className="text-center"><Link component="a" className="custom-link" onClick={()=>{handleClickLikesLI(value.postId,value.date)}}><i className="far fa-heart mr-2"></i>{value.totalReactions}</Link></td>
                                                    <td className="text-center"><Link component="a" className="custom-link" onClick={()=>{handleClickCommentsLI(value.postId,value.date)}}><i className="far fa-comments mr-2"></i>{value.totalComments}</Link></td>
                                                </tr>
                                            );
                                        })
                                    : null
                                }
                                </tbody>
                            </Table>
                        </div>
                    </>
            }
            {
                dataPage.length > 0 ?
                    <div className="w-50 mx-auto mt-4">
                        <p className="mb-0"><strong>Your LinkedIn page(s)</strong></p>
                        <RadioGroup row aria-label="pageList" name="pageList" value={selectedPage} >
                            {
                                dataPage.map((v,i)=>(
                                    <FormControlLabel key={i} className="mb-0 w-50 mr-0 pr-3" value={v.pageId} control={<Radio color="primary" onChange={()=>{handleChangePageList(v.smpId, v.pageId, v.responseId)}}/>} label={v.pageName}/>
                                ))
                            }
                        </RadioGroup>
                    </div>
                : null
            }
            <div className="table-content-wrapper height-58 w-50 mx-auto mt-4 overflow-auto">
                <Table striped>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th width="20%" className="text-center">Likes</th>
                        <th width="20%" className="text-center">Comments</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        !(dataPageDetails && Object.keys(dataPageDetails).length === 0 && Object.getPrototypeOf(dataPageDetails) === Object.prototype) ?
                            <>
                                {
                                    !(dataPageDetails.today && Object.keys(dataPageDetails.today).length === 0 && Object.getPrototypeOf(dataPageDetails.today) === Object.prototype) &&
                                        dataPageDetails.today.msg === "" ?
                                            <tr>
                                                <td>Today</td>
                                                <td className="text-center"><Link component="a" className="custom-link" onClick={() => handleClickLikesLI(dataPageDetails.today.postId,"today")}><i className="far fa-heart mr-2"></i>{dataPageDetails.today.totalReactions}</Link>
                                                </td>
                                                <td className="text-center"><Link component="a" className="custom-link" onClick={() => handleClickCommentsLI(dataPageDetails.today.postId,"today")}><i className="far fa-comments mr-2"></i>{dataPageDetails.today.totalComments}</Link></td>
                                            </tr>
                                        :
                                            <tr>
                                                <td>Today</td>
                                                <td colSpan={2}>{dataPageDetails.today.msg}</td>
                                            </tr>
                                }
                                {
                                    dataPageDetails.linkedinPostList.length > 0 ?
                                        dataPageDetails.linkedinPostList.map((value, index)=>{
                                            return (
                                                <tr key={index}>
                                                    <td>{value.date}</td>
                                                    <td className="text-center"><Link component="a" className="custom-link" onClick={()=>{handleClickLikesLI(value.postId,value.date)}}><i className="far fa-heart mr-2"></i>{value.totalReactions}</Link></td>
                                                    <td className="text-center"><Link component="a" className="custom-link" onClick={()=>{handleClickCommentsLI(value.postId,value.date)}}><i className="far fa-comments mr-2"></i>{value.totalComments}</Link></td>
                                                </tr>
                                            );
                                        })
                                    : null
                                }
                            </>
                        :
                            <tr>
                                <td colSpan={3} className="text-center">Select page name to see it's data</td>
                            </tr>
                    }
                    </tbody>
                </Table>
            </div>
            <DisplayModal toggleLink={toggleLink} modalLink={modalLink} modalTitle={modalTitle} type={type} modalData={modalData}/>
        </>
    );
}
const DisplayDetails = ({type, modalData}) => {
    if(type === "like"){
        return <DisplayLikesDetails modalData={modalData}/>;
    } else if(type === "comment"){
        return <DisplayCommentsDetails modalData={modalData}/>;
    }
}
const DisplayModal = ({modalLink, toggleLink, modalTitle, type, modalData}) => {
    return (
        <Modal size="lg" isOpen={modalLink} toggle={toggleLink}>
            <ModalHeader toggle={toggleLink}>{modalTitle}</ModalHeader>
            <ModalBody>
                <DisplayDetails type={type} modalData={modalData} />
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" onClick={()=>toggleLink()}>CLOSE</Button>
            </ModalFooter>
        </Modal>
    );
}
const DisplayLikesDetails = ({modalData}) => {
    return (
        <div className="table-content-wrapper height-58 mt-3">
            <Table striped>
                <thead>
                <tr>
                    <th className="text-center">Likes</th>
                    <th className="text-center">Celebrates</th>
                    <th className="text-center">Supports</th>
                    <th className="text-center">Loves</th>
                    <th className="text-center">Insightfuls</th>
                    <th className="text-center">Funnies</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="text-center">{modalData.slraLikes}</td>
                    <td className="text-center">{modalData.slraCelebrates}</td>
                    <td className="text-center">{modalData.slraSupports}</td>
                    <td className="text-center">{modalData.slraLoves}</td>
                    <td className="text-center">{modalData.slraInsightfuls}</td>
                    <td className="text-center">{modalData.slraCuriouses}</td>
                </tr>
                </tbody>
            </Table>
        </div>
    );
}
const DisplayCommentsDetails = ({modalData}) => {
    return (
        <div className="table-content-wrapper height-58 mt-3">
            <Table striped>
                <thead>
                <tr>
                    <th width="40%">User</th>
                    <th width="60%">Comment</th>
                </tr>
                </thead>
                <tbody>
                {
                    modalData.commentList.length > 0 ?
                        modalData.commentList.map((v,i)=>(
                            <tr key={i}>
                                <td>{v.scUser}</td>
                                <td>{v.scComment}</td>
                            </tr>
                        ))
                    :
                        <tr>
                            <td colSpan={2} className="text-center">No comment available.</td>
                        </tr>
                }
                </tbody>
            </Table>
        </div>
    );
}
export default LinkedInReport;