import { Card, CardHeader } from "@material-ui/core";
import { Cancel, CheckCircleRounded, KeyboardBackspace, LocalShipping } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { demandOrderTabsEnum, rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { DOListingUrl } from "../../../base/constant/RoutePath";
import { isNullValue, isNullValueOrZero, isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Filter from "../../../component/filter/Filter";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import Button from "../../../component/widgets/button/Button";
import NumberEditText from "../../../component/widgets/NumberEditText";
import TableList from "../../../component/widgets/tableView/TableList";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { showAlert } from "../../../redux/actions/AppActions";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";
import { assignBulkTransporterColoumn } from "../../../templates/FreightTemplates";
import './AssignBulkDemandOrderView.css';
import { lanePlaceholder, lanePriceLabel, transporterLabel, transporterPlaceholder } from "./base/demandOrderMessageUtils";
import { assignBulkDemandOrder } from "./demandOrdersApi/demandOrderServiceActions";

function AssignBulkDemandOrderView() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [assignLoading, setAssignLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<any>([]);
    const [userParams, setUserParams] = React.useState<any>([]);
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [isAllchecked, setAllValue] = React.useState<any>(false)
    const [assignBulkTransporter, setBulkTransporter] = React.useState<any>({})
    const [assignBulkLanePrice, setBulkLanePrice] = React.useState<any>("")
    const selectedDoOrdersList: any = history.location.state;


    useEffect(() => {
        if (selectedDoOrdersList && selectedDoOrdersList.length > 0) {
            let doOrders: any = [];
            doOrders = selectedDoOrdersList.map((item: any, index: any) => {
                return {
                    id: item.id,
                    demandOrderCode: item.demandOrderCode,
                    quantity: item.quantity,
                    laneDisplayName: item.laneDisplayName,
                    partnerName: item.transporter && item.transporter.transporterName,
                    partnerCode: item.transporter && item.transporter.transporterCode,
                    partnerData: item.transporter ? {
                        partnerEmail: item.transporter.transporterEmail,
                        partnerCompanyName: item.transporter.transporterName,
                    } : undefined,
                    isCheckboxChecked: true,
                    dispatchBy: item.dispatchBy,
                    lanePrice: item.transporter && item.transporter.lanePrice,
                    index: index
                }
            })
            setUserParams(doOrders);
            setAllValue(true)
        }// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history.location.state]);

    return <div className="DO-assign-transporter">
        <div className="filter-wrap">
            <Filter
                pageTitle={"DO Assign Transporter"}
                buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                buttonTitle={isMobile ? " " : "Back"}
                leftIcon={<KeyboardBackspace />}
                onClick={() => {
                    history.push({
                        pathname: DOListingUrl + demandOrderTabsEnum.APPROVED,
                        state: { isBulk: true }
                    })
                }
                }
            >
            </Filter>
        </div>
        <div className="dispatchInput row transporterInput">
            <div className="form-group col-12 col-md-4 pl-md-2 pr-md-2 p-0">
                <div className="input-wrap ">
                    <AutoSuggest
                        placeHolder={transporterPlaceholder}
                        label={transporterLabel}
                        value={assignBulkTransporter.partnerName}
                        suggestions={partnerList}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getPartnerList(value);
                            }
                        }}
                        onSelected={(value: OptionType) => {
                            setBulkTransporter({
                                partnerName: value.label,
                                partnerCode: value.value,
                                partnerData: value.data
                            })
                        }}
                        onChange={(text: string) => {
                            setBulkTransporter({
                                partnerName: text,
                                partnerCode: "",
                                partnerData: undefined
                            })
                        }}
                    />
                </div>
            </div>
            <div className="form-group col-12 col-md-4 pl-md-2 pr-md-3 p-0">
                <NumberEditText
                    maxLength={8}
                    label={lanePriceLabel}
                    allowNegative={false}
                    allowZero={false}
                    decimalScale={2}
                    placeholder={lanePlaceholder}
                    value={assignBulkLanePrice}
                    onChange={(text: string) => {
                        setBulkLanePrice(text)
                    }}
                />
            </div>
            <div className="applyAll">
                <Button
                    buttonStyle="btn-blue"
                    title="Apply All"
                    disable={assignLoading}
                    leftIcon={<CheckCircleRounded />}
                    onClick={() => {
                        let doOrderData: any = [];
                        doOrderData = userParams && userParams.map((item: any) => {
                            let itemObject: any = item;
                            if (isObjectEmpty(assignBulkTransporter) !== true) {
                                itemObject.partnerName = assignBulkTransporter.partnerName
                                itemObject.partnerCode = assignBulkTransporter.partnerCode
                                itemObject.partnerData = assignBulkTransporter.partnerData
                            }
                            if (assignBulkLanePrice.length > 0) {
                                itemObject.lanePrice = assignBulkLanePrice
                            }
                            return itemObject;
                        })
                        setUserParams(doOrderData)
                        setError({})
                    }}
                />
            </div>
        </div>
        <div className="dispatch-card-wrapper assignTransporter">
            <Card className="creat-contract-wrapp creat-wrapp">
                <CardHeader className="creat-contract-header"
                    title={"Assign Transporter"}
                />
                <div className="table-detail-listing inp-tableList scroll-table ">
                    <TableList
                        tableColumns={assignBulkTransporterColoumn(isAllchecked, handleChecks, handleAllChecks, error, setError, partnerList, getPartnerList, userParams, setUserParams)}
                        currentPage={0}
                        rowsPerPage={25}
                        rowsPerPageOptions={rowsPerPageOptions}
                        listData={userParams}
                        onChangePage={(event: any, page: number) => {
                        }}
                        onChangeRowsPerPage={(event: any) => {
                        }}
                    />
                </div>
            </Card>
            <div className="text-right ">
                <div className="indent-btn-wrap">
                    <Button
                        buttonStyle="btn-orange mr-3"
                        title="Cancel"
                        disable={assignLoading}
                        leftIcon={<Cancel />}
                        onClick={() => {
                            history.push({
                                pathname: DOListingUrl + demandOrderTabsEnum.APPROVED,
                                state: { isBulk: true }
                            })
                        }}
                    />
                    <Button
                        buttonStyle="btn-blue"
                        title="Assign Transporter"
                        disable={assignLoading}
                        loading={assignLoading}
                        onClick={() => {
                            if (countSelectedDOs() > 0) {
                                let newBulkErrorArray: any = new Array(selectedDoOrdersList.length).fill(null)
                                let assignbulkpartnerArray: any = []
                                userParams && userParams.forEach((element: any) => {
                                    if (element.isCheckboxChecked) {
                                        if (validate(element).partnerName || validate(element).lanePrice) {
                                            newBulkErrorArray[element.index] = validate(element)
                                        }
                                        else {
                                            let params: any = {
                                                demandOrderId: element.id,
                                                lanePrice: parseFloat(element.lanePrice),
                                                transporterCode: element.partnerCode,
                                                transporterName: element.partnerName,
                                                transporterEmail: element.partnerData && element.partnerData.partnerEmail,
                                                transporterCompany: element.partnerData && element.partnerData.partnerCompanyName,
                                            }
                                            assignbulkpartnerArray.push(params)
                                        }
                                    }
                                })
                                setError(newBulkErrorArray)
                                if (countSelectedDOs() === assignbulkpartnerArray.length) {
                                    setAssignLoading(true)
                                    appDispatch(assignBulkDemandOrder({ demandOrderPartnerAssignDetails: assignbulkpartnerArray })).then((response: any) => {
                                        if (response) {
                                            response.message && appDispatch(showAlert(response.message));
                                            history.goBack();
                                        }
                                        setAssignLoading(false)
                                    })
                                }
                            }
                            else {
                                appDispatch(showAlert("Please select atleast one DO", false));
                                return;
                            }
                        }}
                        leftIcon={<LocalShipping />}
                    />
                </div>
            </div>
        </div>
    </div>

    function validate(element: any) {
        let newerror: any = {}
        if (isNullValue(element.partnerCode)) {
            newerror.partnerName = "Enter valid transporter"
        }
        if (isNullValueOrZero(element.lanePrice)) {
            newerror.lanePrice = "Enter lane price"
        }
        return newerror;
    }

    function getPartnerList(text: string) {
        appDispatch(searchClientPartner({ query: text })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteListWithData(response, "partnerName", "partnerCode"))
            }
        });
    }

    function handleChecks(checked: any, demandOrderCode: any) {
        let checkArray: any = [];
        let checkedCounts: any = 0;
        checkArray = userParams && userParams.map((item: any) => {
            let itemList: any = item;
            if (item.isCheckboxChecked) {
                checkedCounts++;
            }
            if (item.demandOrderCode === demandOrderCode) {
                itemList.isCheckboxChecked = checked;
                if (checked) {
                    checkedCounts++;
                }
            }
            return itemList;
        })
        if (checked) {
            if (checkedCounts === (userParams && userParams.length)) {
                setAllValue(true);
            }
        } else {
            setAllValue(false);
        }
        setUserParams(checkArray)
    }

    function handleAllChecks(checked: any) {
        let checkArray: any = [];
        checkArray = userParams && userParams.map((item: any) => {
            return {
                ...item,
                isCheckboxChecked: checked
            };
        })
        setUserParams(checkArray);
        setAllValue(checked)
    }

    function countSelectedDOs() {
        let count = 0;
        userParams && userParams.forEach((item: any) => {
            if (item.isCheckboxChecked) {
                count++;
            }
        })
        return count;
    }
}

export default AssignBulkDemandOrderView;