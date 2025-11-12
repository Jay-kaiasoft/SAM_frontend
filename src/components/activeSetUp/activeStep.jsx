import React, {useState, useEffect, useCallback, useMemo} from "react";
import {Typography, TextField, Button, Stepper, Step, StepLabel, Checkbox, FormControlLabel, MenuItem, Select, FormControl, InputLabel, InputAdornment, Link} from "@mui/material";
import { connect } from 'react-redux';
import {getprocessActivation, setInformationAction, setAddressDetailAction, setBusinessInfoAction, setCompleteActivationAction, setCellInfoAction} from '../../actions/userActions.js';
import { Row, Col } from 'reactstrap';
import {useForm, Controller, FormProvider, useFormContext,} from "react-hook-form";
import {characterNumberOnly, checkCreateURL, easUrlEncoder, getHostData, numberOnly} from "../../assets/commonFunctions";
import {sendOtpOnboarding, updateAuthenticator, verifiedOtpCell} from "../../services/userService";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {getCountry, getCountryToState, getLanguage, validatePhoneFormat} from "../../services/commonService";
import {siteURL, staticUrl, websiteColor, websiteTitle} from "../../config/api";
import OtpModal from "../shared/commonControlls/otpModal.jsx";
import ImportStyleModal from "../shared/commonControlls/importStyleModal.jsx";
import { setConfirmDialogAction } from "../../actions/confirmDialogActions.js";
import AuthIDComponent from '@authid/react-component';
import titleize from "titleize";

function getSteps(value = 0) {
    let data = ["", "", "", "", "", ""]
    if (value > 0) {
        for (let i = 0; i < value; i++) {
            data.push("");
        }
    } else {
        data = ["", "", "", "", "", ""]
    }
    return data
}
function removeSpaces(value){
    if (!value.trim().length) {
        return "";
    } else {
        return value;
    }
}

const Authenticator = ({handleAuthenticatorSuccess, handleAuthenticatorFailure}) => {
    const [finalUrl, setFinalUrl] = useState(null);
    const [buttonClick, setButtonClick] = useState(false);
    useEffect(()=>{
        let interval = null;
        interval = setInterval(() => {
            if(sessionStorage.getItem("operationId") !== null){
                setFinalUrl("https://id.authid.ai/?i="+sessionStorage.getItem("operationId")+"&s="+sessionStorage.getItem("oneTimeSecret"));
            }
        }, 1000);
        window.addEventListener("message", (event) => {
            if(event.data.pageName === "verifiedPage"){
                if (event.data.success) {
                    handleAuthenticatorSuccess();
                } else {
                    handleAuthenticatorFailure();
                }
            }
        });
        return ()=>{
            clearInterval(interval);
            interval = null;
        }
    },[]);
    return (
        <>
            <div className="w-50 mx-auto text-center mt-5">
                <a className="navbar-brand" href={`${staticUrl}/index.html`}><img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /></a>
                <h3 className="my-3">Let's verify it's you - Biometric check needed</h3>
                <p className="mt-3">
                    Biometric authentication is widely adopted in IT field for security, efficiency, and compliance. 
                </p>
                <p className="mb-5">
                    It ensures that only authorized personnel can access sensitive areas, modules, and data, reducing the risk of fraud, unauthorized access of your account in salesandmarketing.ai.
                </p>
                <Button variant="contained" type="button" color="primary" onClick={()=>{setButtonClick(true);}}>PROCEED FOR BIOMETRIC AUTHENTICATION</Button>
            </div>
            {
                (finalUrl && buttonClick) && <div className="loading-main-ai d-flex flex-column align-items-center justify-content-center">
                    <AuthIDComponent
                        url={finalUrl}
                        webauth={true}
                    />
                </div>
            }
        </>
    );
}

