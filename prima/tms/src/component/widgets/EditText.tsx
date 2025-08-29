import { TextField } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';
import "./EditText.css";

interface EditTextProps {
    label?: string
    placeholder: string
    value: string | number | undefined
    onChange: Function
    validator?: RegExp | undefined
    maxLength: number
    type?: string
    name?: string
    error?: any
    required?: boolean
    toolTip?: Function
    disabled?: boolean
    endAdornment?: any
    autoCaps?: boolean,
    mandatory?: boolean,
}

const EditText = (props: EditTextProps) => {
    const { disabled, error, endAdornment, autoCaps, mandatory } = props;
    const myInput = useRef<any>();
    useEffect(() => {
        error && myInput.current && myInput.current.focus();
    }, [error]);

    return (
        <div className="input-wrap">
            <div className="d-flex align-items-center">
                <label>
                    <span>
                        {props.label}
                        {mandatory && <span className="mandatory-flied">*</span>}
                    </span>
                    <span>{props.toolTip && props.toolTip()}</span>
                </label>

            </div>
            <TextField
                inputRef={myInput}
                name={props.name}
                // error={props.error || ""}
                placeholder={props.placeholder}
                value={props.value || ''}
                required={props.required || false}
                type={props.type || "text"}
                disabled={disabled}
                helperText={error || ""}
                InputProps={{
                    endAdornment: endAdornment,
                }}
                inputProps={{
                    autoComplete: 'new-password',
                    form: {
                        autoComplete: 'off',
                    },
                }}

                onChange={(event: any) => {
                    if (event.target.value.length <= props.maxLength) {
                        props.onChange(autoCaps ? event.target.value.toString().toUpperCase() : event.target.value);
                    }
                }}        
            />
        </div>
        
    );
}

export default EditText;