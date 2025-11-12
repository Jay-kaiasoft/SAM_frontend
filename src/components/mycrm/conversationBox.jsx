import React from "react"
import { dateFormat } from "../../assets/commonFunctions"
import { format } from "date-fns"

const ConversationBox = ({ conversationData }) => {
    const renderDate = (dateTime, index) => {
        if (index === 0 || dateFormat(conversationData?.[index - 1].dateTime) !== dateFormat(dateTime)) {
            return (
                <div className="d-flex justify-content-center my-3">
                    <div className="p-2 px-4 sms-date-container">{format(new Date(dateTime), 'MMM d')}</div>
                </div>
            )
        }
        return null
    }

    const renderSelfMessage = (sms, index) => {
        return (
            <div key={index}>
                {renderDate(sms.dateTime, index)}
                <div className="d-flex flex-column align-items-end">
                    {sms?.displayAs === "image" ?
                        <img src={sms?.content} style={{ maxHeight: "100px" }} alt="sms text" /> :
                        <div className="p-3 text-white self-sms-container" dangerouslySetInnerHTML={{ __html: sms?.content }} />}
                    {sms?.attachmentList?.length > 0 ? (
                        <div className="attachments-container">
                            {sms?.attachmentList?.map((attachment, index) => {
                                return (
                                    <div className="attachment-file" key={index}>
                                        <i className="far fa-paperclip"></i>
                                        <p className="attachment-file-name mb-0">
                                            {attachment.sraFileName}
                                        </p>
                                        <a href={attachment?.sraFileUrl} download>
                                            <i className="far fa-file-download" style={{ cursor: "pointer" }}></i>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                    <p className="mt-1" style={{ color: "#d4d4d4" }}>{format(new Date(sms?.dateTime), 'MM-dd-yy hh:mm a')}</p>
                </div>
            </div>
        )
    }
    const renderOtherMessage = (sms, index) => {
        return (
            <div key={index}>
                {renderDate(sms.dateTime, index)}
                <div className="d-flex mw-75 flex-column align-items-start">
                    {sms?.displayAs === "image" ?
                        <img src={sms?.content} style={{ maxHeight: "100px" }} alt="sms text" /> :
                        <div className="p-3 other-sms-container" dangerouslySetInnerHTML={{ __html: sms?.content }} />}
                    {sms?.attachmentList?.length > 0 ? (
                        <div className="attachments-container">
                            {sms?.attachmentList?.map((attachment, index) => {
                                return (
                                    <div className="attachment-file" key={index}>
                                        <i className="far fa-paperclip"></i>
                                        <p className="attachment-file-name mb-0">
                                            {attachment.sraFileName}
                                        </p>
                                        <a href={attachment?.sraFileUrl} download>
                                            <i className="far fa-file-download" style={{ cursor: "pointer" }}></i>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                    <p className="mt-1" style={{ color: "#d4d4d4" }}>{format(new Date(sms?.dateTime), 'MM-dd-yy hh:mm a')}</p>
                </div>
            </div>
        )
    }
    return (
        conversationData.length > 0 &&
            <div className="overflow-auto px-3">
                {
                    conversationData && conversationData?.map((sms, index) => {
                        if (sms?.type === "self") {
                            return renderSelfMessage(sms, index)
                        } else if (sms.type === "other") {
                            return renderOtherMessage(sms, index)
                        } else {
                            return null
                        }
                    })
                }
            </div>
    )
}

export default ConversationBox