import MomentUtils from "@date-io/moment";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { FileCopyOutlined, KeyboardBackspace, Tune } from "@material-ui/icons";
import React, { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  billPeriodTableColumns,
  rowsPerPageOptions
} from "../../../base/constant/ArrayList";
import {
  billingPeriodLabel, freightLabel,
  fuelSurchargeLabel,
  gstAmountLabel,
  notBillablePeriodicMessage,
  orderVolumeLabel,
  orderWeightLabel,
  pendingPodLabel,
  periodNotOverMessage,
  totalKmLabel,
  totalLabel,
  totalPayable,
  totalTripsLabel,
  transporterLabel
} from "../../../base/constant/MessageUtils";
import { FreightReconciliationUrl } from "../../../base/constant/RoutePath";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { isDateGreater } from "../../../base/utility/DateUtils";
import { getAdvanceFilterChips } from "../../../base/utility/Routerutils";
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Chips from "../../../component/chips/Chips";
import Filter from "../../../component/filter/Filter";
import Information from "../../../component/information/Information";
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from "../../../component/widgets/button/Button";
import { CustomTooltipTable } from "../../../component/widgets/CustomToolTipTable";
import ListingSkeleton from "../../../component/widgets/listingSkeleton/ListingSkeleton";
import TableCollapseList from "../../../component/widgets/tableView/tableCollapseList/TableCollapseList";
import { InfoTooltip } from "../../../component/widgets/tooltip/InfoTooltip";
import { freightReconcilationPeriodicFilters } from "../../../moduleUtility/FilterUtils";
import { showAlert } from "../../../redux/actions/AppActions";
import {
  refreshList,
  setCurrentPage,
  setDefaultExpandRowIndex,
  setOrderDetails,
  setResponse,
  setRowPerPage,
  setSelectedElement,
  toggleFilter,
  togglePointsModal
} from "../../../redux/actions/FreightReconciliationAction";
import FreightReconciliationReducer, {
  FREIGHT_RECONCILIATION_STATE
} from "../../../redux/reducers/FreightReconciliationReducer";
import {
  createPeriodicBill,
  getFreightOrderPeriodicInvoiceList,
  getFreightReconcilationOrderDetails
} from "../../../serviceActions/OrderServiceActions";
import { freightReconcilationPeriodicTableColumns } from "../../../templates/InvoiceTemplates";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import InvoiceCardDetails from "../invoiceInfo/InvoiceCardDetails";
import FreightReconcilationContractModal from "./FreightReconcilationContractModal";
import FreightReconciliationPeriodicFilters from "./FreightReconcilationPeriodicFilters";

