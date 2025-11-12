import React from 'react';
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import ContactUsForm from "./contactUsForm";
import {reCaptchaSiteKey} from "../../config/api";

const ContactUs = () => {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={reCaptchaSiteKey}>
            <ContactUsForm/>
        </GoogleReCaptchaProvider>
    );
}

export default ContactUs;