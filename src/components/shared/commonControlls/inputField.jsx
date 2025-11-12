import React, { forwardRef, useImperativeHandle, useState } from "react";
import TextField from '@mui/material/TextField';

const InputField = forwardRef((props, ref) => {
    const [error, setError] = useState("");

    const handleChange = (event, i) => {
        if (props.index !== undefined && props.index !== null && props.index >= 0) {
            setError("");
            props.onChange(event, props.index);
        } else {
            if (event.target.value.trim() === "") {
                event.target.value="";
            } else {
                setError("");
            }
            props.onChange(event.target.name, event.target.value)
        }
    }
    const validate = () => {
        if (props.validation) {
            const rules = props.validation.split("|");
            for (let i = 0; i < rules.length; i++) {
                const current = rules[i];
                if (current === "required") {
                    if (!props.value.trim()) {
                        setError(props.label + " is required");
                        return false
                    }
                }
                const pair = current.split(":")
                switch (pair[0]) {
                    case "min":
                        if (props.value.length < pair[1]) {
                            setError(`This field must be at least ${pair[1]} charactesr long`);
                            return false
                        }
                        break;
                    case "max":
                        if (props.value.length > pair[1]) {
                            setError(`This field must be no longer than ${pair[1]} charactesr long`);
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

    useImperativeHandle(ref, () => {
        return {
            validate: () => validate(),
            setError: (e) => setError(e)
        }
    })
    return (
        <div className="input-wrapper">
            <TextField
                variant="standard"
                placeholder={props.placeholder}
                disabled={props.disabled}
                id={props.id}
                error={error.length > 0}
                label={props.label}
                name={props.name}
                onChange={(event) => handleChange(event)}
                type={props.type}
                value={props.value}
                autoComplete={props.autoComplete}
                className={`input-field ${props?.className}`}
                multiline={props?.multiline}
                minRows={props?.minRows}
                required={props?.required}
                onBlur={props?.onBlur}
                onKeyDown={props?.onKeyDown}
                InputProps={props?.InputProps}
                sx={props?.sx}
                onFocus={props?.onFocus}
            />
            {/* {error && (
                <p className="error" style={{ color: 'red' }}>{error}</p>
            )} */}
        </div>
    )
})

InputField.defaultProps = {
    id: "",
    name: "",
    type: "text",
    value: "",
    autoComplete: "off",
    validation: "",
    disabled: false,
    error: false,
    required: false
}
export default InputField;