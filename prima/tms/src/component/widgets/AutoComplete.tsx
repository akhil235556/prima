import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import Select, { createFilter } from 'react-select';
import { components } from 'react-select/';
import { OptionProps } from 'react-select/src/components/Option';
import { SingleValueProps } from 'react-select/src/components/SingleValue';
import { ValueType } from 'react-select/src/types';
import "./AutoComplete.css";
import { OptionType } from './widgetsInterfaces';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
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

    }),
);

const { Option, SingleValue } = components;


interface AutoCompleteProps {
    placeHolder: string,
    label: string,
    error?: string,
    isLoading?: boolean
    onChange: Function,
    options: OptionType[] | undefined,
    value: ValueType<OptionType>
    icon?: any,
    renderOption?: any,
    renderValueHolder?: any,
    showCustomView?: boolean,
    defaultValue?: ValueType<OptionType>,
    isDisabled?: boolean,
    mandatory?: boolean,
    name?: string,
    toolTip?: Function
    isClearable?: boolean,
    isShowAll?: boolean,
    menuPortalTarget?: any,
    labelStyle?: any;
    isSearchable?: boolean,
    noOptionsMessage?: (obj: { inputValue: string }) => string | null;

}

export default function AutoComplete(props: AutoCompleteProps) {
    const { error, mandatory, isClearable, isShowAll, menuPortalTarget, labelStyle, isSearchable } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [options, setOptions] = useState<any>();
    useEffect(() => {
        if ((props.options && props.options.length <= 10) || isShowAll) {
            setOptions(props.options)
        } else if (props.options && props.options.length > 10) {
            setOptions(props.options.slice(0, 10))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setOptions, props.options])


    function handleChangeSingle(value: ValueType<OptionType>) {
        myInput.current && myInput.current.blur();
        props.onChange(value);
    }

    const selectStyles = {
        input: (base: CSSProperties) => ({
            ...base,
            color: theme.palette.text.primary,
            '& input': {
                font: 'inherit',
            },
        }),
    };


    const customOption = (optionProps: OptionProps<OptionType>) => {
        return (
            <Option {...optionProps}>
                {(props.showCustomView && props.renderOption && props.renderOption(optionProps.data)) || optionProps.data.label}
            </Option>
        );
    }


    const customSingleValue = (valueProps: SingleValueProps<OptionType>) => {
        return (
            <SingleValue {...valueProps}>
                {(props.showCustomView && props.renderValueHolder && props.renderValueHolder(valueProps)) || valueProps.children}
            </SingleValue>
        );
    }

    const myInput = useRef<any>();
    useEffect(() => {
        error && myInput.current && myInput.current.focus();
    }, [error]);

    return (
        <div className="autocomplete-wrap">
            <label htmlFor="" className={labelStyle ? labelStyle : "d-flex align-items-center"}>{props.label}
                {mandatory && <span className="mandatory-flied">*</span>}
                <span>{props.toolTip && props.toolTip()}</span>
            </label>
            <Select
                menuPlacement='auto'
                ref={myInput}
                className="select-container"
                menuPortalTarget={menuPortalTarget}
                classes={classes}
                styles={selectStyles}
                // inputId="react-select"
                isClearable={isClearable}
                classNamePrefix="select"
                filterOption={
                    createFilter({
                        ignoreAccents: false,
                        ignoreCase: true,
                    })
                }
                ignoreAccents={false}
                isLoading={props.isLoading}
                isSearchable={isSearchable === false ? isSearchable : true}
                backspaceRemovesValue={true}
                placeholder={props.placeHolder}
                options={options}
                name={props.name || ''}
                isDisabled={props.isDisabled}
                components={{
                    Option: customOption,
                    SingleValue: customSingleValue
                }}
                defaultValue={props.defaultValue}
                value={(props.value && props.value) || null}
                onInputChange={(newValue) => {
                    var optionList = isShowAll ? props.options && props.options.filter((element: any) => {
                        try {
                            return (element.label).toLocaleLowerCase().includes(newValue.toLocaleLowerCase())
                        } catch (error) {
                            return element
                        }

                    }) : props.options && props.options.filter((element: any) => {
                        try {
                            return (element.label).toLocaleLowerCase().includes(newValue.toLocaleLowerCase())
                        } catch (error) {
                            return element
                        }

                    }).slice(0, 10);
                    setOptions(optionList);
                }}
                onChange={handleChangeSingle}
                noOptionsMessage={props.noOptionsMessage}
            />
            {error && <label className="error"

            >{error}</label>}
        </div>
    );


}
