import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { KeyboardBackspace, Tune } from "@material-ui/icons";
import React, { useEffect, useReducer } from "react";
import { useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from "react-router";
import { allTrackRequestListingOptions, placementTrackRequestListingOptions, rowsPerPageOptions, trackRequestTab, trackRequestTabValue, vehicleTrackRequestListingOptions } from '../../../base/constant/ArrayList';
import { TrackRequestUrl } from '../../../base/constant/RoutePath';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { getAdvanceFilterChips, useQuery } from '../../../base/utility/Routerutils';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from "../../../base/utility/ViewUtils";
import Chips from '../../../component/chips/Chips';
import Filter from "../../../component/filter/Filter";
import PageContainer from "../../../component/pageContainer/PageContainer";
import { TabPanel } from "../../../component/tabs/TabPanel";
import AutoComplete from '../../../component/widgets/AutoComplete';
import Button from '../../../component/widgets/button/Button';
import CardList from '../../../component/widgets/cardlist/CardList';
import ExpendableCardList from '../../../component/widgets/cardlist/ExpendableCardList';
import TableCollapseList from '../../../component/widgets/tableView/tableCollapseList/TableCollapseList';
import TableList from '../../../component/widgets/tableView/TableList';
import WarningModal from '../../../modals/warningModal/WarningModal';
import { trackListFilters } from '../../../moduleUtility/FilterUtils';
import { pollStart } from '../../../redux/actions/AppActions';
import { hideLoading, refreshList, setCurrentPage, setResponse, setRowPerPage, setSelectedElement, setSelectedTab, showLoading, toggleFilter, togglePointsModal } from '../../../redux/actions/TrackListingAction';
import TrackListingReducer, { TRACK_LIST_STATE } from "../../../redux/reducers/TrackListingReducer";
import { acceptPlacementDateTime, getCurrentVehicleType, getPlacementDateTime, orchestrationToken, rejectPlacementDateTime, rejectTrackRequest } from '../../../serviceActions/TrackRequestVehicleTypeServiceActions';
import { placementDateTimeChildrenTableColumn } from '../../../templates/PlanningTemplates';
import { trackRequestPlacementDateTimeTableColumn, trackRequestTabsListingColumn } from '../../../templates/TrackRequestListTemplates';
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';
import PlacementDateTimeApproveModal from './PlacementDateTimeApproveModal';
import TrackRequestAcceptWarningModal from './TrackRequesAcceptWarningModal';
import TrackRequestFilters from './TrackRequestFilters';

function TrackRequestListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const { id } = useParams<any>();
    const params = useQuery();
    const config = new URLSearchParams(useLocation().search).get('config')
    const [placementDateTimeCancelModalOpen, setPlacementDateTimeCancelModalOpen] = React.useState<boolean>(false)
    const [placementDateTimeApproveModalOpen, setPlacementDateTimeApproveModalOpen] = React.useState<boolean>(false)
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(trackListFilters);
    const [state = TRACK_LIST_STATE, dispatch] = useReducer(TrackListingReducer, TRACK_LIST_STATE);
    const [acceptWarningDetails, setAcceptWarningDetails] = React.useState<any>({});
    const [trackRequestRejectWarningModal, setTrackRequestRejectWarningModal] = React.useState<any>(false);
    const [trackRequestAcceptWarningModal, setTrackRequestAcceptWarningModal] = React.useState<any>(false);
    const [optionValue, setOptionValue] = React.useState<any>({})
    const [trackDropdownOptions, setTrackDropdownOptions] = React.useState<any>([]);
    const [pollingLoader, setPollingLoader] = React.useState<boolean>(false);

    useEffect(() => {
        if (config === "all") {
            setOptionValue(allTrackRequestListingOptions[0])
            setTrackDropdownOptions(allTrackRequestListingOptions);
        } else if (config === "vehicle") {
            setOptionValue(vehicleTrackRequestListingOptions[0]);
            setTrackDropdownOptions(vehicleTrackRequestListingOptions);
        } else if (config === "placement") {
            setOptionValue(placementTrackRequestListingOptions[0]);
            setTrackDropdownOptions(placementTrackRequestListingOptions)
        }
    }, [config])


    useEffect(() => {
        const getList = async () => {
            let queryParams: any = {
                page: state.currentPage,
                size: state.pageSize,
                statusCode: id ? trackRequestTabValue[trackRequestTab.indexOf(id)] : trackRequestTabValue[0]
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params);
            }
            if (queryParams && queryParams.queryFieldLabel) {
                delete queryParams["queryFieldLabel"]
            }
            dispatch(setSelectedTab(id ? trackRequestTab.indexOf(id) : 0))
            dispatch(showLoading())
            if (optionValue && optionValue.value === 'Vehicle Type') {
                appDispatch(getCurrentVehicleType(queryParams)).then((response: any) => {
                    if (response) {
                        dispatch(setResponse(response))
                    }
                    dispatch(hideLoading())
                });
            }
            else if (optionValue && optionValue.value === 'Placement Date and Time') {
                appDispatch(getPlacementDateTime(queryParams)).then((response: any) => {
                    if (response) {
                        dispatch(setResponse(response))
                    }
                    dispatch(hideLoading())
                });
            }

        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.pageSize, history.location.search, id, optionValue]);

    const stopPollingLoader = () => {
        setPollingLoader(false);
    }

    const fetchPollingData = (params: any) => {
        return appDispatch(orchestrationToken({ orchestrationId: params.orchestrationId, service: params.service })).then((response: any) => {
            return response;
        })
    }

    const stopPollingDataAccept = () => {
        setPollingLoader(false);
        setPlacementDateTimeApproveModalOpen(false);
        history.push({
            pathname: TrackRequestUrl + trackRequestTab[1],
            search: "?config=" + config
        })
    }

    const stopPollingDataAcceptVehicle = () => {
        setPollingLoader(false);
        setTrackRequestAcceptWarningModal(false)
        history.push({
            pathname: TrackRequestUrl + trackRequestTab[1],
            search: "?config=" + config
        })
    }

    const stopPollingDataRejectVehicle = () => {
        setPollingLoader(false);
        setTrackRequestRejectWarningModal(false)
        history.push({
            pathname: TrackRequestUrl + trackRequestTab[2],
            search: "?config=" + config
        })
    }

    const stopPollingDataReject = () => {
        setPollingLoader(false);
        setPlacementDateTimeCancelModalOpen(false);
        history.push({
            pathname: TrackRequestUrl + trackRequestTab[2],
            search: "?config=" + config
        })
    }

    const switchTab = (tabIndex: number) => {
        dispatch(setSelectedTab(tabIndex));
        dispatch(setCurrentPage(1));
        dispatch(setRowPerPage(rowsPerPageOptions[0]));
        history.replace({
            pathname: TrackRequestUrl + trackRequestTab[tabIndex],
            search: params.toString()
        });
    }

    return (
        <div className="so-listing-wrapper">
            <PlacementDateTimeApproveModal
                open={placementDateTimeApproveModalOpen}
                onClose={() => {
                    setPlacementDateTimeApproveModalOpen(false);
                    dispatch(setSelectedElement({}))
                }}
                onSuccess={(params: any) => {
                    dispatch(showLoading())
                    appDispatch(acceptPlacementDateTime({ acceptData: params })).then((response: any) => {
                        if (response) {
                            setPollingLoader(true);
                            appDispatch(pollStart({
                                params: { orchestrationId: response.orchestrationId, service: response.service },
                                asyncFetch: fetchPollingData,
                                stopPollingData: stopPollingDataAccept,
                                stopPollingLoader: stopPollingLoader,
                                orchestrationType: "Track Request"
                            }))
                            //response.message && appDispatch(showAlert(response.message, true))
                        }
                    })
                    dispatch(hideLoading())
                }}
                loading={pollingLoader}
                selectedElement={state.selectedItem}
            />
            {/* FOR REJECT */}
            <PlacementDateTimeApproveModal
                open={placementDateTimeCancelModalOpen}
                onClose={() => {
                    setPlacementDateTimeCancelModalOpen(false);
                    dispatch(setSelectedElement({}))
                }}
                onSuccess={(params: any) => {
                    dispatch(showLoading())
                    appDispatch(rejectPlacementDateTime({ cancelData: params })).then((response: any) => {
                        if (response) {
                            setPollingLoader(true);
                            appDispatch(pollStart({
                                params: { orchestrationId: response.details.orchestrationId, service: response.details.service },
                                asyncFetch: fetchPollingData,
                                stopPollingData: stopPollingDataReject,
                                stopPollingLoader: stopPollingLoader,
                                orchestrationType: "Track Request"
                            }))
                        }
                    })
                    dispatch(hideLoading())
                }}
                rejectModal={true}
                selectedElement={state.selectedItem}
                loading={pollingLoader}
            />
            <WarningModal
                open={trackRequestRejectWarningModal}
                onClose={() => {
                    setTrackRequestRejectWarningModal(false)
                }}
                warningMessage={"Are you sure want to reject the vehicle type change request?"}
                primaryButtonTitle={"Confirm"}
                secondaryuttonTitle={"Cancel"}
                onSuccess={() => {
                    dispatch(showLoading())
                    console.log("x->", state)
                    appDispatch(rejectTrackRequest({ id: state.selectedItem?.id, statusCode: state.selectedItem?.statusCode, freightOrderCode: state?.selectedItem?.freightOrderCode })).then((response: any) => {
                        if (response) {
                            setPollingLoader(true);
                            appDispatch(pollStart({
                                params: { orchestrationId: response.orchestrationId, service: response.service },
                                asyncFetch: fetchPollingData,
                                stopPollingData: stopPollingDataRejectVehicle,
                                stopPollingLoader: stopPollingLoader,
                                orchestrationType: "Track Request",
                            }))
                        }
                    });
                    dispatch(hideLoading())
                }}
                pollingLoader={pollingLoader}
            />
            <TrackRequestAcceptWarningModal
                open={trackRequestAcceptWarningModal}
                onClose={() => {
                    setTrackRequestAcceptWarningModal(false)
                }}
                primaryButtonTitle={"Confirm"}
                secondaryButtonTitle={"Cancel"}
                selectedElement={acceptWarningDetails}
                warningMessage={"Contract doesn't exist for the requested vehicle type! Please enter the lane price."}
                onSuccess={(params: any) => {
                    dispatch(showLoading())
                    setPollingLoader(true);
                    appDispatch(pollStart({
                        params: { orchestrationId: params.orchestrationId, service: params.service },
                        asyncFetch: fetchPollingData,
                        stopPollingData: stopPollingDataAcceptVehicle,
                        stopPollingLoader: stopPollingLoader,
                        orchestrationType: "Track Request",
                    }))
                    dispatch(hideLoading())
                }}
                pollingLoader={pollingLoader}
            />

            <TrackRequestFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    dispatch(refreshList());
                    dispatch(toggleFilter());
                    addFiltersQueryParams(filterChips, filterParams);
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <LanePointsDisplayModal
                open={state.openPointModal}
                laneCode={state.selectedItem && state.selectedItem.laneCode}
                // partition={state.selectedItem && state.selectedItem.clientCode}
                onClose={() => {
                    dispatch(setSelectedElement(undefined));
                    dispatch(togglePointsModal());
                }} />

            <Filter
                pageTitle={"Track Request"}
                buttonTitle={isMobile ? " " : "Back"}
                buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                leftIcon={<KeyboardBackspace />}
                onClick={() => {
                    history.goBack();
                }}
            >
                <AutoComplete
                    isSearchable={false}
                    placeHolder={''}
                    label={''}
                    onChange={(value: any) => {
                        setOptionValue(value);
                        switchTab(0);
                    }}
                    options={trackDropdownOptions}
                    value={optionValue}
                />
                <Button
                    title={"Filter"}
                    buttonStyle="btn-orange"
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                />
            </Filter>
            <div>
                <div className="bill-tab tab-nav">
                    <Tabs value={state.selectedTabIndex} onChange={(event: any, newValue: any) => {
                        if (newValue !== state.selectedTabIndex) {
                            switchTab(newValue);
                        }
                    }}
                        variant="scrollable"
                        scrollButtons={isMobile ? "on" : "off"}
                    >
                        {trackRequestTab.map((element, index) => (
                            <Tab
                                key={index}
                                label={element} />
                        ))}
                    </Tabs>
                </div>
                {/* <div>
                    {!isMobile &&
                        <SearchFilter
                            list={trackingQuickFilters}
                            appliedFilters={filterState.params}
                            onClickSearch={(params: any) => {
                                dispatch(refreshList());
                                if (params) {
                                    addFiltersQueryParams(filterState.chips, {
                                        ...filterState.params,
                                        queryField: params.field.value,
                                        queryFieldLabel: params.field.label,
                                        query: params.text
                                    });
                                } else {
                                    removeFiltersQueryParams(["queryField", "queryFieldLabel", "query"])
                                }
                            }}
                        />
                    }
                </div> */}
                <TabPanel
                    value={state.selectedTabIndex}
                    index={state.selectedTabIndex}>
                    {pageContent}
                </TabPanel>
            </div>
        </div >
    );

    function pageContent() {
        return (
            <PageContainer
                loading={state.loading}
                listData={state.listData}
            >
                {!isObjectEmpty(getAdvanceFilterChips(filterState.chips))
                    && Object.keys(getAdvanceFilterChips(filterState.chips)).map((element: any, index: any) => (
                        <Chips
                            key={index}
                            label={filterState.chips[element]}
                            onDelete={() => {
                                dispatch(refreshList());
                                if (element === "fromDate" || element === "toDate" || element === "query") {
                                    let secondKey = element === "fromDate" ? "toDate" : "fromDate";
                                    let extraMobileKey = element === "query" ? ["queryField", "queryFieldLabel"] : []
                                    removeFiltersQueryParams([element, secondKey, ...extraMobileKey])
                                } else {
                                    removeFiltersQueryParams([element]);
                                }
                            }}
                        />
                    ))}
                {optionValue && optionValue.label === "Vehicle Type" ?
                    <>
                        {
                            isMobile ?
                                <CardList
                                    listData={state.listData}
                                    tableColumns={trackRequestTabsListingColumn(onClickLaneCode, id ? trackRequestTab.indexOf(id) : 0, onClickApprove, onClickReject)}
                                    isNextPage={state.pagination && state.pagination.next}
                                    onReachEnd={() => {
                                        dispatch(setCurrentPage(state.pagination.next))
                                    }}
                                />
                                :
                                <TableList
                                    tableColumns={trackRequestTabsListingColumn(onClickLaneCode, id ? trackRequestTab.indexOf(id) : 0, onClickApprove, onClickReject)}
                                    currentPage={state.currentPage}
                                    rowsPerPage={state.pageSize}
                                    rowsPerPageOptions={rowsPerPageOptions}
                                    totalCount={state.pagination && state.pagination.count}
                                    listData={state.listData}
                                    onChangePage={(event: any, page: number) => {
                                        dispatch(setCurrentPage(page));
                                    }}
                                    onChangeRowsPerPage={(event: any) => {
                                        dispatch(setRowPerPage(event.target.value));
                                    }}
                                />
                        }
                    </>
                    : <>
                        {
                            isMobile ?
                                <ExpendableCardList
                                    listData={state.listData}
                                    tableColumns={trackRequestPlacementDateTimeTableColumn(onClickLaneCode, id ? trackRequestTab.indexOf(id) : 0, onClickApprovePlacement, onClickRejectPlacement)}
                                    isNextPage={state.pagination && state.pagination.next}
                                    onReachEnd={() => {
                                        dispatch(setCurrentPage(state.pagination.next));
                                    }}
                                    childTableColumns={placementDateTimeChildrenTableColumn()}
                                    childElementKey={'freightShipment'} />
                                :
                                <TableCollapseList
                                    tableColumns={trackRequestPlacementDateTimeTableColumn(onClickLaneCode, id ? trackRequestTab.indexOf(id) : 0, onClickApprovePlacement, onClickRejectPlacement)}
                                    currentPage={state.currentPage}
                                    rowsPerPage={state.pageSize}
                                    rowsPerPageOptions={rowsPerPageOptions}
                                    totalCount={state.pagination && state.pagination.count}
                                    listData={state.listData}
                                    onChangePage={(event: any, page: number) => {
                                        dispatch(setCurrentPage(page));
                                    }}
                                    onChangeRowsPerPage={(event: any) => {
                                        dispatch(setRowPerPage(event.target.value));
                                    }}
                                    childrenColumns={placementDateTimeChildrenTableColumn()}
                                    childElementKey={'freightShipment'}
                                />
                        }
                    </>}
            </PageContainer>
        );
    }

    function onClickLaneCode(element: any) {
        dispatch(togglePointsModal());
        dispatch(setSelectedElement(element))
    }

    function onClickApprove(element: any) {
        setTrackRequestAcceptWarningModal(true);
        setAcceptWarningDetails(element)
    }

    function onClickReject(element: any) {
        setTrackRequestRejectWarningModal(true);
        dispatch(setSelectedElement(element));
    }

    function onClickApprovePlacement(element: any) {
        setPlacementDateTimeApproveModalOpen(true)
        dispatch(setSelectedElement(element))
    }

    function onClickRejectPlacement(element: any) {
        setPlacementDateTimeCancelModalOpen(true)
        dispatch(setSelectedElement(element))
    }

}

export default TrackRequestListing;