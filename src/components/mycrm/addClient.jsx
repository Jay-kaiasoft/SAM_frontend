import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, Link, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material'
import { QontoConnector, QontoStepIcon } from '../../assets/commonFunctions';
import { Col, Row } from 'reactstrap';
import { Controller, useForm } from 'react-hook-form';
import { getCountry, getCountryToState } from '../../services/commonService';


const sectors = [
    { id: 1, sector: "11", title: "Agriculture, Forestry, Fishing and Hunting" },
    { id: 2, sector: "21", title: "Mining, Quarrying, and Oil and Gas Extraction" },
    { id: 3, sector: "22", title: "Utilities" },
    { id: 4, sector: "23", title: "Construction" },
    { id: 5, sector: "31-33", title: "Manufacturing" },
    { id: 6, sector: "42", title: "Wholesale Trade" },
    { id: 7, sector: "44-45", title: "Retail Trade" },
    { id: 8, sector: "48-49", title: "Transportation and Warehousing" },
    { id: 9, sector: "51", title: "Information" },
    { id: 10, sector: "52", title: "Finance and Insurance" },
    { id: 11, sector: "53", title: "Real Estate and Rental and Leasing" },
    { id: 12, sector: "54", title: "Professional, Scientific, and Technical Services" },
    { id: 13, sector: "55", title: "Management of Companies and Enterprises" },
    { id: 14, sector: "56", title: "Administrative and Support and Waste Management and Remediation Services" },
    { id: 15, sector: "61", title: "Educational Services" },
    { id: 16, sector: "62", title: "Health Care and Social Assistance" },
    { id: 17, sector: "71", title: "Arts, Entertainment, and Recreation" },
    { id: 18, sector: "72", title: "Accommodation and Food Services" },
    { id: 19, sector: "81", title: "Other Services" },
    { id: 20, sector: "92", title: "Public Administration" }
];


