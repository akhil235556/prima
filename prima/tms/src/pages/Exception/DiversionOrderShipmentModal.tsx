import { TextareaAutosize } from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FreightType, tatOptions } from '../../base/constant/ArrayList';
import {
    appointmentDateTimeLabel, appointmentDateTimePlaceholder, constraintBreachContinue, LBHLabel,
    numberOfBoxes, numberOfBoxesPlaceHolder, placementDateTimeLabel, placementDateTimePlaceholder,
    remarkLabel, tatLabelWithoutUnit, tatPlaceholder, VolumeLabel, volumePlaceholder
} from "../../base/constant/MessageUtils";
import { convertDateTimeServerFormat, displayDateTimeFormatter } from "../../base/utility/DateUtils";
import { isNullValue, isObjectEmpty } from "../../base/utility/StringUtils";
import AutoComplete from "../../component/widgets/AutoComplete";
import AutoSuggest from "../../component/widgets/AutoSuggest";
import CardContentSkeleton from "../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import EditText from '../../component/widgets/EditText';
import NumberEditText from "../../component/widgets/NumberEditText";
import { OptionType } from "../../component/widgets/widgetsInterfaces";
import ModalContainer from "../../modals/ModalContainer";
import WarningModal from "../../modals/warningModal/WarningModal";
import { autosuggestSearchLength } from "../../moduleUtility/ConstantValues";
import {
    // getStringAutoCompleteData,
    removeListItem, setAutoCompleteListWithData
} from "../../moduleUtility/DataUtils";
import { showAlert } from "../../redux/actions/AppActions";
import { searchCustomer } from "../../serviceActions/ConsigneeServiceActions";
import { convertUom, getBulkMaterialUnitsCount } from "../../serviceActions/MaterialServiceActions";
import { addShipment, editShipment, getOrderLocations } from '../../serviceActions/OrderServiceActions';
import { getDOList, getDoMaterialList } from "../freight/demandOrders/demandOrdersApi/demandOrderServiceActions";
// import { getLrNumberListDetails } from "../../../serviceActions/ServiceabilityServiceActions";
import { createShipmentParams, DiversionRenderArticles, diversionValidateShipmentDetails, updateShipmentParams } from "./DiversionRaiseOrderViewUtils";


interface DiversionOrderShipmentModalProps {
    open: boolean,
    onClose: any
    onSuccess: any
    selectedElement: any,
    shipmentDeatils?: any,
    freightOrderCode?: any,
    servicabiltyTat?: any
    freightType?: any
    doResponse: any
    doMaterialResponse?: any
    setDOResponse?: any
    setDOMaterialResponse?: any
    order?: any
    showDONumber?: boolean
}

