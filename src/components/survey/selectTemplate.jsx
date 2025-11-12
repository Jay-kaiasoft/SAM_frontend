import React from 'react';
import {connect} from "react-redux";
import {myPageImageUrl} from "../../config/api";
import { Row, Col, FormGroup } from "reactstrap";
import { Button, Link } from "@mui/material";
import history from "../../history";

const SelectTemplate = ({
    user,
    myDataTemplate,
    data,
    handleTemplateSelected,
    handleClickNextSecond = () => { },
    handleBack = () => { },
    handleClickSaveValidation = () => { },
}) => {
    const renderTemplatesList = () => {
        let renderedTemplatesList = []
        for (let index = 0; index < myDataTemplate.length; index += 2) {
            const template =
                <div className="col-lg-3 col-md-6 card-container" key={index}>
                    <div className={`card mb-3 ${myDataTemplate[index].stId === data["sryStId"] ? "active-tmpt" : ""}`} onClick={() => { handleTemplateSelected(myDataTemplate[index].stId) }}>
                        <div className="card-img-wrapper">
                            <img className="card-img-top" src={myPageImageUrl.replace("{{memberId}}", user.memberId).replace("{{folderName}}", "surveytemplate").replace("{{myPageId}}", myDataTemplate[index].stId)} alt="tile" />
                        </div>
                        <div className="card-body">
                            <div className="card-title">{myDataTemplate[index].stName}</div>
                        </div>
                    </div>
                    {index + 1 <= myDataTemplate.length - 1 &&
                        <div className={`card mb-3 ${myDataTemplate[index + 1].stId === data["sryStId"] ? "active-tmpt" : ""}`} onClick={() => { handleTemplateSelected(myDataTemplate[index + 1].stId) }}>
                            <div className="card-img-wrapper">
                                <img className="card-img-top" src={myPageImageUrl.replace("{{memberId}}", user.memberId).replace("{{folderName}}", "surveytemplate").replace("{{myPageId}}", myDataTemplate[index+1].stId)} alt="tile" />
                            </div>
                            <div className="card-body">
                                <div className="card-title">{myDataTemplate[index + 1].stName}</div>
                            </div>
                        </div>
                    }
                </div>
            renderedTemplatesList.push(template)
        }
        return renderedTemplatesList;
    }
    return (
        <Row>
            <Col xs={10} sm={10} md={9} lg={9} xl={9} className="mx-auto">
                <div className="pages-container">
                    {
                        myDataTemplate.length > 0 ?
                            renderTemplatesList()
                        :
                            <Row style={{height:"50vh"}} className="row align-items-center w-100">
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                    <p className="mb-5">You have no survey design available</p>
                                    <p>Create A Survey Design</p>
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/addmysurveytemplates")}}>
                                        <i className="far fa-plus-square"></i>
                                        <div className="bg-green"></div>
                                    </Link>
                                </Col>
                            </Row>
                    }
                </div>
                <FormGroup className="text-center mb-4 mt-3">
                    <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                    <Button variant="contained" color="primary" onClick={()=>{handleClickSaveValidation(1)}} className="mr-3 saveAndDraft"><i className="far fa-save mr-2"></i>SAVE AND DRAFT</Button>
                    <Button variant="contained" color="primary" onClick={handleClickNextSecond} className="mr-3"><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                </FormGroup>
            </Col>
        </Row>
    );
}
const mapStateToProps = (state) => {
    return {
        user:state.user
    }
}
export default connect(mapStateToProps, null)(SelectTemplate);