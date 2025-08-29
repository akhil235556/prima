import { CardHeader } from '@material-ui/core';
import { Close, Info } from '@material-ui/icons';
import React, { useLayoutEffect, useRef } from 'react';
import AutoComplete from '../../../../component/widgets/AutoComplete';
import Button from '../../../../component/widgets/button/Button';
import { CustomToolTip } from "../../../../component/widgets/CustomToolTip";
import NumberEditText from '../../../../component/widgets/NumberEditText';
import { OptionType } from '../../../../component/widgets/widgetsInterfaces';
import './FreightSlab.css';


interface FreightSlabProps {
    ruleData: any,
    editRule: any,
    freightData: any,
    freightRules: any,
    errors?: any,
}

const getToolTipData = (constraint: string) => {
    if (constraint.toLowerCase() === "weight") {
        return "In kg"
    } else {
        return "In meter"
    }
}

const FreightRules = (props: FreightSlabProps) => {
    const { ruleData, editRule, freightRules, errors } = props;
    const ruleId = useRef(0);

    useLayoutEffect(() => {
        if (!(ruleData && ruleData.length)) {
            editRule([{ id: ruleId.current }]);
            ruleId.current += 1
        }
    }, [ruleData, editRule])

    return (
        <div className="freight-slab-wrap">
            <CardHeader className="creat-contract-header"
                title="Rules"
                action={<Close onClick={() => {
                    editRule(undefined)
                }} />}
            />
            <div className="freight-slab-content">
                <div className="row custom-form-row align-items-end">
                    <div className="col-12">
                        {
                            ruleData && ruleData.map((item: any, index: number) => (
                                <div className="row align-items-end" key={item.id}>
                                    <div className="col-6 col-md-3 form-group slab-form">
                                        <AutoComplete
                                            label={"Constraint"}
                                            mandatory
                                            placeHolder={'Enter Constraint'}
                                            error={(errors[index] && errors[index].object) || ""}
                                            value={item.object}
                                            options={freightRules && freightRules.map((item: any) => ({
                                                label: item.object,
                                                value: item.object,
                                                data: item
                                            }))}
                                            onChange={(element: OptionType) => {
                                                const ruleObject = { ...ruleData[index], object: element }
                                                const newRule = [...ruleData];
                                                newRule[index] = ruleObject;
                                                editRule(newRule)
                                            }}
                                        />
                                    </div>
                                    <div className="col-6 col-md-3 form-group slab-form">
                                        <AutoComplete
                                            label={"Operators"}
                                            mandatory
                                            placeHolder={'Enter Operator'}
                                            error={(errors[index] && errors[index].operator) || ""}
                                            value={item.operator}
                                            // options={undefined}
                                            options={item &&
                                                item.object &&
                                                item.object.data &&
                                                item.object.data.operator.map((item: any) => ({
                                                    value: item,
                                                    label: item
                                                }))}
                                            onChange={(element: OptionType) => {
                                                const ruleObject = { ...ruleData[index], operator: element }
                                                const newRule = [...ruleData];
                                                newRule[index] = ruleObject;
                                                editRule(newRule)
                                            }}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <div className="row align-items-md-center align-items-end">
                                            <div className="col-7 col-md form-group slab-form">
                                                <NumberEditText
                                                    label={'Value'}
                                                    mandatory
                                                    maxLength={10}
                                                    placeholder={'Enter Value'}
                                                    error={(errors[index] && errors[index].value) || ""}
                                                    value={item.value}
                                                    onChange={(text: string) => {
                                                        const ruleObject = { ...ruleData[index], value: text }
                                                        const newRule = [...ruleData];
                                                        newRule[index] = ruleObject;
                                                        editRule(newRule)
                                                    }}
                                                    toolTip={() =>
                                                        <CustomToolTip
                                                            title={(item.object && item.object.value && getToolTipData(item.object.value)) || ""}
                                                            disableInMobile={"false"}
                                                            placement="top"
                                                        >
                                                            <Info className="blue-text info-icon" />
                                                        </CustomToolTip>
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-auto col-5 form-group add-button-wrapp">
                                                {
                                                    !item.preOperator ? (
                                                        <>
                                                            <Button
                                                                title="And"
                                                                buttonStyle="btn-blue and-or-btn mr-2"
                                                                leftIcon={''}
                                                                onClick={() => {
                                                                    const ruleObject = { ...ruleData[index], preOperator: 'and' }
                                                                    const newRule = [...ruleData, { id: ruleId.current }];
                                                                    ruleId.current += 1
                                                                    newRule[index] = ruleObject;
                                                                    editRule(newRule)
                                                                }}
                                                            />
                                                            <Button
                                                                title="Or"
                                                                buttonStyle="btn-blue and-or-btn mr-2"
                                                                leftIcon={''}
                                                                onClick={() => {
                                                                    const ruleObject = { ...ruleData[index], preOperator: 'or' }
                                                                    const newRule = [...ruleData, { id: ruleId.current }];
                                                                    ruleId.current += 1
                                                                    newRule[index] = ruleObject;
                                                                    editRule(newRule)
                                                                }}
                                                            />
                                                            {
                                                                index > 0 && index === ruleData.length - 1 && (
                                                                    <Button
                                                                        title=""
                                                                        buttonStyle="minus-btn"
                                                                        leftIcon={<Close />}
                                                                        onClick={() => {
                                                                            const newRules = ruleData.filter((rule: any) => rule.id !== item.id);
                                                                            newRules[index - 1] = { ...newRules[index - 1], preOperator: undefined }
                                                                            editRule(newRules);
                                                                        }}
                                                                    />
                                                                )
                                                            }
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                title={item.preOperator === "and" ? "And" : "Or"}
                                                                buttonStyle="btn-and-gray and-or-btn mr-4"
                                                                leftIcon={''}
                                                                onClick={() => {

                                                                }}
                                                            />
                                                            <Button
                                                                title=""
                                                                buttonStyle="minus-btn"
                                                                leftIcon={<Close />}
                                                                onClick={() => {
                                                                    const newRules = ruleData.filter((rule: any) => rule.id !== item.id);
                                                                    editRule(newRules);
                                                                }}
                                                            />
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }

                    </div>

                </div>


            </div>
        </div>
    )
}

export default FreightRules;
