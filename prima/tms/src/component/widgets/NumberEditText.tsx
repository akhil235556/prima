import { TextField } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';
import NumberFormat from 'react-number-format';
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
    allowNegative?: boolean,
    decimalScale?: number
    disabled?: boolean,
    decimalSeparator?: boolean
    mandatory?: boolean,
    onBlur?: any
    allowZero?: boolean
}

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { value: string } }) => void;
    maxLength: number,
    allowNegative?: boolean,
    decimalScale?: number
    decimalSeparator?: boolean,
    allowZero?: boolean
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
    const { inputRef, onChange, maxLength, allowNegative, decimalScale, decimalSeparator, allowZero, ...other } = props;
    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                if (allowZero) {
                    onChange({
                        target: {
                            value: values.floatValue ? (values.floatValue + "") : values.floatValue === 0 ? (values.floatValue + "") : ""
                        },
                    });
                } else {
                    onChange({
                        target: {
                            value: values.floatValue ? (values.floatValue + "") : ""
                        },
                    });
                }

            }}
            decimalScale={decimalScale}
            decimalSeparator={decimalSeparator}
            isAllowed={(values) => {
                const { value, } = values;
                return value === "" || value.length <= maxLength;
            }}
            allowNegative={allowNegative}
            isNumericString
        // prefix="$"
        />
    );
}

const NumberEditText = (props: EditTextProps) => {
    const { allowNegative = false, maxLength, decimalScale, disabled, error, decimalSeparator, mandatory, allowZero, onBlur } = props
    const myInput = useRef<any>();
    useEffect(() => {
        error && myInput.current && myInput.current.focus();
    }, [error]);
    return (

        <div className="input-wrap">
            <label className="d-flex align-items-center">
                <span>
                    {props.label && props.label}
                    {mandatory && <span className="mandatory-flied">*</span>}
                </span>
                <span>{props.toolTip && props.toolTip()}</span>
            </label>
            <TextField
                inputRef={myInput}
                placeholder={props.placeholder}
                value={props.value || ''}
                // required={props.required || false}
                disabled={disabled}
                helperText={error || ""}
                onBlur={() => { onBlur && onBlur() }}
                onChange={(event: any) => {
                    props.onChange(event.target.value);
                }}
                InputProps={{
                    inputComponent: NumberFormatCustom as any,
                    inputProps: {
                        maxLength: maxLength,
                        allowNegative: allowNegative,
                        decimalScale: decimalScale,
                        decimalSeparator: decimalSeparator,
                        allowZero: allowZero,
                        inputMode: 'decimal',
                    }
                }}
            />
        </div>

    );

}

export default NumberEditText;