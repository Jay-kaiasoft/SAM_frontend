import React, { useEffect, lazy, Suspense } from "react";
import { Button, Drawer } from '@mui/material';
import { getGroupListWithCheckDuplicate, getSegmentList } from "../../../services/clientContactService";
import { getMyPagesList } from "../../../services/myDesktopService";
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Col, Row } from "reactstrap";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import { connect } from "react-redux";
import Loader from "../../shared/loaderV2/loader";
const WorkflowDetails = lazy(() => import("../screens/workflowDetails"))
const SelectEmailTemplate = lazy(() => import("../screens/selectEmailTemplate"))
const SelectGroup = lazy(() => import("../screens/selectGroup"))
const Scheduler = lazy(() => import("../screens/scheduler"))
const FromInfo = lazy(() => import("../screens/fromInfo"))
const EmailPreview = lazy(() => import("../screens/emailPreview"))
const TimerComponent = lazy(() => import("../timerComponent"))

const EmailCampaign = ({
    data,
    setData,
    triggerModal,
    setTriggerModal,
    handleClickSubmitTrigger,
    id,
    globalAlert,
}) => {
    const [emailTemplate, setEmailTemplate] = React.useState([]);
    const [myDataPublished, setMyDataPublished] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [groupList, setGroupList] = React.useState()
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = 7;
    useEffect(() => {
        getGroupListWithCheckDuplicate().then(res => {
            if (res.result) {
                if (res.result.group.length > 0) {
                    let tempGroupList = [];
                    if(typeof data.amGroupSegmentId !== "undefined" && data.amGroupSegmentId !== 0 && data.amGroupSegmentId !== null && data.amGroupSegmentId !== ""){
                        tempGroupList=res.result.group;
                        getSegmentList(data.amGroupId).then(res1 => {
                            if (res1.status === 200) {
                                let index = tempGroupList.findIndex(x => x.groupId === data.amGroupId);
                                tempGroupList[index].groupSegment=res1.result;
                            }
                        })
                    } else {
                        tempGroupList=res.result.group;
                    }
                    setGroupList(tempGroupList);
                }
            }
        });
        getMyPagesList(2).then(res => {
            if (res.result) {
                setEmailTemplate(res.result.mypage);
                setMyDataPublished(res.result.mypage);
            }
        });
    }, []);
    const handleDataChange = (name, value) => {
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleNext = (event="") => {
        if (activeStep === 0) {
            if(!data?.name){
                globalAlert({
                    type: "Error",
                    text: "Please Enter Name of Workflow",
                    open: true
                })
                return
            }
            if(!data?.mailType){
                globalAlert({
                    type: "Error",
                    text: "Please Select Campaign Type",
                    open: true
                })
                return
            }
        } else if (activeStep === 1 && !data?.amTemplateId) {
            globalAlert({
                type: "Error",
                text: "Please Select Email Template",
                open: true
            })
            return
        } else if (activeStep === 2) {
            if (!data?.amGroupId) {
                globalAlert({
                    type: "Error",
                    text: "Please Select Group",
                    open: true
                })
                return
            }
            if (!data?.totalMember) {
                globalAlert({
                    type: "Error",
                    text: "Selected group don't have members",
                    open: true
                })
                return
            }
        } else if (activeStep === 3) {
            if (!data?.schType) {
                globalAlert({
                    type: "Error",
                    text: "Please select schedule type",
                    open: true
                })
                return
            }
        } else if (activeStep === 4) {
            if (!data?.fromEmail) {
                globalAlert({
                    type: "Error",
                    text: "Please Enter From Email",
                    open: true
                })
                return
            } else if (!data?.fromName) {
                globalAlert({
                    type: "Error",
                    text: "Please Enter From Name",
                    open: true
                })
                return
            } else if (!data?.subject) {
                globalAlert({
                    type: "Error",
                    text: "Please Enter Email Subject",
                    open: true
                })
                return
            }
        } else if(activeStep === 6){
            if((typeof data?.value === "undefined" || data?.value === "" || data?.value === null) || (typeof data?.duration === "undefined" || data?.duration === "" || data?.duration === null)){
                globalAlert({
                    open: true,
                    type: "Error",
                    text: "Please enter value for time delay"
                })
            } else {
                event.preventDefault();
                handleClickSubmitTrigger(data);
                setTriggerModal(false);
                setActiveStep(0);
            }
            return false;
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    const handleClickSearch = () => {
        if(search === ""){
            setEmailTemplate(myDataPublished);
        } else {
            setEmailTemplate( myDataPublished.filter((v)=>{return v.mpName.toLowerCase().includes(search.toLocaleLowerCase())}) )
        }
    }
    return (
        <Drawer open={triggerModal} anchor={'right'} className="ComponentSidebarWrapper">
            <div className='cross-icon-container'>
                <i className="far fa-times fa-lg" onClick={() => {
                    setActiveStep(0); setTriggerModal(!triggerModal)
                }}></i>
            </div>
            <div className='starting-point-container'>
                <Row>
                    <Col>
                        {activeStep === 0 &&
                            <Suspense fallback={<Loader />}>
                                <WorkflowDetails data={data} handleDataChange={handleDataChange} title="Enter Email Campaign Details" />
                            </Suspense>
                        }
                        {activeStep === 1 &&
                            <Suspense fallback={<Loader />}>
                                <SelectEmailTemplate data={data} handleDataChange={handleDataChange} emailTemplate={emailTemplate} search={search} setSearch={setSearch} handleClickSearch={handleClickSearch} />
                            </Suspense>
                        }
                        {activeStep === 2 &&
                            <Suspense fallback={<Loader />}>
                                <SelectGroup data={data} setData={setData} groupList={groupList} setGroupList={setGroupList} globalAlert={globalAlert} id={id}/>
                            </Suspense>
                        }
                        {activeStep === 3 &&
                            <Suspense fallback={<Loader />}>
                                <Scheduler data={data} handleDataChange={handleDataChange} />
                            </Suspense>
                        }
                        {activeStep === 4 &&
                            <Suspense fallback={<Loader />}>
                                <FromInfo data={data} handleDataChange={handleDataChange} callFrom={"Trigger"} />
                            </Suspense>
                        }
                        {activeStep === 5 &&
                            <Suspense fallback={<Loader />}>
                                <EmailPreview data={data} />
                            </Suspense>
                        }
                        {activeStep === 6 &&
                            <Suspense fallback={<Loader />}>
                                <TimerComponent data={data} handleDataChange={handleDataChange} />
                            </Suspense>
                        }
                    </Col>
                </Row>
                <MobileStepper
                    variant="text"
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        activeStep !== maxSteps - 1 ?
                            <Button size="small" onClick={() => { handleNext() }} >
                                NEXT
                                <KeyboardArrowRight />
                            </Button> 
                        :
                            <Button size="small" onClick={(event) => { handleNext(event) }} >
                                FINISH
                            </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                            <KeyboardArrowLeft />BACK
                        </Button>
                    }
                />
            </div>
        </Drawer>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) }
    }
}
export default connect(null, mapDispatchToProps)(EmailCampaign);