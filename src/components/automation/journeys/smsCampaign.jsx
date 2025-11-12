import React, { useEffect, Suspense, lazy } from "react"
import { connect } from "react-redux"
import { Button, Drawer, MobileStepper } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Col, Row } from "reactstrap";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions"
import { getGroupListWithCheckDuplicate, getSegmentList } from "../../../services/clientContactService";
import InputField from "../../shared/commonControlls/inputField";
import Loader from "../../shared/loaderV2/loader";
const SelectGroup = lazy(() => import("../screens/selectGroup"))
const Scheduler = lazy(() => import("../screens/scheduler"))
const SMSDetails = lazy(() => import("../screens/smsDetails"))
const SMSPreview = lazy(() => import("../screens/smsPreview"))

const SMSCampaign = ({
    data,
    setData,
    triggerModal,
    setTriggerModal,
    handleClickSubmitTrigger,
    globalAlert
}) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [groupList, setGroupList] = React.useState()
    const maxSteps = 5;
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
    }, []);
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleNext = () => {
        if (activeStep === 0 && !data?.smsName) {
            globalAlert({
                type: "Error",
                text: "Name of SMS can not be blank",
                open: true
            })
            return
        } else if (activeStep === 1) {
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
        } else if (activeStep === 2) {
            if (!data?.sms[0]?.smsDetail) {
                globalAlert({
                    type: "Error",
                    text: "Please write something inside at least one message",
                    open: true
                })
                return
            }
        } else if (activeStep === 3) {
            if (!data?.schType) {
                globalAlert({
                    type: "Error",
                    text: "Please select scheduler option.",
                    open: true
                })
                return
            }
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    const handleDataChange = (name, value) => {
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    return (
        <Drawer open={triggerModal} anchor={'right'} className="ComponentSidebarWrapper" style={{ zIndex: 1000 }}>
            <div className='cross-icon-container'>
                <i className="far fa-times fa-lg" onClick={() => {
                    setActiveStep(0); setTriggerModal(!triggerModal)
                }}></i>
            </div>
            <div className='starting-point-container'>
                <Row>
                    <Col>
                        {activeStep === 0 && <Row>
                            <Col xl={10} className='mx-auto'>
                                <p className='heading-style'>SMS Campaign Information</p>
                                <InputField
                                    type="text"
                                    id="smsName"
                                    name="smsName"
                                    value={data?.smsName}
                                    onChange={(name, value) => { handleDataChange("label", value); handleDataChange(name, value) }}
                                    label="Name of SMS"
                                />
                            </Col>
                        </Row>}
                        {activeStep === 1 &&
                            <Suspense fallback={<Loader />}>
                                <SelectGroup data={data} setData={setData} groupList={groupList} setGroupList={setGroupList} globalAlert={globalAlert}/>
                            </Suspense>
                        }
                        {activeStep === 2 &&
                            <Suspense fallback={<Loader />}>
                                <SMSDetails data={data} setData={setData} handleBack={handleBack} />
                            </Suspense>
                        }
                        {activeStep === 3 &&
                            <Suspense fallback={<Loader />}>
                                <Scheduler data={data} handleDataChange={handleDataChange} />
                            </Suspense>
                        }
                        {activeStep === 4 &&
                            <Suspense fallback={<Loader />}>
                                <SMSPreview data={data} />
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
                            </Button> :
                            <Button size="small" onClick={(event) => { event.preventDefault(); handleClickSubmitTrigger(data); setTriggerModal(false); setActiveStep(0); }} >
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
export default connect(null, mapDispatchToProps)(SMSCampaign);