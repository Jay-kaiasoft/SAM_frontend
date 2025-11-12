import React from "react";
import {Col} from "reactstrap";
import CheckPermissionButton from "../commonControlls/checkPermissionButton";
import {myPageImageUrl} from "../../../config/api";
import {connect} from "react-redux";

const CustomCard = (props) => {
    const myData = props.myData;
    const type = props.type;
    return (
        <>
            {
                myData.map((cValue) => (
                    <Col key={cValue.id} className="custom-card-wrapper" xs={12} md={6} lg={3}>
                        <div className="custom-card">
                            <div className="custom-card-img-wrapper">
                                <img 
                                    className={props.paddedImg? "w-50 m-auto" : "custom-card-img-top"}
                                    src={props.imgSrc !== undefined ? props.imgSrc : cValue.imgFtSrc ? cValue.imgFtSrc : myPageImageUrl.replace("{{memberId}}", props.user.memberId).replace("{{folderName}}", props.folderName).replace("{{myPageId}}", cValue.id)+"?"+new Date().getTime()}
                                    alt="Thumb"
                                />
                            </div>
                            <div className="custom-card-body">
                                <div className="custom-card-title">
                                    {(cValue.mpType === 2 && cValue.groupName !== null) ?
                                        <i className="far fa-users fa-users-g" data-toggle="tooltip" title={cValue.groupName}></i>
                                        : null
                                    }
                                    {cValue.name}
                                </div>
                                <div className="custom-card-content">
                                    {
                                        (()=>{
                                            switch(type) {
                                                case "myPublishedPages" : {
                                                    return (
                                                        <>
                                                            <CheckPermissionButton module="my pages" action="copy">
                                                                <i className="far fa-clone" data-toggle="tooltip" title="Clone" onClick={() => { props.handleClonePublishedPages(cValue.id) }}></i>
                                                            </CheckPermissionButton>
                                                            <CheckPermissionButton module="my pages" action="edit">
                                                                <i className="far fa-pencil-alt" data-toggle="tooltip" title="Edit" onClick={()=>{props.handleClickEdit(cValue.id)}}></i>
                                                            </CheckPermissionButton>
                                                            <i className="far fa-eye" data-toggle="tooltip" title="View" onClick={() => { props.handleClickView(cValue.encMpId) }}></i>
                                                            {
                                                                cValue.mpPublicUrl === "Y" &&
                                                                    <i className="far fa-link" data-toggle="tooltip" title="Link" onClick={() => { props.handleClickLink(cValue.id, props.user.memberId) }}></i>
                                                            }
                                                            {
                                                                (cValue.name !== "Opt In" && cValue.name !== "Opt Out" && cValue.name !== "Rejoin Group") &&
                                                                    <CheckPermissionButton module="my pages" action="delete">
                                                                        <i className="far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={() => { props.handleDeletePublishedPages(cValue.id) }}></i>
                                                                    </CheckPermissionButton>
                                                            }
                                                            <i className="far fa-file-image" data-toggle="tooltip" title="Export As Image" onClick={() => { props.handleClickExportToImage(cValue.id, cValue.name) }}></i>
                                                            <i className="far fa-file-pdf" data-toggle="tooltip" title="Export As PDF" onClick={() => { props.handleClickExportToPDF(cValue.id, cValue.name) }}></i>
                                                            <i className="far fa-file-code" data-toggle="tooltip" title="Export As HTML" onClick={() => { props.handleClickExportToHTML(cValue.id, cValue.name) }}></i>
                                                        </>
                                                    );
                                                }
                                                case "myDraftedPages" : {
                                                    return (
                                                        <>
                                                            <CheckPermissionButton module="my pages" action="edit">
                                                                <i className="far fa-pencil-alt" data-toggle="tooltip" title="Edit" onClick={()=>{props.handleClickEdit(cValue.id)}}></i>
                                                            </CheckPermissionButton>
                                                            <i className="far fa-eye" data-toggle="tooltip" title="View" onClick={() => { props.handleClickView(cValue.encMpId) }}></i>
                                                            <CheckPermissionButton module="my pages" action="delete">
                                                                <i className="far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={() => { props.handleDeletedDraftedPages(cValue.id) }}></i>
                                                            </CheckPermissionButton>
                                                            <i className="far fa-file-image" data-toggle="tooltip" title="Export As Image" onClick={() => { props.handleClickExportToImage(cValue.id, cValue.name) }}></i>
                                                            <i className="far fa-file-pdf" data-toggle="tooltip" title="Export As PDF" onClick={() => { props.handleClickExportToPDF(cValue.id, cValue.name) }}></i>
                                                            <i className="far fa-file-code" data-toggle="tooltip" title="Export As HTML" onClick={() => { props.handleClickExportToHTML(cValue.id, cValue.name) }}></i>
                                                        </>
                                                    );
                                                }
                                                case "freeTemplates" : {
                                                    return (
                                                        <>
                                                            <i className="far fa-clipboard-check" data-toggle="tooltip" title="Use" onClick={() => { props.handleFreeTemplateUse(cValue.ftFolderName) }}></i>
                                                            <i className="far fa-eye" data-toggle="tooltip" title="View" onClick={() => { props.handleFreeTemplateView(cValue.ftFolderName) }}></i>
                                                        </>
                                                    );
                                                }
                                                case "buidItforMeOrder":{
                                                    return (
                                                        <>
                                                            <i className="far fa-ballot-check" data-toggle="tooltip" title="Order Details" onClick={()=>{props.handleClickGetOrderDetails(cValue.bfmId)}}></i>
                                                            {
                                                                cValue.bfmPublishStatusId === 0 ?
                                                                    <>
                                                                        <i className="far fa-pencil-alt" data-toggle="tooltip" title="Edit" onClick={()=>{props.handleClickEdit(cValue.bfmId);}}></i>
                                                                        <i className="far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={()=>{props.handleClickDelete(cValue.bfmId);}}></i>
                                                                    </>
                                                                : null
                                                            }
                                                        </>
                                                    );
                                                }
                                                case "buidItforMeApproval":{
                                                    return (
                                                        <>
                                                            <i className="far fa-ballot-check" data-toggle="tooltip" title="Order Details" onClick={()=>{props.handleClickGetOrderDetails(cValue.bfMpdBfmId)}}></i>
                                                            <i className="far fa-eye" data-toggle="tooltip" title="View" onClick={()=>{props.handleClickView(cValue.encMpId)}}></i>
                                                            <i className="far fa-check-double" data-toggle="tooltip" title="Approve" onClick={()=>{props.handleClickApprove(cValue.mpId)}}></i>
                                                            <i className="far fa-times" data-toggle="tooltip" title="Reject" onClick={()=>{props.handleClickReject(cValue.mpId)}}></i>
                                                        </>
                                                    );
                                                }
                                                case "myPublishedForms" : {
                                                    return (
                                                        <>
                                                            <CheckPermissionButton module="custom form" action="edit">
                                                                <i className="far fa-pencil-alt" data-toggle="tooltip" title="Edit" onClick={()=>{props.handleClickEditPublish(cValue.cfId)}}></i>
                                                            </CheckPermissionButton>
                                                            <CheckPermissionButton module="custom form" action="delete">
                                                                <i className="far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={()=>{props.handleClickDeleteCustomForm(cValue.cfId)}}></i>
                                                            </CheckPermissionButton>
                                                            <CheckPermissionButton module="custom form" action="link">
                                                                <i className="far fa-link" data-toggle="tooltip" title="Published Link" onClick={()=>{props.handleClickLink(cValue.customFormUrl)}}></i>
                                                            </CheckPermissionButton>
                                                        </>
                                                    );
                                                }
                                                case "myDraftedForms" : {
                                                    return (
                                                        <>
                                                            <CheckPermissionButton module="custom form" action="edit">
                                                                <i className="far fa-pencil-alt" data-toggle="tooltip" title="Edit" onClick={()=>{props.handleClickEditDraft(cValue.cfId)}}></i>
                                                            </CheckPermissionButton>
                                                            <CheckPermissionButton module="custom form" action="delete">
                                                                <i className="far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={()=>{props.handleClickDeleteCustomForm(cValue.cfId)}}></i>
                                                            </CheckPermissionButton>
                                                        </>
                                                    );
                                                }
                                                case "myPublishedSurveyTemplates" : {
                                                    return (
                                                        <>
                                                            <i className="far fa-clone" data-toggle="tooltip" title="Copy" onClick={()=>{props.handleClickCloneSurvey(cValue.stId)}}></i>
                                                            <i className="far fa-pencil-alt" data-toggle="tooltip" title="Edit" onClick={()=>{props.handleClickEditSurveyTemplate(cValue.stId)}}></i>
                                                            <i className="far fa-eye" data-toggle="tooltip" title="Preview" onClick={()=>{props.handleClickPreviewSurvey(cValue.stId)}}></i>
                                                            <i className="far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={()=>{props.handleClickDeletePublished(cValue.stId)}}></i>
                                                        </>
                                                    );
                                                }
                                                case "myDraftedSurveyTemplates" : {
                                                    return (
                                                        <>
                                                            <i className="far fa-pencil-alt" data-toggle="tooltip" title="Edit" onClick={()=>{props.handleClickEditSurveyTemplate(cValue.stId)}}></i>
                                                            <i className="far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={()=>{props.handleClickDeleteDrafted(cValue.stId)}}></i>
                                                        </>
                                                    );
                                                }
                                                case "myPublishedAssessmentTemplates" : {
                                                    return (
                                                        <>
                                                            <i className="far fa-clone" data-toggle="tooltip" title="Copy" onClick={()=>{props.handleClickCloneAssessment(cValue.atId)}}></i>
                                                            <i className="far fa-pencil-alt" data-toggle="tooltip" title="Edit" onClick={()=>{props.handleClickEditAssessmentTemplate(cValue.atId)}}></i>
                                                            <i className="far fa-eye" data-toggle="tooltip" title="Preview" onClick={()=>{props.handleClickPreviewAssessment(cValue.atId)}}></i>
                                                            <i className="far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={()=>{props.handleClickDeletePublished(cValue.atId)}}></i>
                                                        </>
                                                    );
                                                }
                                                case "myDraftedAssessmentTemplates" : {
                                                    return (
                                                        <>
                                                            <i className="far fa-pencil-alt" data-toggle="tooltip" title="Edit" onClick={()=>{props.handleClickEditAssessmentTemplate(cValue.atId)}}></i>
                                                            <i className="far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={()=>{props.handleClickDeleteDrafted(cValue.atId)}}></i>
                                                        </>
                                                    );
                                                }
                                                default : {
                                                    return  null;
                                                }
                                            }
                                        })()

                                    }
                                </div>
                            </div>
                        </div>
                    </Col>
                ))
            }
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}
export default connect(mapStateToProps, null)(CustomCard);