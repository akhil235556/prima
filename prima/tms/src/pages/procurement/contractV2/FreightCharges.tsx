import { Card, CardContent } from '@material-ui/core';
import { AddBox, Delete } from '@material-ui/icons';
import React from 'react';
import { useDispatch } from 'react-redux';
import { contractModeType, FreightType } from "../../../base/constant/ArrayList";
import { destinationLabel, destinationPlaceHolder, lanePlaceholder, laneTitle, OperationLabel, originLabel, originPlaceHolder, VariablesLabel } from '../../../base/constant/MessageUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import AutoComplete from '../../../component/widgets/AutoComplete';
import AutoSuggest from '../../../component/widgets/AutoSuggest';
import Button from '../../../component/widgets/button/Button';
import NumberEditText from '../../../component/widgets/NumberEditText';
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList, setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchLane } from "../../../serviceActions/LaneServiceActions";
import { searchZoneLocationList } from '../../../serviceActions/LocationServiceActions';
import FreightRules from './freightSlab/FreightRules';
import FreightSlab from './freightSlab/FreightSlab';

interface RenderChargesProps {
    freightChargesList: any,
    deleteFreight?: any,
    editFreight?: any,
    freightData: any,
    freightRules?: any,
    contractType: any,
    errors?: any
    editMode?: boolean
    partner?: any
    contractMode?: any
}


