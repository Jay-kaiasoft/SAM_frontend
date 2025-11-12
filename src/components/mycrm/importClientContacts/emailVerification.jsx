import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { setImportContactResult } from '../../../actions/importContactActions';
import { pathOr } from 'ramda';
import { handleClickHelp } from '../../../assets/commonFunctions';

const EmailVerification = ({
    onBackPress,
    onNextPress,
    onCancelPress,
    importContactData,
    setImportContactResult,
    emailVerificationPrice,
    cntyPriceSymbol
}) => {
    const [cronEmailVerification, setCronEmailVerification] = useState(importContactData?.cronEmailVerification || "N");
    const [dataTitle, setDataTitle] = useState("");
    const handleOnNext = () => {
        setImportContactResult({...importContactData,"cronEmailVerification":cronEmailVerification});
        onNextPress();
    }
    useEffect(()=>{
        let temp = '';
        temp += '<div class="row">';
        temp += '<div class="col-6 font-weight-bold">Emails</div><div class="col-6 font-weight-bold">Price/Email</div>';
        emailVerificationPrice.map((v)=>(
            temp += '<div class="col-6 text-left">'+v.evpContactTotal+'</div><div class="col-6 text-right">'+cntyPriceSymbol+v.evpRate+'</div>'
        ));
        temp += '</div>';
        setDataTitle(temp);
    },[emailVerificationPrice, cntyPriceSymbol]);
    return (
        <>
            <div className="body" style={{ minHeight: "450px" }}>
                <div className="mt-3 d-flex flex-column align-items-center">
                    <label className="lable-style d-flex">Email Verification <i className="far fa-question-circle font-size-12 ml-2 mt-2" onClick={() => { handleClickHelp("DomainandEmailVerification/Email/TheBestPracticesforDomainandEmailVerificationProcess.html") }}></i></label>
                    <div className="w-50">
                        Validated email address improve your chances of landing in inbox and reduces bounce rate with email providers putting your domain in good standing with them. <span className="cursor-pointer" data-toggle="tooltip" data-html={true} data-template="<div class='tooltip' role='tooltip'><div class='arrow'></div><div class='tooltip-inner'></div></div>" title={dataTitle}><u>Charges apply</u></span>.
                    </div>
                    {/* <div className="mt-3 w-50">
                        This service is provided by <a href="https://www.zerobounce.net?ref=zmu3nzc" target="_blank" rel="noreferrer">ZeroBounce</a> our preferred vendor partner and charges will apply.
                    </div> */}
                    <div className="mt-3 w-50">
                        Would you like to verify the email address being imported to make sure they are reachable valid email address?
                    </div>
                    <div className="mt-3 w-50">
                        <FormControl className="text-left d-flex flex-row align-items-center">
                            <FormLabel id="demo-controlled-radio-buttons-group" className="mr-3 mb-0">Email Verification</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={cronEmailVerification}
                                onChange={(e)=>{setCronEmailVerification(e.target.value)}}
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
        importContactData: pathOr({}, ["importContact", "importContactData"], state),
        emailVerificationPrice: pathOr([], ["countrySetting", "emailVerificationPrice"], state),
        cntyPriceSymbol: pathOr([], ["countrySetting", "cntyPriceSymbol"], state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setImportContactResult: (payload) => { dispatch(setImportContactResult(payload)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EmailVerification);