import Chip from '@material-ui/core/Chip';
import NoSsr from '@material-ui/core/NoSsr';
import { createStyles, emphasize, makeStyles, Theme } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import Select, { components } from 'react-select';
import { MultiValueProps } from 'react-select/src/components/MultiValue';
import { ValueType } from 'react-select/src/types';
import "./MultiSelect.css";
import { OptionType } from './widgetsInterfaces';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            minHeight: 45,
            minWidth: 290,
        },
        input: {
            display: 'flex',
            padding: 0,
            height: 'auto',
        },
        valueContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            flex: 1,
            alignItems: 'center',
            overflow: 'hidden',
        },
        chip: {
            margin: theme.spacing(0.5, 0.25),
        },
        chipFocused: {
            backgroundColor: emphasize(
                theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
                0.08,
            ),
        },
        noOptionsMessage: {
            padding: theme.spacing(1, 2),
        },
        singleValue: {
            fontSize: 16,
        },
        placeholder: {
            position: 'absolute',
            left: 2,
            bottom: 6,
            fontSize: 16,
        },
        paper: {
            position: 'absolute',
            zIndex: 1,
            marginTop: theme.spacing(1),
            left: 0,
            right: 0,
        },
        divider: {
            height: theme.spacing(2),
        },
    }),
);

interface MultiSelectProps {
    placeHolder: string,
    label: string,
    error?: string,
    isLoading?: boolean
    onChange: Function,
    options: Array<OptionType> | undefined,
    value: ValueType<OptionType>
    icon?: any,
    renderOption?: any,
    renderValueHolder?: any,
    showCustomView?: boolean,
    isDisabled?: boolean,
    mandatory?: boolean,
    maxLimit?: number
    maxLimitMessage?: string
}

export default function MultiSelect(props: MultiSelectProps) {
    const { error, value, mandatory, renderOption, maxLimit, maxLimitMessage } = props;
    const classes = useStyles();
    const [options, setOptions] = useState<any>();
    useEffect(() => {
        setOptions(props.options)
    }, [setOptions, props.options])

    const Menu = (props: any) => {
        const optionSelectedLength = props.getValue().length || 0;
        return (
            <components.Menu {...props}>
                {!maxLimit || optionSelectedLength < maxLimit ? (
                    props.children
                ) : (
                    <div style={{ margin: 15 }}>{maxLimitMessage}</div>
                )}
            </components.Menu>
        );
    };

    function MultiValue(props: MultiValueProps<OptionType>) {
        return (
            <div className="multi-select-chip">
                <Chip
                    tabIndex={-1}
                    label={props.children}
                    className={clsx(props.selectProps.classes.chip, {
                        [props.selectProps.classes.chipFocused]: props.isFocused,
                    })}
                    onDelete={props.removeProps.onClick}
                    deleteIcon={<CancelIcon {...props.removeProps} />}
                />
            </div>
        );
    }

    const handleChangeMulti = (value: ValueType<OptionType>) => {
        props.onChange(value);
    };

    const myInput = useRef<any>();
    useEffect(() => {
        error && myInput.current && myInput.current.focus();
    }, [error]);
    return (
        <div className="autocomplete-wrap">
            <label htmlFor="">{props.label}
                {mandatory && <span className="mandatory-flied">*</span>}
            </label>
            <NoSsr>
                <Select
                    ref={myInput}
                    className="select-container"
                    classes={classes}
                    classNamePrefix="select"
                    inputId="react-select-multiple"
                    isClearable={false}
                    TextFieldProps={{
                        label: 'Countries',
                        InputLabelProps: {
                            htmlFor: 'react-select-multiple',
                            shrink: true,
                        },
                    }}
                    placeholder={props.placeHolder}
                    options={options}
                    components={renderOption ? { MultiValue, Option: renderOption, Menu } : { MultiValue, Menu }}
                    isDisabled={props.isDisabled}
                    value={value}
                    onChange={handleChangeMulti}
                    isMulti
                    onInputChange={(newValue) => {
                        var optionList = props.options && props.options.filter((element: any) => {
                            try {
                                return (element.label).toLocaleLowerCase().includes(newValue.toLocaleLowerCase())
                            } catch (error) {
                                return element
                            }
                        });
                        setOptions(optionList);
                    }}
                />
            </NoSsr>
            {error && <label className="error"
            >{error}</label>}
        </div>
    );
}
