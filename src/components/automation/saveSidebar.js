import React from 'react';
import { Button, Drawer, } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { websiteColor } from '../../config/api';

const SaveSidebar = (props) => {
    const { startModal, startingPoint, submitSaveModal } = props;
    const [campData,] = React.useState(["Send Campaign", "Link Clicked"]);
    const [camp, setCamp] = React.useState("");
    const [name, setName] = React.useState("")
    return (
        <Drawer open={startModal} anchor={'right'} className="ComponentSidebarWrapper">
            <div style={{ textAlign: 'right', width: "25vw" }}>
            </div><div style={{ padding: '100px 20px 20px 20px' }}>
                <p style={{ margin: '0px', fontSize: '15px', fontWeight: "bold", color: websiteColor }}>Save Value</p>
                {/* <p style={{ margin: '0px' }}>Campaign</p> */}
                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-standard-label">Starting Point</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        onChange={(e) => setCamp(e.target.value)}
                        label="Campaign"
                        value={startingPoint.label}
                        defaultValue={startingPoint.label}
                    >
                        {
                            campData.map(item => {
                                return <MenuItem value={item}>{item}</MenuItem>
                            })
                        }
                    </Select>
                    <br />
                    <TextField id="filled-basic" label="Enter Name" variant="filled" value={name} onChange={(e) => setName(e.target.value)} />
                </FormControl>
                <br />
                <br />
                <div style={{ display: "flex", justifyContent: "space-evenly", width: "100%", margin: "10px 0 0 0" }}>
                    <Button variant="contained" onClick={() => submitSaveModal({ startingPoint, name })}>SUBMIT</Button>
                </div>
            </div>
        </Drawer>
    );
}
export default SaveSidebar;