const BasicForm = () => {
    const { control, formState: { errors },setValue, getValues } = useFormContext();
    useEffect(() => {
        if(getValues("firstName") === ""){
            setValue("firstName", sessionStorage.getItem("firstName"));
        }
        if(getValues("lastName") === ""){
            setValue("lastName", sessionStorage.getItem("lastName"));
        }
    },[setValue]);
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <p className="text-center pt-1">
                        <a className="navbar-brand" href={`${staticUrl}/index.html`}>
                            <img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /> </a>
                    </p>
                    <h3 className='text-center mb-3'>Welcome, let get you setup</h3>
                    <p className='text-center'>Thank You for Registering!. Now please tell us a little more about yourself.</p>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                    <Controller
                        control={control}
                        name="firstName"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="firstName"
                                label="First Name"
                                fullWidth
                                margin="normal"
                                {...field}
                                value={field.value}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                error={Boolean(errors?.firstName)}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="lastName"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="last-name"
                                label="Last Name"
                                fullWidth
                                margin="normal"
                                {...field}
                                value={field.value}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                error={Boolean(errors?.lastName)}
                            />
                        )}
                    />
                </Col>
            </Row>
        </>
    );
};
const AddressForm = (props) => {
    const classes = {
        formControl: {
            minWidth: 200,
            width: '100%',
        }
    };
    const { control, formState: { errors },setValue,getValues } = useFormContext();
    const [language, setLanguage] = useState([]);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [countryCode,setCountryCode] = useState("+1");

    const fetchData = async () => {
        getLanguage().then(res => {
            if (res.result.language) {
                let language = []
                res.result.language.map(x => (
                    language.push({
                        "key": x.lgName,
                        "value": x.lgLongName
                    })
                ));
                setLanguage(language)
            }
        })
        getCountry().then(res => {
            if (res.result.country) {
                let c = [];
                res.result.country.map(x => (
                    c.push({
                        "key": String(x.id),
                        "value": x.cntName,
                        "cntCode":x.cntCode
                    })
                ));
                setCountry(c);
            }
        })
    }

    const changeCountry = useCallback((countryId) => {
        getCountryToState(countryId).then(res => {
            if (res.result.state) {
                let state = [];
                res.result.state.map(x => (
                    state.push({
                        "key": x.stateLong,
                        "value": x.stateLong
                    })
                ));
                setState(state);
            }
        });
        if(country.length > 0) {
            let sc = country.find(o => Number(o.key) === Number(countryId));
            setCountryCode(sc.cntCode);
        }
    },[country]);

    useEffect(() => {
        fetchData();
        setValue("countrycodephone",countryCode);
    }, [setValue,countryCode]);
    useEffect(()=>{
        changeCountry(getValues("country"));
    },[changeCountry,getValues]);
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <p className="text-center pt-1">
                        <a className="navbar-brand" href={`${staticUrl}/index.html`}>
                            <img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /> </a>
                    </p>
                    <h3 className='text-center mb-3'>Hi {getValues("firstName")}, What is your address</h3>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                    <FormControl sx={classes.formControl} variant="standard" >
                        <InputLabel id="language-label" error={Boolean(errors?.language)}>Select Language</InputLabel>
                        <Controller
                            control={control}
                            name="language"
                            rules={{ required: true }}
                            render={(props) => (
                                <Select id="language" labelId="language-label" value={props.field.value?props.field.value:"en"} onChange={(e) => {props.field.onChange(e.target.value);}} fullWidth className="mb-2" error={Boolean(errors?.language)}>
                                    {language.map((ele, i) => (
                                        <MenuItem key={i} value={ele.key}>
                                            {ele.value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <Controller
                        control={control}
                        name="address"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="address1"
                                label="Address 1"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                error={Boolean(errors?.address)}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="address2"
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="address2"
                                label="Address 2"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="city"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="city"
                                label="City"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                error={Boolean(errors?.city)}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="postcode"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="postcode"
                                label="Post Code"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e) => {field.onChange(characterNumberOnly(e.target.value));}}
                                error={Boolean(errors?.postcode)}
                                className="mb-4"
                            />
                        )}
                    />
                    <FormControl sx={classes.formControl} variant="standard">
                        <InputLabel id="country-label" error={Boolean(errors?.country)}>Select Country</InputLabel>
                        <Controller
                            control={control}
                            name="country"
                            rules={{ required: true }}
                            render={(props) => (
                                <Select labelId="country-label" value={props.field.value?props.field.value:100} onChange={(e) => {props.field.onChange(parseInt(e.target.value));changeCountry(e.target.value)}} fullWidth className="mb-4" error={Boolean(errors?.country)}>
                                    {country.map((ele, i) => (
                                        <MenuItem key={i} value={ele.key}>
                                            {ele.value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <FormControl sx={classes.formControl} variant="standard">
                        <InputLabel id="state-label" error={Boolean(errors?.state)}>Select State</InputLabel>
                        <Controller
                            control={control}
                            name="state"
                            rules={{ required: true }}
                            render={(props) => (
                                <Select labelId="state-label" value={props.field.value} onChange={(e) => {props.field.onChange(e.target.value);}} fullWidth className="mb-2" error={Boolean(errors?.state)}>
                                    {state.map((ele, i) => (
                                        <MenuItem key={i} value={ele.key}>
                                            {ele.value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <Controller
                        control={control}
                        name="phone"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="phone"
                                label="Phone"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e) => {field.onChange(numberOnly(e.target.value));}}
                                error={Boolean(errors?.phone)}
                                InputProps={{startAdornment: <InputAdornment position="start">{countryCode}</InputAdornment>,}}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="cell"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="cell"
                                label="Cell"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e) => {field.onChange(numberOnly(e.target.value));}}
                                error={Boolean(errors?.cell)}
                                InputProps={{startAdornment: <InputAdornment position="start">{countryCode}</InputAdornment>,}}
                            />
                        )}
                    />
                    <p className="mb-0">By providing your cell phone number you opt in to receiving important products updates</p>
                    <Controller
                        control={control}
                        name="countrycodephone"
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="countrycodephone"
                                type="hidden"
                                {...field}
                                value={field.value}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                            />
                        )}
                    />
                </Col>
            </Row>
        </>
    );
};
const CompanyInfoForm = ({handleClickImport}) => {
    const { control, watch, formState: { errors } } = useFormContext();
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={8} lg={8} xl={8} className="offset-md-2 offset-lg-2 offset-xl-2">
                    <p className="text-center pt-1">
                        <a className="navbar-brand" href={`${staticUrl}/index.html`}>
                            <img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /> </a>
                    </p>
                    <h3 className='text-center mb-3'>What is your business name, brand name and brand website?</h3>
                    <p className='text-center'>Tell us little bit more about what you do. This information will appear in your emails to help your recipients find your organization.</p>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                    <Controller
                        control={control}
                        name="businessName"
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="businessName"
                                label="Business Name"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="brandName"
                        rules={{ required: (watch("brandWebsite", false) === "" || watch("brandWebsite", false) === false) ? false : true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="brandName"
                                label="Brand Name"
                                fullWidth
                                margin="normal"
                                {...field}
                                error={Boolean(errors?.brandName)}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                            />
                        )}
                    />
                    <div className='d-flex align-items-end'>
                        <div className='w-100'>
                            <Controller
                                control={control}
                                name="brandWebsite"
                                rules={{ required: (watch("brandName", false) === "" || watch("brandName", false) === false) ? false : true }}
                                render={({ field }) => (
                                    <TextField
                                        variant="standard"
                                        id="brandWebsite"
                                        label="Brand Website"
                                        fullWidth
                                        margin="normal"
                                        {...field}
                                        error={Boolean(errors?.brandWebsite)}
                                        onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                    />
                                )}
                            />
                        </div>
                        <Link component="a" className="btn-circle ml-2" data-toggle="tooltip" title="Add your brand logo and colors automatically" onClick={()=>{handleClickImport()}}>
                            <i className="far fa-upload pl-1"></i>
                            <div className="bg-dark-blue"></div>
                        </Link>
                    </div>
                </Col>
            </Row>
        </>
    );
};

const AccountSecurityForm = () => {
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mx-auto">
                    <p className="text-center pt-1">
                        <a className="navbar-brand" href={`${staticUrl}/index.html`}>
                            <img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /> </a>
                    </p>
                    <h3 className='text-center mb-3'>Account Security</h3>
                    <p className='text-center mb-3'>Advance Account Security Setup Protect your account with 2-Step Verification. Add an extra layer of security. Keep the bad guys out, even if someone else gets your password, it won't be enough to sign in to your account.</p>
                    <p className='text-center'>Each time you sign in to your {websiteTitle} account, you'll need your password and mobile verification code. Learn more</p>
                    <p className="text-center pt-1">
                        <a className="navbar-brand" href={`${staticUrl}/index.html`}>
                            <img src={siteURL+"/img/2_step_verifiation.png"} alt="2_step_verifiation" style={{ width: '60%' }} /> </a>
                    </p>
                    <h3 className='text-center'>Would you like to set up it up?</h3>
                </Col>
            </Row>
        </>
    );
};

const AccountMobileForm = () => {
    const { control, formState: { errors }, getValues } = useFormContext();
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={8} lg={8} xl={8} className="offset-2">
                    <p className="text-center pt-1">
                        <a className="navbar-brand" href={`${staticUrl}/index.html`}>
                            <img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /> </a>
                    </p>
                    <h3 className='text-center mb-3'>Account Security</h3>
                    <p className='text-center mb-3'>Advance Account Security Setup Protect your account with 2-Step Verification. Add an extra layer of security. Keep the bad guys out,
                        even if someone else gets your password, it won't be enough to sign in to your account.</p>
                    <p className='text-center'>Each time you sign in to your {websiteTitle} account, you'll need your password and mobile verification code. Learn more</p>
                    <p className="text-center pt-1">
                        <a className="navbar-brand" href={`${staticUrl}/index.html`}>
                            <img src={siteURL+"/img/2_step_verifiation.png"} alt="2_step_verifiation" style={{ width: '60%' }} /> </a>
                    </p>
                    <h3 className='text-center'>What is your mobile/cell number?</h3>
                </Col>
                <Col xs={12} sm={12} md={3} lg={3} xl={3} className="mx-auto">
                    <Controller
                        control={control}
                        name="cell"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="cell"
                                fullWidth
                                label="What is your mobile/cell number?"
                                {...field}
                                error={Boolean(errors?.cell)}
                                onChange={(e) => {field.onChange(numberOnly(e.target.value));}}
                                InputProps={{startAdornment: <InputAdornment position="start">{getValues("countrycodephone")}</InputAdornment>,}}
                            />
                        )}
                    />
                </Col>
            </Row>
        </>
    );
};

