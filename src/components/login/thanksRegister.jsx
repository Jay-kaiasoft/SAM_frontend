import React from 'react';
import {Row,Col} from "reactstrap";
import {Box} from '@mui/material';
import CorousealsComponent from "../shared/carouselsComponent/corouselsComponent";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {resendActivateEmailUserAction} from "../../actions/userActions";
import {siteURL, staticUrl, websiteTitle} from "../../config/api";

const ThanksRegister = (props) => {
    const { user } = props;
    const email = user ? user.email : "";
    const resendEmail = () => {
        if(email === "")
        {
            localStorage.removeItem("memberId");
        }
        if(localStorage.getItem("memberId")) {
            const mId = localStorage.getItem("memberId");
            props.resendactivateemail(mId);
        }
    }
    return (
        <>
            <Row>
                <Col xs={12} sm={8} md={7} lg={7} xl={7} className="pl-0">
                    <CorousealsComponent />
                </Col>
                <Col xs={12} sm={4} md={5} lg={5} xl={5} className="formBox">
                    <Box className="formMidle">
                        <p className="text-center pt-1">
                            <a className="navbar-brand" href={`${staticUrl}/index.html`}>
                                <img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /> </a>
                        </p>
                        <br />
                        <h2 className="text-center mb-4">Thanks for signing up!</h2>
                        <p>Please check your email and click Activate Account in the message we just sent to {email}.</p>
                        <p>If you do not receive our activation email.  Please check your Junk/Spam Folder to make sure your SPAM Settings did not route our email to your Junk/Spam Folder.</p>
                        <p><Link to="#" onClick={()=>resendEmail()}>Click Here</Link> to resend Activation Email if you did not receive it.</p>
                        <p>Once your account is activated, we’ll send you an email with some information to help you get started with {websiteTitle}.</p>
                    </Box>
                </Col>
            </Row>
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        resendactivateemail: (data) => {
            dispatch(resendActivateEmailUserAction(data))
        }
    }
}

const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ThanksRegister);