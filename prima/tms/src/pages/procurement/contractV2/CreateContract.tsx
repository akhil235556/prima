import { Card, CardContent, Checkbox, FormControlLabel } from "@material-ui/core";
import { ArrowRightAlt, ClearAll, KeyboardBackspace } from '@material-ui/icons';
import Info from '@material-ui/icons/Info';
import { DatePicker } from "@material-ui/pickers";
import React, { useEffect, useReducer } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { FreightType, ftlServiceabilityModeTypeList, ptlModeTypeList, serviceabilityModeTypeList } from "../../../base/constant/ArrayList";
import {
    contractModeLabel, contractModePlaceholder, freightTypeLabel,
    freightTypePlaceholder, lanePlaceholder, laneTitle, transporterLabel,
    transporterPlaceHolder, vehicleTypeLabel, vehicleTypePlaceholder
} from "../../../base/constant/MessageUtils";
import { ContractFreightCharges, ContractUrl } from "../../../base/constant/RoutePath";
import { displayDateFormatter } from "../../../base/utility/DateUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import ContractMessageAlertBox from '../../../component/alert/ContractAlertBox';
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import AutoComplete from '../../../component/widgets/AutoComplete';
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import Button from '../../../component/widgets/button/Button';
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomToolTip } from "../../../component/widgets/CustomToolTip";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from '../../../component/widgets/NumberEditText';
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList, setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { clearUserParams, hideLoading, setUserParams, showLoading } from '../../../redux/actions/CreateContractActions';
import CreateContractReducer, { CREATE_CONTRACT_STATE } from "../../../redux/reducers/CreateContractReducer";
import { createContract } from '../../../serviceActions/ContractServiceActions';
import { getClientFreightTypeList } from "../../../serviceActions/FreightTypeServiceActions";
import { searchLane } from '../../../serviceActions/LaneServiceActions';
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";
import { getAllVehicleTypeList } from "../../../serviceActions/VehicleTypeServiceActions";
import "./ContractListing.css";
import { createContractParams, validateCreateContractData } from "./ContractViewUtility";

