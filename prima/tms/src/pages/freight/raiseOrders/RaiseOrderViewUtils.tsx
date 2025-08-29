import { Add, Close } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { FreightType, materialBalanceQuantityColumn, uomOptionsList } from "../../../base/constant/ArrayList";
import { articleError, errorFreightType, errorLane, errorSelectTransporter, errorTransportMode, quantityError, vehicleTypeError } from '../../../base/constant/MessageUtils';
import { isNullValue, isNullValueOrZero, isObjectEmpty, tatValueConverter } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import Button from "../../../component/widgets/button/Button";
import { CustomTooltipTable } from "../../../component/widgets/CustomToolTipTable";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from "../../../component/widgets/NumberEditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchMaterialList } from "../../../serviceActions/MaterialServiceActions";
import './RaiseOrder.css';

interface RenderArticlesProps {
    element: any,
    onAdd: any,
    onRemove: any,
    onSelectArticle: any,
    onChangeArticle: any,
    isAddButton?: boolean,
    classStyle?: string,
    DODetails?: any,
    doMaterialList?: any,
    onChangeQuantity?: any,
    onChangeDOMaterial?: any,
    onChangeProductQuantity?: any
    onChangeUom?: any,
    onChangeReferenceDocketNo?: any,
    onClear?: any,
}
export function RenderArticles(props: RenderArticlesProps) {
    const appDispatch = useDispatch();
    const {
        onAdd, onRemove,
        element, onSelectArticle, onChangeArticle, classStyle, doMaterialList, onChangeQuantity, onChangeDOMaterial, onChangeProductQuantity, onChangeReferenceDocketNo, onChangeUom, onClear, DODetails } = props;
    const [articleList, setArticleList] = React.useState<Array<OptionType> | undefined>(undefined);

    return (
        <div className={classStyle ? classStyle : "col-md-12"}>
            <div className="">
                <div className="custom-form-row row align-items-end">
                    <div className="col-md-12 ">
                        <div className="row align-items-end">
                            {isNullValue(DODetails) ?
                                <>
                                    <div className="form-group col-md-3">
                                        <AutoSuggest
                                            label="Material name"
                                            placeHolder="Enter Material name"
                                            suggestions={articleList}
                                            error={element.articleError}
                                            value={element.articlesName}
                                            isClearable={true}
                                            onClear={() => {
                                                onClear(element.index)
                                            }}
                                            onChange={(text: string) => {
                                                onChangeArticle(text, element.index);
                                            }}
                                            handleSuggestionsFetchRequested={({ value }: any) => {
                                                if (value.length > autosuggestSearchLength) {
                                                    appDispatch(searchMaterialList({ query: value })).then((response: any) => {
                                                        response && response.materials && setArticleList(setAutoCompleteListWithData(response.materials, "name", "code"));
                                                    })
                                                }
                                            }}
                                            onSelected={(article: OptionType) => {
                                                onSelectArticle(article, element.index)
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-9">
                                        <div className="row">
                                            <div className="form-group col-md-3 pr-0 pl-0">
                                                <NumberEditText
                                                    label="Quantity"
                                                    placeholder="Enter Quantity"
                                                    maxLength={9}
                                                    decimalScale={(!isObjectEmpty(element.article) && !isObjectEmpty(element.article.data) && element.article.data.isBulk) ? 5 : 0}
                                                    disabled={isObjectEmpty(element.article) || isObjectEmpty(element.uom) || element.isDisabledMaterialQuantity}
                                                    decimalSeparator={false}
                                                    allowZero={(!isObjectEmpty(element.article) && !isObjectEmpty(element.article.data) && element.article.data.isBulk)}
                                                    value={element.quantity}
                                                    error={element.quantityError}
                                                    onChange={(value: any) => {
                                                        onChangeQuantity(value, element.index);
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group col-md-3 pr-0">
                                                <NumberEditText
                                                    label="Product Quantity"
                                                    placeholder="Enter Quantity"
                                                    maxLength={9}
                                                    decimalScale={5}
                                                    allowZero
                                                    disabled={isObjectEmpty(element.article) || isObjectEmpty(element.uom) || element.isDisableProductQuantity}
                                                    value={element.productQuantity}
                                                    error={element.productQuantityError}
                                                    onChange={(value: any) => {
                                                        onChangeProductQuantity(value, element.index)
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group col-md-2 pr-0">
                                                <AutoComplete
                                                    label="UoM"
                                                    placeHolder="UoM"
                                                    options={uomOptionsList}
                                                    isDisabled={isObjectEmpty(element.article)}
                                                    value={element.uom}
                                                    error={element.uomError}
                                                    onChange={(value: any) => {
                                                        onChangeUom(value, element.index)
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group col-md-3 pr-0">
                                                <EditText
                                                    label="Ref. Docket No."
                                                    placeholder="Ref. Docket No."
                                                    maxLength={20}
                                                    disabled={isObjectEmpty(element.article)}
                                                    value={element.refDocketNumber}
                                                    onChange={(value: string) => {
                                                        onChangeReferenceDocketNo(value, element.index);
                                                    }}
                                                />
                                            </div>
                                            <div className="col-2 col-md-1 text-center d-flex align-items-center">
                                                {element.index === 0 ?
                                                    <Button
                                                        buttonStyle={"add-btn"}
                                                        onClick={() => {
                                                            onAdd()
                                                        }}
                                                        leftIcon={<Add />}
                                                    /> :
                                                    (<Button
                                                        buttonStyle={"minus-btn"}
                                                        leftIcon={<Close />}
                                                        onClick={() => {
                                                            onRemove(element);
                                                        }}
                                                    />)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </> :
                                <>
                                    <div className="form-group col-md-3">
                                        <AutoComplete
                                            label="Material name"
                                            placeHolder="Enter Material name"
                                            options={doMaterialList}
                                            // options={setAutoCompleteListWithData(doMaterialList, "materialName", "materialCode")}
                                            mandatory
                                            error={element.materialError}
                                            value={element.material}
                                            onChange={(value: string) => {
                                                onChangeDOMaterial(value, element.index);
                                            }}
                                        />
                                    </div>

                                    <div className="form-group col-md">
                                        <NumberEditText
                                            label="Material Units "
                                            placeholder="Units"
                                            maxLength={9}
                                            decimalSeparator={false}
                                            // decimalScale={2}
                                            disabled={isObjectEmpty(element.material) || element.isDisabledMaterialQuantity}
                                            value={element.materialQuantity}
                                            error={element.materialQuantityError}
                                            onChange={(value: any) => {
                                                onChangeQuantity(value, element.index);
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-3">
                                        <NumberEditText
                                            label="Product Quantity"
                                            placeholder="Enter Quantity"
                                            maxLength={9}
                                            mandatory
                                            toolTip={() =>
                                                <CustomTooltipTable
                                                    tableColumn={materialBalanceQuantityColumn}
                                                    tableData={(element.material && element.material.data) && [element.material.data]}
                                                />
                                            }
                                            disabled={isObjectEmpty(element.material) || element.isDisableProductQuantity}
                                            // decimalSeparator={false}
                                            decimalScale={3}
                                            allowZero
                                            value={element.productQuantity}
                                            error={element.productQuantityError}
                                            onChange={(value: any) => {
                                                onChangeProductQuantity(value, element.index)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md">
                                        <EditText
                                            label="UoM"
                                            placeholder="UoM"
                                            maxLength={10}
                                            disabled
                                            value={element.unit}
                                            error={element.unitError}
                                            onChange={(value: any) => {
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md">
                                        <EditText
                                            label="Ref. Docket No."
                                            placeholder="Ref. Docket No."
                                            maxLength={20}
                                            disabled={isObjectEmpty(element.material)}
                                            value={element.refDocketNumber}
                                            onChange={(value: string) => {
                                                onChangeReferenceDocketNo(value, element.index);
                                            }}
                                        />
                                    </div>
                                    <div className="col-2 col-md-1 align-self-center">
                                        {element.index === 0 ?
                                            <Button
                                                buttonStyle={"add-btn"}
                                                onClick={() => {
                                                    onAdd()
                                                }}
                                                leftIcon={<Add />}
                                            /> :
                                            (<Button
                                                buttonStyle={"minus-btn"}
                                                leftIcon={<Close />}
                                                onClick={() => {
                                                    onRemove(element);
                                                }}
                                            />)
                                        }
                                    </div>
                                </>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export function validateIndentData(userParams: any, laneCheck: any, laneVisible: boolean): any {
    if (userParams.freightType === undefined) {
        return { freightType: errorFreightType }
    }
    else if (userParams.freightType && userParams.freightType.label === FreightType.PTL && isNullValue(userParams.ptlMode)) {
        return { ptlMode: "Select Mode" }
    }
    else if (userParams?.ptlMode?.value === "zone") {
        if (userParams.partner === undefined) {
            return { partner: errorSelectTransporter }
        }
        if (isNullValue(userParams.originZoneCode)) {
            return { origin: "Select origin" }
        }
        if (isNullValue(userParams.destination)) {
            return { destination: "Select destination" }
        }
        if (userParams.serviceabilityModeCode === undefined) {
            return { serviceabilityModeCode: errorTransportMode }
        }
    }
    else if (userParams.freightType && userParams.freightType.label === FreightType.FTL && isNullValue(userParams.vehicleType)) {
        return { vehicleType: vehicleTypeError }
    }
    else if (userParams.lane === undefined) {
        return { lane: errorLane }
    } else if (userParams.serviceabilityModeCode === undefined) {
        return { serviceabilityModeCode: errorTransportMode }
    }
    else if (userParams.partner === undefined) {
        return { partner: errorSelectTransporter }
    } else if (laneVisible && userParams.freightType && userParams.freightType.label === FreightType.FTL && isNullValueOrZero(userParams.lanePrice)) {
        return { lanePrice: "Enter valid lane price" }
    } else if (laneVisible && laneCheck && isNullValueOrZero(userParams.lanePrice)) {
        return { lanePrice: "Enter valid lane price" }
    }
    return true;
}

export function validateShipmentDetails(userParams: any, freightType?: any, doResponse?: any, DOResponse?: any): any {

    const shipmentDeatils = userParams.map((element: any) => {
        if (isNullValue(element.details.pickupPoint)) {
            element.error.pickupPoint = "Enter valid Pickup Point";
        }
        if (isNullValue(element.details.dropPoint)) {
            element.error.dropPoint = "Enter valid Drop Point";
        }
        if (isNullValue(element.details.tatValue)) {
            element.error.tatValue = "Select Valid Option";
        }
        if (isNullValue(element.details.tat)) {
            element.error.tat = "Enter valid tat";
        }
        if (!isNullValue(element.details.consigneeName) && isNullValue(element.details.consignee)) {
            element.error.consignee = "Enter valid consignee";
        }
        // if (!isNullValue(element.details.shipmentTagValue)) {
        //     element.error.shipmentTagValue = "Enter shipment tag";
        // }
        if (isNullValue(element.details.placementDatetime)) {
            element.error.placementDatetime = "Enter valid placement date time";
        }
        if (!isNullValue(element.details.length)) {
            if (isNullValueOrZero(element.details.width)) {
                element.error.width = "Enter valid width";
            }
            if (isNullValueOrZero(element.details.height)) {
                element.error.height = "Enter valid height";
            }
        }
        if (!isNullValue(element.details.width)) {
            if (isNullValueOrZero(element.details.width)) {
                element.error.length = "Enter valid length";
            }
            if (isNullValueOrZero(element.details.height)) {
                element.error.height = "Enter valid height";
            }
        }
        if (!isNullValue(element.details.height)) {
            if (isNullValueOrZero(element.details.length)) {
                element.error.length = "Enter valid length";
            }
            if (isNullValueOrZero(element.details.height)) {
                element.error.height = "Enter valid height";
            }
        }
        if (freightType && freightType.label === FreightType.PTL && isNullValueOrZero(element.details.totalShipmentWeight)) {
            element.error.totalShipmentWeight = "Enter valid Weight";
        }

        if (doResponse?.sourceNumber) {
            // eslint-disable-next-line
            element.details.articles.map((article: any) => {
                if (article.material === undefined || !isNullValue(article.material?.value)) {
                    if (isObjectEmpty(article.material)) {
                        article.materialError = "Select valid material";
                    }
                    if (isNullValueOrZero(article.productQuantity)) {
                        article.productQuantityError = quantityError;
                    }
                }
            });
        } else {
            // eslint-disable-next-line
            element.details.articles.map((article: any) => {
                if (article.article !== undefined || !isNullValue(article.articlesName) || !isNullValueOrZero(article.quantity) || !isNullValueOrZero(article.uom)) {
                    if (isNullValue(article.article)) {
                        article.articleError = articleError;
                    }
                    // if (isNullValueOrZero(article.quantity)) {
                    //     article.quantityError = quantityError;
                    // }
                    if (isNullValueOrZero(article.quantity)) {
                        article.quantityError = quantityError;
                    }
                    if (isNullValueOrZero(article.uom)) {
                        article.uomError = "Select UOM";
                    }
                }
            });
        }

        return element;
    });
    //  || !isNullValue(element.error.partner)
    const error = shipmentDeatils.some(function (element: any) {
        return ((
            !isNullValue(element.error.consignee) || !isNullValue(element.error.pickupPoint) || !isNullValue(element.error.dropPoint)
            || !isNullValue(element.error.tat)
            || !isNullValue(element.error.placementDatetime)
            || !isNullValueOrZero(element.error.length)
            || !isNullValueOrZero(element.error.width)
            || !isNullValueOrZero(element.error.totalShipmentWeight)
            || !isNullValueOrZero(element.error.height) ||
            element.details.articles.some(function (element: any) {
                return (!isNullValue(element.articleError) || !isNullValue(element.quantityError) || !isNullValue(element.materialError) || !isNullValue(element.productQuantityError) || !isNullValue(element.uomError));
            })
        ));
    });

    if (error) {
        return shipmentDeatils;
    } else {
        return true;
    }
}

export function createIndentParams(state: any) {
    let userParams = state.userParams;
    let params: any = {
        freightTypeCode: userParams?.freightType?.value,
        laneCode: userParams?.lane?.value,
        referenceId: userParams?.refId,
        partnerCode: userParams?.partner?.value,
        contractCode: userParams?.contractCode,
        serviceabilityModeCode: userParams?.serviceabilityModeCode?.value,
        originZoneCode: userParams?.originZoneCode,
        destinationZoneCode: userParams?.destination?.value,
        waybillNumber: userParams?.waybillNumber
    };
    if (userParams.freightType.label === FreightType.FTL) {
        params.vehicleTypeCode = userParams.vehicleType.value;
    }
    if (userParams.lanePrice) {
        params.lanePrice = userParams.lanePrice;
    }
    if (userParams.orderRemarks) {
        params.orderRemarks = userParams.orderRemarks;
    }
    params.shipmentDetails = state.shipmentDeatils.map((element: any) => {
        let shipmentList: Array<any> = [];
        let data: any = {
            tat: tatValueConverter(element.details.tatValue.value, element.details.tat),
            placementDatetime: element.details.placementDatetime,
            appointmentDatetime: element.details.appointmentDatetime,
        }

        if (element.details.totalShipmentQuantity) {
            data.totalShipmentQuantity = Number(element.details.totalShipmentQuantity);
        }
        if (element.details.dropPoint) {
            data.dropLocationCode = element.details.dropPoint.value;
        }
        if (element.details.pickupPoint) {
            data.pickupLocationCode = element.details.pickupPoint.value;
        }
        if (element.details.pickupPoint && element.details.pickupPoint.data) {
            data.originLocationCode = element.details.pickupPoint.data.parentLocationCode;
        }
        if (element.details.dropPoint && element.details.dropPoint.data) {
            data.destinationLocationCode = element.details.dropPoint.data.parentLocationCode;
        }
        if (userParams.DODetails && userParams.DODetails.consigneeCode) {
            data.consigneeCode = userParams.DODetails.consigneeCode
        } else {
            if (element.details.consignee) {
                data.consigneeCode = element.details.consignee.value;
            }
        }
        if (element.details.length) {
            data.length = Number(element.details.length);
        }
        if (element.details.width) {
            data.width = Number(element.details.width);
        }
        if (element.details.height) {
            data.height = Number(element.details.height);
        }
        if (element.details.totalShipmentVolume) {
            data.totalShipmentVolume = element.details.totalShipmentVolume;
        }
        if (element.details.totalShipmentWeight) {
            data.totalShipmentWeight = element.details.totalShipmentWeight;
        }
        if (element.details.shipmentTagValue) {
            data.shipmentTag = element.details.shipmentTagValue.value
        }
        if (element.details.lrNumber) {
            data.lrNumber = element.details.lrNumber;
        }
        if (element.details.shipmentRefId) {
            data.shipmentRefId = element.details.shipmentRefId;
        }
        if (element.details.shipmentRemarks) {
            data.shipmentRemarks = element.details.shipmentRemarks;
        }
        if (userParams.DODetails && userParams.DODetails.demandOrderCode) {
            data.demandOrderCode = userParams.DODetails.demandOrderCode
        }
        if (!isObjectEmpty(userParams.DODetails)) {
            // eslint-disable-next-line
            element.details.articles.map((element: any) => {
                if (!isNullValue(element.material) && !isNullValue(element.productQuantity)) {
                    shipmentList.push({
                        articleCode: element.material.value,
                        articleName: element.material.label,
                        count: element.materialQuantity,
                        productQuantity: Number(element.productQuantity),
                        uom: element.unit,
                        refDocketNumber: element.refDocketNumber
                    })
                }
            })
        } else {
            // eslint-disable-next-line
            element.details.articles.map((element: any) => {
                if (!isNullValue(element.article) && !isNullValue(element.quantity) && !isNullValue(element.uom)) {
                    shipmentList.push({
                        articleCode: element.article.value,
                        articleName: element.article.label,
                        count: element.quantity,
                        uom: element.uom.value,
                        refDocketNumber: element.refDocketNumber,
                        productQuantity: Number(element.productQuantity),
                    })
                }
            })
        }

        data.articleDetails = shipmentList;

        if (userParams.freightType.label === FreightType.FTL) {
            data.vehicleTypeCode = userParams.vehicleType.value;
        }
        data.partnerCode = userParams.partner.value;
        return data;
    });
    return params;
}



export function createShipmentParams(orderDetails: any, shipmentData: any, doResponse: any) {
    let shipmentList: Array<any> = [];
    let params: any = {
        freightOrderCode: orderDetails.freightOrderCode,
        shipmentDetails: {
            tat: tatValueConverter(shipmentData.details.tatValue.value, shipmentData.details.tat),
            appointmentDatetime: shipmentData.details.appointmentDatetime,
            placementDatetime: shipmentData.details.placementDatetime,
            partnerCode: orderDetails.partnerCode,
            demandOrderCode: doResponse && doResponse.demandOrderCode,
            //waybillNumber: shipmentData?.details?.waybillNumber
        }
    }
    if (shipmentData.details.totalShipmentQuantity) {
        params.shipmentDetails.totalShipmentQuantity = Number(shipmentData.details.totalShipmentQuantity);
    }
    if (shipmentData.details.dropPoint) {
        params.shipmentDetails.dropLocationCode = shipmentData.details.dropPoint.value;
    }
    if (shipmentData.details.pickupPoint) {
        params.shipmentDetails.pickupLocationCode = shipmentData.details.pickupPoint.value;
    }
    if (shipmentData.details.pickupPoint && shipmentData.details.pickupPoint.data) {
        params.shipmentDetails.originLocationCode = orderDetails.originZoneCode ? shipmentData.details.pickupPoint.value : shipmentData.details.pickupPoint.data.parentLocationCode;
    }
    if (shipmentData.details.dropPoint && shipmentData.details.dropPoint.data) {
        params.shipmentDetails.destinationLocationCode = orderDetails.destinationZoneCode ? shipmentData.details.dropPoint.value : shipmentData.details.dropPoint.data.parentLocationCode;
    }
    if (shipmentData.details.length) {
        params.shipmentDetails.length = Number(shipmentData.details.length);
    }
    if (shipmentData.details.width) {
        params.shipmentDetails.width = Number(shipmentData.details.width);
    }
    if (shipmentData.details.height) {
        params.shipmentDetails.height = Number(shipmentData.details.height);
    }

    if (shipmentData.details.consignee) {
        params.shipmentDetails.consigneeCode = shipmentData.details.consignee.value;
    }
    if (shipmentData.details.shipmentTagValue) {
        params.shipmentDetails.shipmentTag = shipmentData.details.shipmentTagValue.value;
    }

    if (shipmentData.details.totalShipmentVolume) {
        params.shipmentDetails.totalShipmentVolume = shipmentData.details.totalShipmentVolume;
    }
    if (shipmentData.details.totalShipmentWeight) {
        params.shipmentDetails.totalShipmentWeight = shipmentData.details.totalShipmentWeight;
    }
    if (shipmentData.details.lrNumber) {
        params.shipmentDetails.lrNumber = shipmentData.details.lrNumber;
    }
    if (shipmentData.details.shipmentRefId) {
        params.shipmentDetails.shipmentRefId = shipmentData.details.shipmentRefId;
    }
    if (!isNullValue(shipmentData.details.shipmentRemarks)) {
        params.shipmentDetails.shipmentRemarks = shipmentData.details.shipmentRemarks;
    }

    if (doResponse?.sourceNumber) {
        // eslint-disable-next-line
        shipmentData.details.articles.map((element: any) => {
            if (!isNullValue(element.material) && !isNullValue(element.productQuantity)) {
                shipmentList.push({
                    articleCode: element.material.value,
                    articleName: element.material.label,
                    count: element.materialQuantity,
                    productQuantity: Number(element.productQuantity),
                    uom: element.unit,
                    refDocketNumber: element.refDocketNumber,
                    invoiceNumber: element.invoiceNumber

                })
            }
        });
    } else {
        // eslint-disable-next-line
        shipmentData.details.articles.map((element: any) => {
            if (!isNullValue(element.article) && !isNullValue(element.quantity) && !isNullValue(element.uom)) {
                shipmentList.push({
                    articleCode: element.article.value,
                    articleName: element.article.label,
                    count: element.quantity,
                    uom: element.uom.value,
                    productQuantity: Number(element.productQuantity),
                    refDocketNumber: element.refDocketNumber,
                    invoiceNumber: element.invoiceNumber

                })
            }
        });
    }
    params.shipmentDetails.articleDetails = shipmentList;

    if (orderDetails.freightType === FreightType.FTL) {
        params.vehicleTypeCode = orderDetails.vehicleTypeCode;
    }
    return params;
}

export function updateShipmentParams(orderDetails: any, shipmentDeatils: any, shipmentData: any, doResponse: any) {
    let shipmentList: Array<any> = [];
    let params: any = {
        freightOrderCode: shipmentDeatils.freightOrderCode,
        freightShipmentCode: shipmentDeatils.freightShipmentCode,
        tat: tatValueConverter(shipmentData.details.tatValue.value, shipmentData.details.tat),
        placementDatetime: shipmentData.details.placementDatetime,
        appointmentDatetime: shipmentData.details.appointmentDatetime,
        partnerCode: orderDetails.partnerCode,
        //waybillNumber: shipmentData?.details?.waybillNumber

    }
    if (shipmentData.details.totalShipmentQuantity) {
        params.totalShipmentQuantity = Number(shipmentData.details.totalShipmentQuantity);
    }
    if (shipmentData.details.dropPoint) {
        params.dropLocationCode = shipmentData.details.dropPoint.value;
    }
    if (shipmentData.details.pickupPoint) {
        params.pickupLocationCode = shipmentData.details.pickupPoint.value;
    }
    if (shipmentData.details.pickupPoint && shipmentData.details.pickupPoint.data) {
        params.originLocationCode = orderDetails?.originZoneCode ? shipmentData.details.pickupPoint.value : shipmentData.details.pickupPoint.data.parentLocationCode;
    }
    if (shipmentData.details.dropPoint && shipmentData.details.dropPoint.data) {
        params.destinationLocationCode = orderDetails?.destinationZoneCode ? shipmentData.details.dropPoint.value : shipmentData.details.dropPoint.data.parentLocationCode;
    }
    if (shipmentData.details.length) {
        params.length = Number(shipmentData.details.length);
    }
    if (shipmentData.details.width) {
        params.width = Number(shipmentData.details.width);
    }
    if (shipmentData.details.height) {
        params.height = Number(shipmentData.details.height);
    }

    if (shipmentData.details.consignee) {
        params.consigneeCode = shipmentData.details.consignee.value;
    }
    if (shipmentData.details.shipmentTagValue) {
        params.shipmentTag = shipmentData.details.shipmentTagValue.value;
    }
    if (shipmentData.details.totalShipmentVolume) {
        params.totalShipmentVolume = shipmentData.details.totalShipmentVolume;
    }
    if (shipmentData.details.totalShipmentWeight) {
        params.totalShipmentWeight = shipmentData.details.totalShipmentWeight;
    }
    if (shipmentData.details.lrNumber) {
        params.lrNumber = shipmentData.details.lrNumber;
    }
    if (shipmentData.details.shipmentRefId) {
        params.shipmentRefId = shipmentData.details.shipmentRefId;
    }
    if (shipmentData.details.shipmentRemarks) {
        params.shipmentRemarks = shipmentData.details.shipmentRemarks;
    }
    let totalShipmentVolume = shipmentData.details.totalShipmentVolume ? shipmentData.details.totalShipmentVolume.toString() : "";
    let prevtotalShipmentVolume = shipmentData.details.prevtotalShipmentVolume ? shipmentData.details.prevtotalShipmentVolume.toString() : "";
    let totalShipmentWeight = shipmentData.details.totalShipmentWeight ? shipmentData.details.totalShipmentWeight.toString() : "";
    let prevtotalShipmentWeight = shipmentData.details.prevtotalShipmentWeight ? shipmentData.details.prevtotalShipmentWeight.toString() : "";
    let totalShipmentQuantity = shipmentData.details.totalShipmentQuantity ? shipmentData.details.totalShipmentQuantity.toString() : "";
    let prevtotalShipmentQuantity = shipmentData.details.prevtotalShipmentQuantity ? shipmentData.details.prevtotalShipmentQuantity.toString() : "";
    if (totalShipmentVolume !== prevtotalShipmentVolume) {
        params.volumeModified = true;
    }
    if (totalShipmentWeight !== prevtotalShipmentWeight) {
        params.weightModified = true;
    }
    if (totalShipmentQuantity !== prevtotalShipmentQuantity) {
        params.totalShipmentQuantityModified = true;
    }
    if (doResponse?.sourceNumber) {
        // eslint-disable-next-line
        shipmentData.details.articles.map((element: any) => {
            if (!isNullValue(element.material) && !isNullValue(element.productQuantity)) {
                shipmentList.push({
                    articleCode: element.material.value,
                    articleName: element.material.label,
                    count: element.materialQuantity,
                    productQuantity: Number(element.productQuantity),
                    uom: element.unit,
                    refDocketNumber: element.refDocketNumber,
                    invoiceNumber: element.invoiceNumber
                })
            }
        })
            ;
    } else {
        // eslint-disable-next-line
        shipmentData.details.articles.map((element: any) => {
            if (!isNullValue(element.article) && !isNullValue(element.quantity) && !isNullValue(element.uom)) {
                shipmentList.push({
                    articleCode: element.article.value,
                    articleName: element.article.label,
                    count: element.quantity,
                    productQuantity: Number(element.productQuantity),
                    uom: element.uom.value,
                    refDocketNumber: element.refDocketNumber,
                    invoiceNumber: element.invoiceNumber
                })
            }
        });
    }
    params.articleDetails = shipmentList;
    if (orderDetails.freightType === FreightType.FTL) {
        params.vehicleTypeCode = orderDetails.vehicleTypeCode;
    }
    return params;
}

