import { Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { AddCircle, CheckCircle, Close, Create, KeyboardBackspace, Mail, Publish, Today, Visibility } from '@material-ui/icons';
import Info from '@material-ui/icons/Info';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { contractCreationTabValue, FreightType, ServicabilityType } from "../../../base/constant/ArrayList";
import {
    ApprovedBy, contractId, contractModeLabel, DetentionLabel, freightLabel, GstLabel, laneTitle,
    modLabel, noDataAvailableMessage, orderStatusLabel, referenceIdLabel,
    TerminatedBy, transporterLabel,
    ValidityFromLabel, ValidityToLabel, vehicleTypeLabel, VolumetricWeightLabel, zoneTitle
} from "../../../base/constant/MessageUtils";
import { ContractUrl } from '../../../base/constant/RoutePath';
import { convertDateFormat, displayDateFormatter } from '../../../base/utility/DateUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import ContractFreightAlertBox from '../../../component/alert/ContractFreightAlertBox';
import { LaneView } from '../../../component/CommonView';
import Filter from '../../../component/filter/Filter';
import Information from '../../../component/information/Information';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
import CardContentSkeleton from '../../../component/widgets/cardContentSkeleton/CardContentSkeleton';
import { CustomToolTip } from '../../../component/widgets/CustomToolTip';
import FileUploadModal from "../../../modals/FileUploadModal";
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { showAlert } from '../../../redux/actions/AppActions';
import { hideLoading, showLoading } from '../../../redux/actions/CreateContractActions';
import CreateContractReducer, { CREATE_CONTRACT_STATE } from "../../../redux/reducers/CreateContractReducer";
import { approveContract, getConstraints, getContractDetails, templateConstraints, terminateContract } from '../../../serviceActions/ContractServiceActions';
import {
    createContractFreightRates,
    deleteContractFreightRates, getContractFreightRates, getFreightChargesList, getFreightRules, getFreightVariableList, putContractFreightRates
} from "../../../serviceActions/FrightRateServiceAction";
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';
import AddConstraints from './AddConstraints';
import AddConstraintsList from './AddConstraintsList';
import { createConstraintsParams, getConstraintsList, validateData } from './AddConstraintsUtility';
import CancelTerminateModal from './CancelTerminateModal';
import ContractRenewModal from './ContractRenewModal';
import "./CreateContractFreight.css";
import EditConfirmationModal from './EditConfirmationModal';
import FreightCharges from './FreightCharges';
import FreightResponseView from './FreightResponseView';
import ViewPdfModal from './ViewPdfModal';

interface CreateContractFreightProps {
    editMode?: boolean
}

const initialErrorObj: any = {
    rateType: "",
    lane: "",
    charges: "",
    operation: "",
    variable: "",
    amount: "",
    slabs: undefined,
    rules: undefined,
}

const CreateContractFreight = ({ editMode }: CreateContractFreightProps) => {
    const [contractDetails, setContractDetails] = useState<any>({});
    const [state = CREATE_CONTRACT_STATE, dispatch] = useReducer(CreateContractReducer, CREATE_CONTRACT_STATE);
    const [freightCharges, setFreightCharges] = useState<any>([])
    const [freightRules, setFreightRules] = useState<any>([]);
    const [errors, setErrors] = useState<any>([]);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [openPointModal, setOpenPointModal] = useState<boolean>(false);
    const { id } = useParams<any>();
    const history = useHistory();
    const appDispatch = useDispatch();
    const [openModal, setOpenModal] = React.useState(false);
    const [viewPdf, setViewPdf] = React.useState<boolean>(false);
    const [cancelModal, setCancelModal] = React.useState<boolean>(false);
    const [contractRenewalModal, setContractRenewalModal] = React.useState<boolean>(false);
    const [refresh, setRefresh] = React.useState<boolean>(false);
    const [contractSuccesModal, setContractSuccessModal] = React.useState<boolean>(false);
    const [freightResponse, setFreightResponse] = React.useState<any>([]);
    const [editModal, setEditModal] = React.useState<boolean>(false);
    const [successMessage, setSuccessMessage] = React.useState<string>("");
    const [tabIndex, setTabIndex] = React.useState<any>(0);
    let identifier = useRef(0);
    let slabId = useRef(100);
    let ruleId = useRef(100);
    const [userParams, setUserParams] = React.useState<any>([]);
    const [constraints, setConstraints] = React.useState<any>([]);
    const [error, setError] = React.useState<any>([]);
    let tabValues = contractDetails?.contractType === "FTL" ? contractCreationTabValue : contractCreationTabValue.slice(0, 1);

    useEffect(() => {
        if (contractDetails?.contractCode) {
            Promise.all([appDispatch(templateConstraints({})), appDispatch(getConstraints({ contractCode: contractDetails?.contractCode }))])
                .then((response: any) => {
                    if (response && response[0]) {
                        setConstraints(setAutoCompleteListWithData(response[0], "label", "value"));
                    }
                    if (response && response[1]) {
                        let constraints = getConstraintsList(response);
                        if (constraints?.length) {
                            setUserParams([...constraints]);
                        }
                    }
                });
        }
        //eslint-disable-next-line
    }, [contractDetails]);

    useEffect(() => {
        async function initialiseApp() {
            dispatch(showLoading())
            const contractResponse = await appDispatch(getContractDetails({ contractCode: id }));
            if (contractResponse) {
                let promiseArray: any = [
                    appDispatch(getFreightRules()),
                    appDispatch(getFreightChargesList(dispatch, { freightType: contractResponse?.contractType, contractMode: contractResponse?.contractMode })),
                    appDispatch(getFreightVariableList(dispatch))
                ];
                // dispatch(setFreightChargesList(setAutoCompleteListWithData(charges, "description", "chargeName")))
                const [freightRules] = await Promise.all(promiseArray);
                setFreightRules(freightRules);
                setContractDetails(contractResponse)
                dispatch(hideLoading())
            }
        }

        id && initialiseApp();
        // eslint-disable-next-line
    }, [id, refresh])

    useEffect(() => {
        if (contractDetails.contractCode && editMode && state.freightChargesList) {
            const queryParams = {
                contractCode: contractDetails.contractCode
            }
            dispatch(showLoading())
            appDispatch(getContractFreightRates(queryParams)).then((response: any) => {
                // let response = contract;
                if (response && response.length) {
                    setFreightResponse(response);
                    const freightArr = response.map((item: any, index: any) => {
                        const freightObj: any = {
                            id: item.id,
                            rateType: {
                                label: item.rateType,
                                value: item.rateType,
                            },
                            origin: {
                                originName: item.originName,
                                originCode: item.originCode,
                            },
                            destination: {
                                destinationName: item.destinationName,
                                destinationCode: item.destinationCode,
                            },
                            charges: {
                                value: item.chargeName,
                                label: item.chargeName,
                            },
                            operation: {
                                label: item.operation,
                                value: item.operation,
                            },
                            lane: {
                                laneCode: item.laneCode,
                                laneName: item.laneName,
                            },
                            variable: {
                                value: item.variableCode,
                                label: item.variableName,
                            },
                            // amount: item.amount,
                            slabs: undefined,
                            rules: undefined,
                            isSaved: true,
                        }

                        if (index === response.length - 1) {
                            identifier.current += (item.id + 1)
                        }

                        if (state && state.freightChargesList) {
                            const chargeFilter = state.freightChargesList.filter((freight: any) => freight.label === item.chargeName);
                            if (chargeFilter.length) {
                                freightObj.charges = chargeFilter[0];
                            }
                            const variableFilter: any = chargeFilter[0]?.data?.variable?.filter((variable: any) => variable.code === item.variableCode)
                            const attributeFilter: any = variableFilter && variableFilter[0]?.attributes?.map((attribute: any) => {
                                const chargeAttribute = item?.chargeAttributes?.find((chargeAttribute: any) => attribute.code === chargeAttribute.attributeCode)
                                return {
                                    ...attribute,
                                    value: chargeAttribute?.value ? chargeAttribute?.value : "0"
                                }
                            })
                            freightObj.variable = (variableFilter && variableFilter[0]) && {
                                label: item.variableName,
                                value: item.variableCode,
                                data: {
                                    ...variableFilter[0],
                                    attributes: attributeFilter
                                }
                            }
                        }
                        if (item.slab && item.slab.length) {
                            const slabArr = item.slab.map((slab: any) => {
                                const slabObj = {
                                    id: slabId.current,
                                    min: slab.slabStart,
                                    max: slab.slabEnd,
                                    variable: {
                                        value: slab.variableCode,
                                        label: slab.variableName
                                    },
                                    amount: slab.slabRate,
                                }
                                slabId.current += 1;
                                return slabObj;
                            })
                            freightObj.slabs = slabArr

                        }

                        if (item.rule && item.rule.length) {

                            const ruleArr = item.rule.map((rule: any) => {
                                const ruleObj = {
                                    id: ruleId.current,
                                    object: {
                                        value: rule.object,
                                        label: rule.object,
                                        data: freightRules && freightRules.filter((element: any) => element.object === rule.object)[0]
                                    },
                                    operator: {
                                        value: rule.operator,
                                        label: rule.operator
                                    },
                                    value: rule.value,
                                    preOperator: rule.preOperator,
                                }
                                ruleId.current += 1;
                                return ruleObj;
                            })
                            freightObj.rules = ruleArr
                        }

                        identifier.current += 1;
                        return freightObj;
                    })
                    setFreightCharges(freightArr);
                }
                dispatch(hideLoading())
            })
        }
        // eslint-disable-next-line
    }, [contractDetails, editMode, state.freightChargesList])

    const addFreightCharges = () => {
        const newFreightCharges = [...freightCharges, { id: identifier.current }];
        identifier.current += 1;
        setFreightCharges(newFreightCharges);
    }

    function addConstraint() {
        setUserParams([...userParams, {}]);
    }

    const deleteFreightCharges = (id: number, isSaved: boolean) => {
        if (editMode && isSaved) {
            appDispatch(deleteContractFreightRates({ id }))
        }
        const newFreightCharges = freightCharges.filter((item: any) => item.id !== id)
        setFreightCharges(newFreightCharges);
    }

    const editFreightCharges = (id: number, name: string, value: any) => {
        const newFreightCharges = freightCharges.map((item: any) => {
            if (item.id === id && name === 'charges') {
                return {
                    ...item,
                    [name]: value,
                    rateType: undefined,
                    operation: undefined,
                    variable: undefined,
                    slabs: undefined,
                    // amount: undefined,
                }
            } else if (item.id === id && name === "rateType") {
                return {
                    ...item,
                    [name]: value,
                    variable: undefined,
                    slabs: undefined,
                    // amount: undefined,
                }
            } else if (item.id === id && name === "attribute") {
                return {
                    ...item,
                    variable: {
                        ...item?.variable,
                        data: {
                            ...item?.variable?.data,
                            attributes: item?.variable?.data?.attributes.map((attribute: any) => (
                                attribute.code === value.code ? {
                                    ...attribute,
                                    value: value.value
                                } : { ...attribute }
                            ))
                        }
                    }
                }

            }
            else if (item.id === id) {
                return {
                    ...item,
                    [name]: value,
                }
            }
            return item;
        })
        setFreightCharges(newFreightCharges);
        setErrors({ ...initialErrorObj });
    }

    const inputValidation = () => {
        let isError = false;
        const newFreightErrors = freightCharges.map((item: any) => {
            let errorObj = { ...initialErrorObj }
            const isPTL = contractDetails.contractType === FreightType.PTL;
            // if (item.variable && item.variable.value && (item.variable.value === "Percentage")) {
            //     if (Number(item.amount) > 100) {
            //         errorObj.amount = "Percentage can't be greater than 100";
            //         isError = true;
            //     }
            // }

            if (!item.rateType && isPTL) {
                errorObj.rateType = "Enter Rate Type";
                isError = true;
            }
            if (item?.origin?.originName && !item?.destination?.destinationName && isPTL) {
                errorObj.destination = "Enter Destination";
                isError = true;
            }
            if (item?.origin?.originName && !item?.origin?.originCode && isPTL) {
                errorObj.origin = "Please Select Origin";
                isError = true;
            }
            if (item?.destination?.destinationName && !item?.destination?.destinationCode && isPTL) {
                errorObj.destination = "Please Select Destination";
                isError = true;
            }
            if (!item?.origin?.originName && item?.destination?.destinationName && isPTL) {
                errorObj.origin = "Enter Origin";
                isError = true;
            }
            if (!item.charges) {
                isError = true;
                errorObj.charges = "Enter Charges";
            }
            if (!item.operation) {
                errorObj.operation = "Enter Operation";
                isError = true;
            }
            if ((item.rateType && item.rateType.label === 'FLAT') || !isPTL) {
                if (!item.variable) {
                    errorObj.variable = "Enter Variable";
                    isError = true;
                }
                else {
                    item.variable?.data?.attributes?.forEach((attribute: any) => {
                        if (!attribute.value) {
                            errorObj[attribute.code] = `Enter ${attribute.label}`
                            isError = true;
                        } else if (!(attribute.label === 'Absorption Limit') && attribute.value === '0') {
                            errorObj[attribute.code] = `${attribute.label} should be greater than Zero`;
                            isError = true;
                        } else if (attribute.datatype === "percentage") {
                            if (Number(attribute.value) > 100) {
                                errorObj[attribute.code] = "Percentage can't be greater than 100";
                                isError = true;
                            }
                        }
                    })
                }

            }

            if (item.rateType && item.rateType.label === "SLAB" && isPTL) {

                const slabArr = item.slabs && item.slabs.map((slab: any) => {
                    const slabErrObj = {
                        min: "",
                        max: "",
                        variable: "",
                        amount: "",
                    }
                    if (!slab.min) {
                        slabErrObj.min = "Enter Min Value";
                        isError = true;
                    }
                    if (!slab.max) {
                        slabErrObj.max = "Enter Max Value";
                        isError = true;
                    }
                    if (!slab.variable) {
                        slabErrObj.variable = "Enter Variable";
                        isError = true;
                    }
                    if (!slab.amount) {
                        slabErrObj.amount = "Enter Value";
                        isError = true;
                    }

                    return slabErrObj;
                })

                errorObj.slabs = slabArr
            }

            if (item.rules && item.rules.length && isPTL) {

                const rulesArr = item.rules.map((rule: any, index: number) => {
                    const rulesErrObj = {
                        object: "",
                        operator: "",
                        value: "",
                    }

                    if (!rule.object) {
                        rulesErrObj.object = "Enter Constraints";
                        isError = true;
                    }

                    if (!rule.operator) {
                        rulesErrObj.operator = "Enter Operator";
                        isError = true;
                    }

                    if (!rule.value) {
                        rulesErrObj.value = "Enter Value";
                        isError = true
                    }

                    return rulesErrObj;
                })

                errorObj.rules = rulesArr;
            }

            return errorObj;
        })
        setErrors(newFreightErrors);
        return !isError;
    }

    const postFreightData = () => {
        if (!editMode && !inputValidation()) {
            return;
        }
        dispatch(showLoading());
        const isPTL = contractDetails.contractType === "PTL";
        const dataFromState = freightCharges.map((item: any) => {

            if (!isPTL) {
                return {
                    chargeName: item.charges.label,
                    chargeCode: item.charges.value,
                    operation: item.operation.value,
                    variableCode: item.variable.value,
                    variableName: item.variable.label,
                    // amount: item.amount,
                    chargeAttributes: item.variable.data?.attributes?.map((attribute: any) => (
                        {
                            attributeCode: attribute.code,
                            attributeName: attribute.label,
                            value: attribute.value
                        }
                    ))
                }
            }
            const outputBody: any = {
                rateType: item.rateType.label,
                chargeName: item.charges.label,
                chargeCode: item.charges.value,
                lane: undefined,
                operation: item.operation.value,
                variableName: undefined,
                variableCode: undefined,
                // amount: item.amount,
                slab: undefined,
                rule: undefined,
                originName: item?.origin?.originName,
                originCode: item?.origin?.originCode,
                destinationName: item?.destination?.destinationName,
                destinationCode: item?.destination?.destinationCode
            }
            if (item.lane) {
                outputBody.lane = {
                    name: item.lane.laneName,
                    code: item.lane.laneCode,
                }
            }

            if (item.rateType.label === 'FLAT') {
                outputBody.variableCode = item.variable.value;
                outputBody.variableName = item.variable.label;
                outputBody.chargeAttributes = item.variable.data?.attributes?.map((attribute: any) => (
                    {
                        attributeCode: attribute.code,
                        attributeName: attribute.label,
                        value: attribute.value
                    }
                ))
            }

            const slabBody = item.slabs ? item.slabs.map((slab: any) => ({
                slabStart: slab.min,
                slabEnd: slab.max,
                slabRate: slab.amount,
                variableCode: slab.variable.value,
                variableName: slab.variable.label
            })) : undefined;

            const ruleBody = item.rules ? item.rules.map((rule: any) => ({
                object: rule.object.value,
                operator: rule.operator.value,
                value: rule.value,
                preOperator: rule.preOperator,
            })) : undefined

            if (slabBody) outputBody.slab = slabBody;
            if (ruleBody) outputBody.rule = ruleBody;

            return outputBody;
        })
        const body = {
            freightType: contractDetails.contractType,
            contractCode: contractDetails.contractCode,
            partnerCode: contractDetails.partner && contractDetails.partner.code,
            contractMode: contractDetails?.contractMode,
            rateDefinition: dataFromState,
        }
        const params = createConstraintsParams(userParams);
        if (editMode) {
            appDispatch(putContractFreightRates(
                {
                    ...body,
                    contractStatus: contractDetails.contractStatus,
                    serviceabilityModeCode: contractDetails.serviceabilityModeCode,
                    constraints: params
                })).then((response: any) => {
                    if (response) {
                        setContractSuccessModal(true);
                        response.message && setSuccessMessage(response.message);
                        history.goBack();
                    }
                    dispatch(hideLoading())

                })
        } else {
            appDispatch(createContractFreightRates(
                {
                    ...body,
                    serviceabilityModeCode: contractDetails.serviceabilityModeCode,
                    constraints: params
                })).then((response: any) => {
                    if (response && response.message) {
                        setContractSuccessModal(true);
                        setSuccessMessage(response.message);
                    }
                    dispatch(hideLoading())
                })
        }


    }

    function cancelOrder() {
        let queryParam: any = {
            contractCode: contractDetails.contractCode
        }
        dispatch(showLoading());
        appDispatch(terminateContract(queryParam)).then((response: any) => {
            if (response) {
                response.message && appDispatch(showAlert(response.message));
                setCancelModal(false)
                history.goBack();
            }
            dispatch(hideLoading());
        })
    }

    return (

        <div className="order-detail-wrapper ship-order-detail-wrap create-contract-freight--wrapper">
            <div className="filter-wrap">
                <Filter
                    pageTitle={"Contract Creation"}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        if (isEditable) {
                            window.location.reload()
                        } else {
                            history.goBack();
                        }
                    }}
                >
                    {
                        (editMode && !isEditable) && (
                            <>
                                {
                                    contractDetails &&
                                    (
                                        contractDetails.contractStatus === "ACTIVE" ||
                                        contractDetails.contractStatus === "PENDING"
                                    ) &&
                                    (
                                        <>
                                            <Button
                                                buttonStyle={"btn-orange"}
                                                title={isMobile ? "" : "Terminate"}
                                                leftIcon={<Close />}
                                                onClick={() => {
                                                    setCancelModal(true);
                                                }}
                                            />
                                            <Button
                                                buttonStyle={"btn-blue mob-btn-blue"}
                                                title={isMobile ? "" : "Edit"}
                                                leftIcon={<Create />}
                                                onClick={() => {
                                                    setIsEditable(true)
                                                }}
                                            />
                                        </>

                                    )
                                }

                            </>
                        )
                    }
                    {
                        contractDetails && contractDetails.contractStatus === "TERMINATED" &&
                        <Button
                            buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                            title={isMobile ? "" : "Renew Contract"}
                            leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
                            onClick={() => {
                                setContractRenewalModal(true);
                            }}
                        />
                    }

                </Filter>
            </div>
            <FileUploadModal
                open={openModal}
                contractId={contractDetails.contractCode}
                onClose={() => {
                    setOpenModal(false)
                }}
                onApply={() => {
                    setOpenModal(false)
                }}
                title={"File Upload"}
            />


            <ViewPdfModal
                open={viewPdf}
                contractId={contractDetails.contractCode}
                onClose={() => {
                    setViewPdf(false);
                }} />

            <LanePointsDisplayModal
                open={openPointModal}
                laneCode={contractDetails && contractDetails.lane && contractDetails.lane.code}
                onClose={() => {
                    setOpenPointModal(false);
                }} />
            <ContractFreightAlertBox
                open={contractSuccesModal}
                successMessage={successMessage}
                onSuccess={() => {
                    setContractSuccessModal(false);
                    history.push(ContractUrl)
                }}
                onClose={() => {
                    setContractSuccessModal(false);
                }}
            />
            <CancelTerminateModal
                open={cancelModal}
                selectedElement={""}
                loading={state.loading}
                onSuccess={() => {
                    cancelOrder();
                    setCancelModal(false)
                }}
                onClose={() => {
                    setCancelModal(false)
                }}
            />
            <ContractRenewModal
                open={contractRenewalModal}
                selectedElement={contractDetails && contractDetails.contractCode}
                startDate={contractDetails && contractDetails.contractStartDate}
                onSuccess={() => {
                    setContractDetails({})
                    setRefresh((prev) => !prev)
                    setContractRenewalModal(false)
                }}
                onClose={() => {
                    setContractRenewalModal(false)
                }}
            />

            <EditConfirmationModal
                open={editModal}
                selectedElement={""}
                loading={state.loading}
                onSuccess={() => {
                    postFreightData();
                    setEditModal(false)
                }}
                onClose={() => {
                    setEditModal(false)
                }}
            />
            <PageContainer >
                <Card className="creat-contract-wrapp creat-wrapp">
                    <div className="billing-info-header">
                        <h4>Contract Details</h4>
                        <div className="pdf-button-wrapp">
                            {
                                (!editMode || isEditable) &&
                                (contractDetails && contractDetails.contractStatus === "PENDING") && (
                                    <Button
                                        buttonStyle="btn-blue view-pod-btn"
                                        title={isMobile ? "" : "Upload PDF"}
                                        leftIcon={<Publish />}
                                        onClick={() => {
                                            setOpenModal(true)
                                        }}
                                    />
                                )
                            }

                            <Button
                                buttonStyle="btn-orange view-pod-btn"
                                title={isMobile ? "" : "View PDF"}
                                leftIcon={<Visibility />}
                                onClick={() => {
                                    setViewPdf(true);
                                }}
                            />
                        </div>
                    </div>
                    {
                        state.loading ? (
                            <CardContentSkeleton
                                row={3}
                                column={3}
                            />
                        ) : (contractDetails && contractDetails.contractType === 'PTL' ? (
                            <CardContent className="creat-contract-content">
                                <div className="custom-form-row row">
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={contractId}
                                            text={contractDetails.contractCode}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={freightLabel}
                                            text={contractDetails.contractType}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={contractModeLabel}
                                            text={contractDetails.contractMode === ServicabilityType.ZONE.toLowerCase() ? zoneTitle : laneTitle}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={transporterLabel}
                                            text={contractDetails.partner && contractDetails.partner.name}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={modLabel}
                                            text={contractDetails.serviceabilityModeName}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={referenceIdLabel}
                                            text={contractDetails.contractReferenceNo}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={ValidityFromLabel}
                                            text={contractDetails.contractStartDate && convertDateFormat(contractDetails.contractStartDate, displayDateFormatter)}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={ValidityToLabel}
                                            text={contractDetails.contractEndDate && convertDateFormat(contractDetails.contractEndDate, displayDateFormatter)}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            className="con-field-wrap"
                                            title={VolumetricWeightLabel}
                                            text={contractDetails.volumetricDivisionFactor}
                                            tooltip={() => (
                                                < CustomToolTip
                                                    title={"(L*B*H) / Volumetric Factor"}
                                                    disableInMobile={"false"}
                                                    placement="bottom"
                                                >
                                                    <Info className="blue-text info-icon" />
                                                </ CustomToolTip>
                                            )}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={GstLabel}
                                            text={contractDetails.gst}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={orderStatusLabel}
                                            text={contractDetails.contractStatus}
                                            valueClassName="orange-text"
                                        />
                                    </div>

                                    {
                                        contractDetails.contractStatus === "TERMINATED" && (
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    className="con-field-wrap"
                                                    title={TerminatedBy}
                                                    text={contractDetails.contractTerminatedByName}
                                                    valueClassName="orange-text"
                                                    tooltip={() => (
                                                        <CustomToolTip
                                                            title={
                                                                <div className="approved-list">
                                                                    <List>
                                                                        <ListItem>
                                                                            <ListItemIcon>
                                                                                <Mail />
                                                                            </ListItemIcon>
                                                                            <ListItemText>
                                                                                {contractDetails.contractTerminatedByEmail}
                                                                            </ListItemText>
                                                                        </ListItem>
                                                                        <ListItem>
                                                                            <ListItemIcon>
                                                                                <Today />
                                                                            </ListItemIcon>
                                                                            <ListItemText>
                                                                                {convertDateFormat(contractDetails.contractTerminatedDate, displayDateFormatter)}
                                                                            </ListItemText>
                                                                        </ListItem>
                                                                    </List>
                                                                </div>
                                                            }
                                                            disableInMobile={"false"}
                                                            placement="top">
                                                            <Info className="blue-text info-icon" />
                                                        </CustomToolTip>
                                                    )}
                                                />
                                            </div>
                                        )
                                    }

                                    {
                                        contractDetails.contractStatus === "ACTIVE" && (
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    className="con-field-wrap"
                                                    title={ApprovedBy}
                                                    text={contractDetails.contractApprovedByName}
                                                    valueClassName="orange-text"
                                                    tooltip={() => (
                                                        <CustomToolTip
                                                            title={
                                                                <div className="approved-list">
                                                                    <List>
                                                                        <ListItem>
                                                                            <ListItemIcon>
                                                                                <Mail />
                                                                            </ListItemIcon>
                                                                            <ListItemText>
                                                                                {contractDetails.contractApprovedByEmail}
                                                                            </ListItemText>
                                                                        </ListItem>
                                                                        <ListItem>
                                                                            <ListItemIcon>
                                                                                <Today />
                                                                            </ListItemIcon>
                                                                            <ListItemText>
                                                                                {convertDateFormat(contractDetails.contractApprovedDate, displayDateFormatter)}
                                                                            </ListItemText>
                                                                        </ListItem>
                                                                    </List>
                                                                </div>
                                                            }
                                                            disableInMobile={"false"}
                                                            placement="top">
                                                            <Info className="blue-text info-icon" />
                                                        </CustomToolTip>
                                                    )}
                                                />
                                            </div>
                                        )
                                    }

                                </div>
                            </CardContent>
                        ) : (
                            <CardContent className="creat-contract-content">
                                <div className="custom-form-row row">
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={contractId}
                                            text={contractDetails.contractCode}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={freightLabel}
                                            text={contractDetails.contractType}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={laneTitle}
                                            customView={<LaneView element={contractDetails} onClickLaneCode={(data: any) => { setOpenPointModal(true); }} />}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={transporterLabel}
                                            text={contractDetails.partner && contractDetails.partner.name}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={modLabel}
                                            text={contractDetails.serviceabilityModeName}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={vehicleTypeLabel}
                                            text={contractDetails.vehicleType && contractDetails.vehicleType.name}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={ValidityFromLabel}
                                            text={contractDetails.contractStartDate && convertDateFormat(contractDetails.contractStartDate, displayDateFormatter)}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={ValidityToLabel}
                                            text={contractDetails.contractEndDate && convertDateFormat(contractDetails.contractEndDate, displayDateFormatter)}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={DetentionLabel}
                                            text={contractDetails.detentionThreshold}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={referenceIdLabel}
                                            text={contractDetails.contractReferenceNo}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={GstLabel}
                                            text={contractDetails.gst}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={orderStatusLabel}
                                            text={contractDetails.contractStatus}
                                            valueClassName="orange-text"
                                        />
                                    </div>

                                    {
                                        contractDetails.contractStatus === "TERMINATED" && (
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    className="con-field-wrap"
                                                    title={TerminatedBy}
                                                    text={contractDetails.contractTerminatedByName}
                                                    valueClassName="orange-text"
                                                    tooltip={() => (
                                                        <CustomToolTip
                                                            title={
                                                                <div className="approved-list">
                                                                    <List>
                                                                        <ListItem>
                                                                            <ListItemIcon>
                                                                                <Mail />
                                                                            </ListItemIcon>
                                                                            <ListItemText>
                                                                                {contractDetails.contractTerminatedByEmail}
                                                                            </ListItemText>
                                                                        </ListItem>
                                                                        <ListItem>
                                                                            <ListItemIcon>
                                                                                <Today />
                                                                            </ListItemIcon>
                                                                            <ListItemText>
                                                                                {convertDateFormat(contractDetails.contractTerminatedDate, displayDateFormatter)}
                                                                            </ListItemText>
                                                                        </ListItem>
                                                                    </List>
                                                                </div>
                                                            }
                                                            disableInMobile={"false"}
                                                            placement="top">
                                                            <Info className="blue-text info-icon" />
                                                        </CustomToolTip>
                                                    )}
                                                />
                                            </div>
                                        )
                                    }

                                    {
                                        contractDetails.contractStatus === "ACTIVE" && (
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    className="con-field-wrap"
                                                    title={ApprovedBy}
                                                    text={contractDetails.contractApprovedByName}
                                                    valueClassName="orange-text"
                                                    tooltip={() => (
                                                        <CustomToolTip
                                                            title={
                                                                <div className="approved-list">
                                                                    <List>
                                                                        <ListItem>
                                                                            <ListItemIcon>
                                                                                <Mail />
                                                                            </ListItemIcon>
                                                                            <ListItemText>
                                                                                {contractDetails.contractApprovedByEmail}
                                                                            </ListItemText>
                                                                        </ListItem>
                                                                        <ListItem>
                                                                            <ListItemIcon>
                                                                                <Today />
                                                                            </ListItemIcon>
                                                                            <ListItemText>
                                                                                {convertDateFormat(contractDetails.contractApprovedDate, displayDateFormatter)}
                                                                            </ListItemText>
                                                                        </ListItem>
                                                                    </List>
                                                                </div>
                                                            }
                                                            disableInMobile={"false"}
                                                            placement="top">
                                                            <Info className="blue-text info-icon" />
                                                        </CustomToolTip>
                                                    )}
                                                />
                                            </div>
                                        )
                                    }

                                </div>
                            </CardContent>
                        ))
                    }

                </Card>
                <div className="bill-tab tab-nav">
                    <Tabs value={tabIndex} onChange={(event: any, newValue: any) => setTabIndex(newValue)}
                        variant="scrollable"
                        scrollButtons={isMobile ? "on" : "off"}
                    >
                        {tabValues.map((element, index) => (
                            <Tab
                                key={index}
                                label={element} />
                        ))}
                    </Tabs>
                </div>
                <div className="create-contract-freight--content">
                    {state.loading ? <CardContentSkeleton row={1} column={3} /> :
                        ((!editMode || isEditable) ? tabIndex === 0 ? (
                            <>
                                {/* {
                                freightCharges.length === 0 ? (
                                    <div className="text-center mt-md-5">
                                        <Button
                                            buttonStyle="btn-orange"
                                            title={"Add Charges"}
                                            leftIcon={<AddCircle />}
                                            onClick={addFreightCharges}
                                        />
                                    </div>
                                ) : null
                            } */}
                                {
                                    freightCharges.map((item: any, index: number) => (
                                        <FreightCharges
                                            freightChargesList={state.freightChargesList}
                                            deleteFreight={() => deleteFreightCharges(item.id, item.isSaved || false)}
                                            key={item.id}
                                            freightData={item}
                                            freightRules={freightRules}
                                            contractType={contractDetails.contractType}
                                            partner={contractDetails?.partner}
                                            contractMode={contractDetails?.contractMode}
                                            editFreight={(name: string, value: any) => editFreightCharges(item.id, name, value)}
                                            errors={(errors && errors[index]) || {}}
                                            editMode={(editMode && item.isSaved) || false}
                                        />
                                    ))
                                }
                            </>
                        ) : <AddConstraints
                            contractDetails={contractDetails}
                            userParams={userParams}
                            constraints={constraints}
                            setUserParams={setUserParams}
                            error={error}
                            setError={setError}
                        />
                            : tabIndex === 0 ?
                                freightResponse?.length > 0 ?
                                    <FreightResponseView contractDetails={contractDetails} freightResponse={freightResponse} />
                                    : <div className={"noDataDisplay"}>
                                        <p className='m-0'>{noDataAvailableMessage}</p>
                                    </div> : userParams?.length > 0 ?
                                    <AddConstraintsList constraints={userParams} /> :
                                    <div className={"noDataDisplay"}>
                                        <p className='m-0'>{noDataAvailableMessage}</p>
                                    </div>)
                    }
                </div>
                {
                    !(!editMode || isEditable) ? contractDetails.contractStatus === "PENDING" && (
                        <div className="text-right">
                            <Button
                                buttonStyle="btn-blue mr-3"
                                title={"Approve"}
                                leftIcon={<CheckCircle />}
                                onClick={() => {
                                    let queryParam: any = {
                                        contractCode: contractDetails.contractCode
                                    }
                                    dispatch(showLoading());
                                    appDispatch(approveContract(queryParam)).then((response: any) => {
                                        if (response) {
                                            response.message && appDispatch(showAlert(response.message));
                                            history.goBack();
                                        }
                                        dispatch(hideLoading());
                                    })
                                }}
                            />
                        </div>
                    ) : (
                        <div className="text-right">
                            <Button
                                buttonStyle="btn-orange mr-3"
                                title={tabIndex === 0 ? "Add Charges" : "Add Constraint"}
                                leftIcon={<AddCircle />}
                                onClick={tabIndex === 0 ? addFreightCharges : addConstraint}
                            />
                            <Button
                                buttonStyle="btn-blue"
                                title={"Done"}
                                leftIcon={<CheckCircle />}
                                onClick={() => {
                                    const validateCharges = inputValidation();
                                    const validateConstraints = validateData(userParams);
                                    if (!validateCharges) {
                                        setTabIndex(0);
                                    } else if (validateConstraints !== true) {
                                        setTabIndex(1);
                                        setError(validateConstraints);
                                    } else if (validateCharges && validateConstraints === true) {
                                        if (editMode) {
                                            setEditModal(true);
                                        } else {
                                            postFreightData();
                                        }
                                    }
                                }}
                            />
                        </div>
                    )
                }
            </PageContainer>

        </div>
    )
}

export default CreateContractFreight;
