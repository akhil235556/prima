import {
    Card,
    CardContent,
    CardHeader,
    Collapse,
    TextareaAutosize
} from "@material-ui/core";
import {
    Add, ArrowRightAlt,
    ClearAll,
    KeyboardBackspace,
    Remove
} from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import React, { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FreightType, ftlServiceabilityModeTypeList, rowsPerPageOptions, serviceabilityModeTypeList } from "../../../base/constant/ArrayList";
import {
    freightTypeLabel, freightTypePlaceholder, lanePlaceholder,
    modLabel, modPlaceholder, remarkLabel, vehicleTypeLabel,
    vehicleTypePlaceholder
} from "../../../base/constant/MessageUtils";
import { IndentListUrl } from "../../../base/constant/RoutePath";
import { displayDateTimeFormatter } from "../../../base/utility/DateUtils";
import { isNullValue } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Filter from "../../../component/filter/Filter";
import PageContainer from "../../../component/pageContainer/PageContainer";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import Button from "../../../component/widgets/button/Button";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import ListingSkeleton from "../../../component/widgets/listingSkeleton/ListingSkeleton";
import NumberEditText from "../../../component/widgets/NumberEditText";
import TableList from "../../../component/widgets/tableView/TableList";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import WarningModal from "../../../modals/warningModal/WarningModal";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import {
    setAutoCompleteList,
    setAutoCompleteListWithData
} from "../../../moduleUtility/DataUtils";
import { pollStart, showAlert } from "../../../redux/actions/AppActions";
import {
    clearUserParams, hideLoading,
    setUserParams, showLoading
} from "../../../redux/actions/CreateContractActions";
import CreateContractReducer, { CREATE_CONTRACT_STATE } from "../../../redux/reducers/CreateContractReducer";
import { getClientFreightTypeList } from "../../../serviceActions/FreightTypeServiceActions";
import { createIndent, getIndentSOB, getIndentVehicleTypes } from "../../../serviceActions/IndentServiceAction";
import { getLaneFromOriginAndDestination } from "../../../serviceActions/LaneServiceActions";
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";
import { orderOrchestration } from "../../../serviceActions/OrderServiceActions";
import { contractDetailsTableColumns } from "../../../templates/IndentTemplates";
import ContractDetailModal from "./ContractDetailModal";
import './CreateIndent.css';
import { createIndentParams, validateData } from "./IndentViewUtility";
import SOBAllocationModal from "./SOBAllocationModal";

