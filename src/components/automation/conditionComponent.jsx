import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Drawer, } from '@mui/material';
import "../../assets/styles/automation.css";
import { MailOutline } from '@mui/icons-material';
import { setGlobalAlertAction } from '../../actions/globalAlertActions';

const ConditionComponent = ({
    conditionModal,
    setConditionModal,
    handleClickSubmitCondition,
    activeNodeData,
    globalAlert
}) => {
    const actionTemplates = [
        { key: "email_open", label: "Email Open" },
        // { key: "email_link_clicked", label: "Email Link Click" },
        // { key: "email_subscribed", label: "Email Subscribed" },
        // { key: "email_unsubscribed", label: "Email Unsubscribed" },
        // { key: "email_sent", label: "Email Sent" }
    ]
    const [selectedActionTemplate, setSelectedActionTemplate] = useState("")
    const isDataValid = () => {
        if (selectedActionTemplate === "") {
            globalAlert({
                type: "Error",
                text: "Please select Action Condition",
                open: true
            })
            return false
        }
        return true
    }
    useEffect(() => {
        setSelectedActionTemplate(activeNodeData?.data)
    }, [activeNodeData?.data])
    return (
        <Drawer open={conditionModal} anchor={'right'} className="ComponentSidebarWrapper">
            <div style={{ textAlign: 'right', width: "25vw" }}>
            </div>
            <div className='cross-icon-container'>
                <i className="far fa-times fa-lg" onClick={() => { setConditionModal(!conditionModal) }}></i>
            </div>

            <div className="py-5 px-3 actionSidebarContainer">
                <div>
                    <p className='heading-style'>Select Condition</p>
                    {actionTemplates.map((action) => {
                        return (
                            <div
                                className={`${selectedActionTemplate?.key === action?.key ? "pointLabelContainerSelected" : "pointLabelContainer"}`}
                                onClick={() => setSelectedActionTemplate(action)}
                                key={action?.key}
                            >
                                <span><MailOutline fontSize="large" className='mr-4' />{action.label}</span>
                            </div>
                        )
                    })}
                </div>
                <div className='actionSidebarBtnContainer'>
                    <Button variant="contained" onClick={() => {
                        if (!isDataValid()) {
                            return
                        }
                        handleClickSubmitCondition({ ...selectedActionTemplate })
                    }}>SUBMIT</Button>
                </div>
            </div>
        </Drawer>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) }
    }
}
export default connect(null, mapDispatchToProps)(ConditionComponent);