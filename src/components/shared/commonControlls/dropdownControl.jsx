import React, { forwardRef, useImperativeHandle, useState } from "react";
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200,
        },
    },
};

const DropDownControls = forwardRef((props, ref) => {
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    const handleChange = (event, value) => {
        if (props.index !== undefined && props.index !== null && props.index >= 0) {
            setError("");
            props.onChange(event, props.index);
        } else {
            setError("");
            if(props.multiple){
                if(props.open !== null){
                    if(value.props.value === "all" || event.target.value.length === 0) {
                        props.onChange(event.target.name, ["all"])
                    } else {
                        if (event.target.value.indexOf("all") > -1) {
                            event.target.value.splice(event.target.value.indexOf("all"), 1);
                        }
                        props.onChange(event.target.name, event.target.value);
                    }
                } else {
                props.onChange(event.target.name, event.target.value)
                }
            } else {
                props.onChange(event.target.name, value.props.value)
            }
        }

    }

    const handleOpen = ()=>{
        if(props.open === null) {
            setOpen(true);
        } else {
            props.onOpen();
        }
    }

    const handleClose = ()=>{
        if(props.open === null) {
            setOpen(false);
        } else {
            props.onClose();
        }
    }

    const validateDropDown = () => {
        if (props.validation) {
            const rules = props.validation.split("|");
            for (let i = 0; i < rules.length; i++) {
                const current = rules[i];
                if (current === "required") {
                    if (!props.value) {
                        setError(props.label + " is required");
                        return false
                    }
                }
            }
        }
        return true;
    }

    useImperativeHandle(ref, () => {
        return {
            validateDropDown: () => validateDropDown()
        }
    })
    return (
        <div>
            <FormControl variant="standard" className="w-100" error={error.length > 0}>
                <InputLabel id="demo-mutiple-name-label">{props.label}</InputLabel>
                <Select
                    labelId="demo-mutiple-name-label"
                    name={props.name}
                    id="demo-mutiple-name"
                    value={props?.value || ""}
                    error={error.length > 0}
                    onChange={handleChange}
                    input={<Input />}
                    MenuProps={MenuProps}
                    disabled={props.disabled}
                    multiple={props.multiple}
                    open={props.open === null?open:props.open}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    className={props.className}
                    onClick={props?.onClick}
                >
                    {props.dropdownList.map((ele,i) => (
                        <MenuItem key={i} value={ele.key}>
                            {ele.value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
})

DropDownControls.defaultProps = {
    multiple:false,
    open: null,
    className: ""
}


export default DropDownControls;