const FreightCharges = (props: RenderChargesProps) => {
    const appDispatch = useDispatch();
    const { freightChargesList, deleteFreight, editFreight, freightData, freightRules, contractType, errors, editMode, partner, contractMode } = props;
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [locationList, setLocationList] = React.useState<Array<OptionType> | undefined>(undefined);
    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                setLaneList(setAutoCompleteList(response, "laneName", "laneCode"))
            }
        });
    }
    function getLocationList(text: string) {
        appDispatch(searchZoneLocationList({ query: text, partner_code: partner?.code })).then((response: any) => {
            if (response) {
                setLocationList(setAutoCompleteList(response, "zoneName", "zoneCode"));
            }
        });
    }

    return (
        <div>
            <Card className="creat-contract-wrapp freight-charges-wrapp">
                <div className="billing-info-header">
                    <h4>Freight Charges</h4>
                    <div className="pdf-button-wrapp">
                        {
                            contractType === FreightType.PTL && (
                                <Button
                                    buttonStyle="btn-blue view-pod-btn"
                                    title={isMobile ? "" : "Rules"}
                                    leftIcon={<AddBox />}
                                    onClick={() => {
                                        editFreight('rules', []);
                                    }}
                                />
                            )
                        }

                        <Button
                            buttonStyle="btn-orange delete-btn"
                            title={isMobile ? "" : "Delete"}
                            leftIcon={<Delete />}
                            onClick={deleteFreight}
                        />
                    </div>
                </div>
                <CardContent className="creat-contract-content raise-contract-detail">
                    {
                        contractType === FreightType.PTL && (
                            <>
                                <div className="row mt-3 custom-form-row align-items-end">
                                    {contractMode === contractModeType.ZONE ? <>
                                        <div className="col-md-3 form-group">
                                            <AutoSuggest
                                                label={originLabel}
                                                placeHolder={originPlaceHolder}
                                                value={freightData && freightData.origin && freightData.origin.originName}
                                                suggestions={locationList}
                                                isDisabled={editMode}
                                                error={errors.origin || ""}
                                                handleSuggestionsFetchRequested={({ value }: any) => {
                                                    if (value.length > autosuggestSearchLength) {
                                                        getLocationList(value);
                                                    }
                                                }}
                                                onSelected={(element: OptionType) => {
                                                    editFreight("origin", {
                                                        originName: element.label,
                                                        originCode: element.value,
                                                    })
                                                }}
                                                onChange={(text: string) => {
                                                    editFreight("origin", {
                                                        originName: text,
                                                        originCode: "",
                                                    })
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <AutoSuggest
                                                label={destinationLabel}
                                                placeHolder={destinationPlaceHolder}
                                                value={freightData && freightData.destination && freightData.destination.destinationName}
                                                suggestions={locationList}
                                                isDisabled={editMode}
                                                error={errors.destination || ""}
                                                handleSuggestionsFetchRequested={({ value }: any) => {
                                                    if (value.length > autosuggestSearchLength) {
                                                        getLocationList(value);
                                                    }
                                                }}
                                                onSelected={(element: OptionType) => {
                                                    editFreight("destination", {
                                                        destinationName: element.label,
                                                        destinationCode: element.value,
                                                    })
                                                }}
                                                onChange={(text: string) => {
                                                    editFreight("destination", {
                                                        destinationName: text,
                                                        destinationCode: "",
                                                    })
                                                }}
                                            />
                                        </div>
                                    </> :
                                        <div className="col-md-3 form-group">
                                            <AutoSuggest
                                                label={laneTitle}
                                                placeHolder={lanePlaceholder}
                                                value={freightData && freightData.lane && freightData.lane.laneName}
                                                suggestions={laneList}
                                                isDisabled={editMode}
                                                error={errors.lane || ""}
                                                handleSuggestionsFetchRequested={({ value }: any) => {
                                                    if (value.length > autosuggestSearchLength) {
                                                        getLaneList(value);
                                                    }
                                                }}
                                                onSelected={(element: OptionType) => {
                                                    editFreight("lane", {
                                                        laneName: element.label,
                                                        laneCode: element.value,
                                                    })
                                                }}
                                                onChange={(text: string) => {
                                                    editFreight("lane", {
                                                        laneName: text,
                                                        laneCode: "",
                                                    })
                                                }}
                                            />
                                        </div>}
                                    <div className="col-md-3 form-group">
                                        <AutoComplete
                                            label={"Charges"}
                                            mandatory
                                            placeHolder={'Charges'}
                                            isDisabled={editMode}
                                            error={errors.charges || ""}
                                            value={freightData.charges ? {
                                                label: freightData.charges.label,
                                                value: freightData.charges.value
                                            } : undefined}
                                            isShowAll
                                            options={freightChargesList}
                                            onChange={(element: OptionType) => {
                                                editFreight('charges', element)
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-3 form-group">
                                        <AutoComplete
                                            label={OperationLabel}
                                            mandatory
                                            placeHolder={'Operation'}
                                            error={errors.operation || ""}
                                            value={freightData.operation ? {
                                                label: freightData.operation.label,
                                                value: freightData.operation.value
                                            } : undefined}
                                            options={freightData.charges
                                                && freightData.charges.data
                                                && freightData.charges.data.operation
                                                && freightData.charges.data.operation.map((item: string) => ({
                                                    label: item,
                                                    value: item,
                                                }))}
                                            name="rate-type"
                                            onChange={(element: OptionType) => {
                                                editFreight('operation', element)
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-3 form-group">
                                        <AutoComplete
                                            label={"Rate Type"}
                                            mandatory
                                            placeHolder={'Rate'}
                                            error={errors.rateType || ""}
                                            value={freightData.rateType ? {
                                                label: freightData.rateType.label,
                                                value: freightData.rateType.value
                                            } : undefined}
                                            options={freightData.charges
                                                && freightData.charges.data
                                                && freightData.charges.data.rateType
                                                && freightData.charges.data.rateType.map((item: string) => ({
                                                    label: item,
                                                    value: item,
                                                }))}
                                            onChange={(element: OptionType) => {
                                                editFreight('rateType', element)
                                            }}
                                        />
                                    </div>
                                    {
                                        freightData && freightData.rateType && freightData.rateType.label === 'FLAT' ? (
                                            <>
                                                <div className="col-md-3 form-group">
                                                    <AutoComplete
                                                        label={VariablesLabel}
                                                        mandatory
                                                        placeHolder={'Variable'}
                                                        error={errors.variable || ""}
                                                        value={freightData.variable ? {
                                                            label: freightData.variable.label,
                                                            value: freightData.variable.value
                                                        } : undefined}
                                                        options={freightData.charges
                                                            && freightData.charges.data
                                                            && freightData.charges.data.variable
                                                            && setAutoCompleteListWithData(freightData.charges.data.variable, "description", "code")
                                                            // freightData.charges.data.variable.map((item: any) => ({
                                                            //     label: item.description,
                                                            //     value: item.code,
                                                            //     data: item
                                                            // }))}
                                                        }
                                                        name="rate-type"
                                                        onChange={(element: OptionType) => {
                                                            editFreight('variable', element)
                                                        }}
                                                    />
                                                </div>
                                                {(freightData?.variable && freightData?.variable?.data?.attributes) && freightData?.variable?.data?.attributes.map((attribute: any, index: any) => (
                                                    <div key={index} className="col-md-3 form-group">
                                                        <NumberEditText
                                                            label={attribute.label}
                                                            mandatory={attribute.isMandatory}
                                                            maxLength={10}
                                                            decimalScale={2}
                                                            allowZero
                                                            placeholder={attribute.placeholder}
                                                            error={errors[attribute.code] || ""}
                                                            value={attribute.value}
                                                            onChange={(text: string) => {
                                                                editFreight('attribute', {
                                                                    code: attribute.code,
                                                                    value: text
                                                                })
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </>
                                        ) : null
                                    }
                                </div>
                                {
                                    freightData &&
                                    freightData.rateType &&
                                    freightData.rateType.label === 'SLAB' &&
                                    <FreightSlab
                                        slabData={freightData.slabs}
                                        freightData={freightData}
                                        errors={errors.slabs || {}}
                                        editSlab={(value: any) => {
                                            editFreight('slabs', value)
                                        }}
                                    />
                                }

                                {/* {
                                    freightData.slabs &&
                                    <FreightSlab
                                        slabData={freightData.slabs}
                                        freightData={freightData}
                                        errors={errors.slabs || {}}
                                        editSlab={(value: any) => {
                                            editFreight('slabs', value)
                                        }}
                                    />
                                } */}
                                {
                                    freightData.rules &&
                                    <FreightRules
                                        ruleData={freightData.rules}
                                        freightData={freightData}
                                        freightRules={freightRules}
                                        errors={errors.rules || {}}
                                        editRule={(value: any) => {
                                            editFreight('rules', value)
                                        }}
                                    />
                                }
                            </>
                        )
                    }
                    {

                        contractType === FreightType.FTL && (
                            <>
                                <div className="row mt-3 custom-form-row align-items-end">

                                    <div className="col-md-3 form-group">
                                        <AutoComplete
                                            label={"Charges"}
                                            mandatory
                                            placeHolder={'Charges'}
                                            isDisabled={editMode}
                                            error={errors.charges || ""}
                                            value={freightData.charges ? {
                                                label: freightData.charges.label,
                                                value: freightData.charges.value
                                            } : undefined}
                                            options={freightChargesList}
                                            onChange={(element: OptionType) => {
                                                editFreight('charges', element)
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-3 form-group">
                                        <AutoComplete
                                            label={OperationLabel}
                                            mandatory
                                            placeHolder={'Operation'}
                                            error={errors.operation || ""}
                                            value={freightData.operation ? {
                                                label: freightData.operation.label,
                                                value: freightData.operation.value
                                            } : undefined}
                                            options={freightData.charges
                                                && freightData.charges.data
                                                && freightData.charges.data.operation
                                                && freightData.charges.data.operation.map((item: string) => ({
                                                    label: item,
                                                    value: item,
                                                }))}
                                            name="rate-type"
                                            onChange={(element: OptionType) => {
                                                editFreight('operation', element)
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-3 form-group">
                                        <AutoComplete
                                            label={VariablesLabel}
                                            mandatory
                                            placeHolder={'Variable'}
                                            error={errors.variable || ""}
                                            value={freightData.variable ? {
                                                label: freightData.variable.label,
                                                value: freightData.variable.value
                                            } : undefined}
                                            options={freightData.charges
                                                && freightData.charges.data
                                                && freightData.charges.data.variable
                                                && setAutoCompleteListWithData(freightData?.charges?.data?.variable, "description", "code")
                                                // freightData.charges.data.variable.map((item: string) => ({
                                                //     label: item,
                                                //     value: item,
                                                // }))}
                                            }
                                            name="rate-type"
                                            onChange={(element: OptionType) => {
                                                editFreight('variable', element)
                                            }}
                                        />
                                    </div>
                                    {(freightData?.variable && freightData?.variable?.data?.attributes) && freightData?.variable?.data?.attributes.map((attribute: any, index: any) => (
                                        <div key={index} className="col-md-3 form-group">
                                            <NumberEditText
                                                label={attribute.label}
                                                mandatory={attribute.isMandatory}
                                                maxLength={10}
                                                placeholder={attribute.placeholder}
                                                decimalScale={2}
                                                allowZero
                                                error={errors[attribute.code] || ""}
                                                value={attribute.value}
                                                onChange={(text: string) => {
                                                    editFreight('attribute', {
                                                        code: attribute.code,
                                                        value: text
                                                    })
                                                }}
                                            />
                                        </div>
                                    ))}
                                    {/* <div className="col-md-3 form-group">
                                        <NumberEditText
                                            label={ValueLabel}
                                            mandatory
                                            maxLength={10}
                                            placeholder={'Amount'}
                                            error={errors.amount || ""}
                                            value={freightData.amount}
                                            onChange={(text: string) => {
                                                editFreight('amount', text)
                                            }}
                                        />
                                    </div> */}
                                </div>
                            </>
                        )
                    }

                </CardContent>
            </Card>


        </div>
    )
}

export default FreightCharges;
