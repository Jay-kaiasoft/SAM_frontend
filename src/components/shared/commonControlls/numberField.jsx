import React, { forwardRef, useImperativeHandle, useState } from "react";
import TextField from '@mui/material/TextField';
import {PatternFormat} from 'react-number-format';

const NumberField = forwardRef((props, ref) => {
    const [error, setError] = useState("");
    const handleChange = (event) => {
        if (props.index !== undefined && props.index !== null && props.index >= 0) {
            setError("");
            props.onChange(event, props.index);
        } else {
            setError("");
            props.onChange(event.target.name, event.target.value)
        }
    }

    const validateNumber = () => {
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
                const pair = current.split(":");
                switch (pair[0]) {
                    case "min":
                        if (props.value.replace(/ /g,"").length < pair[1]) {
                            setError(`${props.label} must be at least ${pair[1]} charactesr long`);
                            return false;
                        }
                        break;
                    case "max":
                        if (props.value.replace(/ /g,"").length > pair[1]) {
                            setError(`${props.label} must be no longer than ${pair[1]} charactesr long`);
                            return false;
                        }
                        break;
                    case "length":
                        let lengths = pair[1].split(",").map((e)=>parseInt(e));
                        console.log("")
                        if (!lengths.includes(props.value.replace(/ /g,"").length)) {
                            setError(`Length is not matched`);
                            return false;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return true;
    }
    const getValue = () => {
        return props.value;
    }
    useImperativeHandle(ref, () => {
        return {
            validateNumber: () => validateNumber(),
            getValue: () => getValue(),
            setError: (e) => setError(e)
        }
    })

    return (
        <div className="input-wrapper">
            <PatternFormat
                variant="standard"
                customInput={props.hasOwnProperty("textField")?props.textField:TextField}
                disabled={props.disabled}
                id={props.id}
                error={error.length > 0 || props.error}
                label={props.label}
                autoComplete={props.autoComplete}
                className="input-field"
                value={props.value}
                name={props.name}
                mask={props.mask}
                prefix={props.prefix}
                format={props.format || null}
                type={props.type}
                onChange={(event) => handleChange(event)}
                onBlur={props.onBlur}
                sx={props?.sx}
                InputProps={props?.InputProps}
                onFocus={props?.onFocus}
            />
            {/* {error && (
                <p className="error" style={{ color: 'red' }}>{error}</p>
            )} */}
        </div>
    )
})

NumberField.defaultProps = {
    id: "",
    name: "",
    type: "text",
    value: "",
    autoComplete: "off",
    validation: "",
    disabled: false,
    error: false,
    mask: '',

}


export default NumberField;