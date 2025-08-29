import { CardContent, TextareaAutosize } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { DateTimePicker } from '@material-ui/pickers';
import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FreightType, tatOptions } from '../../base/constant/ArrayList';
import {
    appointmentDateTimeLabel, appointmentDateTimePlaceholder, LBHLabel,
    numberOfBoxes, numberOfBoxesPlaceHolder, placementDateTimeLabel,
    placementDateTimePlaceholder, remarkLabel, tatLabelWithoutUnit,
    tatPlaceholder, VolumeLabel, volumePlaceholder, WeightLabel, WeightPlaceholder
} from '../../base/constant/MessageUtils';
import { convertDateTimeServerFormat, displayDateTimeFormatter } from '../../base/utility/DateUtils';
import { isNullValue } from '../../base/utility/StringUtils';
import AutoComplete from '../../component/widgets/AutoComplete';
import AutoSuggest from '../../component/widgets/AutoSuggest';
import Button from '../../component/widgets/button/Button';
import EditText from '../../component/widgets/EditText';
import NumberEditText from '../../component/widgets/NumberEditText';
import { OptionType } from '../../component/widgets/widgetsInterfaces';
import { autosuggestSearchLength } from '../../moduleUtility/ConstantValues';
import { removeListItem, setAutoCompleteListWithData } from '../../moduleUtility/DataUtils';
import { saveShipmetDetails } from '../../redux/actions/RaiseIndentAction';
import { searchCustomer } from '../../serviceActions/ConsigneeServiceActions';
import { convertUom } from '../../serviceActions/MaterialServiceActions';
import { getDOList, getDoMaterialList } from '../freight/demandOrders/demandOrdersApi/demandOrderServiceActions';
import { Context } from './CreateDiversionOrder';
import { DiversionRenderArticles } from './DiversionRaiseOrderViewUtils';
// import { RenderArticles } from '../raiseOrders/RaiseOrderViewUtils';
import './DiversionShipmentOrder.css';


interface DiversionShipmentOrderProps {
    onDelete: any,
    details: any,
    dropPointList: any,
    pickupPointList: any
    servicabiltyTat?: any
    order?: any
}