function DiversionOrderShipmentModal(props: DiversionOrderShipmentModalProps) {
    const { open, onClose, selectedElement, onSuccess, shipmentDeatils, freightOrderCode, freightType, doResponse, doMaterialResponse, setDOResponse, setDOMaterialResponse, order, showDONumber } = props;
    const appDispatch = useDispatch();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [partnerList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [customerList, setCustomerList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [details, setDetails] = React.useState<any>({ error: {}, details: {} });
    const [pickupPointsList, setPickUpPointsList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [dropPointsList, setDropPointsList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [skeletonLoading, setSkeletonLoading] = React.useState<boolean>(false);
    const [doList, setDOList] = React.useState<any>(undefined)
    const [warningModalDetails, setWarningModalDetails] = React.useState<{ open: boolean, warningMessage?: any }>({ open: false });
    const [constraintBreachDetails, setConstraintBreachDetails] = React.useState<any>(undefined);

    useEffect(() => {
        const getDetails = async () => {
            if (selectedElement) {
                setSkeletonLoading(true);
                var pickupList, dropList;
                if (selectedElement.laneCode) {
                    let orderLocationsResponse = await appDispatch(getOrderLocations({ laneCode: selectedElement.laneCode, freightOrderCode: freightOrderCode, isDiverting: true }));
                    if (orderLocationsResponse) {
                        pickupList = setAutoCompleteListWithData(orderLocationsResponse.pickupList, "locationName", "locationCode");
                        dropList = setAutoCompleteListWithData(orderLocationsResponse.dropList, "locationName", "locationCode");
                        setPickUpPointsList(pickupList);
                        setDropPointsList(dropList);
                    }

                }
                let materialUnitResponse: any = undefined;
                if (shipmentDeatils) {
                    if (isNullValue(doResponse)) {
                        let skuCodeArray: any = [];
                        shipmentDeatils?.articleDetails?.forEach((element: any) => {
                            if (element.productSku) {
                                skuCodeArray.push(element.productSku);
                            }
                        })
                        setSkeletonLoading(true);
                        if (skuCodeArray && skuCodeArray.length > 0) {
                            materialUnitResponse = await appDispatch(getBulkMaterialUnitsCount({ skuCode: skuCodeArray }))
                        }
                        setSkeletonLoading(false);
                    }
                    let details = {
                        demandOrderCode: shipmentDeatils.demandOrderCode,
                        partnerName: selectedElement.partnerName,
                        partner: {
                            label: selectedElement.partnerName,
                            value: selectedElement.partnerCode,
                        },
                        pickupPointName: shipmentDeatils.originLocationName,
                        pickupPoint: {
                            label: shipmentDeatils.pickupLocationName,
                            value: shipmentDeatils.pickupLocationCode,
                            data: {
                                parentLocationCode: shipmentDeatils.originLocationCode
                            }
                        },
                        dropPointName: shipmentDeatils.destinationLocationName,
                        dropPoint: {
                            label: shipmentDeatils.dropLocationName,
                            value: shipmentDeatils.dropLocationCode,
                            data: {
                                parentLocationCode: shipmentDeatils.destinationLocationCode
                            }
                        },
                        tat: shipmentDeatils.tat,
                        // tat: shipmentDeatils.orderPlacementDatetime && shipmentDeatils.orderAppointmentDatetime ? setTatByDifference(shipmentDeatils.orderPlacementDatetime, shipmentDeatils.orderAppointmentDatetime) : shipmentDeatils.tat,
                        tatValue: tatOptions[0],
                        volume: shipmentDeatils.volume,
                        weight: shipmentDeatils.weight,
                        length: shipmentDeatils.length,
                        width: shipmentDeatils.width,
                        height: shipmentDeatils.height,
                        consigneeName: shipmentDeatils.consigneeName,
                        totalShipmentVolume: shipmentDeatils.totalShipmentVolume,
                        prevtotalShipmentVolume: shipmentDeatils.totalShipmentVolume,
                        totalShipmentWeight: shipmentDeatils.totalShipmentWeight,
                        prevtotalShipmentWeight: shipmentDeatils.totalShipmentWeight,
                        lrNumber: shipmentDeatils.lrNumber,
                        shipmentRefId: shipmentDeatils.shipmentRefId,
                        shipmentRemarks: shipmentDeatils.shipmentRemarks,
                        totalShipmentQuantity: shipmentDeatils.totalShipmentQuantity,
                        prevtotalShipmentQuantity: shipmentDeatils.totalShipmentQuantity,
                        placementDatetime: convertDateTimeServerFormat(shipmentDeatils.placementDatetime),
                        appointmentDatetime: shipmentDeatils && shipmentDeatils.appointmentDatetime && convertDateTimeServerFormat(shipmentDeatils.appointmentDatetime),
                        consignee: {
                            label: shipmentDeatils.consigneeName,
                            value: shipmentDeatils.consigneeCode,
                        },
                        sourceNumber: shipmentDeatils && shipmentDeatils.sourceNumber
                    }
                    let newArticles: any = []
                    setSkeletonLoading(true)
                    shipmentDeatils.articleDetails && shipmentDeatils.articleDetails.forEach(async (element: any, index: number) => {
                        let data: any = {
                            index: index,
                        }
                        if (element.articleName) {
                            if (doMaterialResponse) {
                                let materialDetails = doMaterialResponse?.find((item: any) => item.materialCode === element.articleCode)
                                data.material = {
                                    label: element.articleName,
                                    value: element.articleCode,
                                    data: materialDetails && { ...materialDetails },
                                }
                                data.materialUnit = materialDetails?.materialUnits;
                                data.balanceQuantity = materialDetails?.balanceQuantity;
                                data.materialQuantity = element.totalArticleCount;
                                data.unit = element.uom;
                                data.articlesName = element.articleName;
                                data.productQuantity = element.totalArticleQuantity;
                                data.isDisabledMaterialQuantity = true;
                                newArticles.push(data)
                                saveDetails({
                                    ...details,
                                    articles: newArticles,
                                }, {
                                    dropPoint: ""
                                })
                            } else {
                                let materialUnitCountDetails = materialUnitResponse?.find((item: any) => item.code === element.articleCode)
                                data.article = {
                                    label: element.articleName,
                                    value: element.articleCode,
                                    data: materialUnitCountDetails
                                };
                                data.units = materialUnitCountDetails?.units
                                data.quantity = element.totalArticleCount;
                                data.uom = {
                                    label: element.uom,
                                    value: element.uom
                                }
                                data.articlesName = element.articleName;
                                data.productQuantity = element.totalArticleQuantity;
                                data.isDisabledMaterialQuantity = true;
                                // newArticles.push(data)
                                if (!(materialUnitCountDetails?.isBulk)) {
                                    if (element.uom === materialUnitCountDetails?.weightUom) {
                                        data.multiplyingFactor = materialUnitCountDetails?.weight
                                    }
                                    else if (element.uom === materialUnitCountDetails.volumeUom) {
                                        data.multiplyingFactor = materialUnitCountDetails?.volume
                                    }
                                    else if (element.uom === "EACH") {
                                        data.multiplyingFactor = materialUnitCountDetails?.units
                                    } else {
                                        let params = {
                                            weight: materialUnitCountDetails?.weight,
                                            volume: materialUnitCountDetails?.volume,
                                            weightUom: materialUnitCountDetails?.weightUom,
                                            volumeUom: materialUnitCountDetails?.volumeUom,
                                            units: materialUnitCountDetails?.units,
                                            toUom: element.uom
                                        }
                                        let response = await appDispatch(convertUom(params))
                                        if (response && response.value) {
                                            data.multiplyingFactor = response.value
                                        } else {
                                            data.uom = undefined
                                        }
                                    }
                                }
                                newArticles[index] = { ...data }
                                saveDetails({
                                    ...details,
                                    articles: newArticles,
                                }, {
                                    dropPoint: ""
                                })
                            }
                        } else {
                            newArticles[index] = { ...data }
                            saveDetails({
                                ...details,
                                articles: newArticles,
                            }, {
                                dropPoint: ""
                            })
                        }
                    })
                    setSkeletonLoading(false)
                    // saveDetails({
                    //     demandOrderCode: shipmentDeatils.demandOrderCode,
                    //     partnerName: selectedElement.partnerName,
                    //     partner: {
                    //         label: selectedElement.partnerName,
                    //         value: selectedElement.partnerCode,
                    //     },
                    //     pickupPointName: shipmentDeatils.originLocationName,
                    //     pickupPoint: {
                    //         label: shipmentDeatils.pickupLocationName,
                    //         value: shipmentDeatils.pickupLocationCode,
                    //         data: {
                    //             parentLocationCode: shipmentDeatils.originLocationCode
                    //         }
                    //     },
                    //     dropPointName: shipmentDeatils.destinationLocationName,
                    //     dropPoint: {
                    //         label: shipmentDeatils.dropLocationName,
                    //         value: shipmentDeatils.dropLocationCode,
                    //         data: {
                    //             parentLocationCode: shipmentDeatils.destinationLocationCode
                    //         }
                    //     },
                    //     tat: shipmentDeatils.tat,
                    //     // tat: shipmentDeatils.orderPlacementDatetime && shipmentDeatils.orderAppointmentDatetime ? setTatByDifference(shipmentDeatils.orderPlacementDatetime, shipmentDeatils.orderAppointmentDatetime) : shipmentDeatils.tat,
                    //     tatValue: tatOptions[0],
                    //     volume: shipmentDeatils.volume,
                    //     weight: shipmentDeatils.weight,
                    //     length: shipmentDeatils.length,
                    //     width: shipmentDeatils.width,
                    //     height: shipmentDeatils.height,
                    //     consigneeName: shipmentDeatils.consigneeName,
                    //     totalShipmentVolume: shipmentDeatils.totalShipmentVolume,
                    //     prevtotalShipmentVolume: shipmentDeatils.totalShipmentVolume,
                    //     totalShipmentWeight: shipmentDeatils.totalShipmentWeight,
                    //     prevtotalShipmentWeight: shipmentDeatils.totalShipmentWeight,
                    //     lrNumber: shipmentDeatils.lrNumber,
                    //     shipmentRefId: shipmentDeatils.shipmentRefId,
                    //     shipmentRemarks: shipmentDeatils.shipmentRemarks,
                    //     totalShipmentQuantity: shipmentDeatils.totalShipmentQuantity,
                    //     prevtotalShipmentQuantity: shipmentDeatils.totalShipmentQuantity,
                    //     placementDatetime: convertDateTimeServerFormat(shipmentDeatils.placementDatetime),
                    //     appointmentDatetime: shipmentDeatils && shipmentDeatils.appointmentDatetime && convertDateTimeServerFormat(shipmentDeatils.appointmentDatetime),
                    //     consignee: {
                    //         label: shipmentDeatils.consigneeName,
                    //         value: shipmentDeatils.consigneeCode,
                    //     },
                    //     sourceNumber: shipmentDeatils && shipmentDeatils.sourceNumber,
                    //     articles: shipmentDeatils.articleDetails && shipmentDeatils.articleDetails.map((element: any, index: number) => {
                    //         let data: any = {
                    //             index: index,
                    //         }
                    //         if (element.articleName) {
                    //             if (doMaterialResponse) {
                    //                 let materialDetails = doMaterialResponse?.find((item: any) => item.materialCode === element.articleCode)
                    //                 data.material = {
                    //                     label: element.articleName,
                    //                     value: element.articleCode,
                    //                     data: materialDetails && { ...materialDetails },
                    //                 }
                    //                 data.materialUnit = materialDetails?.materialUnits;
                    //                 data.balanceQuantity = materialDetails?.balanceQuantity;
                    //                 data.materialQuantity = element.totalArticleCount;
                    //                 data.unit = element.uom;
                    //             } else {
                    //                 let materialUnitCountDetails = materialUnitResponse?.find((item: any) => item.skuCode === element.productSku)
                    //                 data.article = {
                    //                     label: element.articleName,
                    //                     value: element.articleCode,
                    //                 };
                    //                 data.units = materialUnitCountDetails?.units
                    //                 data.quantity = element.totalArticleCount;
                    //                 data.uom = {
                    //                     label: element.uom,
                    //                     value: element.uom
                    //                 }
                    //             }
                    //             data.articlesName = element.articleName;
                    //             data.productQuantity = element.totalArticleQuantity;
                    //             data.isDisabledMaterialQuantity = true;
                    //         }
                    //         return data;
                    //     })
                    // }, {})
                } else {
                    saveDetails({
                        partnerName: selectedElement.partnerName,
                        partner: {
                            label: selectedElement.partnerName,
                            value: selectedElement.partnerCode,
                        },
                        volume: "",
                        weight: "",
                        totalShipmentVolume: "",
                        totalShipmentWeight: "",
                        totalShipmentQuantity: "",
                        length: "",
                        width: "",
                        height: "",
                        lrNumber: "",
                        shipmentRefId: "",
                        shipmentRemarks: "",
                        articles: [{
                            index: 0
                        }],
                        pickupPointName: pickupList && pickupList[0]?.label,
                        pickupPoint: pickupList && pickupList[0],
                        dropPointName: dropList && dropList[0]?.label,
                        dropPoint: dropList && dropList[0],
                        consigneeName: doResponse ? doResponse.consigneeName : dropList && dropList[0]?.data?.consigneeName,
                        consignee: doResponse ? {
                            label: doResponse.consigneeName,
                            value: doResponse.consigneeCode
                        } : {
                            label: dropList && dropList[0]?.data?.consigneeName,
                            value: dropList && dropList[0]?.data?.consigneeCode
                        },
                        placementDatetime: convertDateTimeServerFormat(selectedElement.orderPlacementDatetime),
                        appointmentDatetime: selectedElement && selectedElement.orderAppointmentDatetime && convertDateTimeServerFormat(selectedElement.orderAppointmentDatetime),
                        tat: selectedElement.orderTat,
                        //tat: selectedElement.orderPlacementDatetime && selectedElement.orderAppointmentDatetime ? setTatByDifference(selectedElement.orderPlacementDatetime, selectedElement.orderAppointmentDatetime) : selectedElement.orderTat,
                        tatValue: tatOptions[0],
                    }, {
                        partner: "",
                    })
                }
                setSkeletonLoading(false);
            }
        }
        open && getDetails();
        // eslint-disable-next-line
    }, [open, shipmentDeatils])

    return (
        <ModalContainer
            title={"Shipment"}
            primaryButtonTitle={"Save"}
            primaryButtonStyle="btn-blue"
            primaryButtonLeftIcon={<CheckCircle />}
            open={open}
            styleName="order-shipment-modal"
            onApply={() => {
                let validate = diversionValidateShipmentDetails([details], { label: freightType }, doResponse, order, showDONumber);
                if (validate === true) {
                    addNewShipment();
                } else {
                    setDetails({
                        error: validate[0].error,
                        details: validate[0].details
                    });
                }
            }}
            loading={loading}
            onClose={() => {
                setDetails({
                    error: {},
                    details: {
                        articles: [{
                            index: 0
                        }]
                    }
                });
                onClose();
            }}
        ><WarningModal
                open={warningModalDetails?.open}
                onClose={() => {
                    setWarningModalDetails({ open: false });
                    setConstraintBreachDetails(undefined);
                    setLoading(false);
                }}
                warningMessage={<div><p className="warning-constraint">{warningModalDetails.warningMessage}</p><p className="warning-continue">{constraintBreachContinue}</p></div>}
                primaryButtonTitle={"Yes"}
                secondaryuttonTitle={"No"}
                onSuccess={() => {
                    setWarningModalDetails({ open: false });
                    addNewShipment();
                }}
            />
            {skeletonLoading ?
                <CardContentSkeleton row={6} column={2} />
                :
                <>
                    <div className=" shipment_Details row">
                        <div className="col-md-12 col-lg-12">
                            <div className="custom-form-row row align-items-end">
                                {((order && order === "DO") || showDONumber) &&
                                    <div className="col-md-6 form-group">
                                        <AutoSuggest
                                            label="Do Number"
                                            mandatory
                                            error={details.error.demandOrderCode}
                                            placeHolder="DO Number"
                                            value={details.details.demandOrderCode}
                                            isDisabled={false}
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
                                                        response && setDOList(setAutoCompleteListWithData(response && response.data, "demandOrderCode", "demandOrderCode"));
                                                    })
                                                }
                                            }}
                                            onSelected={(element: OptionType) => {
                                                appDispatch(getDoMaterialList({ demandOrderCode: element.label })).then((response: any) => {
                                                    if (response) {
                                                        setDOResponse(element.data)
                                                        setDOMaterialResponse(response)
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
                                <div className="col-md-6 form-group">
                                    <AutoComplete
                                        label="Pickup Point"
                                        mandatory
                                        placeHolder="Enter Pickup Point"
                                        error={details.error.pickupPoint}
                                        value={details.details.pickupPoint}
                                        options={pickupPointsList}
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
                                <div className="col-md-6 form-group">
                                    <AutoComplete
                                        label="Drop Point"
                                        mandatory
                                        placeHolder="Enter Drop Point"
                                        error={details.error.dropPoint}
                                        value={details.details.dropPoint}
                                        options={dropPointsList}
                                        onChange={(element: OptionType) => {
                                            if (doResponse) {
                                                saveDetails({
                                                    dropPointName: element.label,
                                                    dropPoint: element,
                                                }, {
                                                    dropPoint: ""
                                                })
                                            } else {
                                                let consigneeDetails: any = {};
                                                if (element.data.consigneeName) {
                                                    consigneeDetails.consigneeName = element.data.consigneeName;
                                                    consigneeDetails.consignee = {
                                                        label: element.data.consigneeName,
                                                        value: element.data.consigneeCode
                                                    }
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
                                            }
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <AutoComplete
                                        label={tatLabelWithoutUnit}
                                        mandatory
                                        placeHolder={tatPlaceholder}
                                        isDisabled={true}
                                        value={details.details.tatValue}
                                        error={details.error.tatValue}
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
                                <div className="form-group col-md-3">
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
                                <div className="col-md-6 form-group">
                                    <AutoSuggest
                                        label="Transporter"
                                        mandatory
                                        error={details.error.partner}
                                        placeHolder="Enter Transporter Name"
                                        value={details.details.partnerName}
                                        isDisabled={true}
                                        suggestions={partnerList}
                                        onChange={(text: string) => {
                                        }}
                                        handleSuggestionsFetchRequested={({ value }: any) => {
                                        }}
                                        onSelected={(element: OptionType) => {
                                        }}
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <AutoSuggest
                                        label="Consignee"
                                        error={details.error.consignee}
                                        placeHolder="Enter Consignee Name"
                                        isDisabled={doResponse ? true : false}
                                        value={details.details.consigneeName}
                                        suggestions={customerList}
                                        onChange={(text: string) => {
                                            saveDetails({
                                                consigneeName: text,
                                                consignee: undefined,
                                            }, {
                                                consignee: ""
                                            })
                                        }}
                                        handleSuggestionsFetchRequested={({ value }: any) => {
                                            if (value.length > autosuggestSearchLength) {
                                                appDispatch(searchCustomer({ query: value, queryField: "customer.name" })).then((response: any) => {
                                                    response && setCustomerList(setAutoCompleteListWithData(response, "customerName", "customerCode"));
                                                })
                                            }
                                        }}
                                        onSelected={(element: OptionType) => {
                                            saveDetails({
                                                consigneeName: element.label,
                                                consignee: element,
                                                consigneeAddressName: undefined,
                                                consigneeAddress: undefined,
                                            }, {
                                                consignee: "",
                                                consigneeAddress: ""
                                            })
                                        }}
                                    />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label className="picker-label">{placementDateTimeLabel}<span className="mandatory-flied">*</span></label>
                                    <DateTimePicker
                                        className="custom-date-picker"
                                        placeholder={placementDateTimePlaceholder}
                                        hiddenLabel
                                        disablePast
                                        helperText={details.error.placementDatetime}
                                        format={displayDateTimeFormatter}
                                        value={details.details.placementDatetime || null}
                                        onChange={(date: any) => {

                                            // let tatValueDiff: any = details.details.tat;
                                            // if (details.details && details.details.appointmentDatetime) {
                                            //     tatValueDiff = setTatByDifference(date, details.details.appointmentDatetime)
                                            // }
                                            saveDetails({
                                                placementDatetime: convertDateTimeServerFormat(date),
                                                // tat: tatValueDiff
                                            }, {
                                                placementDatetime: ""
                                            })
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-6">
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
                                <div className="form-group col-md-6">
                                    <NumberEditText
                                        label={"Weight (kg)"}
                                        placeholder="Enter Weight"
                                        maxLength={11}
                                        mandatory={freightType && (freightType === FreightType.PTL)}
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
                                <div className="form-group col-md-6">
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

                                <div className="form-group col-md-6">
                                    <EditText
                                        label={"Shipment Reference Id"}
                                        placeholder="Enter Shipment Reference Id"
                                        maxLength={25}
                                        value={details.details && details.details.shipmentRefId}
                                        onChange={(text: string) => {
                                            saveDetails({
                                                shipmentRefId: text.trim()
                                            }, {
                                                shipmentRefId: ""
                                            })
                                        }}
                                    />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label className="picker-label">{appointmentDateTimeLabel}</label>
                                    <DateTimePicker
                                        className="custom-date-picker"
                                        placeholder={appointmentDateTimePlaceholder}
                                        hiddenLabel
                                        disablePast
                                        helperText={details.error.appointmentDatetime}
                                        format={displayDateTimeFormatter}
                                        value={details.details.appointmentDatetime || null}
                                        onChange={(date: any) => {
                                            // let tatValueDiff: any = details.details.tat;
                                            // if (details.details && details.details.placementDatetime) {
                                            //     tatValueDiff = setTatByDifference(details.details.placementDatetime, date)
                                            // }
                                            saveDetails({
                                                appointmentDatetime: convertDateTimeServerFormat(date),
                                                // tat: tatValueDiff
                                            }, {
                                                appointmentDatetime: ""
                                            })
                                        }}
                                    />
                                </div>
                                <div className="remarks form-group col-12 col-md-6">
                                    <label className="d-flex align-items-center">Remark</label>
                                    <TextareaAutosize
                                        rowsMax={3}
                                        rowsMin={3}
                                        aria-label="maximum height"
                                        placeholder={remarkLabel}
                                        value={details.details && details.details.shipmentRemarks}
                                        onChange={(event: any) => {
                                            saveDetails({
                                                shipmentRemarks: event.target.value
                                            }, {
                                                shipmentRemarks: ""
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mb-0 form-group col-md-6 pl_0">
                                <label>{LBHLabel}</label>
                            </div>
                            <div className="row">
                                <div className="inputBox col-md-6">

                                    <div className="form-group ">
                                        <NumberEditText
                                            placeholder="Enter length"
                                            maxLength={5}
                                            allowNegative={false}
                                            decimalScale={2}
                                            // disabled={doResponse && doResponse.sourceNumber}
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
                                    <div className="form-group ">
                                        <NumberEditText
                                            placeholder="Enter width"
                                            maxLength={5}
                                            allowNegative={false}
                                            // disabled={doResponse && doResponse.sourceNumber}
                                            decimalScale={2}
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
                                    <div className="form-group ">
                                        <NumberEditText
                                            placeholder="Enter height"
                                            maxLength={5}
                                            allowNegative={false}
                                            // disabled={doResponse && doResponse.sourceNumber}
                                            decimalScale={2}
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
                                <div className="custom_input form-group col-md-6">
                                    <NumberEditText
                                        label={numberOfBoxes}
                                        placeholder={numberOfBoxesPlaceHolder}
                                        maxLength={11}
                                        // disabled={doResponse && doResponse.sourceNumber}
                                        decimalSeparator={false}
                                        allowNegative={false}
                                        onBlur={() => {
                                            if (isNullValue(details.details && details.details.totalShipmentQuantity)) {
                                                saveDetails({
                                                    totalShipmentQuantity: ""
                                                }, {
                                                    totalShipmentQuantity: ""
                                                })
                                            }
                                        }}
                                        error={details.error.totalShipmentQuantity}
                                        value={details.details && details.details.totalShipmentQuantity}
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
                    <div className="shipmentDetails row">
                        {details.details.articles && details.details.articles.map((element: any, index: number) => (
                            <DiversionRenderArticles
                                showDONumber={showDONumber}
                                order={order}
                                key={index}
                                classStyle="col-md-12 pr-15"
                                element={element}
                                DODetails={doResponse}
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
                                            article: undefined,
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
                                            uomError: "",
                                            uom: undefined,
                                            articlesName: article.label,
                                            units: article?.data?.units,
                                            productQuantity: "",
                                            quantity: "",
                                            productQuantityError: "",
                                            quantityError: "",
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
                                            materialUnit: material?.data?.materialUnits,
                                            balanceQuantity: material?.data?.balanceQuantity,
                                            materialQuantity: "",
                                            productQuantity: "",
                                            productQuantityError: ""
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
                                        if (isNullValue(doResponse)) {
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
                                        if (isNullValue(doResponse)) {
                                            articles = details.details.articles.map(
                                                (data: any) => ((data.index === quantityIndex) ? {
                                                    ...data,
                                                    quantityError: "",
                                                    productQuantityError: "",
                                                    productQuantity: value,
                                                    isDisabledMaterialQuantity: Number(value) > 0,
                                                    quantity: (data.multiplyingFactor) ? Math.ceil(value / data.multiplyingFactor) : Number(value)
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
                                                    materialQuantity: data.materialUnit ? Math.ceil(value / data.materialUnit) : Number(value)
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
                </>
            }
            <div className="shipment-modal-line"></div>

        </ModalContainer>
    );

    function saveDetails(value: any, error: any) {
        setDetails({
            ...details,
            details: {
                ...details.details,
                ...value
            },
            error: {
                ...details.error,
                ...error
            }
        });
    }

    function addNewShipment() {
        setLoading(true);
        if (shipmentDeatils) {
            let params = updateShipmentParams(selectedElement, shipmentDeatils, details, doResponse);
            if (constraintBreachDetails && !isObjectEmpty(constraintBreachDetails?.failedConstraint)) {
                let ignoredConstraints: any = constraintBreachDetails?.ignoredConstraints ? constraintBreachDetails?.ignoredConstraints : [];
                ignoredConstraints.push(constraintBreachDetails?.failedConstraint)
                params.ignored_constraints = [...ignoredConstraints];
            }
            appDispatch(editShipment(params)).then((response: any) => {
                if (response) {
                    if (response?.details && response?.code === 700) {
                        setWarningModalDetails({ open: true, warningMessage: response.message });
                        setConstraintBreachDetails(response.details)
                        return
                    }
                    response.message && appDispatch(showAlert(response.message));
                    setDetails({
                        error: {},
                        details: {
                            articles: [{
                                index: 0
                            }]
                        }
                    })
                    setConstraintBreachDetails(undefined)
                    onSuccess();
                }
                setLoading(false);
            })
        } else {
            let params = createShipmentParams(selectedElement, details, doResponse);
            if (constraintBreachDetails && !isObjectEmpty(constraintBreachDetails?.failedConstraint)) {
                let ignoredConstraints: any = constraintBreachDetails?.ignoredConstraints ? constraintBreachDetails?.ignoredConstraints : [];
                ignoredConstraints.push(constraintBreachDetails?.failedConstraint)
                params.ignored_constraints = [...ignoredConstraints];
            }
            appDispatch(addShipment(params)).then((response: any) => {
                if (response && response.details) {
                    if (response?.code === 700) {
                        setWarningModalDetails({ open: true, warningMessage: response.message });
                        setConstraintBreachDetails(response.details)
                        return
                    }
                    response.message && appDispatch(showAlert(response.message));
                    setDetails({
                        error: {},
                        details: {
                            articles: [{
                                index: 0
                            }]
                        }
                    })
                    setConstraintBreachDetails(undefined)
                    onSuccess();
                }
                setLoading(false);
            })
        }

    }
}

export default DiversionOrderShipmentModal;
