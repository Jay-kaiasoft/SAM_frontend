import React, { useEffect } from "react"
import { useState } from "react"
import { connect } from "react-redux"
import { Col, Row } from "reactstrap"
import { setGlobalAlertAction } from "../../../actions/globalAlertActions"
import { assessmentReportDataBrowser, getAssessmentReportParticipant } from "../../../services/assessmentService"
import { ContactForm, OptionQuestion, RenderMatrix, RenderMatrixText, TextQuestion } from "../../shared/chartJsComponent/utilityQuestion"
import Switch from "@mui/material/Switch";

const Participants = ({ id, globalAlert, isAnimated }) => {
    const [participantsData, setParticipantsData] = useState({})
    const [participantSelected, setParticipantSelected] = useState("")
    const [selectedParticipantData, setSelectedParticipantData] = useState({})
    const [barChart, setBarChart] = useState(false);
    const [pieChart, setPieChart] = useState(true);
    useEffect(() => {
        const data = `assId=${id}`
        getAssessmentReportParticipant(data).then(res => {
            if (res?.status === 200) {
                setParticipantsData(res?.result)
            } else {
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        })
    }, [id, globalAlert])

    useEffect(() => {
        const data = {
            "assId": id,
            "questionType": 1,
            "controlTypes": [],
            "questionNumbers": [],
            "queAnsList": [],
            "participantId": participantSelected
        }
        assessmentReportDataBrowser(data).then(res => {
            if (res?.status === 200) {
                setSelectedParticipantData(res?.result)
            } else {
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        })
    }, [id, participantSelected, globalAlert])

    return (
        <>
            <div className="d-flex justify-content-between">
            <h4>Assessment : {participantsData?.assessmentName}</h4>
                {
                    participantSelected?
                        <div className="d-flex">
                            <div>
                                <h6 className="d-inline-block">Pie Chart</h6>
                                <Switch color="primary" checked={pieChart} onChange={()=>{setPieChart(!pieChart)}} name='pie' />
                            </div>
                            <div>
                                <h6 className="d-inline-block">Bar Chart</h6>
                                <Switch color="primary" checked={barChart} onChange={()=>{setBarChart(!barChart)}} name='bar' />
                            </div>
                        </div>
                    :
                        null

                }
            </div>
            <Row>
                <Col xs={12} sm={12} md={12} lg={3} xl={3} className="height-58 overflow-auto">
                    <div>
                        {participantsData?.participantsList?.map((participant) => {
                            return (
                                <div
                                    style={{ backgroundColor: `${participantSelected === participant?.participantId ? "#F7F7F7" : ""}` }}
                                    className="d-flex flex-column border p-2 mb-2 rounded cursor-pointer"
                                    key={participant?.participantId}
                                    onClick={() => { setParticipantSelected(participant?.participantId) }}
                                >
                                    {participant?.overallPoints !== "" && <span><strong>Points : </strong>{participant?.overallPoints}</span>}
                                    <span>{`${participant?.city} , ${participant?.state} , ${participant?.country}`}</span>
                                    <span>{`${participant?.source} , ${participant?.technology}`}</span>
                                </div>
                            )
                        })}
                    </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={9} xl={9} className="height-58 overflow-auto">
                    { participantSelected ?
                        <div>
                            {
                                selectedParticipantData?.questions?.length > 0 ?
                                    selectedParticipantData?.questions?.map((value, index) => {
                                        if (value.queTypeId === 1 || value.queTypeId === 6)
                                            return <OptionQuestion key={index} index={index} value={value} isAnimated={isAnimated} barChart={barChart} pieChart={pieChart}/>
                                        else if (value?.queTypeId === 3)
                                            return <RenderMatrix value={value} key={index} isAnimated={isAnimated} barChart={barChart} pieChart={pieChart}/>
                                        else if (value?.queTypeId === 4)
                                            return <ContactForm value={value} key={index} />
                                        else if (value?.queTypeId === 5)
                                            return <RenderMatrixText value={value} key={index} />
                                        return <TextQuestion key={index} value={value} />
                                    })
                                : null
                            }
                        </div>
                    :
                        <div className="d-flex ml-3 px-3 py-2 justify-content-center">
                            <span className="mt-3">Click participant for more details...</span>
                        </div>
                    }
                </Col>
            </Row>
        </>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(Participants);