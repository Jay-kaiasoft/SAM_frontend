import React, {useState} from "react"
import {connect} from "react-redux";
import { Button } from "@mui/material";
import { Col, Row, Input } from "reactstrap";
import {saveDemographicLocation} from "../../services/smsPollingService";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {siteURL} from "../../config/api";
import $ from "jquery";
import { handleClickHelp } from "../../assets/commonFunctions";

const DemographicLocation = ({
    data,
    handleNext,
    handleBack,
    handleDataChange,
    globalAlert
}) => {
    const [country, setCountry] = useState(data.country ? data.country : []);
    
    const locations = [{
        key: 1,
        value: "United States",
        flagImageLink: siteURL+"/img/country_icon/us.gif"
    },
    {
        key: 2,
        value: "Canada",
        flagImageLink: siteURL+"/img/country_icon/ca.gif"
    }]
    const handleChangeLocation = (name) => {
        if(country.includes(name)){
            setCountry((prev)=>{return prev.filter((x)=>x !== name)})
        } else {
            setCountry((prev)=>{ return [...prev,name]})
        }
    }
    const handleClickNext = () => {
        if(country.length === 0){
            globalAlert({
                type: "Error",
                text: "Please Select One Country",
                open: true
            });
            return false;
        }
        let requestData = {
            "iid": data.iid,
            "country":country
        }
        $("button.nextClick").hide();
        $("button.nextClick").after('<div class="lds-ellipsis ml-3"><div></div><div></div><div></div>');
        saveDemographicLocation(requestData).then(res => {
            if (res.status === 200) {
                handleDataChange("country", country);
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
                <Col xs={10} sm={10} md={6} lg={4} xl={4} className="mx-auto" align="left">
                    <p><strong>Demographic Location</strong></p>
                </Col>
            </Row>
            <Row>
                <Col xs={10} sm={10} md={6} lg={4} xl={4} className="mx-auto">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => handleBack(5)}
                        >
                            SMS POLLING DETAILS EDIT
                        </Button>
                        <i className="far fa-question-circle ml-2" onClick={() => handleClickHelp("Survey/Features/GeographicAreaRestriction/GeographicAreaRestrictionsforSurvey.html")}></i>
                    </div>
                    {/*<div className="mt-3" style={{ display: "flex", alignItems: "center" }}>*/}
                    {/*    <span><Input className="location-checkbox" type="checkbox"*/}
                    {/*        checked={selectAll}*/}
                    {/*        onChange={() => { handleChangeSelectAll()}}*/}
                    {/*    />*/}
                    {/*        Select All*/}
                    {/*    </span>*/}
                    {/*    <i className="far fa-question-circle ml-2" onClick={() => handleClickHelp("Survey/Features/GeographicAreaRestriction/GeographicAreaRestrictionsforSurvey.html")}></i>*/}
                    {/*</div>*/}
                    <div className="mt-3" style={{ display: "flex" }}>
                        {
                            locations.map((location) => {
                                return (
                                    <span className="mr-5" key={location.key}>
                                        <Input className="location-checkbox" type="checkbox"
                                            checked={country.includes(location.value)}
                                            onChange={() => { handleChangeLocation(location.value);}}
                                        />
                                        <p className="d-inline-block">
                                            <img src={location.flagImageLink} alt="Info Icon" onClick={() => handleClickHelp("Survey/Features/GeographicAreaRestriction/GeographicAreaRestrictionsforSurvey.html")} className="mr-2" />{location.value}
                                        </p>
                                    </span>
                                )
                            })
                        }
                    </div>
                    <div className="col-12 mt-3 mb-3" align="center">
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => handleBack(1)}
                        >
                            <i className="far fa-long-arrow-left mr-2"></i>BACK
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            className="ml-3 nextClick"
                            onClick={() => handleClickNext()}
                            title="Changes will be committed!!"
                            data-toggle="tooltip"
                        >
                            <i className="far fa-long-arrow-right mr-2"></i>NEXT
                        </Button>
                    </div>
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
export default connect(null, mapDispatchToProps)(DemographicLocation);