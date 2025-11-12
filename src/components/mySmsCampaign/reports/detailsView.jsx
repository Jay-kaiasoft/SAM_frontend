import React from "react";
import Deliveries from "./deliveries";
import RepliesReport from "./repliesReport";
import Undelivered from "./undelivered";
import NotSend from "./notSend";

const DetailsView = ({ csId, smsId }) => {
    return (
        <>
            <Deliveries csId={csId} smsId={smsId} />
            <Undelivered csId={csId} smsId={smsId} />
            <NotSend csId={csId} smsId={smsId} />
            <RepliesReport csId={csId} smsId={smsId} />
        </>
    );
}

export default DetailsView;