const MobileVerificationForm = () => {
    const { control, formState: { errors } } = useFormContext();
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={8} lg={8} xl={8} className="offset-2">
                    <p className="text-center pt-1">
                        <a className="navbar-brand" href={`${staticUrl}/index.html`}>
                            <img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /> </a>
                    </p>
                    <h3 className='text-center mb-3'>Account Security</h3>
                    <p className='text-center mb-3'>Advance Account Security Setup Protect your account with 2-Step Verification. Add an extra layer of security. Keep the bad guys out,
                        even if someone else gets your password, it won't be enough to sign in to your account.</p>
                    <p className='text-center'>Each time you sign in to your {websiteTitle} account, you'll need your password and mobile verification code. Learn more</p>
                    <p className="text-center pt-1">
                        <a className="navbar-brand" href={`${staticUrl}/index.html`}>
                            <img src={siteURL+"/img/2_step_verifiation.png"} alt="2_step_verifiation" style={{ width: '60%' }} /> </a>
                    </p>
                    <h3 className='text-center'>Please enter the verification code sent to your mobile</h3>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                    <Controller
                        control={control}
                        name="otp"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="otp"
                                label="Please enter the verification code sent to your mobile"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e) => {field.onChange(numberOnly(e.target.value));}}
                                error={Boolean(errors?.otp)}
                            />
                        )}
                    />
                </Col>
            </Row>
        </>
    );
};

