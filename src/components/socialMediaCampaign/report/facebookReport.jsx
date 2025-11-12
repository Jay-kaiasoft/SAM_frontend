import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import { Button, FormControlLabel, Link, Radio, RadioGroup } from "@mui/material";
import { getReportFacebookPageDetails, reportFacebookPostComments, reportFacebookPostDetails, reportFacebookPostReactions } from '../../../services/socialMediaService';
import { dateFormat } from '../../../assets/commonFunctions';

const FacebookReport = ({ smId, encSsId, setSmName }) => {
    const [facebookPageList, setFacebookPageList] = useState([]);
    const [facebookPostList, setFacebookPostList] = useState({});
    const [selectedPage, setSelectedPage] = useState(0);
    const [modalLink, setModalLink] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalData, setModalData] = useState({});
    const [type, setType] = useState("");
    const toggleLink = () => setModalLink(!modalLink);

    const getReportFacebookPostDetails = (page) => {
        const data = {
            pageId: page?.pageId,
            pagePostId: page?.pagePostId,
            smpId: page?.smpId
        }
        reportFacebookPostDetails(data).then(res => {
            if (res?.status === 200) {
                setFacebookPostList(res?.result);
            }
        })
    }
    const handleChangePageList = (page) => {
        setSelectedPage(page?.pageId);
        getReportFacebookPostDetails(page)
    }

    const handleClickTotalReactionsFB = (pageId, pagePostId, date, smpId) => {
        setModalTitle(`Reaction details of ${date}`);
        setType("reaction");
        toggleLink();
        const data = {
            pageId,
            pagePostId,
            "flagType":date,
            smpId
        }
        reportFacebookPostReactions(data).then(res => {
            if (res?.status === 200) {
                setModalData(res?.result?.facebookPostReactions)
            }
        })
    }

    const handleClickTotalCommentsFB = (pageId, pagePostId, date, smpId) => {
        setModalTitle(`Comment details of ${date}`);
        setType("comment");
        toggleLink();
        const data = {
            pageId,
            pagePostId,
            "flagType":date,
            smpId
        }
        reportFacebookPostComments(data).then(res => {
            if (res?.status === 200) {
                setModalData(res?.result?.facebookPostComments)
            }
        })
    }

    useEffect(() => {
        const data = `smId=${smId}&encSsId=${encSsId}`
        getReportFacebookPageDetails(data).then(res => {
            if (res?.status === 200) {
                setFacebookPageList(res?.result?.facebookPageList);
                setSmName(res?.result?.smName);
            }
        })
    }, [smId, encSsId, setSmName]);

    return (
        <>
            {
                facebookPageList?.length > 0 ?
                    <div className="w-75 mx-auto">
                        <p className="mb-0"><strong>Your facebook page(s)</strong></p>
                        <RadioGroup row aria-label="pageList" name="pageList" value={selectedPage} >
                            {
                                facebookPageList?.map((page, i) => (
                                    <FormControlLabel key={page?.pageId} className="mb-0 w-auto mr-0 pr-3" value={page?.pageId} control={<Radio color="primary" onChange={() => { handleChangePageList(page) }} />} label={page.pageName} />
                                ))
                            }
                        </RadioGroup>
                    </div>
                    : null
            }
            <div className="table-content-wrapper height-58 w-75 mx-auto mt-3 overflow-auto">
                <Table striped>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th width="20%" className="text-center">People Reached</th>
                            <th width="20%" className="text-center">Engagements</th>
                            <th width="20%" className="text-center">Total Reactions</th>
                            <th width="20%" className="text-center">Total Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !(facebookPostList && Object.keys(facebookPostList).length === 0 && Object.getPrototypeOf(facebookPostList) === Object.prototype) ?
                                <>
                                    {
                                        !(facebookPostList.today && Object.keys(facebookPostList.today).length === 0 && Object.getPrototypeOf(facebookPostList.today) === Object.prototype) &&
                                            <tr>
                                                <td>Today</td>
                                                <td className="text-center"><i className="far fa-users mr-2 cursor-text"></i>{facebookPostList.today?.sfrPeopleReached}</td>
                                                <td className="text-center"><i className="far fa-database mr-2 cursor-text"></i>{facebookPostList.today?.sfrEngagements}</td>
                                                <td className="text-center"><Link component="a" className="custom-link" onClick={() => handleClickTotalReactionsFB(facebookPostList.today?.sfrPageId, facebookPostList.today?.pagePostId, 'today', 0)}><i className="far fa-heart mr-2"></i>{facebookPostList.today?.sfrTotalReactions}</Link></td>
                                                <td className="text-center"><Link component="a" className="custom-link" onClick={() => handleClickTotalCommentsFB(facebookPostList.today?.sfrPageId, facebookPostList.today?.pagePostId, 'today', 0)}><i className="far fa-comments mr-2"></i>{facebookPostList.today?.sfrTotalComments}</Link></td>
                                            </tr>
                                    }
                                    {
                                        facebookPostList?.facebookPostList?.length > 0 ?
                                            facebookPostList?.facebookPostList?.map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                    <td>{dateFormat(value?.sfrDate)}</td>
                                                    <td className="text-center"><i className="far fa-users mr-2 cursor-text"></i>{value?.sfrPeopleReached}</td>
                                                    <td className="text-center"><i className="far fa-database mr-2 cursor-text"></i>{value?.sfrEngagements}</td>
                                                    <td className="text-center"><Link component="a" className="custom-link" onClick={() => {handleClickTotalReactionsFB(value?.sfrPageId, value?.pagePostId, value?.sfrDate, value?.sfrSmpId)}}><i className="far fa-heart mr-2"></i>{value?.sfrTotalReactions}</Link></td>
                                                    <td className="text-center"><Link component="a" className="custom-link" onClick={() => {handleClickTotalCommentsFB(value?.sfrPageId, value?.pagePostId, value?.sfrDate, value?.sfrSmpId)}}><i className="far fa-comments mr-2"></i>{value?.sfrTotalComments}</Link></td>
                                                    </tr>
                                                );
                                            })
                                        : null
                                    }
                                </>
                            :
                                <tr>
                                    <td colSpan={5} className="text-center">Select page name to see it's data</td>
                                </tr>
                        }
                    </tbody>
                </Table>
            </div>
            <DisplayModal toggleLink={toggleLink} modalLink={modalLink} modalTitle={modalTitle} type={type} modalData={modalData} />
        </>
    );
}
const DisplayDetails = ({ type, modalData }) => {
    if (type === "reaction") {
        return <DisplayTotalReactionsDetails modalData={modalData} />;
    } else if (type === "comment") {
        return <DisplayTotalCommentsDetails modalData={modalData} />;
    }
}
const DisplayModal = ({ modalLink, toggleLink, modalTitle, type, modalData }) => {
    return (
        <Modal size="lg" isOpen={modalLink} toggle={toggleLink}>
            <ModalHeader toggle={toggleLink}>{modalTitle}</ModalHeader>
            <ModalBody>
                <DisplayDetails type={type} modalData={modalData} />
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" onClick={() => toggleLink()}>CLOSE</Button>
            </ModalFooter>
        </Modal>
    );
}
const DisplayTotalReactionsDetails = ({ modalData }) => {
    return (
        <div className="table-content-wrapper height-58 mt-3">
            <Table striped>
                <thead>
                    <tr>
                        <th className="text-center">Likes/Cares</th>
                        <th className="text-center">Loves</th>
                        <th className="text-center">Hahas</th>
                        <th className="text-center">Wows</th>
                        <th className="text-center">Sads</th>
                        <th className="text-center">Angries</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-center">{modalData?.sfraLikesCares || 0}</td>
                        <td className="text-center">{modalData?.sfraLoves || 0}</td>
                        <td className="text-center">{modalData?.sfraHahas || 0}</td>
                        <td className="text-center">{modalData?.sfraWows || 0}</td>
                        <td className="text-center">{modalData?.sfraSads || 0}</td>
                        <td className="text-center">{modalData?.sfraAngries || 0}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}
const DisplayTotalCommentsDetails = ({ modalData }) => {
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
                        modalData?.length > 0 ?
                            modalData?.map((item,index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item?.scUser}</td>
                                        <td>{item?.scComment}</td>
                                    </tr>
                                )
                            })
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

export default FacebookReport;