function CreateIndent() {
    const appDispatch = useDispatch();
    const history = useHistory();
    const [state = CREATE_CONTRACT_STATE, dispatch] = useReducer(
        CreateContractReducer,
        CREATE_CONTRACT_STATE
    );

    // eslint-disable-next-line
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [freightTypeList, setFreightTypeList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [vehicleTypeList, setVehicleTypeList] = React.useState<any>([]);
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<any>(false);
    const [openContractDetailModal, setOpenContractDetailModal] = React.useState<boolean>(false)
    const [selectedElement, setSelectedElement] = React.useState<any>([]);
    const [flag, setFlag] = React.useState<any>(false);
    const [details, setDetails] = React.useState(!isMobile);
    const [destinationSuggestion, setDestinationSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [originSuggestion, setOriginSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [openConfirmModal, setOpenConfirmModal] = React.useState<boolean>(false);
    const [warningMessage, setWarningMessage] = React.useState<String>("Are you sure want to create the indent?")
    const [isContractsExpired, setIsContractsExpired] = React.useState<boolean>(false)
    const [expiredContracts, setExpiredContracts] = React.useState<any>([])
    const [nonExpiredContracts, setNonExpiredContracts] = React.useState<any>([])
    const [openSOBAllocationModal, setOpenSOBAllocationModal] = React.useState<boolean>(false)
    const [sobData, setSOBData] = React.useState<any>(undefined)
    const [intialSOBData, setInitialSOBData] = React.useState<any>(undefined)

    const fetchPollingData = (params: any) => {
        return appDispatch(orderOrchestration({ orchestrationId: params.orchestrationId, service: params.service })).then((response: any) => {
            return response.details;
        })
    }

    const stopPollingLoader = (isOrderCreated: boolean) => {
        dispatch(hideLoading());
        isOrderCreated && history.push(IndentListUrl);
    }

    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let promiseArray: any = [
                appDispatch(getClientFreightTypeList()),
            ];
            Promise.all(promiseArray)
                .then((response: any) => {
                    dispatch(hideLoading());
                    if (response && response[0]) {
                        const freightTypes = setAutoCompleteList(
                            response[0],
                            "freightTypeName",
                            "freightTypeName"
                        )
                        const ftlFreight = freightTypes.filter((item: any) => item.label === 'FTL')
                        ftlFreight.length
                            && dispatch(setUserParams({
                                freightType: ftlFreight[0],
                                serviceabilityMode: {
                                    label: "Surface",
                                    value: "surface"
                                }
                            }));

                        setFreightTypeList(ftlFreight);
                    }
                });
        };
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const getTableList = async () => {
            if (state.userParams && state.userParams.freightType && state.userParams.lane && state.userParams.vehicleType && state.userParams.serviceabilityMode) {
                let query: any = {
                    laneCode: state.userParams.lane.value,
                    vehicleTypeCode: state.userParams.vehicleType.value,
                    isActive: 1
                }
                setLoading(true)
                appDispatch(getIndentSOB(query)).then((response: any) => {
                    if (response) {
                        setSOBData(response)
                        const jsonResponse = JSON.parse(JSON.stringify(response))
                        setInitialSOBData(jsonResponse)
                    }
                    setLoading(false)
                })
            }
        };
        flag && getTableList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.userParams]);

    const onCreateHandler = () => {
        const validate = validateData(state.userParams, appDispatch);
        if (validate === true) {
            const expiredContracts = sobData.sobPartners.filter((contract: any) => contract.contractStatus === "TERMINATED");
            if (expiredContracts && expiredContracts.length === sobData.sobPartners.length) {
                dispatch(showAlert("Contracts is Terminated", false))
                return;

            }
            else if (expiredContracts && expiredContracts.length > 0) {
                const nonExpiredContracts = sobData.sobPartners.filter((contract: any) => contract.contractStatus !== "TERMINATED")
                const expiredContractsAllocationSum = expiredContracts.reduce((acc: any, contract: any) => {
                    return acc + contract.allocationPercentage
                }, 0)
                let newNonExpired;
                if (nonExpiredContracts && nonExpiredContracts.length > 0) {
                    const newNoExpired = JSON.stringify(nonExpiredContracts)
                    newNonExpired = JSON.parse(newNoExpired)
                    newNonExpired[0].allocationPercentage += expiredContractsAllocationSum;
                }
                setIsContractsExpired(true)
                setNonExpiredContracts(newNonExpired)
                setExpiredContracts(expiredContracts)
                setWarningMessage("Some of the contracts in SOB are expired, Do you want proceed assigning vehicles to remaining transporters?")
                setOpenConfirmModal(true)
            } else {
                setOpenConfirmModal(true)
            }
        } else {
            setError(validate);
        }
    };

    return (
        <div className="indent-create-wrapper">
            {openContractDetailModal &&
            <ContractDetailModal
                open={openContractDetailModal}
                selectedElement={selectedElement}
                laneCode={state.userParams.lane && state.userParams.lane.value}
                freightType={state.userParams.freightType && state.userParams.freightType.value}
                onSuccess={() => {
                    setOpenContractDetailModal(false)
                }}
                onClose={() => {
                    setOpenContractDetailModal(false)
                }}
            />}
            <WarningModal
                open={openConfirmModal}
                primaryButtonTitle={"Yes"}
                secondaryuttonTitle={"No"}
                primaryButtonStyle={'ok-btn btn-blue'}
                onClose={() => {
                    setOpenConfirmModal(false)
                }}
                warningMessage={warningMessage}
                onSuccess={() => {
                    setOpenConfirmModal(false)
                    if (isContractsExpired) {
                        setOpenSOBAllocationModal(true)
                    } else {
                        createNewIndent();
                    }
                }}
            />
            <SOBAllocationModal
                onClickViewButton={onClickViewButton}
                expiredContracts={expiredContracts}
                nonExpiredContracts={nonExpiredContracts}
                onChangeSOBPercent={onChangeSOBPercent}
                open={openSOBAllocationModal}
                loading={state.loading}
                onClose={() => {
                    setOpenSOBAllocationModal(false)
                }}
                onApply={() => {
                    const validate = validateContracts(nonExpiredContracts)
                    if (validate === true) {
                        createNewIndent(nonExpiredContracts)
                    } else {
                        setNonExpiredContracts(validate)
                    }
                }}
            />
            <div className="filter-wrap">
                <Filter
                    pageTitle={"Indent Creation"}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                />
            </div>

            <PageContainer>
                <Card className="creat-contract-wrapp creat-wrapp">
                    <div className="billing-info-header">
                        <h4>Indent Create</h4>
                    </div>
                    {state.loading ? (
                        <CardContentSkeleton row={isMobile ? 6 : 3} column={isMobile ? 1 : 3} />
                    ) : (
                        <CardContent className="creat-contract-content">
                            <div className="custom-form-row row align-items-end">
                                <div className="form-group col-md-4">
                                    <AutoComplete
                                        label={freightTypeLabel}
                                        mandatory
                                        placeHolder={freightTypePlaceholder}
                                        value={state.userParams.freightType}
                                        error={error.freightType}
                                        options={freightTypeList}
                                        onChange={(element: OptionType) => {
                                            if (element.label === "FTL") {
                                                dispatch(setUserParams({
                                                    freightType: element,
                                                    modeType: ftlServiceabilityModeTypeList[0]
                                                }));
                                            } else {
                                                dispatch(setUserParams({
                                                    freightType: element
                                                }));
                                            }
                                            setError({});
                                            setFlag(true);
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <AutoSuggest
                                        label={"Origin"}
                                        placeHolder={"Select Origin"}
                                        error={error.originLocationError}
                                        value={state.userParams.originLocationName}
                                        suggestions={originSuggestion}
                                        mandatory
                                        handleSuggestionsFetchRequested={({ value }: any) => {
                                            if (value.length > autosuggestSearchLength) {
                                                getOriginSuggestionList(value);
                                            }
                                        }}
                                        onSelected={(element: OptionType) => {
                                            dispatch(
                                                setUserParams({
                                                    lane: undefined,
                                                    vehicleType: undefined,
                                                    originLocationName: element.label,
                                                    originLocationCode: element.value
                                                })
                                            );
                                            if (state.userParams.destinationLocationCode) {
                                                getLaneList({
                                                    originCode: element.value,
                                                    destinationCode: state.userParams.destinationLocationCode
                                                })
                                            }
                                        }}
                                        onChange={(text: string) => {
                                            dispatch(
                                                setUserParams({
                                                    lane: undefined,
                                                    vehicleType: undefined,
                                                    originLocationName: text,
                                                    originLocationCode: undefined
                                                })
                                            );
                                            setError({})
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <AutoSuggest
                                        label={"Destination"}
                                        placeHolder={"Select Destination"}
                                        error={error.destinationLocationError}
                                        value={state.userParams.destinationLocationName}
                                        suggestions={destinationSuggestion}
                                        mandatory
                                        handleSuggestionsFetchRequested={({ value }: any) => {
                                            if (value.length > autosuggestSearchLength) {
                                                getDestinationSuggestionList(value);
                                            }
                                        }}
                                        onSelected={(element: OptionType) => {
                                            dispatch(
                                                setUserParams({
                                                    lane: undefined,
                                                    vehicleType: undefined,
                                                    destinationLocationName: element.label,
                                                    destinationLocationCode: element.value
                                                })
                                            );
                                            if (state.userParams.originLocationCode) {
                                                getLaneList({
                                                    originCode: state.userParams.originLocationCode,
                                                    destinationCode: element.value
                                                })
                                            }
                                        }}
                                        onChange={(text: string) => {
                                            dispatch(
                                                setUserParams({
                                                    lane: undefined,
                                                    vehicleType: undefined,
                                                    destinationLocationName: text,
                                                    destinationLocationCode: undefined
                                                })
                                            );
                                            setError({})
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <AutoComplete
                                        label={"Lane"}
                                        mandatory
                                        placeHolder={lanePlaceholder}
                                        error={error.lane}
                                        value={state.userParams.lane}
                                        options={laneList}
                                        onChange={(element: OptionType) => {
                                            if (state.userParams.freightType && state.userParams.freightType.value === "FTL") {
                                                appDispatch(getIndentVehicleTypes({
                                                    laneCode: element.value,
                                                    freightTypeCode: state.userParams.freightType.value,
                                                    serviceabilityModeCode: state.userParams.serviceabilityMode && state.userParams.serviceabilityMode.value
                                                })).then((response: any) => {
                                                    if (response) {
                                                        let vehicleTypeList: any = [];
                                                        let vehicleTypeListTemp: any = [];
                                                        response.forEach((item: any) => {
                                                            if (vehicleTypeListTemp.indexOf(item.vehicleTypeCode) === -1) {
                                                                vehicleTypeList.push(
                                                                    {
                                                                        label: item.vehicleTypeName,
                                                                        value: item.vehicleTypeCode
                                                                    }
                                                                )
                                                                vehicleTypeListTemp.push(item.vehicleTypeCode)
                                                            }
                                                        })
                                                        setVehicleTypeList(vehicleTypeList)
                                                    } else {
                                                        setVehicleTypeList([])
                                                        appDispatch(showAlert("No partners found for the selected lane", false))
                                                    }
                                                })
                                            }
                                            dispatch(
                                                setUserParams({
                                                    laneName: element.label,
                                                    lane: element,
                                                    vehicleType: undefined,
                                                })
                                            );
                                            setError({});
                                            setFlag(true);
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <AutoComplete
                                        label={modLabel}
                                        placeHolder={modPlaceholder}
                                        options={(state.userParams.freightType && state.userParams.freightType.label === FreightType.FTL) ? ftlServiceabilityModeTypeList : serviceabilityModeTypeList}
                                        mandatory
                                        error={error.serviceabilityModeName}
                                        value={state.userParams.serviceabilityMode}
                                        onChange={(element: OptionType) => {
                                            dispatch(
                                                setUserParams({
                                                    serviceabilityMode: element
                                                })
                                            );
                                            setError({});
                                            setFlag(true);
                                        }}
                                    />
                                </div>
                                {
                                    state.userParams.freightType &&
                                    state.userParams.freightType.value === "FTL"
                                    && (
                                        <>
                                            <div className="form-group col-md-4">
                                                <AutoComplete
                                                    label={vehicleTypeLabel}
                                                    mandatory
                                                    placeHolder={vehicleTypePlaceholder}
                                                    value={state.userParams.vehicleType}
                                                    error={error.vehicleType}
                                                    options={vehicleTypeList}
                                                    onChange={(element: OptionType) => {
                                                        dispatch(
                                                            setUserParams({
                                                                vehicleType: element,
                                                            })
                                                        );
                                                        setError({});
                                                        setFlag(true);
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <NumberEditText
                                                    label="No. Of Vehicle"
                                                    mandatory
                                                    placeholder="Enter Vehicle No"
                                                    maxLength={3}
                                                    decimalScale={0}
                                                    decimalSeparator={false}
                                                    value={state.userParams.count}
                                                    error={error.count}
                                                    onChange={(text: any) => {
                                                        dispatch(
                                                            setUserParams({
                                                                count: text,
                                                            })
                                                        );
                                                        setError({});
                                                        setFlag(false);
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )

                                }
                                {state.userParams.freightType &&
                                    state.userParams.freightType.value === "PTL"
                                    && (
                                        <>
                                            <div className="form-group col-md-4">
                                                <NumberEditText
                                                    label="Volume (ft³)"
                                                    mandatory
                                                    placeholder="Enter Volume"
                                                    maxLength={10}
                                                    decimalScale={3}
                                                    value={state.userParams.volume}
                                                    error={error.volume}
                                                    onChange={(text: any) => {
                                                        dispatch(
                                                            setUserParams({
                                                                volume: text,
                                                            })
                                                        );
                                                        setError({});
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <NumberEditText
                                                    label="Weight (Kg)"
                                                    mandatory
                                                    placeholder="Enter Weight"
                                                    maxLength={10}
                                                    decimalScale={3}
                                                    value={state.userParams.weight}
                                                    error={error.weight}
                                                    onChange={(text: any) => {
                                                        dispatch(
                                                            setUserParams({
                                                                weight: text,
                                                            })
                                                        );
                                                        setError({});
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )
                                }
                                <div className="form-group col-md-4">
                                    <label className="picker-label">
                                        {"Placement Date and Time"}
                                        <span className="mandatory-flied">*</span>
                                    </label>
                                    <DateTimePicker
                                        className="custom-date-picker"
                                        hiddenLabel
                                        placeholder="Placement Date and Time"
                                        helperText={error.placementDatetime}
                                        disablePast
                                        format={displayDateTimeFormatter}
                                        value={state.userParams.placementDatetime || null}
                                        maxDate={state.userParams.contractEndDate}
                                        onChange={(date: any) => {
                                            dispatch(
                                                setUserParams({
                                                    placementDatetime: date,
                                                })
                                            );
                                            setFlag(false);
                                            setError({});
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="picker-label">
                                        {"Appointment Date and Time"}
                                    </label>
                                    <DateTimePicker
                                        className="custom-date-picker"
                                        hiddenLabel
                                        placeholder="Appointment Date and Time"
                                        // helperText={error.appointmentDatetime}
                                        disablePast
                                        format={displayDateTimeFormatter}
                                        value={state.userParams.appointmentDatetime || null}
                                        maxDate={state.userParams.contractEndDate}
                                        onChange={(date: any) => {
                                            dispatch(
                                                setUserParams({
                                                    appointmentDatetime: date,
                                                })
                                            );
                                            setFlag(false);
                                            setError({});
                                        }}
                                    />
                                </div>
                                <div className=" custom-remark remarks_indend remarks form-group col-md-4">
                                    <label className="picker-label">Remark</label>
                                    <TextareaAutosize
                                        className="custom-date-picker"
                                        placeholder={remarkLabel}
                                        value={state.userParams.remarks}
                                        onChange={(event: any) => {
                                            dispatch(
                                                setUserParams({
                                                    remarks: event.target.value,
                                                })
                                            );
                                            setFlag(false);
                                            setError({});
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {intialSOBData && intialSOBData.sobPartners.length > 0 &&
                    ((loading || state.loading) ? <ListingSkeleton /> :
                        <Card className="creat-contract-wrapp creat-wrapp contract-detail-card">
                            <CardHeader
                                className="creat-contract-header"
                                title={"Contract Details"}
                                onClick={() => {
                                    setDetails((prev) => !prev)
                                }}
                                avatar={(details ? <Remove /> : <Add />)}
                            />
                            <Collapse in={details} timeout="auto" unmountOnExit>
                                <CardContent className="creat-contract-content">
                                    <div className="table-detail-listing">
                                        <TableList
                                            tableColumns={contractDetailsTableColumns(onClickViewButton)}
                                            currentPage={0}
                                            rowsPerPage={25}
                                            rowsPerPageOptions={rowsPerPageOptions}
                                            listData={intialSOBData.sobPartners}
                                            onChangePage={(event: any, page: number) => {
                                            }}
                                            onChangeRowsPerPage={(event: any) => {

                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Collapse>

                        </Card>)}

                <div className="text-right">
                    <Button
                        buttonStyle="btn-orange mr-3"
                        title={"Clear"}
                        disable={state.loading}
                        leftIcon={<ClearAll />}
                        onClick={() => {
                            onClear();
                        }}
                    />
                    <Button
                        buttonStyle="btn-blue"
                        title={"Create"}
                        loading={state.loading}
                        leftIcon={<ArrowRightAlt />}
                        onClick={onCreateHandler}
                    />
                </div>
            </PageContainer>
        </div>
    );

    function onClear() {
        setLaneList(undefined);
        dispatch(clearUserParams());
        setVehicleTypeList([]);
        setError({});
    }

    function getDestinationSuggestionList(text: string) {
        appDispatch(searchLocationList({ query: text })).then((response: any) => {
            if (response) {
                setDestinationSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
            }
        })
    };
    function getOriginSuggestionList(text: string) {
        appDispatch(searchLocationList({ query: text })).then((response: any) => {
            if (response) {
                setOriginSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
            }
        })
    };

    function createNewIndent(sobPartners?: any) {
        let params: any;
        if (sobPartners) {
            params = createIndentParams(state.userParams, sobData, sobPartners);
        } else {
            params = createIndentParams(state.userParams, sobData);
        }
        dispatch(showLoading());
        appDispatch(createIndent(params)).then((response: any) => {
            // eslint-disable-next-line
            if (response && response.code && response.code == 200) {
                let orchestrationParams: any = {
                    orchestrationId: response?.details?.orchestrationId,
                    service: response?.details?.service,
                }
                appDispatch(pollStart({
                    params: orchestrationParams,
                    asyncFetch: fetchPollingData,
                    stopPollingLoader: stopPollingLoader,
                }));
            } else {
                dispatch(hideLoading());
                return;
            }
        });
    }

    function getLaneList(params: any) {
        appDispatch(getLaneFromOriginAndDestination(params)).then((response: any) => {
            if (response) {
                setLaneList(
                    setAutoCompleteListWithData(response, "laneName", "laneCode")
                );
            }
        });
    }
    function onClickViewButton(element: any) {
        setSelectedElement({
            partnerCode: element.partnerCode,
            contractCode: element.contractId
        })
        setOpenContractDetailModal(true);
    }

    function onChangeSOBPercent(text: any, element: any) {
        const newContracts = nonExpiredContracts.map((contract: any) => (
            contract.contractId === element.contractId ?
                {
                    ...contract,
                    allocationPercentage: text,
                    allocationPercentageError: ''
                }
                :
                { ...contract }
        ))
        setNonExpiredContracts(newContracts)
    }
    function validateContracts(nonExpiredContracts: any) {
        let error = true;
        const newNonExpiredContracts = nonExpiredContracts.map((nonExpiredContract: any) => {
            if (isNullValue(nonExpiredContract.allocationPercentage)) {
                error = false
                return {
                    ...nonExpiredContract,
                    allocationPercentageError: "Please Enter valid value"
                }
            }
            return nonExpiredContract
        })
        if (!error) {
            return newNonExpiredContracts
        }
        return error;
    }
}

export default CreateIndent;