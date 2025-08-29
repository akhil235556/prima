import { CardHeader } from '@material-ui/core';
import { Add, Close } from '@material-ui/icons';
import React, { useLayoutEffect, useRef } from 'react';
import { ValueLabel, VariablesLabel } from '../../../../base/constant/MessageUtils';
import AutoComplete from '../../../../component/widgets/AutoComplete';
import Button from '../../../../component/widgets/button/Button';
import NumberEditText from '../../../../component/widgets/NumberEditText';
import { OptionType } from '../../../../component/widgets/widgetsInterfaces';
import { setAutoCompleteListWithData } from '../../../../moduleUtility/DataUtils';
import './FreightSlab.css';

interface FreightSlabProps {
    slabData: any,
    editSlab: any,
    freightData: any,
    errors?: any,
}

function FreightSlab(props: FreightSlabProps) {
    const { editSlab, slabData, freightData, errors } = props;
    const slabId = useRef(0);

    useLayoutEffect(() => {
        if (!(slabData && slabData.length)) {
            editSlab([{ id: slabId.current }]);
            slabId.current += 1;
        }
    }, [slabData, editSlab]);

    return (

        <div className="freight-slab-wrap">
            <CardHeader className="creat-contract-header freight-slab"
                title="Slabs"
                onClick={() => {
                    editSlab(undefined)
                }}
                action={<Close />}
            />
            <div className="freight-slab-content slab-content">
                {
                    slabData && slabData.map((item: any, index: number) => (
                        <div className="row no-gutters-mob" key={item.id}>
                            <div className="col-10 col-md-11">
                                <div className="row custom-form-row align-items-end">
                                    <div className="col-6 col-md-3 form-group slab-form">
                                        <AutoComplete
                                            label={VariablesLabel}
                                            mandatory
                                            placeHolder={'Variable'}
                                            error={(errors[index] && errors[index].variable) || ""}
                                            value={item && item.variable ? {
                                                label: item.variable.label,
                                                value: item.variable.value,
                                            } : undefined}
                                            options={freightData.charges
                                                && freightData.charges.data
                                                && freightData.charges.data.variable
                                                && setAutoCompleteListWithData(freightData.charges.data.variable, "description", "code")
                                            }
                                            // freightData.charges.data.variable.map((item: string) => ({
                                            //     label: item,
                                            //     value: item,
                                            // }))}
                                            onChange={(element: OptionType) => {
                                                const slabObject = { ...slabData[index], variable: element }
                                                const newSlab = [...slabData];
                                                newSlab[index] = slabObject;
                                                editSlab(newSlab)
                                            }}
                                        />
                                    </div>
                                    <div className="col-6 col-md-3 form-group slab-form">
                                        <NumberEditText
                                            label={'Min'}
                                            mandatory
                                            maxLength={25}
                                            placeholder={'Min'}
                                            error={(errors[index] && errors[index].min) || ""}
                                            value={item.min}
                                            onChange={(text: string) => {
                                                const slabObject = { ...slabData[index], min: text }
                                                const newSlab = [...slabData];
                                                newSlab[index] = slabObject;
                                                editSlab(newSlab)
                                            }}
                                        />
                                    </div>
                                    <div className="col-6 col-md-3 form-group slab-form">
                                        <NumberEditText
                                            label={'Max'}
                                            mandatory
                                            maxLength={25}
                                            placeholder={'Max'}
                                            error={(errors[index] && errors[index].max) || ""}
                                            value={item.max}
                                            onChange={(text: string) => {
                                                const slabObject = { ...slabData[index], max: text }
                                                const newSlab = [...slabData];
                                                newSlab[index] = slabObject;
                                                editSlab(newSlab)
                                            }}
                                        />
                                    </div>
                                    <div className="col-6 col-md-3 form-group slab-form">
                                        <NumberEditText
                                            label={ValueLabel}
                                            mandatory
                                            maxLength={10}
                                            placeholder={'Enter Value'}
                                            error={(errors[index] && errors[index].amount) || ""}
                                            value={item.amount}
                                            onChange={(text: string) => {
                                                const slabObject = { ...slabData[index], amount: text }
                                                const newSlab = [...slabData];
                                                newSlab[index] = slabObject;
                                                editSlab(newSlab)
                                            }}
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className="col-2 col-md-1 form-group add-button-wrapp">
                                {
                                    index === slabData.length - 1 ? (
                                        <Button
                                            buttonStyle="add-btn"
                                            leftIcon={<Add />}
                                            onClick={() => {
                                                const newSlab = [...slabData, { id: slabId.current }];
                                                slabId.current += 1;
                                                editSlab(newSlab);
                                            }}
                                        />
                                    ) : (
                                        <Button
                                            buttonStyle="minus-btn"
                                            leftIcon={<Close />}
                                            onClick={() => {
                                                const newSlab = slabData.filter((slab: any) => slab.id !== item.id)
                                                editSlab(newSlab);
                                            }}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
export default FreightSlab