import React from "react";
import { Col, Row } from "reactstrap";
import { myPageImageUrl } from "../../../config/api";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { searchIconTransparent } from "../../../assets/commonFunctions";

const SelectEmailTemplate = ({
    data,
    emailTemplate = [],
    handleDataChange,
    search,
    setSearch,
    handleClickSearch
}) => {
    return (
        <Row>
            <Col>
                <p className='heading-style'>Select Email Template</p>
                <div className='text-right pr-4'>
                    <TextField
                        placeholder="Search"
                        name="search"
                        type="text"
                        value={search}
                        onChange={(event)=>{setSearch(event.target.value);}}
                        variant="standard"
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton sx={searchIconTransparent.root} onClick={handleClickSearch}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                </div>
                <div className='p-4 email-template-card-container'>
                    {emailTemplate?.map((template, index) => {
                        return (
                            <div key={index}
                                className={`email-template-card mb-4 ${template.mpId === data?.amTemplateId ? "active-tmpt" : null}`}
                                onClick={() => {
                                    handleDataChange("selectedEmailTemplate", template)
                                    handleDataChange("amTemplateId", template.mpId)
                                }}>
                                <div className="email-template-card-img-wrapper">
                                    <img className="email-template-card-img-top" src={myPageImageUrl.replace("{{memberId}}", template.memberId).replace("{{folderName}}", "mypage").replace("{{myPageId}}", template.mpId)} alt="tile" />
                                </div>
                                <div className="email-template-card-body">
                                    <div className="email-template-card-title">{(template.mpType === 2 && template.groupName !== null) ? <i className="far fa-users fa-users-g" data-toggle="tooltip" title={template.groupName}></i> : null}{template.mpName}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Col>
        </Row>
    )
}
export default SelectEmailTemplate