function FreightReconcilationPeriodicInvoice() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const { id } = useParams<any>();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] =
    useSearchParams(freightReconcilationPeriodicFilters);
  const [state = FREIGHT_RECONCILIATION_STATE, dispatch] = useReducer(
    FreightReconciliationReducer,
    FREIGHT_RECONCILIATION_STATE
  );
  const [loading, setLoading] = React.useState<any>(false);
  const [rowData, setRowData] = React.useState<any>({});
  const [isShowGenerateBill, setIsShowGenerateBill] =
    React.useState<any>(false);
  const [showContractDetails, setShowContractDetails] =
    React.useState<any>(false);
  const [freightContractDetails, setFreightContractDetails] =
    React.useState<any>({});
  const [generateBillMessage, setGenerateBillMessage] =
    React.useState<any>({});


  useEffect(() => {
    const getList = async () => {
      setLoading(true);
      appDispatch(getFreightReconcilationOrderDetails({ id: id })).then(
        (response: any) => {
          dispatch(setOrderDetails(response));
          let endDateExpired = false;
          if (response && response.freightReconciliation) {
            if (response.freightReconciliation.endDate) {
              let endDateTimeStamp = new MomentUtils().date(response.freightReconciliation.endDate)
              let currentDateTimeStamp = new MomentUtils().date(new Date())
              if (isDateGreater(currentDateTimeStamp, endDateTimeStamp,)) {
                endDateExpired = true;
              }
            }
            if (endDateExpired) {
              if (response?.freightReconciliation?.isBillable) {
                setIsShowGenerateBill(false);
              } else {
                setIsShowGenerateBill(true);
                setGenerateBillMessage(notBillablePeriodicMessage)
              }
            } else {
              setIsShowGenerateBill(true)
              setGenerateBillMessage(periodNotOverMessage)
            }
          } else {
            setIsShowGenerateBill(true);
          }
          setLoading(false);
        }
      );
      let queryParams: any = {
        page: state.currentPage,
        pageSize: state.pageSize,
        id: id,
      };
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      if (queryParams && queryParams.queryFieldLabel) {
        delete queryParams["queryFieldLabel"];
      }
      setLoading(true);
      appDispatch(getFreightOrderPeriodicInvoiceList(queryParams)).then(
        (response: any) => {
          dispatch(setResponse(response));
          setLoading(false);
        }
      );
    };
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.refresh_list,
    state.refreshPeriodicList,
    state.currentPage,
    state.pageSize,
    history.location.search,
  ]);

  useEffect(() => {
    if (state.defaultExpandRowIndex >= 0 && state.listData) {
      setRowData(state.listData[state.defaultExpandRowIndex - 1]);
    }
    // eslint-disable-next-line
  }, [state.listData]);

  return (
    <div>
      <FreightReconciliationPeriodicFilters
        open={state.openFilter}
        onClose={() => {
          dispatch(toggleFilter());
        }}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          addFiltersQueryParams(filterChips, filterParams);
          dispatch(toggleFilter());
          dispatch(refreshList());
        }}
        filerChips={filterState.chips}
        filerParams={filterState.params}
      />

      <FreightReconcilationContractModal
        open={showContractDetails}
        onClose={() => {
          setShowContractDetails(false);
        }}
        selectedElement={freightContractDetails}
      />

      <LanePointsDisplayModal
        open={state.openPointModal}
        laneCode={state.selectedItem && state.selectedItem.laneCode}
        onClose={() => {
          dispatch(setSelectedElement(null));
          dispatch(togglePointsModal());
        }}
      />

      <Filter
        pageTitle="Freight Reconciliation"
      >
        <>
          {!isShowGenerateBill ? (
            <Button
              buttonStyle="btn-blue"
              title={isMobile ? " " : "Generate Bill"}
              leftIcon={<FileCopyOutlined />}
              loading={loading}
              onClick={async () => {
                setLoading(true);
                const billResponse = await appDispatch(
                  createPeriodicBill({ reconciliationId: +id })
                );
                if (billResponse?.code === 200) {
                  appDispatch(showAlert(billResponse.message));
                  history.push(FreightReconciliationUrl);
                }
                setLoading(false);
              }}
            />
          ) : (
            <InfoTooltip
              title={generateBillMessage}
              customIcon={
                <Button
                  buttonStyle="btn-blue disabled mob-btn-blue"
                  title={isMobile ? " " : "Generate Bill"}
                  leftIcon={<FileCopyOutlined />}
                />
              }
            />
          )}
        </>
        <Button
          buttonStyle={"btn-orange"}
          title={isMobile ? " " : "Filter"}
          leftIcon={<Tune />}
          onClick={() => {
            dispatch(toggleFilter());
          }}
        />
        <Button
          buttonStyle={"btn-detail btn-detail-mob"}
          title={isMobile ? " " : "Back"}
          leftIcon={<KeyboardBackspace />}
          onClick={() => {
            history.goBack();
          }}
        />
      </Filter>

      <PageContainer>
        {!isObjectEmpty(getAdvanceFilterChips(filterState.chips)) &&
          Object.keys(getAdvanceFilterChips(filterState.chips)).map(
            (element: any, index: any) => (
              <Chips
                key={index}
                label={filterState.chips[element]}
                onDelete={() => {
                  dispatch(refreshList());
                  if (
                    element === "freightOrderDeliveredAtFromTime" ||
                    element === "freightOrderDeliveredAtToTime" ||
                    element === "query"
                  ) {
                    let secondKey =
                      element === "freightOrderDeliveredAtFromTime"
                        ? "freightOrderDeliveredAtToTime"
                        : "freightOrderDeliveredAtFromTime";
                    let extraMobileKey =
                      element === "query"
                        ? ["queryField", "queryFieldLabel"]
                        : [];
                    removeFiltersQueryParams([
                      element,
                      secondKey,
                      ...extraMobileKey,
                    ]);
                  } else {
                    removeFiltersQueryParams([element]);
                  }
                }}
              />
            )
          )}

        {loading ? (
          <ListingSkeleton />
        ) : (
          <>
            <Card className="creat-contract-wrapp creat-wrapp card-detail-wrap">
              <CardHeader
                className="creat-contract-header"
                title={"Freight Details"}
              />
              <CardContent className="creat-contract-content">
                <div className="custom-form-row row">
                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={transporterLabel}
                      text={state?.orderDetails?.partnerName}
                    />
                  </div>
                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={freightLabel}
                      text={state?.orderDetails?.freightType}
                    />
                  </div>
                  <div className="col-md-3 billing-group col-6 freight-icon">
                    <Information
                      title={billingPeriodLabel}
                      text={state?.orderDetails?.billType}
                      customView={
                        <div className="d-flex ">
                          <>
                            <span>{state?.orderDetails?.billType}</span>
                            <CustomTooltipTable
                              tableColumn={billPeriodTableColumns}
                              tableData={[
                                {
                                  startDate: state?.orderDetails?.startDate,
                                  endDate: state?.orderDetails?.endDate,
                                },
                              ]}
                            />
                          </>
                        </div>
                      }
                    />
                  </div>
                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={totalTripsLabel}
                      text={state?.orderDetails?.totalTrips}
                    />
                  </div>

                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={orderVolumeLabel}
                      text={state?.orderDetails?.totalVolume || "NA"}
                    />
                  </div>
                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={orderWeightLabel}
                      text={state?.orderDetails?.totalWeight || "NA"}
                    />
                  </div>
                  <div className="labelWidth col-md-3 billing-group col-6">
                    <Information
                      title={totalKmLabel}
                      text={state?.orderDetails?.totalDistance || "NA"}
                    />
                  </div>
                  <div className="labelWidth col-md-3 billing-group col-6">
                    <Information
                      title={pendingPodLabel}
                      text={state?.orderDetails?.pendingPods || "0"}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="creat-contract-wrapp creat-wrapp card-detail-wrap">
              <CardHeader
                className="creat-contract-header"
                title={"Total Bill Details"}
              />
              <CardContent className="creat-contract-content">
                <div className="custom-form-row row">
                  <div className="col-md-2 billing-group col-6">
                    <Information
                      title={totalLabel}
                      text={"₹ " + (state?.aggregateDetails?.totalBill || "0")}
                    />
                  </div>
                  <div className="col-md-2 billing-group col-6">
                    <Information
                      title={gstAmountLabel}
                      text={
                        "₹ " +
                        (state?.aggregateDetails?.totalGstAmount || "0")
                      }
                    />
                  </div>
                  <div className="col-md-2 billing-group col-6">
                    <Information
                      title={fuelSurchargeLabel}
                      text={
                        "₹ " +
                        (state?.aggregateDetails?.totalFuelSurcharge || "0")
                      }
                    />
                  </div>
                  <div className="col-md-2 billing-group col-6">
                    <Information
                      title={"Debit Charge"}
                      text={"₹ " +
                        (state?.aggregateDetails?.debitCharge || "0")}
                      tooltip={() => (< CustomTooltipTable
                        tableColumn={[{ description: "Freight Order", name: "freightOrder" }, { description: "Lane", name: "lane" }, { description: "Amounts", name: "amount" }, { description: "Remarks", name: "remark" }]}
                        tableData={state?.aggregateDetails?.debitChargeBreakup}
                      />)}
                    />
                  </div>
                  <div className="col-md-2 billing-group col-6 deduction-icon-blue">
                    <Information
                      title={"Deductions"}
                      text={"- ₹ " +
                        (state?.aggregateDetails?.totalDeductions || "0")}
                      valueClassName="red-text"
                      tooltip={() => (<InfoTooltip
                        title={"Debit Charges included"}
                        placement={"top"}
                      />)}
                    />
                  </div>
                  <div className="col-md-2 billing-group col-6">
                    <Information
                      title={totalPayable}
                      text={
                        "₹ " + (state?.aggregateDetails?.totalPayable || "0")
                      }
                    />
                  </div>
                  <div className="col-md-2 billing-group col-6">
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {loading ? (
          <ListingSkeleton />
        ) : (
          <TableCollapseList
            tableColumns={freightReconcilationPeriodicTableColumns(
              onClickOrderCode,
              onClickLaneCode,
              onClickUpdateButton,
              state.defaultExpandRowIndex
            )}
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
            collapseCustomView={true}
            onClickIconButton={onClickUpdateButton}
            expandRowIndex={state.defaultExpandRowIndex}
          >
            <InvoiceCardDetails
              defaultExpandRowIndex={state.defaultExpandRowIndex}
              rowData={rowData}
              stateDispatcher={dispatch}
            />
          </TableCollapseList>
        )}
      </PageContainer>
    </div>
  );

  function onClickOrderCode(element: any) {
    setShowContractDetails(true);
    setFreightContractDetails(element);
  }

  function onClickUpdateButton(element: any) {
    dispatch(setDefaultExpandRowIndex(element.rowIndex));
    setRowData(element);
  }

  function onClickLaneCode(element: any) {
    dispatch(setSelectedElement(element));
    dispatch(togglePointsModal());
  }
}
export default FreightReconcilationPeriodicInvoice;
