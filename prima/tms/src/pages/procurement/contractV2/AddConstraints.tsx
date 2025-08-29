import { Card, CardContent } from '@material-ui/core';
import { Add, Close, Delete } from "@material-ui/icons";
import React from "react";
import { constraintName, from, operator, to, type, uom, ValueLabel, valueType, variableName } from "../../../base/constant/MessageUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import Button from "../../../component/widgets/button/Button";
import NumberEditText from '../../../component/widgets/NumberEditText';
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import "./AddConstraints.css";

interface AddConstraintsProps {
    contractDetails: any;
    constraints: any;
    userParams: any;
    setUserParams: any;
    error: any;
    setError: any;
}

const AddConstraints = (props: AddConstraintsProps) => {

    const { constraints, userParams, setUserParams, error, setError } = props;

    function addSlab(index: any) {
        userParams[index].slab.push({});
        setUserParams([...userParams]);
    }

    function removeSlab(constraintIndex: any, slabIndex: any) {
        userParams[constraintIndex].slab.splice(slabIndex, 1);
        setUserParams([...userParams]);
    }

    function removeConstraint(index: any) {
        error.splice(index, 1);
        userParams.splice(index, 1);
        setUserParams([...userParams]);
        setError([...error]);
    }

    function setValues(index: number, key: any, element: any) {
        if (key === "valueType") {
            userParams[index] = {
                constraintName: userParams?.[index]?.constraintName,
                constraintType: userParams?.[index]?.constraintType
            }
        }
        if (element?.value === "Slab") {
            userParams[index].slab = [{}];
        }
        userParams[index][key] = element;
        delete error?.[index]?.[key];
        setError([...error]);
        setUserParams([...userParams]);
    }

    function setSlabValues(constraintIndex: number, slabIndex: any, key: any, element: any) {
        userParams[constraintIndex].slab[slabIndex][key] = element;
        delete error[constraintIndex]?.slab?.[slabIndex]?.[key];
        setError([...error]);
        setUserParams([...userParams]);
    }

    return (
        <div>
            {
                userParams?.map((constraint: any, index: any) => {
                    return (
                        <Card key={index} className="creat-contract-wrapp creat-wrapp">
                            <div className="billing-info-header">
                                <h4>Constraints</h4>
                                <div className="pdf-button-wrapp">
                                    <Button
                                        buttonStyle="btn-orange delete-btn"
                                        title="Delete"
                                        leftIcon={<Delete />}
                                        onClick={() => removeConstraint(index)}
                                    />
                                </div>
                            </div>

                            <CardContent className="creat-contract-content">
                                <div className="custom-form-row row">
                                    <div className="col-md-3 billing-group col-6">
                                        <AutoComplete
                                            label={constraintName}
                                            placeHolder={constraintName}
                                            options={constraints}
                                            mandatory
                                            error={error?.[index]?.constraintName}
                                            value={constraint?.constraintName}
                                            onChange={(element: OptionType) => {
                                                if (element?.label !== constraint?.constraintName?.label) {
                                                    userParams[index] = {
                                                        constraintName: element
                                                    }
                                                    setUserParams([...userParams]);
                                                }
                                                delete error?.[index]?.constraintName;
                                                setError([...error]);
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <AutoComplete
                                            label={type}
                                            placeHolder={type}
                                            options={constraint?.constraintName?.data?.constraintTypes}
                                            mandatory
                                            error={error?.[index]?.constraintType}
                                            value={constraint?.constraintType}
                                            onChange={(element: OptionType) => {
                                                setValues(index, "constraintType", element);
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <AutoComplete
                                            label={valueType}
                                            placeHolder={valueType}
                                            options={constraint?.constraintName?.data?.valueType}
                                            mandatory
                                            error={error?.[index]?.valueType}
                                            value={constraint?.valueType}
                                            onChange={(element: OptionType) => {
                                                if (element?.label !== constraint?.valueType?.label) {
                                                    setValues(index, "valueType", element);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <AutoComplete
                                            label={variableName}
                                            placeHolder={variableName}
                                            options={constraint?.valueType?.variableName}
                                            mandatory
                                            error={error?.[index]?.variableName}
                                            value={constraint?.variableName}
                                            onChange={(element: OptionType) => {
                                                setValues(index, "variableName", element);
                                            }}
                                        />
                                    </div>

                                    {constraint?.valueType?.value === "Slab" ?
                                        constraint?.slab?.map((item: any, idx: any) => {
                                            return (
                                                <div key={idx} className="bg-grey--light">
                                                    <div className="custom-form-row row d-flex">
                                                        <div className="col-md-2 billing-group">
                                                            <NumberEditText
                                                                label={from}
                                                                placeholder={"Lane KM"}
                                                                maxLength={10}
                                                                mandatory
                                                                allowZero={false}
                                                                error={error[index]?.slab?.[idx]?.slabStart}
                                                                value={item?.slabStart}
                                                                onChange={(text: any) => {
                                                                    setSlabValues(index, idx, "slabStart", text);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-md-2 billing-group">
                                                            <NumberEditText
                                                                label={to}
                                                                placeholder={"Lane KM"}
                                                                maxLength={10}
                                                                allowZero={false}
                                                                mandatory
                                                                error={error[index]?.slab?.[idx]?.slabEnd}
                                                                value={item?.slabEnd}
                                                                onChange={(text: any) => {
                                                                    setSlabValues(index, idx, "slabEnd", text);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-md-3 billing-group">
                                                            <AutoComplete
                                                                label={operator}
                                                                placeHolder={operator}
                                                                options={constraint?.constraintName?.data?.operators}
                                                                mandatory
                                                                error={error[index]?.slab?.[idx]?.operator}
                                                                value={item?.operator}
                                                                onChange={(element: OptionType) => {
                                                                    setSlabValues(index, idx, "operator", element);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-md-2 billing-group">
                                                            <NumberEditText
                                                                allowZero={false}
                                                                label={ValueLabel}
                                                                placeholder={ValueLabel}
                                                                mandatory
                                                                maxLength={10}
                                                                error={error[index]?.slab?.[idx]?.slabRate}
                                                                value={item?.slabRate}
                                                                onChange={(text: any) => {
                                                                    setSlabValues(index, idx, "slabRate", text);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-md-2 billing-group ">
                                                            <AutoComplete
                                                                label={uom}
                                                                placeHolder={uom}
                                                                options={constraint?.valueType?.uom}
                                                                mandatory
                                                                error={error[index]?.slab?.[idx]?.uom}
                                                                value={item?.uom}
                                                                onChange={(element: OptionType) => {
                                                                    setSlabValues(index, idx, "uom", element);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-md-1 billing-group ">
                                                            <Button
                                                                buttonStyle={idx === constraint?.slab?.length - 1 ? "add-btn" : "minus-btn"}
                                                                leftIcon={idx === constraint?.slab?.length - 1 ? <Add /> : <Close />}
                                                                onClick={() => {
                                                                    idx === constraint?.slab?.length - 1 ? addSlab(index) : removeSlab(index, idx);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        : constraint?.valueType?.value !== undefined ?
                                            <div className="bg-grey--light">
                                                <div className="custom-form-row row d-flex flex-wrap justify-content-between align-items-center">
                                                    <div className="form-group col-md-3">
                                                        <AutoComplete
                                                            label={operator}
                                                            placeHolder={operator}
                                                            options={constraint?.constraintName?.data?.operators}
                                                            mandatory
                                                            error={error?.[index]?.operator}
                                                            value={constraint?.operator}
                                                            onChange={(element: OptionType) => {
                                                                setValues(index, "operator", element);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-7">
                                                        <NumberEditText
                                                            allowZero={false}
                                                            label={ValueLabel}
                                                            placeholder={ValueLabel}
                                                            mandatory
                                                            maxLength={10}
                                                            error={error?.[index]?.value}
                                                            value={constraint?.value}
                                                            onChange={(text: any) => {
                                                                setValues(index, "value", text);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-2">
                                                        <AutoComplete
                                                            label={uom}
                                                            placeHolder={uom}
                                                            options={constraint?.valueType?.uom}
                                                            mandatory
                                                            error={error?.[index]?.uom}
                                                            value={constraint?.uom}
                                                            onChange={(element: OptionType) => {
                                                                setValues(index, "uom", element);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div> : <></>}
                                </div>
                            </CardContent>
                        </Card>)
                })
            }
        </div >
    );
}

export default AddConstraints;