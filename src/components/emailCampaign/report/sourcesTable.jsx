import React, { useState } from "react"
import { Table } from "reactstrap";
import { getEmailCampaignsReportProductLinksClickUser } from "../../../services/emailCampaignService";
import LinkClickModal from "./linkClickModal";

const SourcesTable = ({ sourcesData }) => {
    const [linkClickModal, setLinkClickModal] = useState(false);
    const [linkSelected, setLinkSelected] = useState({})
    const toggleLinkClickModal = (id, campLink) => {
        setLinkClickModal(prevState => !prevState);
        if (!linkClickModal) {
            getEmailCampaignsReportProductLinksClickUser(`linkId=${id}`).then(res => {
                if (res?.status === 200) {
                    setLinkSelected({ productLinksClickUser: res?.result?.productLinksClickUser, campLink })
                }
            })
        }
    }
    return (
        <div className="table-content-wrapper height-58 overflow-auto">
            <Table striped>
                <thead>
                    <tr>
                        <th width="10%" className="text-center">No</th>
                        <th width="60%" align="left">Link Name</th>
                        <th width="20%" className="text-center">PC</th>
                        <th width="10%" className="text-center">Mobile</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sourcesData?.length > 0 ?
                            sourcesData?.map((value, index) => {
                                return (
                                    <tr key={index} onClick={() => toggleLinkClickModal(value?.id, value?.campLink)}>
                                        <td className="text-center">{index + 1}</td>
                                        <td>{value?.campLink}</td>
                                        <td className="text-center">{value?.pc}</td>
                                        <td className="text-center">{value?.mobile}</td>
                                    </tr>
                                );
                            })
                            :
                            <tr>
                                <td colSpan={4} className="text-center">No Data Found.</td>
                            </tr>
                    }
                </tbody>
            </Table>
            <LinkClickModal linkSelected={linkSelected} linkClickModal={linkClickModal} toggleLinkClickModal={toggleLinkClickModal} />
        </div>
    )
}

export default SourcesTable