const FinalstepForm = () => {
    const { control, setValue, getValues } = useFormContext();
    const [ loginPreference, setLoginPreference ] = useState(getValues("loginPreference"));
    const handleClickAuthenticator = (value) => {
        setValue("loginPreference", value);
        setLoginPreference(value);
    }
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <p className="text-center pt-1">
                        <a className="navbar-brand" href={`${staticUrl}/index.html`}>
                            <img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /> </a>
                    </p>
                    <h3 className='text-center'>{getValues("firstName")}, Your Account Is Ready!!</h3>
                    <p className='text-center'>Let's set up your list now and build your first campaigns.</p>
                    <h5 className='text-center'>Want to improve your {websiteTitle} skills?</h5>
                    <p className='text-center m-0'>
                        <FormControlLabel control={
                            <Controller
                            control={control}
                            name="newsletterSubscribe"
                            render={({ field }) => (
                                <Checkbox id="newsletterSubscribe" color="primary" {...field} />
                            )}
                            />
                        } label={`Subscribe to ${websiteTitle} Skills and Update (Optional)`} />
                    </p>
                    <p className='text-center'>A newsletter of special offers, tips, feature updates, and marketing news delivered right to your inbox</p>
                    <div className="w-50 mx-auto">
                        <h5 className="text-center my-4">Choose your Login Preference</h5>
                        <div className="d-flex justify-content-around">
                            <div className={`authenticator-box p-3 cursor-pointer mr-3 position-relative ${loginPreference === "microsoftAuthenticator" ? "active" : ""}`} onClick={()=>{/*handleClickAuthenticator("microsoftAuthenticator")*/handleClickAuthenticator("")}}>
                                <img className="authenticator-icon" src={siteURL+"/img/microsoft-authenticator.svg"} alt="Microsoft Authenticator" />
                                <p className="mb-0">Microsoft Authenticator</p>
                            </div>
                            <div className={`authenticator-box p-3 cursor-pointer mr-3 position-relative ${loginPreference === "googleAuthenticator" ? "active" : ""}`} onClick={()=>{/*handleClickAuthenticator("googleAuthenticator")*/handleClickAuthenticator("")}}>
                                <img className="authenticator-icon" src={siteURL+"/img/google-authenticator.svg"} alt="Microsoft Authenticator" />
                                <p className="mb-0">Google Authenticator</p>
                            </div>
                            <div className={`authenticator-box p-3 cursor-pointer ${loginPreference === "authidAuthenticator" ? "active" : ""}`} onClick={()=>{handleClickAuthenticator("authidAuthenticator")}}>
                                <img className="authenticator-icon" src={siteURL+"/img/authid-authenticator.svg"} alt="Microsoft Authenticator" />
                                <p className="mb-0">Biomatric Authenticator</p>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
};

