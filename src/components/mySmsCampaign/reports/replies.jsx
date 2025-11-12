import React from "react";
import RepliesReport from "./repliesReport";

const Replies = ({ csId, smsId }) => {
    return (
        <RepliesReport csId={csId} smsId={smsId} />
    );
}

export default Replies;
