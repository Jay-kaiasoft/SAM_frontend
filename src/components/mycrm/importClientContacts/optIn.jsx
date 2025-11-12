import React, { useState } from 'react';
import { pathOr } from 'ramda';
import { connect } from 'react-redux';
import { Button, FormControl, FormControlLabel, FormLabel, Link, Radio, RadioGroup } from '@mui/material';
import { siteURL, websiteTitle } from '../../../config/api';
import { setImportContactResult } from '../../../actions/importContactActions';
import { handleClickHelp } from '../../../assets/commonFunctions';

const OptIn = ({
    onBackPress,
    onNextPress,
    onCancelPress,
    importContactData,
    setImportContactResult
}) => {
    const [cronOptInYN, setCronOptInYN] = useState(importContactData?.cronOptInYN || "N");
    const handleOnNext = () => {
        setImportContactResult({...importContactData,"cronOptInYN":cronOptInYN});
        onNextPress();
    }
    return (
        <>
            <div className="body" style={{ minHeight: "450px" }}>
                <div className="mt-3 d-flex flex-column align-items-center">
                    <label className="lable-style d-flex">Opt-In <i className="far fa-question-circle font-size-12 ml-2 mt-2" onClick={() => { handleClickHelp("ClientData/ClientContact/maintaincontact/Opt-In.html") }}></i></label>
                    <div className="w-50">
                        {websiteTitle} will send a SMS if there is a mobile phone and an email if there is an email address with a link to a form where your contact can update and maintain their contact information. This is a great way to collect any information that is missing from your contact list and clean your data. We highly recommend that you customize the Opt-In message by referring to the <Link component="a" className="cursor-pointer" onClick={()=>{window.open(siteURL+"/smstemplates", "_blank");}}>SMS templates</Link> and <Link component="a" className="cursor-pointer" onClick={()=>{window.open(siteURL+"/mypages", "_blank");}}>Email templates</Link> in My Desktop section. SMS message charges may apply as per your plan.
                    </div>
                    <div className="mt-3 w-50">
                        Don't worry, we only unsubscribe if your contact requests it.
                    </div>
                    <div className="mt-3 w-50">
                        Would you like to send the contacts being imported an Opt-In email and SMS message to collect more information into your CRM?
                    </div>
                    <div className="mt-3 w-50">
                        <FormControl className="text-left d-flex flex-row align-items-center">
                            <FormLabel id="demo-controlled-radio-buttons-group" className="mr-3 mb-0">Opt-In</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={cronOptInYN}
                                onChange={(e)=>{setCronOptInYN(e.target.value)}}
                            >
                                <FormControlLabel className="mb-0" value="Y" control={<Radio />} label="Yes" />
                                <FormControlLabel className="mb-0" value="N" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="mt-3">
                        <Button variant="contained" color="primary" onClick={onBackPress}><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                        <Button variant="contained" color="primary" className="ml-3 mr-3" onClick={() => handleOnNext()}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                        <Button variant="contained" color="primary" onClick={onCancelPress}><i className="far fa-times mr-2"></i>CANCEL</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        importContactData: pathOr({}, ["importContact", "importContactData"], state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setImportContactResult: (payload) => { dispatch(setImportContactResult(payload)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OptIn);