const AddClient = () => {
    const steps = ["1", "2"];
    const [activeStep, setActiveStep] = useState(0);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [countryCode, setCountryCode] = useState("+1");

    const [contactPhoto, setContactPhoto] = useState(null);
    const handleContactPhoto = (e) => {
        const f = e.target.files?.[0];
        if (f) setContactPhoto(URL.createObjectURL(f));
    };

    const {
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            clientName: null,
            discription: null,
            logo: null,

            clientIndustry: null,
            clientSubIndustry: null,
            websiteUrl: null,
            country: null,
            city: null,
            state: null,
            address1: null,
            address2: null,
            zipCode: null,

            billingCountry: null,
            billingCity: null,
            billingState: null,
            billingAddress1: null,
            billingAddress2: null,
            billingZipCode: null,

            contactPerson: null,
            designation: null,
            contactEmail: null,
            contactPhone: null,
            contactAddress: null,
            note: null
        },
    });

    const handleNext = (data) => {
        console.log("data", data)
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleGetCountrys = async () => {
        const res = await getCountry()
        if (res.result.country) {
            let c = [];
            res.result.country.map(x => (
                c.push({
                    "key": String(x.id),
                    "value": x.cntName,
                    "cntCode": x.cntCode
                })
            ));
            setCountry(c);
        }
    }

    const handleGetStates = async (countryId) => {
        const res = await getCountryToState(countryId)
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
    }

    useEffect(() => {
        handleGetCountrys()
    }, [])

    return (
        <div className="midleMain">
            <Typography fontWeight={600} fontSize={24} sx={{ ml: 5 }}>
                Add Client
            </Typography>

            <Box display="flex" justifyContent="center" mt={1}>
                <Stepper className="w-50 p-1 mb-1" alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={QontoStepIcon} />
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <Box sx={{ paddingX: { sm: 10, lg: 20, xxl: 30 } }} className='py-2'>
                <form onSubmit={handleSubmit(handleNext)}>
                    {
                        activeStep === 0 && (
                            <>
                                <Row>
                                    <Col xs={12}>
                                        <Typography fontWeight={600} fontSize={18}>
                                            Client Information
                                        </Typography>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} sm={12} md={6}>
                                        <Controller
                                            control={control}
                                            name="clientName"
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <TextField
                                                    variant="standard"
                                                    id="clientName"
                                                    label="Client Name"
                                                    fullWidth
                                                    margin="normal"
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) => { field.onChange(e.target.value) }}
                                                    error={Boolean(errors?.clientName)}
                                                />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name="clientIndustry"
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    options={sectors}
                                                    value={sectors.find(o => o.id === field.value) || null}
                                                    onChange={(_, newValue) => field.onChange(newValue?.id ?? null)}
                                                    getOptionLabel={(option) => option.title || ""}
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                            label="Client Industry / Sector"
                                                            error={!!errors?.clientIndustry}
                                                            margin="normal"

                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name="clientSubIndustry"
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    options={sectors}
                                                    value={sectors.find(o => o.id === field.value) || null}
                                                    onChange={(_, newValue) => field.onChange(newValue?.id ?? null)}
                                                    getOptionLabel={(option) => option.title || ""}
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                            label="Client Sub Industry / Sector"
                                                            error={!!errors?.clientSubIndustry}
                                                            margin="normal"

                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name="websiteUrl"
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <TextField
                                                    variant="standard"
                                                    id="websiteUrl"
                                                    label="Website URL"
                                                    fullWidth
                                                    margin="normal"
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) => { field.onChange(e.target.value) }}
                                                    error={Boolean(errors?.websiteUrl)}
                                                />
                                            )}
                                        />
                                    </Col>

                                    <Col xs={12} sm={12} md={6}>
                                        <div>
                                            <Controller
                                                control={control}
                                                name="discription"
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        variant="standard"
                                                        id="discription"
                                                        label="Discription"
                                                        multiline
                                                        rows={4}
                                                        fullWidth
                                                        margin="none"
                                                        sx={{ marginTop: 2.7 }}
                                                        value={field.value}
                                                        onChange={(e) => { field.onChange(e.target.value) }}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "120px",
                                                border: "2px dashed #ccc",
                                                borderRadius: "6px",
                                                backgroundColor: "#fafafa",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                transition: "border-color 0.3s ease",
                                                marginTop: 15
                                            }}
                                        >
                                            <p
                                                style={{
                                                    color: "#999",
                                                    fontSize: "14px",
                                                    fontWeight: 500,
                                                    margin: 0,
                                                    textAlign: "center",
                                                }}
                                            >
                                                Upload Client Logo Here
                                            </p>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className='my-4'>
                                    <Col xs={12}>
                                        <Typography fontWeight={600} fontSize={18}>
                                            Client Address
                                        </Typography>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} sm={12} md={6}>
                                        <div>
                                            <Controller
                                                control={control}
                                                name="country"
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        options={country}
                                                        getOptionLabel={(option) => option.value}
                                                        value={country.find(option => option.key === field.value) || null}
                                                        onChange={(event, newValue) => {
                                                            const value = newValue ? newValue.key : null;
                                                            field.onChange(value);
                                                            if (value) {
                                                                handleGetStates(value);
                                                            }
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                variant="standard"
                                                                {...params}
                                                                label="Country"
                                                                error={Boolean(errors?.country)}
                                                            // helperText={errors?.country ? "This field is required" : ""}
                                                            />
                                                        )}
                                                        isOptionEqualToValue={(option, value) => option.key === value.key}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <Controller
                                                control={control}
                                                name="address1"
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="standard"
                                                        id="address1"
                                                        label="Address 1"
                                                        fullWidth
                                                        margin="normal"
                                                        {...field}
                                                        value={field.value}
                                                        onChange={(e) => { field.onChange(e.target.value) }}
                                                        error={Boolean(errors?.address1)}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div>
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
                                                        value={field.value}
                                                        onChange={(e) => { field.onChange(e.target.value) }}
                                                        error={Boolean(errors?.city)}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={12} md={6}>
                                        <div>
                                            <Controller
                                                control={control}
                                                name="state"
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        disabled={state?.length === 0}
                                                        options={state}
                                                        getOptionLabel={(option) => option.value}
                                                        value={state.find(option => option.key === field.value) || null}
                                                        onChange={(event, newValue) => {
                                                            field.onChange(newValue ? newValue.key : null);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                variant="standard"
                                                                {...params}
                                                                label="State"
                                                                error={Boolean(errors?.state)}
                                                            // helperText={errors?.state ? "This field is required" : ""}
                                                            />
                                                        )}
                                                        isOptionEqualToValue={(option, value) => option.key === value.key}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <Controller
                                                control={control}
                                                name="address2"
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="standard"
                                                        id="address2"
                                                        label="Address 2"
                                                        fullWidth
                                                        margin="normal"
                                                        {...field}
                                                        value={field.value}
                                                        onChange={(e) => { field.onChange(e.target.value) }}
                                                        error={Boolean(errors?.address2)}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <Controller
                                                control={control}
                                                name="zipCode"
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="standard"
                                                        id="zipCode"
                                                        label="Zip / Post Code"
                                                        fullWidth
                                                        margin="normal"
                                                        {...field}
                                                        value={field.value}
                                                        onChange={(e) => { field.onChange(e.target.value) }}
                                                        error={Boolean(errors?.zipCode)}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        )
                    }
                    {
                        activeStep === 1 && (
                            <Row>
                                <Col xs={12}>
                                    {/* Centered card area */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <div style={{ width: "400px" }}>
                                            <div className='my-3'>
                                                <Row>
                                                    <Col xs={12}>
                                                        <Typography sx={{ textAlign: "left" }} fontWeight={600} fontSize={18}>
                                                            Contact Person Information
                                                        </Typography>
                                                    </Col>
                                                </Row>
                                            </div>

                                            <div className='d-flex items-center'>
                                                <div style={{ display: "flex", justifyContent: "start", marginRight: 30 }}>
                                                    <label
                                                        htmlFor="contactPhotoInput"
                                                        style={{
                                                            width: 70,
                                                            height: 70,
                                                            borderRadius: "50%",
                                                            border: "2px dashed #d9d9d9",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            cursor: "pointer",
                                                            overflow: "hidden",
                                                            background: "#fafafa",
                                                        }}
                                                    >
                                                        {contactPhoto ? (
                                                            <img
                                                                src={contactPhoto}
                                                                alt="contact"
                                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            />
                                                        ) : (
                                                            <i className="fa-solid fa-camera" style={{ color: "#c8c8c8", fontSize: 18 }} />
                                                        )}
                                                        <input id="contactPhotoInput" type="file" accept="image/*" hidden onChange={handleContactPhoto} />
                                                    </label>
                                                </div>

                                                <Controller
                                                    control={control}
                                                    name="contactPerson"
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            variant="standard"
                                                            label="Contact Person"
                                                            fullWidth
                                                            margin="normal"
                                                            {...field}
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                            error={Boolean(errors?.contactPerson)}
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <Controller
                                                control={control}
                                                name="designation"
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="standard"
                                                        label="Designation / Post"
                                                        fullWidth
                                                        margin="normal"
                                                        {...field}
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        error={Boolean(errors?.designation)}
                                                    />
                                                )}
                                            />

                                            <div style={{ position: "relative" }}>
                                                <Controller
                                                    control={control}
                                                    name="contactEmail"
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            variant="standard"
                                                            label="Email ID"
                                                            fullWidth
                                                            margin="normal"
                                                            {...field}
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                            error={Boolean(errors?.contactEmail)}
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <div style={{ position: "relative" }}>
                                                <Controller
                                                    control={control}
                                                    name="contactPhone"
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            variant="standard"
                                                            label="Phone Number"
                                                            fullWidth
                                                            margin="normal"
                                                            {...field}
                                                            value={field.value}
                                                            onChange={(e) => {
                                                                const onlyDigits = e.target.value.replace(/[^0-9]/g, "");
                                                                field.onChange(onlyDigits);
                                                            }}
                                                            error={Boolean(errors?.contactPhone)}
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <Controller
                                                control={control}
                                                name="contactAddress"
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="standard"
                                                        label="Address"
                                                        fullWidth
                                                        multiline
                                                        rows={5}
                                                        margin="normal"
                                                        {...field}
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                control={control}
                                                name="note"
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="standard"
                                                        label="Note"
                                                        fullWidth
                                                        multiline
                                                        rows={5}
                                                        margin="normal"
                                                        {...field}
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )
                    }


                    <Row className='my-2'>
                        <Col>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 15 }}>
                                <Link href="/clientContact" component="a">
                                    <Button type='button' variant="contained" color="primary"><i className="far fa-times mr-2"></i>CANCEL</Button>
                                </Link>
                                {
                                    activeStep > 0 && (
                                        <Button type='button' variant="contained" color="primary" onClick={handleBack}><i className="far fa-long-arrow-left mr-2"></i>Back</Button>
                                    )
                                }
                                <Button type='submit' variant="contained" color="primary">
                                    {/* <i class="fa-solid fa-floppy-disk"></i> */}
                                    {activeStep === 1 ? "" : <i className="far fa-long-arrow-right mr-2"></i>}
                                    {activeStep === 1 ? "Submit" : "NEXT"}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </Box>
        </div>
    )
}

export default AddClient