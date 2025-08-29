import { Card, CardContent } from "@material-ui/core";
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { ClearAll, KeyboardBackspace, LocalShipping, Tune } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import React, { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { TabPanel } from "../../../../src/component/tabs/TabPanel";
import { demandOrderTabsEnum, OrderStatus, rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { AssignDemandOrderUrl, DOListingUrl, OrderDetailsUrl, RaiseIndentUrl } from "../../../base/constant/RoutePath";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { displayDateTimeFormatter } from "../../../base/utility/DateUtils";
import { useQuery } from "../../../base/utility/Routerutils";
import { isNullValue, isNullValueOrZero, isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Chips from "../../../component/chips/Chips";
import Filter from "../../../component/filter/Filter";
import PageContainer from "../../../component/pageContainer/PageContainer";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import Button from "../../../component/widgets/button/Button";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import CardList from "../../../component/widgets/cardlist/CardList";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from "../../../component/widgets/NumberEditText";
import TableList from "../../../component/widgets/tableView/TableList";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { orderListingFilters } from "../../../moduleUtility/FilterUtils";
import { showAlert } from "../../../redux/actions/AppActions";
import {
    refreshList,
    setCurrentPage,
    setResponse, setRowPerPage,
    setSelectedElement,
    toggleFilter,
    togglePointsModal
} from '../../../redux/actions/OrderActions';
import OrderReducer, { ORDER_STATE } from "../../../redux/reducers/OrderReducer";
import { getOrderList } from "../../../serviceActions/OrderServiceActions";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";
import './AssignDemandOrder.css';
import { assignLabel, demandOrderLabel, demandOrderPlaceholder, dipatchedByLabel, dispatchDateTimePlaceholder, freightOrderLabel, lanePlaceholder, lanePriceLabel, totalQtyLabel, totalQtyPlaceHolder, transporterLabel, transporterPlaceholder } from "./base/demandOrderMessageUtils";
import { demandOrderFOColumn } from "./base/demandOrderTemplate";
import DemandFOFilters from "./demandFOFilters";
import { assignDemandOrder, getDOList } from "./demandOrdersApi/demandOrderServiceActions";

function AssignDemandOrder() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const params = useQuery();
    const { id, currentTab } = useParams<any>();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(orderListingFilters);
    const laneCode = new URLSearchParams(useLocation().search).get("laneCode");
    const tabName = new URLSearchParams(useLocation().search).get("tabName");
    const [value, setValue] = React.useState(tabName === demandOrderTabsEnum.APPROVED ? (currentTab ? parseInt(currentTab) : 0) : 1);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [assignLoading, setAssignLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<any>({});
    const [userParams, setUserParams] = React.useState<any>({});
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        history.push({
            pathname: AssignDemandOrderUrl + id + "/" + newValue,
            search: params.toString()
        });
        setValue(newValue);
    };
    const [state = ORDER_STATE, dispatch] = useReducer(OrderReducer, ORDER_STATE);

    useEffect(() => {
        const getList = async () => {
            let queryParams: any = {
                page: state.currentPage,
                pageSize: state.pageSize,
                laneCode: laneCode,
            }
            let doQueryParams: any = {
                demandOrderCode: id
            };
            if (!filterState?.params?.orderStatusCode) {
                queryParams.orderStatusCodes = `${OrderStatus.CONFIRMED},${OrderStatus.PENDING}`
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params);
            }
            setLoading(true);
            Promise.all([appDispatch(getDOList(doQueryParams)), appDispatch(getOrderList(queryParams))]).then((response: any) => {
                if (response && response[0] && response[0].data && response[0].data[0]) {
                    let doData = response[0].data[0];
                    setUserParams({
                        id: doData.id,
                        demandOrderCode: doData.demandOrderCode,
                        quantity: doData.quantity,
                        partnerName: doData.transporter && doData.transporter.transporterName,
                        partnerCode: doData.transporter && doData.transporter.transporterCode,
                        partnerData: doData.transporter ? {
                            partnerEmail: doData.transporter.transporterEmail,
                            partnerCompanyName: doData.transporter.transporterName,
                        } : undefined,
                        dispatchBy: doData.dispatchBy,
                        lanePrice: doData.transporter && doData.transporter.lanePrice
                    })
                } else {
                    setUserParams({})
                } if (response && response[1]) {
                    dispatch(setResponse(response[1]));
                }
                setLoading(false);
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);

    return (
        <div className="assign-demand-order">
            <DemandFOFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    dispatch(refreshList())
                    dispatch(toggleFilter());
                    addFiltersQueryParams(filterChips, filterParams)
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <Filter
                pageTitle={"Demand Order"}
                buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                buttonTitle={isMobile ? " " : "Back"}
                leftIcon={<KeyboardBackspace />}
                onClick={() => {
                    history.push(DOListingUrl + tabName)
                }}
            >
                {
                    value === 1 &&
                    <>
                        <Button
                            buttonStyle="btn-orange"
                            title={isMobile ? " " : "Filter"}
                            leftIcon={<Tune />}
                            loading={state.loading}
                            onClick={() => {
                                dispatch(toggleFilter());
                            }}
                        />
                        <Button
                            buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                            title={isMobile ? "" : "Create FO"}
                            leftIcon={isMobile ? <img src="/images/Add.png" alt="Add" /> : <LocalShipping />}
                            loading={state.loading}
                            onClick={() => {
                                history.push({
                                    pathname: RaiseIndentUrl + id,
                                })
                            }}
                        />
                    </>
                }

            </Filter>

            <PageContainer
                loading={loading}
                listData={state.listData}
            >
                <div className={tabName === demandOrderTabsEnum.APPROVED ? "assign-fright" : ""}>
                    <div className="bill-tab tab-nav assign-order">
                        {tabName === demandOrderTabsEnum.APPROVED &&
                            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                                <Tab label={assignLabel} />
                                <Tab label={freightOrderLabel} />
                            </Tabs>}
                    </div>
                    <TabPanel value={value} index={0}>
                        <Card className="creat-contract-wrapp">
                            {loading ?
                                <CardContentSkeleton
                                    row={3}
                                    column={2}
                                /> : <CardContent className="creat-contract-content raise-contract-detail">
                                    <div className="row custom-form-row align-items-end">
                                        <div className="form-group col-md-6">
                                            <EditText
                                                label={demandOrderLabel}
                                                maxLength={60}
                                                disabled
                                                mandatory
                                                error={error.demandOrderCode}
                                                placeholder={demandOrderPlaceholder}
                                                value={userParams.demandOrderCode}
                                                onChange={(text: string) => {

                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <NumberEditText
                                                label={totalQtyLabel}
                                                mandatory
                                                disabled
                                                maxLength={8}
                                                allowNegative={false}
                                                allowZero
                                                decimalScale={2}
                                                placeholder={totalQtyPlaceHolder}
                                                value={userParams.quantity}
                                                error={error.quantity}
                                                onChange={(text: string) => {

                                                }}
                                            />
                                        </div>

                                        <div className="col-md-6 form-group">
                                            <AutoSuggest
                                                label={transporterLabel}
                                                placeHolder={transporterPlaceholder}
                                                value={userParams.partnerName}
                                                suggestions={partnerList}
                                                mandatory
                                                error={error.partnerName}
                                                handleSuggestionsFetchRequested={({ value }: any) => {
                                                    if (value.length > autosuggestSearchLength) {
                                                        getPartnerList(value);
                                                    }
                                                }}
                                                onSelected={(value: OptionType) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        partnerName: value.label,
                                                        partnerCode: value.value,
                                                        partnerData: value.data,
                                                    })
                                                    setError({})
                                                }}
                                                onChange={(text: string) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        partnerName: text,
                                                        partnerCode: "",
                                                        partnerData: undefined,
                                                    })
                                                    setError({})
                                                }}
                                            />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label className="picker-label">{dipatchedByLabel} <span className="mandatory-flied">*</span></label>
                                            <DateTimePicker
                                                className="custom-date-picker"
                                                placeholder={dispatchDateTimePlaceholder}
                                                hiddenLabel
                                                disabled
                                                format={displayDateTimeFormatter}
                                                helperText={error.dispatchBy}
                                                value={userParams.dispatchBy || null}
                                                onChange={(date: any) => {

                                                }}
                                            />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <NumberEditText
                                                label={lanePriceLabel}
                                                mandatory
                                                maxLength={8}
                                                allowNegative={false}
                                                allowZero={false}
                                                decimalScale={2}
                                                placeholder={lanePlaceholder}
                                                error={error.lanePrice}
                                                value={userParams.lanePrice}
                                                onChange={(text: string) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        lanePrice: text
                                                    })
                                                    setError({})
                                                }}
                                            />
                                        </div>
                                    </div>

                                </CardContent>}
                        </Card>
                        <div className="row text-right">
                            <div className="col indent-btn-wrap">
                                <Button
                                    buttonStyle="btn-orange mr-3"
                                    title="Clear"
                                    disable={loading || assignLoading}
                                    leftIcon={<ClearAll />}
                                    onClick={() => {
                                        setUserParams({
                                            ...userParams,
                                            partnerName: "",
                                            partnerCode: "",
                                            partnerData: undefined,
                                            lanePrice: ""
                                        })
                                    }}
                                />
                                <Button
                                    buttonStyle="btn-blue"
                                    title="Assign Transporter"
                                    disable={loading || assignLoading}
                                    loading={assignLoading}
                                    onClick={() => {
                                        if (validate()) {
                                            setAssignLoading(true)
                                            let params: any = {
                                                demandOrderId: userParams.id,
                                                lanePrice: parseFloat(userParams.lanePrice),
                                                transporterCode: userParams.partnerCode,
                                                transporterName: userParams.partnerName,
                                                transporterEmail: userParams.partnerData && userParams.partnerData.partnerEmail,
                                                transporterCompany: userParams.partnerData && userParams.partnerData.partnerCompanyName,
                                            }
                                            appDispatch(assignDemandOrder(params)).then((response: any) => {
                                                if (response) {
                                                    response.message && appDispatch(showAlert(response.message));
                                                    history.goBack();
                                                }
                                                setAssignLoading(false)
                                            })
                                        }
                                    }}
                                    leftIcon={<LocalShipping />}
                                />
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel styleName="freigh-tab" value={value} index={1}>
                        {
                            !isObjectEmpty(filterState.chips) && Object.keys(filterState.chips).map((element: any, index: any) => (
                                <Chips
                                    key={index}
                                    label={element === "isVehicleAssignedStatus" ? "Vehicle Assigned: " + filterState.chips[element] : filterState.chips[element]}
                                    onDelete={() => {
                                        dispatch(refreshList());
                                        if (element === "dispatchOrderCreatedAtFromTime" || element === "dispatchOrderCreatedAtToTime") {
                                            let secondKey = element === "dispatchOrderCreatedAtFromTime" ? "dispatchOrderCreatedAtToTime" : "dispatchOrderCreatedAtFromTime";
                                            removeFiltersQueryParams([element, secondKey])
                                        } else {
                                            removeFiltersQueryParams([element]);
                                        }
                                    }}
                                />

                            ))}
                        {
                            isMobile ?
                                <CardList
                                    listData={state.listData}
                                    tableColumns={demandOrderFOColumn(onClickLaneCode, onClickViewButton)}
                                    isNextPage={state.pagination && state.pagination.next}
                                    onReachEnd={() => {
                                        dispatch(setCurrentPage(state.pagination.next))
                                    }}
                                />
                                :
                                <TableList
                                    tableColumns={demandOrderFOColumn(onClickLaneCode, onClickViewButton)}
                                    currentPage={state.currentPage}
                                    rowsPerPage={state.pageSize}
                                    rowsPerPageOptions={rowsPerPageOptions}
                                    totalCount={state.pagination && state.pagination.count}
                                    listData={state.listData}
                                    onChangePage={(event: any, page: number) => {
                                        dispatch(setCurrentPage(page))
                                    }}
                                    onChangeRowsPerPage={(event: any) => {
                                        dispatch(setRowPerPage(event.target.value))
                                    }}
                                />
                        }
                    </TabPanel>

                </div>

            </PageContainer>
        </div>
    );

    function validate() {
        if (isNullValue(userParams.demandOrderCode)) {
            setError({ demandOrderCode: "Enter DO code" })
            return false
        } else if (isNullValue(userParams.partnerCode)) {
            setError({ partnerName: "Enter valid transporter" })
            return false
        } else if (isNullValue(userParams.dispatchBy)) {
            setError({ dispatchBy: "Enter dispatched by date" })
            return false
        } else if (isNullValueOrZero(userParams.lanePrice)) {
            setError({ lanePrice: "Enter lane price" })
            return false
        }
        return true;
    }

    function getPartnerList(text: string) {
        appDispatch(searchClientPartner({ query: text })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteListWithData(response, "partnerName", "partnerCode"))
            }
        });
    }

    function onClickLaneCode(element: any) {
        dispatch(togglePointsModal());
        dispatch(setSelectedElement(element))
    }

    function onClickViewButton(element: any) {
        element && history.push({
            pathname: OrderDetailsUrl + element.freightOrderCode,
            search: "?demandOrderCode=" + id
        });
    }
}

export default AssignDemandOrder;