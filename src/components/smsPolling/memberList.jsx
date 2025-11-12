import React, {useState, Fragment, useEffect, useCallback} from "react";
import { connect } from "react-redux";
import {Button, MenuItem, Select} from "@mui/material";
import { Col, Row, Table } from "reactstrap";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { Input, FormGroup, Label } from 'reactstrap'
import { Pagination } from "@mui/material";
import {getSmsPollingContactList, saveMemberList} from "../../services/smsPollingService";
import $ from "jquery";

const noMobileText = "This Contact Group Does Not Have Cell or Mobile Phone Field.<br>This Contact Group Can Not Be Used.<br>If you would like to use this Contact Group then please add mobile or cell field to it."
const MemberList = ({
    handleNext,
    handleBack,
    data,
    setData,
    handleDataChange,
    globalAlert
}) => {
    const [contactDetails, setContactDetails] = useState([]);
    const [selectedPage, setSelectedPage] = useState(0);
    const [searchSend,setSearchSend] = useState("");
    const [sort,setSort] = useState("firstName,asc");
    const [perPage,setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [totalData,setTotalData] = useState(0);
    const [mainTablecheckBoxValue, setMainTablecheckBoxValue] = useState(false);
    const [tableCheckBoxValue, setTableCheckBoxValue] = useState([]);
    const [tableCheckBoxValueList, setTableCheckBoxValueList] = useState([]);
    const handleChangePagination = (event,value) => {
        setSelectedPage(value-1);
    }
    const handleChangePerPage = (event) => {
        setSelectedPage(0);
        setPerPage(event.target.value);
    }
    const displayContactList = useCallback((groupId) => {
        if(typeof groupId !== "undefined") {
            let requestData = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
            setContactDetails([]);
            getSmsPollingContactList(groupId, requestData).then(res => {
                if (res.status === 200) {
                    if (res.result && res.result.contact) {
                        setContactDetails(res.result.contact);
                        setTotalPages(res.result.getTotalPages);
                        setTotalData(res.result.totalContact);
                    }
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        }
    },[searchSend,selectedPage,perPage,sort,globalAlert]);
    useEffect(() => {
        displayContactList(data.groupList);
    }, [selectedPage,perPage,searchSend,displayContactList,data.groupList]);
    useEffect(() => {
        setSort("firstName,asc");
        setSearchSend("");
        if(data?.memberList?.length > 0){
            setTableCheckBoxValueList(data.memberList);
        }
    }, [data.memberList]);
    const mainTableCheckBox = () => {
        let flag = mainTablecheckBoxValue
        setMainTablecheckBoxValue(!flag)
        let newTableCheckBoxValue = []
        const newTableCheckBoxValueList = []
        contactDetails.forEach(element => {
            newTableCheckBoxValue.push(!flag)
            if (!flag)
                newTableCheckBoxValueList.push(element.emailId)
        });
        setTableCheckBoxValue(newTableCheckBoxValue)
        setTableCheckBoxValueList(newTableCheckBoxValueList);
    }

    const tableCheckBox = (index, id) => {
        const newTableCheckBoxValue = [...tableCheckBoxValue]
        newTableCheckBoxValue[index] = !newTableCheckBoxValue[index]
        setTableCheckBoxValue(newTableCheckBoxValue)
        if (!newTableCheckBoxValue[index]) {
            setTableCheckBoxValueList(tableCheckBoxValueList.filter(x => x !== id));
        } else {
            setTableCheckBoxValueList([...tableCheckBoxValueList, id]);
        }
        let length = newTableCheckBoxValue.filter(function (value) {
            return value === true;
        }).length
        if (length !== newTableCheckBoxValue.length) {
            setMainTablecheckBoxValue(false)
        }
    }
    const handleClickNext = () => {
        if (data.groupList === undefined) {
            globalAlert({
                type: "Error",
                text: "Please select group",
                open: true
            })
            return
        }
        if (tableCheckBoxValueList.length === 0) {
            globalAlert({
                type: "Error",
                text: "Please select members",
                open: true
            })
            return
        }
        let requestData = {
            "iid": data.iid,
            "groupList": data.groupList,
            "memberList": tableCheckBoxValueList,
            "lchst": mainTablecheckBoxValue ? "A" : "S",
            "rndHash": data.rndHash,
            "subMemberId": data.subMemberId
        }
        $("button.nextClick").hide();
        $("button.nextClick").after('<div class="lds-ellipsis ml-3"><div></div><div></div><div></div>');
        saveMemberList(requestData).then(res => {
            if (res.status === 200) {
                handleDataChange("memberList", tableCheckBoxValueList);
                handleNext(1);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.nextClick").show();
        });
    }
    return (
        <div>
            <Row>
                <Col xs={10} className="mx-auto">
                    <Row className="mb-3">
                        <Col xs={12} sm={12} md={6} lg={6} xl={6} align="left" className="mx-auto">
                            <p className="m-0 align-middle d-inline-block"><strong>Member List</strong></p>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6} align="right" className="mx-auto">
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
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={4} className="mx-auto">
                            <div className="table-content-wrapper group-table-style">
                                <Table striped className="table-layout-fixed">
                                    <thead>
                                        <tr>
                                            <th>
                                                Group Name
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data?.groups?.length > 0 ?
                                                data?.groups?.map((group) => {
                                                    return (
                                                        group.lockGroup !== "Y" && <Fragment key={group.gId}>
                                                            <tr>
                                                                <td className="p-0">
                                                                    <FormGroup check className="w-100">
                                                                        <Label check className="w-100 p-1 cursor-pointer">
                                                                            <Input
                                                                                name="groupOption"
                                                                                type="radio"
                                                                                onChange={
                                                                                    () => {
                                                                                        setTableCheckBoxValue([])
                                                                                        setTableCheckBoxValueList([])
                                                                                        setData((prev) => {
                                                                                            return {
                                                                                                ...prev,
                                                                                                groupList: group.gId,
                                                                                                groupName: group.name
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                }
                                                                                checked={data.groupList === group.gId}
                                                                            />{group.name}
                                                                        </Label>
                                                                    </FormGroup>
                                                                </td>
                                                            </tr>
                                                        </Fragment>
                                                    )
                                                })
                                            : null
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                        <Col xs={12} lg={8}>
                            {
                                data.groupList === undefined &&
                                <div align="center" style={{ width: "100%", verticalAlign: "middle", marginTop: "50px" }}>
                                    <p style={{ fontSize: 18 }} dangerouslySetInnerHTML={{ __html: noMobileText }}/>
                                </div>
                            }
                            {
                                (data.groupList > 0 && contactDetails.length > 0) &&
                                <div className="table-content-wrapper">
                                    <div className="contact-table-div">
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                    <th width="5%">
                                                        <FormGroup check className="w-100">
                                                            <Input className="clientCheck" type="checkbox" checked={mainTablecheckBoxValue} onChange={() => mainTableCheckBox()} />
                                                        </FormGroup>
                                                    </th>
                                                    <th width="30%">First Name</th>
                                                    <th width="30%">Last Name</th>
                                                    <th width="35%">Mobile Number</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    contactDetails.length > 0 ?
                                                        contactDetails.map((contact,index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <FormGroup check className="w-100 p-2">
                                                                            <Input className="clientCheck" type="checkbox" checked={tableCheckBoxValueList.includes(contact.emailId)} onChange={() => tableCheckBox(index,contact.emailId)} />
                                                                        </FormGroup>
                                                                    </td>
                                                                    <td className="align-middle">{contact.firstName}</td>
                                                                    <td className="align-middle">{contact.lastName}</td>
                                                                    <td className="align-middle">{contact.phoneNumber}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    : null
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            }
                            {
                                (data.groupList > 0 && contactDetails.length > 0) &&
                                <Row className="mt-3">
                                    <Col xs={6}><span className="align-middle pt-2">{`Showing ${contactDetails.length > 0 ? (perPage*selectedPage)+1 : 0} to ${((perPage*selectedPage)+1)+contactDetails.length-1} of ${totalData} entries`}</span></Col>
                                    <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage+1} showFirstButton showLastButton onChange={handleChangePagination}/></Col>
                                </Row>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col align="center">
                            <div className="col-12 mt-3 mb-3" align="center">
                                <Button color="primary" variant="contained" onClick={() => handleBack(1)}>
                                    <i className="far fa-long-arrow-left mr-2"></i>BACK
                                </Button>
                                <Button color="primary" variant="contained" className="ml-3 nextClick" onClick={() => {handleClickNext()}} title="Changes will be committed!!" data-toggle="tooltip">
                                    <i className="far fa-long-arrow-right mr-2"></i>NEXT
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
    }
}

export default connect(null, mapDispatchToProps)(MemberList);
