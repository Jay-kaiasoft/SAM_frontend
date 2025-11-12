import { useState } from "react";
import {
  Autocomplete,
  Button,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Row, Col, Table } from "reactstrap";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { QontoConnector, QontoStepIcon } from "../../../assets/commonFunctions";
import AddMilestonesModel from "./addMilestonesModel";

const AddProject = () => {
  const steps = ["1", "2", "3"];
  const [activeStep, setActiveStep] = useState(0);
  const [openModel, setOpenModel] = useState(false)

  const [projectLogo, setProjectLogo] = useState(null);
  const [projectDocs, setProjectDocs] = useState([]);

  const handleCloseModel = () => {
    setOpenModel(false)
  }

  const handleOpenModel = () => {
    setOpenModel(true)
  }

  const handleProjectLogo = (e) => {
    const f = e.target.files?.[0];
    if (f) setProjectLogo(URL.createObjectURL(f));
  };

  const handleProjectDocs = (e) => {
    const files = Array.from(e.target.files || []);
    setProjectDocs(files);
  };

  const clientCompany = [
    { key: "1", value: "Company 1" },
    { key: "2", value: "Company 2" },
    { key: "3", value: "Company 3" },
  ];

  const projectType = [
    { key: "1", value: "Marketing" },
    { key: "2", value: "Development" },
    { key: "3", value: "Design" },
  ];

  const projectPriority = [
    { key: "1", value: "High" },
    { key: "2", value: "Medium" },
    { key: "3", value: "Low" },
  ];

  const projectStatus = [
    { key: "1", value: "Planning" },
    { key: "2", value: "In Progress" },
    { key: "3", value: "Completed" },
  ];

  const members = [
    { id: 1, name: "Ava Patel" },
    { id: 2, name: "Noah Khan" },
    { id: 3, name: "Zoe Smith" },
  ];

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: "",
      projectDiscription: "",
      clientCompany: null,
      startDate: null,
      endDate: null,
      assignMember: [],
      projectType: null,
      projectPriority: null,
      projectStatus: null,
      projectBudget: "",
      note: "",
    },
  });

  const handleNext = (data) => {
    console.log("step-1 data", data);
    setActiveStep((s) => s + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="midleMain">
      <Typography fontWeight={600} fontSize={24} sx={{ ml: 5 }}>
        Add Project
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

      <Box className="py-2" sx={{ paddingX: { sm: 10, lg: 20, xxl: 30 } }}>
        <form onSubmit={handleSubmit(handleNext)}>
          {activeStep === 0 && (
            <>
              <Row>
                <Col xs={12}>
                  <Typography fontWeight={600} fontSize={18}>
                    Project Details
                  </Typography>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                  <Controller
                    control={control}
                    name="projectName"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="standard"
                        label="Project Name"
                        fullWidth
                        margin="normal"
                        error={Boolean(errors.projectName)}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="clientCompany"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Autocomplete
                        options={clientCompany}
                        getOptionLabel={(o) => o?.value ?? ""}
                        value={clientCompany.find((o) => o.key === field.value) || null}
                        onChange={(_, v) => field.onChange(v?.key ?? null)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Client Company"
                            error={Boolean(errors.clientCompany)}
                            margin="normal"
                          />
                        )}
                        isOptionEqualToValue={(o, v) => o.key === v.key}
                      />
                    )}
                  />

                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Controller
                      control={control}
                      name="startDate"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          inputFormat="MM/dd/yyyy hh:mm a"
                          label="Start Date"
                          slotProps={{ textField: { variant: "standard", fullWidth: true, margin: "normal", error: Boolean(errors.startDate) } }}
                        />
                      )}
                    />
                  </LocalizationProvider>

                  <Controller
                    control={control}
                    name="assignMember"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={members}
                        getOptionLabel={(o) => o.name}
                        value={members.filter((m) => field.value?.includes(m.id))}
                        onChange={(_, v) => field.onChange(v.map((x) => x.id))}
                        renderInput={(params) => (
                          <TextField {...params} variant="standard" label="Assign Member" margin="normal" error={Boolean(errors.clientCompany)} />
                        )}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="projectType"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Autocomplete
                        options={projectType}
                        getOptionLabel={(o) => o.value}
                        value={projectType.find((o) => o.key === field.value) || null}
                        onChange={(_, v) => field.onChange(v?.key ?? null)}
                        renderInput={(params) => (
                          <TextField {...params} variant="standard" label="Project Type" margin="normal" error={Boolean(errors.projectType)} />
                        )}
                        isOptionEqualToValue={(o, v) => o.key === v.key}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="projectStatus"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Autocomplete
                        options={projectStatus}
                        getOptionLabel={(o) => o.value}
                        value={projectStatus.find((o) => o.key === field.value) || null}
                        onChange={(_, v) => field.onChange(v?.key ?? null)}
                        renderInput={(params) => (
                          <TextField {...params} variant="standard" label="Project Status" margin="normal" error={Boolean(errors.projectStatus)} />
                        )}
                        isOptionEqualToValue={(o, v) => o.key === v.key}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="projectBudget"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="standard"
                        label="Project Budget"
                        fullWidth
                        margin="normal"
                        inputMode="decimal"
                        error={Boolean(errors.projectBudget)}
                      />
                    )}
                  />
                </Col>

                <Col xs={12} md={6}>
                  <Controller
                    control={control}
                    name="projectDiscription"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="standard"
                        label="Project Discription"
                        multiline
                        rows={5}
                        fullWidth
                        margin="none"
                        sx={{ marginTop: 0.2 }}
                        error={Boolean(errors.projectDiscription)}
                      />
                    )}
                  />

                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Controller
                      control={control}
                      name="endDate"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="End Date"
                          inputFormat="MM/dd/yyyy hh:mm a"
                          slotProps={{ textField: { variant: "standard", fullWidth: true, margin: "none", error: Boolean(errors.endDate) } }}
                          sx={{ marginTop: 3 }}
                        />
                      )}
                    />
                  </LocalizationProvider>

                  <Controller
                    control={control}
                    name="projectPriority"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Autocomplete
                        options={projectPriority}
                        getOptionLabel={(o) => o.value}
                        value={projectPriority.find((o) => o.key === field.value) || null}
                        onChange={(_, v) => field.onChange(v?.key ?? null)}
                        renderInput={(params) => (
                          <TextField {...params}
                            variant="standard"
                            label="Project Priority"
                            margin="none"
                            sx={{ marginTop: 3 }}
                            error={Boolean(errors.projectPriority)} />
                        )}
                        isOptionEqualToValue={(o, v) => o.key === v.key}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="note"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="standard"
                        label="Notes or Comments"
                        multiline
                        rows={4}
                        fullWidth
                        margin="none"
                        sx={{ marginTop: 3.7 }}
                      />
                    )}
                  />
                </Col>
              </Row>
            </>
          )}
          {activeStep === 1 && (
            <>
              <Row>
                <Col xs={12}>
                  <Typography fontWeight={600} fontSize={18}>
                    Project Attachments
                  </Typography>
                </Col>
              </Row>

              <Box mt={1} display="grid" gap={2} sx={{ maxWidth: 520, mx: "auto" }}>
                <label
                  htmlFor="projectLogoInput"
                  style={{
                    height: 120,
                    border: "2px dashed #d9d9d9",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: "#fafafa",
                    overflow: "hidden",
                  }}
                >
                  {projectLogo ? (
                    <img
                      src={projectLogo}
                      alt="Project logo preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Typography sx={{ color: "#9e9e9e", fontWeight: 600 }}>
                      Upload Project Logo / Image here
                    </Typography>
                  )}
                  <input
                    id="projectLogoInput"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleProjectLogo}
                  />
                </label>

                <label
                  htmlFor="projectDocsInput"
                  style={{
                    height: 120,
                    border: "2px dashed #d9d9d9",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: "#fafafa",
                  }}
                >
                  <Typography sx={{ color: "#9e9e9e", fontWeight: 600, textAlign: "center" }}>
                    Click to Upload Project Document / Attachments
                  </Typography>
                  <input
                    id="projectDocsInput"
                    type="file"
                    multiple
                    hidden
                    onChange={handleProjectDocs}
                  />
                </label>

                {/* Small file list (optional) */}
                {projectDocs.length > 0 && (
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Selected files:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {projectDocs.map((f, i) => (
                        <li key={i} style={{ color: "#616161", fontSize: 14 }}>{f.name}</li>
                      ))}
                    </ul>
                  </Box>
                )}
              </Box>
            </>
          )}

          {activeStep === 2 && (
            <>
              <Row>
                <Col xs={12}>
                  <Typography fontWeight={600} fontSize={18}>
                    Project Milestones
                  </Typography>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="icon-wrapper w-100 my-2 pt-3">
                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add Milestones" onClick={handleOpenModel}>
                      <i className="far fa-plus-square"></i>
                      <div className="bg-green"></div>
                    </Link>
                  </div>

                  <div className="table-content-wrapper w-100">
                    <div className="contact-table-div">
                      <Table striped>
                        <thead>
                          <tr>
                            <th>Milestone</th>
                            <th>Status</th>
                            <th>Assign To</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td colSpan={7} className="text-center">No Milestones Found.</td></tr>
                        </tbody>
                      </Table>
                    </div>

                    <Row className="mt-2">
                      <Col xs={6}>
                        <span className="align-middle" style={{ fontWeight: "bold" }}>
                          {`Total Projects : 0 | Selected : 0`}
                        </span>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </>
          )}
          <Row className="my-2">
            <Col>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 15 }}>
                <Link href="/projects" component="a">
                  <Button type='button' variant="contained" color="primary"><i className="far fa-times mr-2"></i>CANCEL</Button>
                </Link>
                {
                  activeStep > 0 && (
                    <Button type='button' variant="contained" color="primary" onClick={handleBack}><i className="far fa-long-arrow-left mr-2"></i>Back</Button>
                  )
                }
                <Button type='submit' variant="contained" color="primary">
                  {/* <i class="fa-solid fa-floppy-disk"></i> */}
                  {activeStep === 2 ? <i class="far fa-floppy-disk"></i> : <i className="far fa-long-arrow-right mr-2"></i>}
                  {activeStep === 2 ? "Submit" : "NEXT"}
                </Button>
              </div>
            </Col>
          </Row>
        </form>
        <AddMilestonesModel open={openModel} onClose={handleCloseModel} />
      </Box>
    </div>
  );
};

export default AddProject;