function DiversionShipmentOrder(props: DiversionShipmentOrderProps) {
    const { order, onDelete, details, dropPointList, pickupPointList, servicabiltyTat } = props;
    const appDispatch = useDispatch();
    const [state, dispatch] = useContext(Context);
    // eslint-disable-next-line
    const [doList, setDoList] = React.useState<Array<OptionType> | undefined>(undefined)
    const [partnerList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [customerList, setCustomerList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [doMaterialResponse, setDoMaterialResponse] = React.useState<any>()
    const [DODetails, setDODetails] = React.useState<any>()
    useEffect(() => {
        !details.isShipmentRefIdDisabled && saveDetails({
            tatValue: tatOptions[0]
        }, {
            tatValue: ""
        })
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (pickupPointList && dropPointList && dropPointList[0] && pickupPointList[0] && !details.isShipmentRefIdDisabled) {
            saveDetails({
                pickupPointName: pickupPointList[0].label,
                pickupPoint: pickupPointList[0],
                dropPointName: dropPointList[0].label,
                dropPoint: dropPointList[0],
                consigneeName: dropPointList[0].data.consigneeName,
                consignee: {
                    label: dropPointList[0].data.consigneeName,
                    value: dropPointList[0].data.consigneeCode
                },
                tatValue: tatOptions[0],
                tat: servicabiltyTat ? servicabiltyTat : "",
                // sourceNumber: DODetails && DODetails.sourceNumber
            }, {
                pickupPoint: ""
            })
        }
        // eslint-disable-next-line
    }, [pickupPointList, dropPointList]);

    return (
        <div className="billing-info-wrapp shipment-order-wrapper">
            <div className="billing-info-header">
                <h4>Shipment Details</h4>
                {
                    !details.isNonDeletable &&
                    <Button
                        buttonStyle="btn-orange delete-btn"
                        title="Delete"
                        leftIcon={<Delete />}
                        onClick={() => {
                            onDelete && onDelete(details.index);
                        }}
                    />
                }

            </div>
            <CardContent className="creat-contract-content create-shipment-content">
                <div className=" shipment_Details row custom-form-row align-items-end">
                    {!isNullValue(order) &&
                        <div className="col-md-4 form-group">
                            <AutoSuggest
                                label="DO Number"
                                error={details.error.demandOrderCode}
                                placeHolder=" DO Number"
                                // isDisabled={true}
                                mandatory
                                value={details.details.demandOrderCode}
                                suggestions={doList}
                                onChange={(text: string) => {
                                    saveDetails({
                                        demandOrderCode: text,
                                        articles: [{ index: 0 }]

                                    }, {
                                        demandOrderCode: ""
                                    })
                                }}
                                handleSuggestionsFetchRequested={({ value }: any) => {
                                    if (value.length > autosuggestSearchLength) {
                                        appDispatch(getDOList({ query: value, queryField: 'demandOrderCode' })).then((response: any) => {
                                            response && setDoList(setAutoCompleteListWithData(response && response.data, "demandOrderCode", "demandOrderCode"));
                                        })
                                    }
                                }}
                                onSelected={(element: OptionType) => {
                                    appDispatch(getDoMaterialList({ demandOrderCode: element.label })).then((response: any) => {
                                        if (response) {
                                            setDODetails(element.data)
                                            setDoMaterialResponse(response)
                                        }
                                    })
                                    saveDetails({
                                        demandOrderCode: element.label,
                                        articles: [{ index: 0 }]

                                    }, {
                                        demandOrderCode: "",
                                    })
                                }}
                            />
                        </div>}
                    <div className="col-md-4 form-group">
                        <AutoComplete
                            label="Pickup Point"
                            mandatory
                            placeHolder="Enter Pickup Point"
                            error={details.error.pickupPoint}
                            value={details.details.pickupPoint}
                            options={pickupPointList}
                            onChange={(element: OptionType) => {
                                saveDetails({
                                    pickupPointName: element.label,
                                    pickupPoint: element,
                                }, {
                                    pickupPoint: ""
                                })
                            }}
                        />
                    </div>
                    <div className="col-md-4 form-group">
                        <AutoComplete
                            label="Drop Point"
                            mandatory
                            placeHolder="Enter Drop Point"
                            error={details.error.dropPoint}
                            value={details.details.dropPoint}
                            options={dropPointList}
                            onChange={(element: OptionType) => {
                                let consigneeDetails: any = {};
                                if (element.data.consigneeName) {
                                    consigneeDetails.consigneeName = element.data.consigneeName;
                                    consigneeDetails.consignee = {
                                        label: element.data.consigneeName,
                                        value: element.data.consigneeCode
                                    };
                                } else {
                                    consigneeDetails.consigneeName = ""
                                    consigneeDetails.consignee = undefined
                                }
                                saveDetails({
                                    dropPointName: element.label,
                                    dropPoint: element,
                                    ...consigneeDetails
                                }, {
                                    dropPoint: ""
                                })
                            }}
                        />
                    </div>
                    <div className="form-group col-md-2">
                        <AutoComplete
                            label={tatLabelWithoutUnit}
                            mandatory
                            placeHolder={tatPlaceholder}
                            value={details.details.tatValue}
                            error={details.error.tatValue}
                            isDisabled={true}
                            options={tatOptions}
                            onChange={(element: OptionType) => {
                                saveDetails({
                                    tatValue: element,
                                    tat: "",
                                }, {
                                    tat: ""
                                })
                            }}
                        />
                    </div>
                    <div className="form-group col-md-2">
                        <NumberEditText
                            placeholder={tatPlaceholder}
                            error={details.error.tat}
                            allowNegative={false}
                            disabled={true}
                            required
                            maxLength={5}
                            value={details.details.tat}
                            onChange={(text: any) => {
                                saveDetails({
                                    tat: text,
                                }, {
                                    tat: ""
                                })
                            }}
                        />
                    </div>
                    <div className="col-md-4 form-group">
                        <AutoSuggest
                            label="Transporter"
                            mandatory
                            isDisabled={true}
                            error={details.error.partner}
                            placeHolder="Enter Transporter Name"
                            value={state.userParams.partner.label}
                            suggestions={partnerList}
                            onChange={(text: string) => {

                            }}
                            handleSuggestionsFetchRequested={({ value }: any) => {

                            }}
                            onSelected={(element: OptionType) => {

                            }}
                        />
                    </div>
                    <div className="col-md-4 form-group">
                        <AutoSuggest
                            label="Consignee"
                            error={details.error.consignee}
                            placeHolder="Enter Consignee Name"
                            value={details.details.consigneeName}
                            suggestions={customerList}
                            onChange={(text: string) => {
                                saveDetails({
                                    consigneeName: text,
                                    consignee: undefined,
                                    consigneeAddressName: undefined,
                                    consigneeAddress: undefined,
                                }, {
                                    consignee: ""
                                })
                            }}
                            handleSuggestionsFetchRequested={({ value }: any) => {
                                if (value.length > autosuggestSearchLength) {
                                    appDispatch(searchCustomer({ query: value })).then((response: any) => {
                                        response && setCustomerList(setAutoCompleteListWithData(response, "customerName", "customerCode"));
                                    })
                                }
                            }}
                            onSelected={(element: OptionType) => {
                                saveDetails({
                                    consigneeName: element.label,
                                    consignee: element,
                                    consigneeAddressName: undefined,
                                    consigneeAddress: undefined
                                }, {
                                    consignee: "",
                                    consigneeAddress: "",
                                })
                            }}
                        />
                    </div>

                    <div className="col-md-4 form-group">
                        <label className="picker-label d-flex">{placementDateTimeLabel}<span className="mandatory-flied">*</span></label>
                        <DateTimePicker
                            className="custom-date-picker"
                            placeholder={placementDateTimePlaceholder}
                            hiddenLabel
                            disablePast
                            helperText={details.error.placementDatetime}
                            format={displayDateTimeFormatter}
                            value={details.details.placementDatetime || null}
                            onChange={(date: any) => {
                                // let tatValueDiff:any= details.details.tat;
                                //             if(details.details && details.details.appointmentDatetime){
                                //              tatValueDiff= setTatByDifference(date,details.details.appointmentDatetime)
                                //               }
                                saveDetails({
                                    placementDatetime: convertDateTimeServerFormat(date),
                                    //tat:tatValueDiff
                                }, {
                                    placementDatetime: ""
                                })
                            }}
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <NumberEditText
                            label={VolumeLabel}
                            placeholder={volumePlaceholder}
                            maxLength={11}
                            decimalScale={3}
                            allowNegative={false}
                            error={details.error.totalShipmentVolume}
                            value={details.details && details.details.totalShipmentVolume}
                            onChange={(text: string) => {
                                saveDetails({
                                    totalShipmentVolume: text
                                }, {
                                    totalShipmentVolume: ""
                                })
                            }}
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <NumberEditText
                            label={WeightLabel}
                            placeholder={WeightPlaceholder}
                            maxLength={11}
                            mandatory={state.userParams.freightType && state.userParams.freightType.label === FreightType.PTL}
                            decimalScale={2}
                            allowNegative={false}
                            error={details.error.totalShipmentWeight}
                            value={details.details && details.details.totalShipmentWeight}
                            onChange={(text: string) => {
                                saveDetails({
                                    totalShipmentWeight: text
                                }, {
                                    totalShipmentWeight: ""
                                })
                            }}
                        />
                    </div>

                    <div className="form-group col-md-4">
                        <EditText
                            label={"LR Number"}
                            placeholder="Enter LR Number"
                            maxLength={25}
                            error={details.error.lrNumber}
                            value={details.details && details.details.lrNumber}
                            onChange={(text: string) => {
                                saveDetails({
                                    lrNumber: text.trim()
                                }, {
                                    lrNumber: ""
                                })
                            }}
                        />
                    </div>

                    <div className="form-group col-md-4">
                        <EditText
                            label={"Shipment Reference Id"}
                            placeholder="Shipment Reference Id"
                            maxLength={25}
                            error={details.error.shipmentRefId}
                            value={details.details && details.details.shipmentRefId}
                            disabled={details.isShipmentRefIdDisabled}
                            onChange={(text: string) => {
                                saveDetails({
                                    shipmentRefId: text.trim()
                                }, {
                                    shipmentRefId: ""
                                })
                            }}
                        />
                    </div>

                    <div className="col-md-4 form-group">
                        <label className="picker-label d-flex">{appointmentDateTimeLabel}</label>
                        <DateTimePicker
                            className="custom-date-picker"
                            placeholder={appointmentDateTimePlaceholder}
                            hiddenLabel
                            disablePast
                            helperText={details.error.appointmentDatetime}
                            format={displayDateTimeFormatter}
                            value={details.details.appointmentDatetime || null}
                            onChange={(date: any) => {
                                // let tatValueDiff:any = details.details.tat;
                                // if(details.details && details.details.placementDatetime){
                                //     tatValueDiff= setTatByDifference(details.details.placementDatetime,date)
                                //   }
                                saveDetails({
                                    appointmentDatetime: convertDateTimeServerFormat(date),
                                    //tat:tatValueDiff
                                }, {
                                    appointmentDatetime: ""
                                })
                            }}
                        />
                    </div>
                    <div className="label-remarks remarks col-md-4 form-group">
                        <label className="d-flex align-items-center">Remark</label>
                        <TextareaAutosize
                            rowsMax={3}
                            rowsMin={3}
                            aria-label="maximum height"
                            placeholder={remarkLabel}
                            value={details.details.shipmentRemarks}
                            onChange={(event: any) => {
                                saveDetails({
                                    shipmentRemarks: event.target.value
                                }, {
                                    shipmentRemarks: ""
                                })
                            }}
                        />
                    </div>
                    <div className="col-md-12 col-xl-4">
                        <div className="details row">
                            <div className="col-md-8 width-100 details-mobile">
                                <div className="mb-0 input-wrap">
                                    <label className="d-flex align-items-center">{LBHLabel}</label>
                                </div>
                                <div className=" inputBoxOrder input-lbh">
                                    <div className="form-group">
                                        <NumberEditText
                                            placeholder="Length"
                                            maxLength={5}
                                            allowNegative={false}
                                            decimalScale={2}
                                            // disabled={!isNullValue(DODetails)}
                                            error={details.error.length}
                                            value={details.details && details.details.length}
                                            onChange={(text: string) => {
                                                saveDetails({
                                                    length: text.trim()
                                                }, {
                                                    length: "",
                                                    width: "",
                                                    height: ""
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <NumberEditText
                                            placeholder="Width"
                                            maxLength={5}
                                            allowNegative={false}
                                            decimalScale={2}
                                            // disabled={!isNullValue(DODetails)}
                                            error={details.error.width}
                                            value={details.details && details.details.width}
                                            onChange={(text: string) => {
                                                saveDetails({
                                                    width: text.trim()
                                                }, {
                                                    length: "",
                                                    width: "",
                                                    height: ""
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <NumberEditText
                                            placeholder="Height"
                                            maxLength={5}
                                            allowNegative={false}
                                            decimalScale={2}
                                            // disabled={!isNullValue(DODetails)}
                                            error={details.error.height}
                                            value={details.details && details.details.height}
                                            onChange={(text: string) => {
                                                saveDetails({
                                                    height: text.trim()
                                                }, {
                                                    length: "",
                                                    width: "",
                                                    height: ""
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className=" inputLabelOrder form-group pl-md-0 col-md-4">
                                <NumberEditText
                                    label={numberOfBoxes}
                                    placeholder={numberOfBoxesPlaceHolder}
                                    maxLength={11}
                                    // decimalSeparator={false}
                                    decimalScale={2}
                                    // disabled={!isNullValue(DODetails)}
                                    onBlur={() => {
                                        if (isNullValue(details.details && details.details.totalShipmentQuantity)) {
                                            saveDetails({
                                                totalShipmentQuantity: ""
                                            }, {
                                                totalShipmentQuantity: ""
                                            })
                                        }
                                    }}
                                    allowNegative={false}
                                    error={details.error.totalShipmentQuantity}
                                    value={(details.details && details.details.totalShipmentQuantity)}
                                    onChange={(text: string) => {
                                        saveDetails({
                                            totalShipmentQuantity: text
                                        }, {
                                            totalShipmentQuantity: ""
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
                <div className="shipment-line"></div>
                <div className="row align-items-end">
                    {details.details.articles && details.details.articles.map((element: any, index: number) => (
                        <DiversionRenderArticles
                            showDONumber={!isNullValue(order)}
                            order={order}
                            key={index}
                            element={element}
                            DODetails={DODetails}
                            doMaterialList={setAutoCompleteListWithData(doMaterialResponse, "materialName", "materialCode")}
                            onAdd={() => {
                                saveDetails({
                                    articles: [...details.details.articles, {
                                        index: details.details.articles.length,
                                    }]
                                }, {
                                    dropPoint: ""
                                })
                            }}
                            onClear={(elementIndex: number) => {
                                const articles = details.details.articles.map(
                                    (data: any) => ((data.index === elementIndex) ? {
                                        ...data,
                                        articleError: "",
                                        quantityError: "",
                                        articlesName: "",
                                        productQuantity: "",
                                        quantity: "",
                                        uom: undefined,
                                        article: undefined,
                                    } : data));
                                saveDetails({
                                    ...details.details,
                                    articles: articles,
                                }, {
                                    dropPoint: ""
                                })
                            }}
                            onChangeArticle={(text: any, partnerIndex: number) => {
                                const articles = details.details.articles.map(
                                    (data: any) => ((data.index === partnerIndex) ? {
                                        ...data,
                                        articleError: "",
                                        quantityError: "",
                                        articlesName: text,
                                        productQuantity: "",
                                        quantity: "",
                                        uom: undefined,
                                        article: undefined
                                    } : data));
                                saveDetails({
                                    ...details.details,
                                    articles: articles,
                                }, {
                                    dropPoint: ""
                                })
                            }}
                            onSelectArticle={(article: any, articlesIndex: number) => {
                                const articles = details.details.articles.map(
                                    (data: any) => ((data.index === articlesIndex) ? {
                                        ...data,
                                        articleError: "",
                                        quantityError: "",
                                        articlesName: article.label,
                                        units: article?.data?.units,
                                        article
                                    } : data));
                                saveDetails({
                                    ...details.details,
                                    articles: articles,
                                    // length: article.data && article.data.length,
                                    // width: article.data && article.data.width,
                                    // height: article.data && article.data.height
                                }, {
                                    dropPoint: ""
                                })
                            }}
                            onChangeUom={async (value: any, uomValueIndex: number) => {
                                let currentRow: any = details.details.articles.find((data: any) => data.index === uomValueIndex);
                                currentRow.uom = value;
                                const articleData = currentRow.article?.data;
                                if (!articleData.isBulk) {
                                    if (value.value === articleData?.weightUom) {
                                        currentRow.multiplyingFactor = articleData?.weight
                                    } else if (value.value === articleData?.volumeUom) {
                                        currentRow.multiplyingFactor = articleData?.volume
                                    } else if (value.value === "EACH") {
                                        currentRow.multiplyingFactor = articleData?.units
                                    } else {
                                        let params = {
                                            weight: articleData?.weight,
                                            volume: articleData?.volume,
                                            weightUom: articleData?.weightUom,
                                            volumeUom: articleData?.volumeUom,
                                            units: articleData?.units,
                                            toUom: value.value
                                        }
                                        let response = await appDispatch(convertUom(params))
                                        if (response && response.value) {
                                            currentRow.multiplyingFactor = response.value
                                        } else {
                                            currentRow.uom = undefined;
                                        }
                                    }
                                }
                                const articles = details.details.articles.map(
                                    (data: any) => ((data.index === uomValueIndex) ? {
                                        // ...data,
                                        ...currentRow,
                                        articleError: "",
                                        quantityError: "",
                                        productQuantity: "",
                                        quantity: "",
                                    } : data));

                                saveDetails({
                                    ...details.details,
                                    articles: articles,
                                }, {
                                    dropPoint: ""
                                })
                            }}
                            onChangeDOMaterial={(material: any, materialIndex: number) => {
                                const materials = details.details.articles.map(
                                    (data: any) => ((data.index === materialIndex) ? {
                                        ...data,
                                        unitError: "",
                                        materialError: "",
                                        material: material,
                                        unit: material?.data?.unit,
                                        balanceQuantity: material?.data?.balanceQuantity,
                                        materialUnit: material?.data?.materialUnits,
                                        materialQuantity: "",
                                        productQuantity: "",
                                        productQuantityError: "",
                                    } : data));
                                saveDetails({
                                    ...details.details,
                                    articles: materials,
                                }, {
                                    dropPoint: ""
                                })
                            }}
                            onChangeQuantity={(value: any, quantityIndex: number) => {
                                if (!(details?.details?.articles[quantityIndex]?.isDisabledMaterialQuantity)) {
                                    let articles: any = [];
                                    if (isNullValue(DODetails)) {
                                        articles = details.details.articles.map(
                                            (data: any) => ((data.index === quantityIndex) ? {
                                                ...data,
                                                quantityError: "",
                                                productQuantityError: "",
                                                quantity: Number(value),
                                                isDisableProductQuantity: Number(value) > 0,
                                                productQuantity: (data.multiplyingFactor) ? Number(value * data.multiplyingFactor) : Number(value)
                                            } : data));
                                    }
                                    else {
                                        articles = details.details.articles.map(
                                            (data: any) => ((data.index === quantityIndex) ? {
                                                ...data,
                                                materialQuantityError: "",
                                                productQuantityError: "",
                                                materialQuantity: Number(value),
                                                isDisableProductQuantity: Number(value) > 0,
                                                productQuantity: data.materialUnit ? Number(value * data.materialUnit) : Number(value)
                                            } : data));
                                    }
                                    saveDetails({
                                        ...details.details,
                                        articles: articles,
                                        // totalShipmentQuantity: value,
                                    }, {
                                        dropPoint: ""
                                    })
                                }
                            }}
                            onChangeProductQuantity={(value: any, quantityIndex: number) => {
                                if (!(details?.details?.articles[quantityIndex]?.isDisableProductQuantity)) {
                                    let articles: any = []
                                    if (isNullValue(DODetails)) {
                                        articles = details.details.articles.map(
                                            (data: any) => ((data.index === quantityIndex) ? {
                                                ...data,
                                                quantityError: "",
                                                productQuantityError: "",
                                                productQuantity: value,
                                                isDisabledMaterialQuantity: Number(value) > 0,
                                                quantity: (data.multiplyingFactor) ? Math.ceil(value / data.multiplyingFactor) : Math.ceil(Number(value))
                                            } : data));
                                    }
                                    else {
                                        articles = details.details.articles.map(
                                            (data: any) => ((data.index === quantityIndex) ? {
                                                ...data,
                                                materialQuantityError: "",
                                                productQuantityError: "",
                                                productQuantity: value,
                                                isDisabledMaterialQuantity: Number(value) > 0,
                                                materialQuantity: data.materialUnit ? Math.ceil(value / data.materialUnit) : Math.ceil(Number(value))
                                            } : data));
                                    }

                                    saveDetails({
                                        ...details.details,
                                        articles: articles,
                                        // totalShipmentQuantity: materials && materials[quantityIndex] && materials[quantityIndex].materialQuantity
                                    }, {
                                        dropPoint: ""
                                    })
                                }
                            }}
                            onRemove={(element: any) => {
                                const articles = removeListItem(details.details.articles, element)
                                saveDetails({
                                    articles: articles,
                                }, {
                                    dropPoint: ""
                                })
                            }}
                        />
                    ))}
                </div>
            </CardContent>
        </div>
    )

    function saveDetails(value: any, error: any) {
        dispatch(saveShipmetDetails(
            state.shipmentDeatils.map((element: any) => (element.index === details.index) ? {
                ...element,
                details: {
                    ...element.details,
                    ...value
                },
                error: {
                    ...element.error,
                    ...error
                }
            } : element)
        ))
    }
}


export default DiversionShipmentOrder;