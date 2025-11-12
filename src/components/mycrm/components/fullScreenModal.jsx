import { IconButton, InputAdornment, Pagination, TextField } from "@mui/material";
import { Col, Modal, ModalBody, ModalHeader, Row, Table } from "reactstrap";
import SearchIcon from '@mui/icons-material/Search';
import EditContact from "../editContact";
import EntriesPerPage from "./entriesPerPage";

const FullScreenModal = ({
    fullscreenModal,
    selectedTab,
    totalPages,
    contactDetails,
    selectedPage,
    perPage,
    clickedToEdit,
    sortBox,
    search,
    showTableHead,
    languages,
    totalContactsByGroup,
    selectedTabOld,
    editEmailId,
    clickedGroup,
    displayGroupSegmentDetails = () => { },
    setSelectedTabl = () => { },
    handleChangeSearch = () => { },
    toggleFullscreenModal = () => { },
    handleChangePagination = () => { },
    handleChangePerPage = () => { },
    handleClickSearch = () => { },
    clickedToEditContact = () => { },
    handleClickSort = () => { }
}) => {
    return (
        <Modal isOpen={fullscreenModal} toggle={toggleFullscreenModal} id="fullscreenModal">
            <ModalHeader toggle={toggleFullscreenModal}></ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            contactDetails?.contact?.length === 0 ? "No members found" : null
                        }
                        {
                            selectedTab === 0 && typeof contactDetails.contact !== "undefined" && contactDetails.contact.length > 0 ?
                                <>
                                    <div className="top-button mb-2">
                                        <EntriesPerPage perPage={perPage} handleChangePerPage={handleChangePerPage} />
                                        <div>
                                            <TextField
                                                placeholder="Search"
                                                variant="standard"
                                                name="search"
                                                type="text"
                                                value={search}
                                                onChange={handleChangeSearch}
                                                onKeyUp={(e)=>{
                                                    if(e.keyCode === 13){
                                                        handleClickSearch();
                                                    }
                                                }}
                                                InputProps={{
                                                    endAdornment:
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={handleClickSearch}>
                                                                <SearchIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="table-content-wrapper">
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                    {
                                                        showTableHead.map((item, index) => {
                                                            return <th key={index} onClick={() => { handleClickSort(item, index) }}>{contactDetails.contactHeader[item]}
                                                                <span>
                                                                    {typeof sortBox[index] !== "undefined"
                                                                        ? (sortBox[index] === true
                                                                            ? <i className="fad fa-sort-up ml-1"></i>
                                                                            : <i className="fad fa-sort-down ml-1"></i>)
                                                                        : <i className="fad fa-sort ml-1"></i>}
                                                                </span>
                                                            </th>
                                                        })
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    contactDetails.contact.map((item, index) => {
                                                        return (
                                                            <tr key={index} className={item.duplicateRecords === "Y" ? "duplicate-email-phone" : ""} >
                                                                {showTableHead.map((item1, index2) => {
                                                                    return <td className={clickedToEdit.includes(item1) ? "cursor-pointer" : ""} key={index2} onClick={() => { return clickedToEdit.includes(item1) ? clickedToEditContact(item.emailId) : null }} >{(item1 === "usDefaultLanguage") ? languages[item[item1]] : item[item1]}</td>
                                                                })}
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                    <Row className="mt-3">
                                        <Col xs={6}><span className="align-middle pt-2">{`Showing ${contactDetails.contact.length > 0 ? (perPage * selectedPage) + 1 : 0} to ${((perPage * selectedPage) + 1) + contactDetails.contact.length - 1} of ${totalContactsByGroup} entries`}</span></Col>
                                        <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage + 1} showFirstButton showLastButton onChange={handleChangePagination} /></Col>
                                    </Row>
                                </> : null
                        }
                        {
                            selectedTab === 3 && typeof contactDetails.contact !== "undefined" && contactDetails.contact.length > 0 ?
                                <>
                                    <div className="icon-wrapper mb-5"></div>
                                    <EditContact selectedTab={selectedTabOld} setSelectedTabl={setSelectedTabl} displayGroupSegmentDetails={displayGroupSegmentDetails} emailId={editEmailId} groupId={clickedGroup.groupId} />
                                </>
                                : null
                        }
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default FullScreenModal