const ActiveSetup = (props) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const id = queryString.get("v") ? queryString.get("v") : "";
    useEffect(() => {
        if(sessionStorage.getItem('userId') === null && sessionStorage.getItem('operationId') === null){
            getHostData().then((res1) => {
                let d = 2;
                if(res1.data.address.country === "United States"){
                    d = 2;
                } else if(res1.data.address.country === "India"){
                    d = 21;
                }
                props.setProcessActivation(id, d);
            })
        }
    }, [id,props]);
    const methods = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            address: "",
            address2: "",
            language: "en",
            country: 100,
            city: "",
            state: "",
            postcode: "",
            phone: "",
            countrycodephone: "",
            businessName: "",
            brandName: "",
            brandWebsite: "",
            cell: "",
            countryCode: "",
            otp: "",
            newsletterSubscribe: "",
            brandWebsiteURL:"",
            loginPreference:""
        },
    });
    const [activeStep, setActiveStep] = useState(0);
    const [steps, setsteps] = useState(getSteps());
    const [modalOtp, setModalOtp] = useState(false);
    const toggleModalOtp = ()=>{setModalOtp(!modalOtp)};
    const [modalImport, setModalImport] = useState(false);
    const toggleImport = () => { setModalImport(!modalImport); }
    let is2FA = 0;
    const isStepFalied = () => {
        return Boolean(Object.keys(methods.formState.errors).length);
    };
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <Authenticator handleAuthenticatorSuccess={handleAuthenticatorSuccess} handleAuthenticatorFailure={handleAuthenticatorFailure} />;
            case 1:
                return <BasicForm />;
            case 2:
                return <AddressForm />;
            case 3:
                return <CompanyInfoForm handleClickImport={handleClickImport} />;
            case 4:
                return <AccountSecurityForm />;
            case 5:
                return <AccountMobileForm />;
            case 6:
                return <MobileVerificationForm />;
            case 7:
                return <FinalstepForm/>;
    
            default:
                return "unknown step";
        }
    }
    const handleAuthenticatorSuccess = () => {
        let requestData = {
            "memberId": Number(sessionStorage.getItem('userId')),
            "authidOperationId": sessionStorage.getItem('operationId')
        }
        updateAuthenticator(requestData).then(res => {
            sessionStorage.removeItem('operationId');
            sessionStorage.removeItem('oneTimeSecret');
            if (res.status === 200) {
                let name = res?.result?.userInfo?.NameOfHolder?.split(" ") || [];
                if(name.length > 0){
                    methods.setValue("firstName",titleize(name[0].toLowerCase()));
                    methods.setValue("lastName",titleize(name[1].toLowerCase()));
                }
                methods.setValue("address",titleize(res?.result?.userInfo?.Address?.toLowerCase()?.replaceAll(/[^a-zA-Z0-9.,-]/gi,"")));
                getCountry().then(res1 => {
                    if (res1.result.country) {
                        let c = res1.result.country.filter(x => x.cntName === res?.result?.userInfo?.issuerName);
                        if(c.length > 0){
                            methods.setValue("country",c[0].id);
                        }
                    }
                })
                let tempState = "";
                if(res?.result?.userInfo?.AddressState){
                    tempState = titleize(res?.result?.userInfo?.AddressState?.toLowerCase());
                }
                methods.setValue("state", tempState);
                handleNext();
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleAuthenticatorFailure = () => {
        props.globalAlert({
            type: "Error",
            text: "An error occurred. Please try again.",
            open: true
        });
    }
    const handleSendOtp = (type) => {
        let requestData = {
            "memberId": Number(sessionStorage.getItem('userId')),
            "cell": methods.getValues("cell"),
            "countryCode": methods.getValues("countrycodephone")
        }
        sendOtpOnboarding(requestData).then(res => {
            if (res.status === 200) {
                if(type === "send"){
                    toggleModalOtp();
                }
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleNextStep2 = () => {
        let step2data = {
            memberId: Number(sessionStorage.getItem('userId')),
            address: methods.getValues("address"),
            streetAddress: methods.getValues("address2"),
            memberDefaultLanguage: methods.getValues("language"),
            country: methods.getValues("country"),
            city: methods.getValues("city"),
            state: methods.getValues("state"),
            postCode: methods.getValues("postcode"),
            phone: methods.getValues("phone"),
            cell: methods.getValues("cell")
        }
        props.setAddressDetails(step2data);
        setActiveStep(activeStep + 1);
    }
    const handleNextStep3 = (data) => {
        let step3data = {
            memberId: Number(sessionStorage.getItem('userId')),
            businessName: data.businessName,
            brandName: data.brandName,
            brandWebsite: data.brandWebsite,
            brandLogo: data.brandLogo,
            brandColors: data.brandColors
        }
        props.setBusinessInformation(step3data);
        setActiveStep(activeStep + 1);
    }
    const handleNext =async (data) => {
        if (activeStep === 1) {
            let step1data = {
                memberId: Number(sessionStorage.getItem('userId')),
                firstName: data.firstName,
                lastName: data.lastName,
            }
            props.setInformation(step1data);
        } else if (activeStep === 2) {
            let isValidPh = await validatePhoneFormat(data.country, data.phone);
            if(!isValidPh){
                props.globalAlert({
                    type: "Error",
                    text: `Invalid phone number format or Do not put a national prefix on your phone number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct`,
                    open: true
                });
                return;
            }
            isValidPh = await validatePhoneFormat(data.country, data.cell);
            if(!isValidPh){
                props.globalAlert({
                    type: "Error",
                    text: `Invalid cell number format or Do not put a national prefix on your cell number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct`,
                    open: true
                });
                return;
            }
            handleSendOtp("send");
            return false;
        } else if (activeStep === 3) {
            if((typeof data.brandName !== "undefined" && data.brandName !== "" && data.brandName !== null) && (typeof data.brandWebsite !== "undefined" && data.brandWebsite !== "" && data.brandWebsite !== null)){
                if(typeof data.brandWebsite !== "undefined" && data.brandWebsite !== "" && data.brandWebsite !== null && data.brandWebsite.match(/^(https?:\/\/)?([\w]{2,}\.)?[\w]{2,256}(\.[\w]{2,6})+(\b([-a-zA-Z0-9@:%_+.~#?&//=]*))+/gm) === null){
                    props.globalAlert({
                        type: "Error",
                        text: `Please enter proper brand website`,
                        open: true
                    });
                    return;
                }
                if((typeof data.brandLogo !== "undefined" && data.brandLogo !== "" && data.brandLogo !== null) || (typeof data.brandColors !== "undefined" && data.brandColors !== "" && data.brandColors !== null)){
                    handleNextStep3(data);
                } else {
                    props.confirmDialog({
                        open: true,
                        title: `You can import your branding styles from your webiste by clicking import icon (<i class="far fa-upload"></i>) near website name.\n\nYou can import it later also from Edit Profile -> My Branding Kit section.\n\nAre you sure, you want to continue without importing branding styles ?`,
                        onConfirm: () => {
                            handleNextStep3(data);
                        }
                    });
                }
            } else {
                handleNextStep3(data);
            }
            return false;
        } else if (activeStep === 4) {
            let step4data = {
                memberId: Number(sessionStorage.getItem('userId')),
                is2FA: is2FA
            }
            props.setCellInformation(step4data);
            if(is2FA === 0){
                setsteps(getSteps(is2FA));
                setActiveStep(7);
            } else {
                setsteps(getSteps(2));
                setActiveStep(5);
            }
            return false;
        } else if (activeStep === 6) {
            let step5data = {
                otp:localStorage.getItem("cellotp"),
                memberId:Number(sessionStorage.getItem('userId')),
                verifyedOtp:data.otp
            }
            verifiedOtpCell(step5data).then(res => {
                if (res.status === 200) {
                    setActiveStep(activeStep + 1);
                } else {
                    props.globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true,
                    });
                }
            });
            return false;
        } else if (activeStep === 7) {
            if(typeof data.loginPreference === "undefined" || data.loginPreference === "" || data.loginPreference === null){
                props.globalAlert({
                    type: "Error",
                    text: `Please select login preference`,
                    open: true
                });
                return;
            }
            let newsletterSubscribe = data.newsletterSubscribe === true ? 1 : 0;
            let step6data = {
                memberId: Number(sessionStorage.getItem('userId')),
                newsletterSubscribe: newsletterSubscribe,
                loginPreference: data.loginPreference
            }
            props.setCompleteActivation(step6data);
        }
        if (activeStep === steps.length - 1 || (steps.length === 6 && activeStep === 7)) {
        } else {
            setActiveStep(activeStep + 1);
        }
    };
    const handleBack = () => {
        if(steps.length === 6 && activeStep === 7){
            setActiveStep(activeStep - 3);
        } else {
            setActiveStep(activeStep - 1);
        }
    };
    const handleCheckYes = () => {
        is2FA=1;
        handleNext();

    };
    const handleCheckNo = () => {
        is2FA=0;
        handleNext();
    };
    const handleClickImport = () => {
        if((typeof methods.getValues("brandName") === "undefined" || methods.getValues("brandName") === "" || methods.getValues("brandName") === null) && (typeof methods.getValues("brandWebsite") === "undefined" || methods.getValues("brandWebsite") === "" || methods.getValues("brandWebsite") === null)){
            props.globalAlert({
                type: "Error",
                text: `If you want to add brand logo and colors, please enter brand name and brand website`,
                open: true
            });
            return;
        }
        if(typeof methods.getValues("brandWebsite") !== "undefined" && methods.getValues("brandWebsite") !== "" && methods.getValues("brandWebsite") !== null && methods.getValues("brandWebsite").match(/^(https?:\/\/)?([\w]{2,}\.)?[\w]{2,256}(\.[\w]{2,6})+(\b([-a-zA-Z0-9@:%_+.~#?&//=]*))+/gm) === null){
            props.globalAlert({
                type: "Error",
                text: `Please enter proper brand website`,
                open: true
            });
            return;
        }
        let isUrlCorrect = checkCreateURL(methods.getValues("brandWebsite"),props.globalAlert);
        methods.setValue("brandWebsiteURL",isUrlCorrect)
        toggleImport();
    }
    const classes = {
        '& .MuiStepLabel-root .Mui-completed': {
            color: websiteColor,
        },
        '& .MuiStepLabel-root .Mui-active': {
            color: websiteColor,
        },
        '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
            borderColor: websiteColor,
        },
        '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
            borderColor: websiteColor,
        },
    }
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Stepper alternativeLabel activeStep={(steps.length === 6 && activeStep === 7) ? 5 : activeStep} className="w-50 mx-auto">
                        {steps.map((step, index) => {
                            const labelProps = {};
                            const stepProps = {};
                            if (isStepFalied() && activeStep === index) {
                                labelProps.error = true;
                            }
                            return (
                                <Step {...stepProps} key={index} sx={classes}>
                                    <StepLabel {...labelProps} >{step}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <Typography variant="h3" align="center">
                            Thank You
                        </Typography>
                    ) : (
                        <>
                            <FormProvider {...methods}>
                                <form onSubmit={methods.handleSubmit(handleNext)}>
                                    {getStepContent(activeStep,handleClickImport)}
                                    <div className="row">
                                        <div className="col-md-12 pb-5 pt-5 text-center">
                                            {activeStep === 4 ? (
                                                <>
                                                    <Button
                                                        onClick={handleBack}
                                                        variant="contained"
                                                        color="primary"
                                                    >
                                                        BACK
                                                    </Button>
                                                    <Button className="ml-3"
                                                        variant="contained"
                                                        type="button"
                                                        color="primary" onClick={()=>{handleCheckYes();}}> YES </Button>
                                                    <Button className="ml-3"
                                                        variant="contained"
                                                        type="button"
                                                        color="primary" onClick={()=>{handleCheckNo();}}> NO </Button>
                                                </>
                                            ) : null}
                                            {activeStep !== 0 && activeStep !== 4 ? (
                                                <>
                                                    {activeStep !== 1 &&<Button
                                                        disabled={activeStep === 0}
                                                        onClick={handleBack}
                                                        variant="contained"
                                                        color="primary"
                                                    >
                                                        BACK
                                                    </Button>}
                                                    <Button
                                                        className="ml-3"
                                                        variant="contained"
                                                        color="primary"
                                                        type="submit"
                                                    >
                                                        {activeStep === steps.length - 1 || (steps.length === 6 && activeStep === 7) ? "LET'S GO!" : "NEXT"}
                                                    </Button>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                </form>
                            </FormProvider>
                        </>
                    )}
                </Col>
            </Row>
            <OtpModal modalOtp={modalOtp} toggleModalOtp={toggleModalOtp} cell={methods.getValues("cell")} handleSendOtp={handleSendOtp} globalAlert={props.globalAlert} handleNextStep2={handleNextStep2}/>
            {modalImport && <ImportStyleModal modalImport={modalImport} toggleImport={toggleImport} selectedBrand={methods} />}
        </>
    );
};


const mapDispatchToProps = dispatch => {
    return {
        setProcessActivation: (id, d) => {
            dispatch(getprocessActivation(id, d))
        },
        setInformation: (data) => {
            dispatch(setInformationAction(data))
        },
        setAddressDetails: (data) => {
            dispatch(setAddressDetailAction(data))
        },
        setBusinessInformation: (data) => {
            dispatch(setBusinessInfoAction(data))
        },
        setCellInformation: (data) => {
            dispatch(setCellInfoAction(data))
        },
        setCompleteActivation: (data) => {
            dispatch(setCompleteActivationAction(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        }
    }
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActiveSetup)