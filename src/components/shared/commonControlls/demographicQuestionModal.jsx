import React,{useState} from "react";
import {Col, Input, Row, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import {Button,Popover,Typography} from "@mui/material";
import $ from "jquery";
import { websiteColor } from "../../../config/api";

const DemographicQuestionModal = ({questionModal, handleNext, setData, toggleQuestionModal, type, setIsQuestionModalOpenedOnce=()=>{}, setCategoryPageList=()=>{}})=>{
    const [anchorEls, setAnchorEls] = useState([null,null,null,null,null,null,null,null,null]);
    const [tempQuestions, setTempQuestions] = useState([
        {index:0, value: "Gender", isChecked:false, question: "What is your gender?", options: ["Male", "Female"]},
        {index:1, value: "Age", isChecked:false, question: "In what year were you born? _ _ _ _"},
        {index:2, value: "Marital Status", isChecked:false, question: "What is your marital status?", options:["Now married", "Widowed", "Divorced", "Separated", "Never married"]},
        {index:3, value: "Education", isChecked:false, question: "What is the highest degree or level of school you have completed? If currently enrolled, mark the previous grade or highest degree received.", options: ["No schooling completed", "Nursery school to 8th grade", "9th, 10th or 11th grade", "12th grade, no diploma", "High school graduate - high school diploma or the equivalent (for example: GED)", "Some college credit, but less than 1 year", "1 or more years of college, no degree", "Associate degree (for example: AA, AS)", "Bachelor's degree (for example: BA, AB, BS)", "Master's degree (for example: MA, MS, MEng, MEd, MSW, MBA)", "Professional degree (for example: MD, DDS, DVM, LLB, JD)", "Doctorate degree (for example: PhD, EdD)"]},
        {index:4, value: "Employment Status", isChecked:false, question: "Are you currently...?", options: ["Employed for wages", "Self-employed", "Out of work and looking for work", "Out of work but not currently looking for work", "A homemaker", "A student", "Retired", "Unable to work"]},
        {index:5, value: "Employer Type", isChecked:false, question: "Please describe your work.", options: ["Employee of a for-profit company or business or of an individual, for wages, salary, or commissions", "Employee of a not-for-profit, tax-exempt, or charitable organization", "Local government employee (city, county, etc.)", "State government employee", "Federal government employee", "Self-employed in own not-incorporated business, professional practice, or farm", "Self-employed in own incorporated business, professional practice, or farm", "Working without pay in family business or farm"]},
        {index:6, value: "Housing", isChecked:false, question: " Is this house, apartment, or mobile home:", options: ["Owned by you or someone in this household with a mortgage or loan?", "Owned by you or someone in this household free and clear (without a mortgage or loan)?", "Rented for cash rent?", "Occupied without payment of cash rent?"]},
        {index:7, value: "Household Income", isChecked:false, question: "What is your total household income?", options: ["Less than $10,000", "$10,000 to $19,999", "$20,000 to $29,999", "$30,000 to $39,999", "$40,000 to $49,999", "$50,000 to $59,999", "$60,000 to $69,999", "$70,000 to $79,999", "$80,000 to $89,999", "$90,000 to $99,999", "$100,000 to $149,999", "$150,000 or more"]},
        {index:8, value: "Race", isChecked:false, question: "Please specify your race.", options: ["Hispanic or Latino", "American Indian or Alaska Native", "Asian", "Black or African American", "Native Hawaiian or Other Pacific Islander", "White"]},
    ]);
    const handleClick = (event, i) => {
        setAnchorEls(prev=>{
            prev[i] = event.target;
            return [...prev];
        })
      };
    const handleClose = (i) => {
        setAnchorEls(prev=>{
            prev[i] = null;
            return [...prev];
        })
    };
    const handleAddClick = () => {
        let t = tempQuestions.filter(v=>v.isChecked).map(v=>v.value);
        setData((prev)=>{
            prev.demographicQuestions = t;
            return {...prev};
        });
        if(t.length === 0){
            setCategoryPageList([{id:1,catName:"None",color:"#000000"}]);
        } else {
            setCategoryPageList([{id:8,catName:"Demographics",color:websiteColor}]);
        }
        setIsQuestionModalOpenedOnce((prev)=>!prev);
        toggleQuestionModal();
        handleNext();
    }
    const handleClickCancel = () => {
        toggleQuestionModal();
        handleCallAddCategoryModal();
    }
    const handleCallAddCategoryModal = () => {
        $("#clickAddCategoryPage").trigger("click");
    }
    return (
        <Modal isOpen={questionModal} size="lg">
            <ModalHeader className="" toggle={()=>{handleClickCancel();}}>Demographic Questions</ModalHeader>
            <ModalBody className="m-4">
                <Row>
                    <Col xs={12}>
                        <p className="fs-16">
                            Would you like to collect demographic data for your {type}?<br/>
                            Please select what you would like to collect and questions will be generated automatically for you.
                        </p>
                    </Col>
                </Row>
                <Row className="fs-16">
                    {
                        tempQuestions.map((v, i)=>{
                            return (
                                <Col xs={4} key={i} className="my-3">
                                    <div className="d-flex align-items-center" >
                                        <Input 
                                            type="checkbox" 
                                            className="mr-3" 
                                            checked={v.isChecked}  
                                            onChange={()=>{
                                                setTempQuestions((prev)=>{
                                                    prev[i].isChecked = !prev[i].isChecked;
                                                    return [...prev];
                                                });
                                            }}
                                        />
                                        <label className="mb-0 cursor-pointer" aria-describedby={`simple-popover-${i}`} onClick={(event)=>{handleClick(event, i)}}>{v.value}</label>
                                    </div>
                                    <Popover
                                        id={`simple-popover-${i}`}
                                        open={Boolean(anchorEls[i])}
                                        anchorEl={anchorEls[i]}
                                        onClose={()=>{handleClose(i)}}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <Typography className="p-3"><strong>{v.question}</strong></Typography>
                                        {
                                            v.hasOwnProperty("options") ?
                                                <ul className="mr-3">
                                                    {
                                                        v.options.map((option, j)=>{
                                                            return <li className="list-style-disc" key={j}>{option}</li>
                                                        })
                                                    }
                                                </ul>
                                            : null
                                        }
                                    </Popover>
                                </Col>
                            );
                        })
                    }
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" className="mr-2" onClick={handleAddClick}>ADD</Button>
                <Button variant="contained" color="primary" onClick={()=>{handleClickCancel();}}>CANCEL</Button>
            </ModalFooter>
        </Modal>
    );
}

export default DemographicQuestionModal;