function CreateContract() {
    const appDispatch = useDispatch();
    const history = useHistory();
    const [state = CREATE_CONTRACT_STATE, dispatch] = useReducer(CreateContractReducer, CREATE_CONTRACT_STATE);
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined)
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined)
    const [freightTypeList, setFreightTypeList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [error, setError] = React.useState<any>({});
    const [toggleSuccessModal, setToggleSuccessModal] = React.useState<any>(false)
    const [messageModalData, setMessageModalData] = React.useState<any>({})
    const vehicleTypeList = useSelector((state: any) =>
        state.appReducer.vehicleTypeList, shallowEqual
    );
    const [checked, setChecked] = React.useState<boolean>(false);
    const [contractId, setContractId] = React.useState<any>(undefined);

    const handleChange = (event: { target: { name: any; checked: any; }; }) => {
        setChecked((prev: boolean) => !prev)
    };

    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let promiseArray: any = [appDispatch(getAllVehicleTypeList()), appDispatch(getClientFreightTypeList())];
            Promise.all(promiseArray).then((response: any) => {
                if (response && response[1]) {
                    setFreightTypeList(setAutoCompleteList(response[1], "freightTypeName", "freightTypeName"));
                }
                dispatch(hideLoading());
            })

        }
        getList();
        dispatch(setUserParams({
            gst: 18
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div className="filter-wrap">
                <Filter
                    pageTitle={"Contract Creation"}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                />
            </div>

            <ContractMessageAlertBox
                open={toggleSuccessModal}
                selectedElement={messageModalData}
                onSuccess={() => {
                    setMessageModalData({})
                    setToggleSuccessModal(false);
                    history.push(ContractFreightCharges + contractId)
                }}
                onClose={() => {
                    setMessageModalData({})
                    setToggleSuccessModal(false)
                    history.push(ContractUrl)
                }}
            />

            <PageContainer  >
                <Card className="creat-contract-wrapp creat-wrapp">
                    <div className="billing-info-header">
                        <h4>Contract Details</h4>
                    </div>
                    {state.loading ?
                        <CardContentSkeleton
                            row={3}
                            column={3}
                        />
                        : <CardContent className="creat-contract-content">
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
                                            if (element.value === FreightType.FTL) {
                                                dispatch(setUserParams({
                                                    freightType: element,
                                                    modeType: ftlServiceabilityModeTypeList[0],
                                                }));
                                            } else {
                                                dispatch(setUserParams({
                                                    freightType: element,
                                                    modeType: undefined
                                                }));
                                            }

                                            setError({});
                                        }}
                                    />
                                </div>
                                {state.userParams.freightType && state.userParams.freightType.value === FreightType.FTL &&

                                    <div className="form-group col-md-8">
                                        <AutoSuggest
                                            label={laneTitle}
                                            mandatory
                                            placeHolder={lanePlaceholder}
                                            error={error.lane}
                                            value={state.userParams.laneName}
                                            suggestions={laneList}
                                            handleSuggestionsFetchRequested={({ value }: any) => {
                                                if (value.length > autosuggestSearchLength) {
                                                    getLaneList(value);
                                                }
                                            }}
                                            onSelected={(element: OptionType) => {
                                                dispatch(setUserParams({
                                                    laneName: element.label,
                                                    lane: element,
                                                }));
                                                setError({});
                                            }}
                                            onChange={(text: string) => {
                                                dispatch(setUserParams({
                                                    lane: undefined,
                                                    partner: undefined,
                                                    laneName: text
                                                }));
                                            }}
                                        />
                                    </div>
                                }

                                <div className="form-group col-md-4">
                                    <AutoComplete
                                        label="Mode of Transportation"
                                        mandatory
                                        placeHolder="Select Transportation"
                                        value={state.userParams.modeType}
                                        options={state.userParams.freightType && state.userParams.freightType.value === FreightType.FTL ? ftlServiceabilityModeTypeList : serviceabilityModeTypeList}
                                        error={error.modeType}
                                        onChange={(value: any) => {
                                            if (value.value === "air") {
                                                dispatch(setUserParams({
                                                    modeType: value,
                                                    volumetricDivisionFactor: 5000
                                                }));
                                            } else {
                                                dispatch(setUserParams({
                                                    modeType: value,
                                                    volumetricDivisionFactor: 4500
                                                }));
                                            }

                                            setError({});
                                        }}
                                    />
                                </div>

                                {state.userParams.freightType && state.userParams.freightType.value === FreightType.PTL &&
                                    <div className="form-group col-md-4">
                                        <AutoComplete
                                            label={contractModeLabel}
                                            mandatory
                                            placeHolder={contractModePlaceholder}
                                            value={state.userParams.contractMode}
                                            error={error.contractMode}
                                            options={ptlModeTypeList}
                                            onChange={(element: OptionType) => {
                                                dispatch(setUserParams({
                                                    contractMode: element
                                                }));
                                                setError({});
                                            }}
                                        />
                                    </div>
                                }

                                <div className="form-group col-md-4">
                                    <AutoSuggest
                                        label={transporterLabel}
                                        placeHolder={transporterPlaceHolder}
                                        value={state.userParams.partnerName}
                                        error={error.partner}
                                        mandatory
                                        suggestions={partnerList}
                                        handleSuggestionsFetchRequested={({ value }: any) => {
                                            if (value.length > autosuggestSearchLength) {
                                                getPartnerListPTL(value);
                                            }
                                        }}
                                        onSelected={(element: OptionType) => {
                                            dispatch(setUserParams({
                                                partnerName: element.label,
                                                partner: element
                                            }))
                                            setError({});
                                        }}
                                        onChange={(text: string) => {
                                            dispatch(setUserParams({
                                                partnerName: text,
                                                partner: undefined
                                            }))
                                        }}
                                    />
                                </div>

                                {state.userParams.freightType && state.userParams.freightType.value === FreightType.FTL && <div className="form-group col-md-4">
                                    <AutoComplete
                                        label={vehicleTypeLabel}
                                        mandatory
                                        placeHolder={vehicleTypePlaceholder}
                                        value={state.userParams.vehicleType}
                                        error={error.vehicleType}
                                        options={setAutoCompleteListWithData(vehicleTypeList, "type", "code")}
                                        onChange={(element: OptionType) => {
                                            dispatch(setUserParams({
                                                vehicleType: element,
                                            }));
                                            setError({});
                                        }}
                                    />
                                </div>}

                                <div className="form-group col-md-4">
                                    <label className="picker-label">{"Validity From"}<span className="mandatory-flied">*</span></label>
                                    <DatePicker
                                        className="custom-date-picker"
                                        hiddenLabel
                                        placeholder="From Date"
                                        helperText={error.contractStartDate}
                                        disablePast
                                        format={displayDateFormatter}
                                        value={state.userParams.contractStartDate || null}
                                        maxDate={state.userParams.contractEndDate}
                                        onChange={(date: any) => {
                                            dispatch(setUserParams({
                                                contractStartDate: date
                                            }));
                                            setError({});
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="picker-label">{"Validity To"}<span className="mandatory-flied">*</span></label>
                                    <DatePicker
                                        className="custom-date-picker"
                                        placeholder="To Date"
                                        hiddenLabel
                                        format={displayDateFormatter}
                                        helperText={error.contractEndDate}
                                        disablePast
                                        minDate={state.userParams.contractStartDate}
                                        value={state.userParams.contractEndDate || null}
                                        onChange={(date: any) => {
                                            dispatch(setUserParams({
                                                contractEndDate: date
                                            }));
                                            setError({});
                                        }}
                                    />
                                </div>

                                {
                                    state.userParams.freightType && state.userParams.freightType.value === FreightType.FTL && (
                                        <div className="form-group col-md-4">
                                            <NumberEditText
                                                label="Detention Threshold (hrs)"
                                                placeholder="Enter Detention Threshold"
                                                maxLength={3}
                                                decimalSeparator={false}
                                                value={state.userParams.detentionThreshold}
                                                error={error.detentionThreshold}
                                                onChange={(text: any) => {
                                                    dispatch(setUserParams({
                                                        detentionThreshold: text
                                                    }));
                                                    setError({});
                                                }}
                                            />
                                        </div>
                                    )
                                }


                                <div className="form-group col-md-4">
                                    <EditText
                                        label={"Reference Id"}
                                        placeholder={"Reference Id"}
                                        value={state.userParams.contractReferenceNo}
                                        error={error.contractReferenceNo}
                                        maxLength={20}
                                        onChange={(text: any) => {
                                            dispatch(setUserParams({
                                                contractReferenceNo: text
                                            }));
                                            setError({});
                                        }}
                                    />
                                </div>

                                {state.userParams.freightType && state.userParams.freightType.value === FreightType.PTL &&
                                    <div className="form-group col-md-4">
                                        <NumberEditText
                                            label={"Volumetric Weight Factor"}
                                            mandatory
                                            placeholder={"Volumetric Weight Factor"}
                                            value={state.userParams.volumetricDivisionFactor}
                                            error={error.volumetricDivisionFactor}
                                            maxLength={5}
                                            onChange={(text: any) => {
                                                dispatch(setUserParams({
                                                    volumetricDivisionFactor: text
                                                }));
                                                setError({});
                                            }}
                                            toolTip={() =>
                                                <CustomToolTip
                                                    title={"(L*B*H) / Volumetric Factor"}
                                                    disableInMobile={"false"}
                                                    placement="bottom"
                                                >
                                                    <Info className="blue-text info-icon" />
                                                </CustomToolTip>
                                            }
                                        />
                                    </div>}
                                <div className="form-group col-md-4">

                                    <FormControlLabel className="gst-checkbox"
                                        control={
                                            <Checkbox className="custom-checkbox"
                                                checked={checked}
                                                onChange={handleChange}
                                                name="checked"
                                            />
                                        }
                                        label="GST"
                                    />
                                </div>
                                {checked &&
                                    <div className="form-group col-md-4">
                                        <NumberEditText
                                            label={"GST (%)"}
                                            mandatory
                                            placeholder={"GST (%)"}
                                            value={state.userParams.gst}
                                            error={error.gst}
                                            maxLength={3}
                                            onChange={(text: any) => {
                                                dispatch(setUserParams({
                                                    gst: text
                                                }));
                                                setError({});
                                            }}
                                        />
                                    </div>}
                            </div>
                        </CardContent>
                    }
                </Card>

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
                        onClick={() => {
                            const validate = validateCreateContractData(state.userParams, appDispatch, checked)
                            if (validate === true) {
                                createNewContract();
                            } else {
                                setError(validate);
                            }
                        }}
                    />

                </div>
            </PageContainer>
        </div >
    );

    function onClear() {
        setPartnerList(undefined);
        setLaneList(undefined);
        dispatch(clearUserParams());
        setError({});
        setChecked(false);
    }

    function createNewContract() {
        dispatch(showLoading());
        let params = createContractParams(state.userParams, checked);
        dispatch(showLoading());
        appDispatch(createContract(params)).then((response: any) => {
            if (response && response.message && response.details) {
                setMessageModalData(response.message);
                setContractId(response.details.contractCode);
                setToggleSuccessModal(true);
            }
            dispatch(hideLoading());
        })

    }

    // function getPartnerList(text: string) {
    //     appDispatch(searchLanePartner({ laneCode: text })).then((response: any) => {
    //         if (response && response.partnerDetails) {
    //             setPartnerList(setAutoCompleteListFromObject(response.partnerDetails, "partner", "name", "code"));
    //         }
    //     });
    // }

    function getPartnerListPTL(text: string) {
        appDispatch(searchClientPartner({ query: text })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteListWithData(response, "partnerName", "partnerCode"))
            }
        });
    }

    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                setLaneList(setAutoCompleteListWithData(response, "laneName", "laneCode"))
            }
        });
    }

}
export default CreateContract;
