import {
  Card,
  CardContent,
  CardHeader,
  TextareaAutosize
} from "@material-ui/core";
import { KeyboardBackspace, Tune } from "@material-ui/icons";
import React, { useEffect, useReducer, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  billPeriodTableColumns,
  InvoiceStatusEnum,
  invoiceTab,
  permissionCode,
  rowsPerPageOptions
} from "../../../base/constant/ArrayList";
import {
  approveBillLabel, fuelSurchargeLabel,
  gstAmountLabel,
  totalLabel,
  totalPayable
} from "../../../base/constant/MessageUtils";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import {
  convertDateFormat,
  displayDateTimeFormatter
} from "../../../base/utility/DateUtils";
import { getAdvanceFilterChips } from "../../../base/utility/Routerutils";
import { isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import PaymentAlertBox from "../../../component/alert/PaymentAlertBox";
import Chips from "../../../component/chips/Chips";
import DataNotFound from "../../../component/error/DataNotFound";
import Filter from "../../../component/filter/Filter";
import Information from "../../../component/information/Information";
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from "../../../component/widgets/button/Button";
import CardList from "../../../component/widgets/cardlist/CardList";
import { CustomTooltipTable } from "../../../component/widgets/CustomToolTipTable";
import ListingSkeleton from "../../../component/widgets/listingSkeleton/ListingSkeleton";
import TableCollapseList from "../../../component/widgets/tableView/tableCollapseList/TableCollapseList";
import { InfoTooltip } from "../../../component/widgets/tooltip/InfoTooltip";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { freightBillingPeriodicInvoiceFilters } from "../../../moduleUtility/FilterUtils";
import { showAlert } from "../../../redux/actions/AppActions";
import {
  refreshList,
  setCurrentPage,
  setDefaultExpandRowIndex,
  setResponse,
  setRowPerPage,
  setSelectedElement,
  toggleFilter,
  togglePointsModal
} from "../../../redux/actions/InvoiceActions";
import InvoiceReducer, {
  INVOICE_STATE
} from "../../../redux/reducers/InvoiceReducer";
import {
  commentsTransactions,
  getApprover,
  getDisputeReasons,
  getFreightBillingPeriodicInvoiceList,
  getFreightOrderDetails,
  getUsersList,
  payBill
} from "../../../serviceActions/BillGenerateServiceActions";
import { freightBillingPeriodicTableColumns } from "../../../templates/InvoiceTemplates";
import ContractDetailModal from "../../indentManagement/indent/ContractDetailModal";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import FreightReconcilationContractModal from "../freightReconciliation/FreightReconcilationContractModal";
import AddApproveModal from "./AddApproveModal";
import ApproveInvoiceModal from "./ApproveInvoiceModal";
import BillingCardDetails from "./BillingCardDetails";
import CancelInvoiceModal from "./CancelInvoiceModal";
import DisputeInvoiceModal from "./DisputeInvoiceModal";
import EditApproveModal from "./EditApproveModal";
import FreightBillingPeriodicFilter from "./FreightBillingPeriodicFilter";
import "./FreightBillingPeriodicInvoice.css";
import InvoiceViewButtons from "./InvoiceViewButtons";

function FreightBillingPeriodicInvoice() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const location = useLocation<any>();
  const userInfo = useSelector(
    (state: any) => state.appReducer.userInfo,
    shallowEqual
  );
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<any>();
  const [orderDetails, setOrderDetails] = React.useState<any>({});
  const { id } = useParams<any>();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] =
    useSearchParams(freightBillingPeriodicInvoiceFilters);
  const [state = INVOICE_STATE, dispatch] = useReducer(
    InvoiceReducer,
    INVOICE_STATE
  );
  const [openDisputeModal, setOpenDisputeModal] = useState<boolean>(false);
  const [openApproveModal, setOpenApprovelModal] = useState<boolean>(false);
  const [isOwnerClient, setIsOwnerClient] = React.useState<any>(false);
  const [rowData, setRowData] = React.useState<any>({});
  const [showContractDetails, setShowContractDetails] =
    React.useState<any>(false);
  const [freightContractDetails, setFreightContractDetails] =
    React.useState<any>({});
  const [disputeDetails, setDisputeDetails] = React.useState<any>({});
  const [disputeReasons, setDisputeReasons] = React.useState<any>({});
  const [approversList, setApproversList] = React.useState<any>([]);
  const [userApprovedCount, setUserApprovedCount] = React.useState<any>(0);
  const [openCancelModal, setOpenCancelModal] = React.useState<boolean>(false);
  const [commentsList, setCommentsList] = React.useState<any>(undefined);
  const [approveDisable, setApproveDisable] = React.useState<boolean>(false);
  const [openAddApproveModal, setOpenAddApproveModal] =
    React.useState<boolean>(false);
  const [openWarningModal, setOpenWarningModal] = React.useState<any>({
    open: false,
    message: "",
  });
  const [showAddReasonButton, setShowAddReasonButton] =
    React.useState<boolean>(false);
  const [showSubmitButton, setShowSubmitButton] =
    React.useState<boolean>(false);
  const [openContractDetailModal, setOpenContractDetailModal] =
    React.useState<boolean>(false);
  const [usersList, setUsersList] = React.useState<any>([]);
  const [openEditApproveModal, setOpenEditApproveModal] = React.useState<boolean>(false);
  //const [remarks, setRemarks] = React.useState("");

  useEffect(() => {
    const getDetails = () => {
      const freightOrderParams: any = {
        billNo: id,
      };
      setLoading(true);
      const promiseArray = [
        appDispatch(getFreightOrderDetails(freightOrderParams)),
      ];
      Promise.all(promiseArray)
        .then((response) => {
          if (response && response[0]) {
            if (
              response[0].owner === "CLIENT" &&
              (invoiceTab[location?.state?.selectedTabIndex] ===
                InvoiceStatusEnum.PENDING ||
                invoiceTab[location?.state?.selectedTabIndex] ===
                InvoiceStatusEnum.DISPUTED)
            ) {
              setIsOwnerClient(true);
            }
            let billDetails = response[0];
            setOrderDetails(response[0]);
            if (
              response[0] && (response[0]?.billStatus === InvoiceStatusEnum.CANCELLED || response[0]?.billStatus === InvoiceStatusEnum.APPROVED || response[0]?.billStatus === InvoiceStatusEnum.PAID)
            ) {
              appDispatch(commentsTransactions({ billNo: id })).then((commentResponse: any) => {
                if (commentResponse) {
                  setCommentsList(commentResponse);
                } else {
                  setCommentsList([]);
                }
              });
            }
            let periodicListParams: any = {
              billNo: response[0].billNo,
              page: state.currentPage,
              size: state.pageSize,
            };
            if (!isObjectEmpty(filterState.params)) {
              periodicListParams = Object.assign(periodicListParams, filterState.params);
            }
            appDispatch(
              getUsersList({
                node: response[0].node,
                permissionCode: permissionCode.Approved,
              })
            ).then((usersListResp: any) => {
              usersListResp &&
                setUsersList(
                  setAutoCompleteListWithData(usersListResp, "name", "userId")
                );
            });
            appDispatch(
              getFreightBillingPeriodicInvoiceList(periodicListParams)
            ).then((response: any) => {
              if (response) {
                const tempListArray = response.FreightOrderBillsDetails?.filter(
                  (element: any) => element.isDisputed
                );
                if (billDetails.clientAcceptanceRequired === "TRUE") {
                  setShowAddReasonButton(true);
                }
                if (billDetails.clientAcceptanceRequired === "TRUE" && tempListArray?.length > 0 && billDetails.isDisputable) {
                  setShowSubmitButton(true);
                  //setShowAddReasonButton(true);
                } else {
                  //on page refresh
                  setShowSubmitButton(false);
                }
                dispatch(
                  setResponse(
                    response,
                    invoiceTab[location?.state?.selectedTabIndex]
                  )
                );
                setLoading(false);
              } else {
                setLoading(false);
              }

            });
          } else {
            setLoading(false);
          }

        })
    };
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.refresh_list,
    state.refreshPeriodicList,
    state.currentPage,
    state.pageSize,
    history.location.search,
  ]);

  useEffect(() => {
    if (
      orderDetails.billStatus === InvoiceStatusEnum.PENDING &&
      orderDetails.owner === "PARTNER"
    ) {
      appDispatch(getDisputeReasons()).then((response: any) => {
        if (response) {
          let mapReasons: any = [];
          mapReasons =
            response.reason &&
            response.reason.map((item: any) => {
              return {
                value: item,
                label: item,
              };
            });
          // setReasonsList(mapReasons)
          setDisputeReasons(mapReasons);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetails]);

  useEffect(() => {
    async function fetchApprover() {
      const approverListResp = await appDispatch(getApprover({ billNo: id }));
      if (approverListResp && approverListResp.length) {
        setApproversList(approverListResp);
        let hasApproved = false;
        let approvedCount = 0;
        approverListResp.forEach((item: any) => {
          if (item.approveMarked) {
            if (item.userId === userInfo.userId) {
              hasApproved = true;
            }
            approvedCount++;
          }
        });
        setUserApprovedCount(approvedCount);
        setApproveDisable(hasApproved);
      }
    }
    userInfo &&
      id &&
      fetchApprover();
    // eslint-disable-next-line
  }, [appDispatch, id, userInfo, refresh, orderDetails]);

  useEffect(() => {
    if (state.defaultExpandRowIndex >= 0 && state.listData) {
      setRowData(state.listData[state.defaultExpandRowIndex - 1]);
    }
    // eslint-disable-next-line
  }, [state.listData]);

  // const handleRemarksTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setRemarks(e?.target.value)
  // }
  return (
    <div>
      <FreightBillingPeriodicFilter
        open={state.openFilter}
        onClose={() => {
          dispatch(toggleFilter());
        }}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          addFiltersQueryParams(filterChips, filterParams);
          dispatch(refreshList());
          dispatch(toggleFilter());
        }}
      />

      <PaymentAlertBox
        open={openWarningModal.open}
        onSuccess={() => {
          if (openWarningModal && openWarningModal.goBack) {
            history.goBack();
            return;
          }
          setOpenWarningModal({ open: false, message: "" });
          setRefresh((prev) => !prev);
        }}
        onClose={() => {
          if (openWarningModal && openWarningModal.goBack) {
            history.goBack();
            return;
          }
          setOpenWarningModal({ open: false, message: "" });
          setRefresh((prev) => !prev);
        }}
        message={openWarningModal.message}
      />

      <AddApproveModal
        open={openAddApproveModal}
        usersList={usersList}
        billNo={id}
        billStatus={orderDetails.billStatus}
        onSuccess={() => {
          setOpenAddApproveModal(false);
        }}
        onClose={() => {
          setOpenAddApproveModal(false);
        }}
        noOFApprovers={orderDetails.requiredApproverCount}
      />

      <EditApproveModal
        open={openEditApproveModal}
        usersList={usersList}
        onSuccess={(message: any) => {
          setOpenEditApproveModal(false);
          message && setOpenWarningModal({ open: true, message: message })
        }}
        billNo={id}
        approversList={approversList}
        onClose={() => {
          setOpenEditApproveModal(false)
        }}
        noOFApprovers={orderDetails?.requiredApproverCount}
      />

      <CancelInvoiceModal
        open={openCancelModal}
        selectedElement={id}
        onSuccess={() => {
          setOpenCancelModal(false);
          history.goBack();
        }}
        isPeriodicBilling
        onClose={() => {
          setOpenCancelModal(false);
        }}
      />

      {openContractDetailModal &&
      <ContractDetailModal
        open={openContractDetailModal}
        selectedElement={{
          contractCode: orderDetails.contractCode,
          partnerCode: orderDetails.partnerCode,
        }}
        laneCode={orderDetails && orderDetails.laneCode}
        freightType={orderDetails.freightTypeCode}
        onSuccess={() => {
          setOpenContractDetailModal(false);
        }}
        onClose={() => {
          setOpenContractDetailModal(false);
        }}
      />}

      <FreightReconcilationContractModal
        open={showContractDetails}
        onClose={() => {
          setShowContractDetails(false);
        }}
        billNo={id}
        selectedElement={freightContractDetails}
        isPeriodicBilling
      />

      <DisputeInvoiceModal
        open={openDisputeModal}
        onClose={() => {
          setOpenDisputeModal(false);
        }}
        onSuccess={() => {
          dispatch(refreshList());
        }}
        reasonsList={disputeReasons}
        disputeDetails={disputeDetails}
        billNo={id}
        stateDispatcher={dispatch}
        isPeriodic
      />

      <ApproveInvoiceModal
        open={openApproveModal}
        onClose={() => {
          setOpenApprovelModal(
            (openApproveModal: boolean) => !openApproveModal
          );
        }}
        onSuccess={(response: any) => {
          if (response) {
            setOpenApprovelModal(
              (openApproveModal: boolean) => !openApproveModal
            );
            if (
              orderDetails.billStatus === InvoiceStatusEnum["AWAITING APPROVAL"]
            ) {
              let markedCount = 0;
              approversList.forEach((item: any) => {
                if (item.approveMarked) {
                  markedCount++;
                }
              });
              if (markedCount < approversList.length - 1) {
                setOpenWarningModal({
                  open: true,
                  message: response.message,
                  goBack: true,
                });
                return;
              }
            }
            response.message && appDispatch(showAlert(response.message));
            history.goBack();
          }
        }}
        selectedElement={id}
        approveInvoiceWarning={approveBillLabel}
      />

      <LanePointsDisplayModal
        open={state.openPointModal}
        laneCode={state.selectedItem && state.selectedItem.laneCode}
        onClose={() => {
          dispatch(setSelectedElement(null));
          dispatch(togglePointsModal());
        }}
      />

      <div className="filter-wrap">
        <Filter
          pageTitle={
            orderDetails?.billStatus ? orderDetails?.billStatus + " BILL" : ""
          }
          buttonStyle="btn-orange"
          buttonTitle={isMobile ? " " : "Filter"}
          leftIcon={<Tune />}
          onClick={() => {
            dispatch(toggleFilter());
          }}
        >
          <Button
            buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
            title={isMobile ? "" : "Back"}
            leftIcon={<KeyboardBackspace />}
            onClick={() => {
              history.goBack();
            }}
          />
        </Filter>
      </div>
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
                    element === "freightOrderCreatedAtFromTime" ||
                    element === "freightOrderCreatedAtToTime" ||
                    element === "query"
                  ) {
                    let secondKey =
                      element === "freightOrderCreatedAtFromTime"
                        ? "freightOrderCreatedAtToTime"
                        : "freightOrderCreatedAtFromTime";
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

        {loading || isNullValue(orderDetails) ? (
          <ListingSkeleton />
        ) : (
          <>
            <div>
              <Card className="creat-contract-wrapp card-detail-wrap">
                <CardHeader
                  className="creat-contract-header"
                  title="Bill Information"
                />
                <CardContent className="creat-contract-content">
                  <div className="custom-form-row row">
                    <div className="col-md-3 billing-group col-6">
                      <Information
                        title={"Bill Number"}
                        text={orderDetails.billNo}
                      />
                    </div>
                    <div className="col-md-3 billing-group col-6">
                      <Information
                        title={"Status"}
                        text={orderDetails.billStatus}
                        valueClassName="orange-text"
                      />
                    </div>
                    {orderDetails?.billStatus === "PENDING" && (
                      <div className="col-md-3 billing-group col-6">
                        <Information
                          title={"Created By"}
                          text={orderDetails.billCreatedByName}
                        />
                      </div>
                    )}
                    <div className="col-md-3 billing-group col-6 freight-icon">
                      <Information
                        title={"Billing Period"}
                        text={orderDetails.BillTypeDetails?.billType}
                        customView={
                          <div className="d-flex ">
                            <>
                              <span>
                                {orderDetails.BillTypeDetails?.billType}
                              </span>
                              <CustomTooltipTable
                                tableColumn={billPeriodTableColumns}
                                tableData={[
                                  {
                                    startDate:
                                      orderDetails.BillTypeDetails?.startDate,
                                    endDate:
                                      orderDetails.BillTypeDetails?.endDate,
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
                        title={"Bill Raised By"}
                        text={
                          orderDetails.owner === "CLIENT"
                            ? orderDetails.clientName
                            : orderDetails.partnerName
                        }
                      />
                    </div>
                    {orderDetails?.billStatus === "ACCEPTED" && (
                      <>
                        <div className="col-md-3 billing-group col-6">
                          <Information
                            title={"Accepted By"}
                            text={orderDetails.billAcceptedByName}
                          />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                          <Information
                            title={"Accepted Date"}
                            text={
                              orderDetails.billAcceptedDate &&
                              convertDateFormat(
                                orderDetails.billAcceptedDate,
                                displayDateTimeFormatter
                              )
                            }
                          />
                        </div>
                      </>
                    )}
                    {orderDetails.billStatus === "DISPUTED" && (
                      <>
                        <div className="col-md-3 billing-group col-6">
                          <Information
                            title={"Dispute Raised By"}
                            text={orderDetails.billDisputedByName}
                          />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                          <Information
                            title={"Dispute Raised At"}
                            text={
                              orderDetails.billDisputedDate &&
                              convertDateFormat(
                                orderDetails.billDisputedDate,
                                displayDateTimeFormatter
                              )
                            }
                          />
                        </div>
                      </>
                    )}
                    {(orderDetails.billStatus ===
                      InvoiceStatusEnum["AWAITING APPROVAL"] ||
                      orderDetails.billStatus ===
                      InvoiceStatusEnum.APPROVED) && (
                        <>
                          {approversList.length ? (
                            <div className="col-md-3 billing-group col-6">
                              <Information
                                title="Approvers"
                                image={
                                  <img
                                    src={
                                      userApprovedCount === approversList.length
                                        ? "/images/approve-icon.png"
                                        : "/images/pending-icon.png"
                                    }
                                    alt="billStatus"
                                  />
                                }
                                customView={
                                  <CustomTooltipTable
                                    customIcon={
                                      <span className="blue-text approve-text">
                                        {userApprovedCount ===
                                          approversList.length
                                          ? "Approved"
                                          : "Waiting for approval"}
                                      </span>
                                    }
                                    wrap={true}
                                    arrow={true}
                                    tableColumn={[
                                      {
                                        description:
                                          userApprovedCount ===
                                            approversList.length
                                            ? "Approved"
                                            : `${approversList.length -
                                            userApprovedCount
                                            } Approvals needed`,
                                        name: "taggedLocationName",
                                        customView: (value: any) => (
                                          <ul>
                                            <li className="row align-items-center approve-user">
                                              <div className="col-8">
                                                <div className="media">
                                                  <img
                                                    className="mr-2"
                                                    src="/images/user-icon.svg"
                                                    alt="user icon"
                                                  />
                                                  <div className="mddia-body approve-user-content">
                                                    <strong>
                                                      {value.userName}
                                                    </strong>
                                                    <span>{value.userEmail}</span>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-4 user-status-type">
                                                {value.approveMarked ? (
                                                  <>
                                                    <img
                                                      className="mr-2"
                                                      src="/images/approve.png"
                                                      alt="Approved"
                                                    />
                                                    <span className="green-text">
                                                      Approved
                                                    </span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <img
                                                      className="mr-2"
                                                      src="/images/pending.png"
                                                      alt="Pending"
                                                    />
                                                    <span className="orange-text">
                                                      Pending
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                            </li>
                                          </ul>
                                        ),
                                      },
                                    ]}
                                    tableData={approversList}
                                    showStringValue={true}
                                    style={{
                                      tooltip: {
                                        minWidth: isMobile ? 320 : 320,
                                        maxWidth: isMobile ? 320 : 400,
                                        marginTop: 8,
                                        overflow: "visible",
                                      },
                                    }}
                                  />
                                }
                              />
                            </div>
                          ) : null}
                        </>
                      )}
                    {orderDetails.billStatus === "CANCELLED" && (
                      <>
                        <div className="col-md-3 billing-group col-6">
                          <Information
                            title={"Cancelled By"}
                            text={orderDetails.billCancelledByName}
                          />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                          <Information
                            title={"Cancelled Date"}
                            text={
                              orderDetails.billCancelledDate &&
                              convertDateFormat(
                                orderDetails.billCancelledDate,
                                displayDateTimeFormatter
                              )
                            }
                          />
                        </div>
                      </>
                    )}
                    {orderDetails.billStatus === "PAID" && (
                      <>
                        <div className="col-md-3 billing-group col-6">
                          <Information
                            title={"Paid By"}
                            text={orderDetails.billPaidByName}
                          />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                          <Information
                            title={"Paid Date"}
                            text={
                              orderDetails.billPaidDate &&
                              convertDateFormat(
                                orderDetails.billPaidDate,
                                displayDateTimeFormatter
                              )
                            }
                          />
                        </div>
                      </>
                    )}
                    {commentsList && commentsList.length > 0 && (
                      <div className="col-md-3 billing-group col-6">
                        <Information
                          title="Comments"
                          image={
                            <img src="/images/comments-icon.png" alt="Status" />
                          }
                          customView={
                            <CustomTooltipTable
                              customIcon={
                                <span className="blue-text approve-text">
                                  View all Comments
                                </span>
                              }
                              wrap={true}
                              arrow={true}
                              tableColumn={[
                                {
                                  description: "Comments",
                                  customView: (value: any) => (
                                    <ul className="custom-list-tool">
                                      <li className="row align-items-center approve-user">
                                        <div className="col-8">
                                          <div className="media">
                                            <img
                                              className="mr-2"
                                              src="/images/user-icon.svg"
                                              alt="user icon"
                                            />
                                            <div className="mddia-body approve-user-content">
                                              <strong>
                                                {value.userName} (
                                                <span className="orange-text">
                                                  {value.action}
                                                </span>
                                                )
                                              </strong>
                                              <span>{value.userEmail}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-4 user-status-type">
                                          <span>
                                            {convertDateFormat(
                                              value.timestamp,
                                              displayDateTimeFormatter
                                            )}
                                          </span>
                                        </div>
                                        <div className="col-12 mt-2">
                                          <p className="pr-text mb-0">
                                            {value.remarks || "NA"}
                                          </p>
                                        </div>
                                      </li>
                                    </ul>
                                  ),
                                },
                              ]}
                              tableData={commentsList}
                              showStringValue={true}
                              style={{
                                tooltip: {
                                  minWidth: isMobile ? 320 : 320,
                                  maxWidth: isMobile ? 320 : 400,
                                  marginTop: 8,
                                  overflow: "visible",
                                },
                              }}
                            />
                          }
                        />
                      </div>
                    )}

                    <div className="col-md-3 billing-group col-6">
                      <Information
                        title={"Created Date"}
                        text={
                          orderDetails.billCreatedDate &&
                          convertDateFormat(
                            orderDetails.billCreatedDate,
                            displayDateTimeFormatter
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="total-bill-wrapp">
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
                        text={"₹ " + (orderDetails?.totalBillAmount || "0")}
                      />
                    </div>
                    <div className="col-md-2 billing-group col-6">
                      <Information
                        title={gstAmountLabel}
                        text={
                          "₹ " +
                          (orderDetails?.totalGstAmount || "0")
                        }
                      />
                    </div>
                    <div className="col-md-2 billing-group col-6">
                      <Information
                        title={fuelSurchargeLabel}
                        text={
                          "₹ " + (orderDetails?.totalBillFuelSurcharge || "0")
                        }
                      />
                    </div>
                    <div className="col-md-2 billing-group col-6">
                      <Information
                        title={"Debit Charge"}
                        text={"₹ " + (orderDetails?.debitCharge || "0")}
                        tooltip={() => (< CustomTooltipTable
                          tableColumn={[{ description: "Freight Order", name: "freightOrder" }, { description: "Lane", name: "lane" }, { description: "Amounts", name: "amount" }, { description: "Remarks", name: "remark" }]}
                          tableData={orderDetails?.debitChargeBreakup}
                        />)}
                      />
                    </div>
                    <div className="col-md-2 billing-group col-6 deduction-icon-blue">
                      <Information
                        title={"Deductions"}
                        text={"- ₹ " + (orderDetails?.totalBillDeduction || "0")}
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
                        text={"₹ " + (orderDetails?.totalBillPayable || "0")}
                      />
                    </div>
                    <div className="col-md-2 billing-group col-6" ></div>
                  </div>

                  <div className="custom-form-row row">
                    <div className="col-md-7 billing-group col-12">
                      <div className="billing-info-remark remark-row">
                        <div className="form-group">
                          {/* <label>Remark</label> */}
                          <TextareaAutosize
                            rowsMax={1}
                            rowsMin={1}
                            aria-label="maximum height"
                            placeholder="Remarks"
                            disabled={true}
                            value={""}
                            onChange={() => { }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5 billing-group col-12">
                      <div className="bill-btn-wrap d-flex">
                        <InvoiceViewButtons
                          transactionsResponse={orderDetails}
                          approverClickHandler={approverClickHandler}
                          onApproveClickHandler={onApproveClickHandler}
                          setCommentModal={setShowAddReasonButton}
                          setLoading={setLoading}
                          setOpenCancelModal={setOpenCancelModal}
                          billNo={id}
                          approveDisable={approveDisable}
                          showSubmitButton={showSubmitButton}
                          setOpenEditApproveModal={setOpenEditApproveModal}
                          isPeriodic
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
        {loading || isNullValue(state.listData) ? (
          <DataNotFound />
        ) : (
          <div className="">
            {isMobile ? (
              <CardList
                listData={state.listData}
                tableColumns={freightBillingPeriodicTableColumns(
                  onClickOrderCode,
                  onClickLaneCode,
                  isOwnerClient,
                  onClickUpdateButton,
                  onClickDisputeButton,
                  state.defaultExpandRowIndex,
                  showAddReasonButton,
                  orderDetails
                )}
                isNextPage={state.pagination && state.pagination.next}
                onReachEnd={() => {
                  dispatch(setCurrentPage(state.pagination.next));
                }}
              />
            ) : (
              <TableCollapseList
                tableColumns={freightBillingPeriodicTableColumns(
                  onClickOrderCode,
                  onClickLaneCode,
                  isOwnerClient,
                  onClickUpdateButton,
                  onClickDisputeButton,
                  state.defaultExpandRowIndex,
                  showAddReasonButton,
                  orderDetails
                )}
                currentPage={state.currentPage}
                rowsPerPage={state.pageSize}
                rowsPerPageOptions={rowsPerPageOptions}
                totalCount={state.pagination && state.pagination.count}
                listData={state.listData}
                onChangePage={(event: any, page: number) => {
                  dispatch(setCurrentPage(page));
                }}
                childElementKey={"shipmentTransactionData"}
                onChangeRowsPerPage={(event: any) => {
                  dispatch(setRowPerPage(event.target.value));
                }}
                onClickIconButton={onClickUpdateButton}
                collapseCustomView={true}
                expandRowIndex={state.defaultExpandRowIndex}
              >
                {(childFreightOrderBillsDetails: any) => (
                  <BillingCardDetails
                    childFreightOrderBillsDetails={
                      childFreightOrderBillsDetails
                    }
                    stateDispatcher={dispatch}
                    isOwnerClient={isOwnerClient}
                    setDisputeReasons={setDisputeReasons}
                    rowData={rowData}
                    billDetails={orderDetails}
                    billNo={orderDetails.billNo}
                  />
                )}
              </TableCollapseList>
            )}
          </div>
        )}
      </PageContainer>
    </div>
  );

  function onClickDisputeButton(element: any) {
    setOpenDisputeModal(true);
    setDisputeDetails(element);
  }

  function onClickOrderCode(element: any) {
    setShowContractDetails(true);
    setFreightContractDetails(element);
  }

  function onClickLaneCode(element: any) {
    dispatch(setSelectedElement(element));
    dispatch(togglePointsModal());
  }

  function onClickUpdateButton(element: any) {
    dispatch(setDefaultExpandRowIndex(element.rowIndex));
    setRowData(element);
  }

  function onApproveClickHandler() {
    let invoiceParams: any = {
      billNo: id
    }
    if (orderDetails.billStatus === InvoiceStatusEnum.PENDING
      || orderDetails.billStatus === InvoiceStatusEnum.ACCEPTED
      || orderDetails.billStatus === InvoiceStatusEnum["AWAITING APPROVAL"]) {
      setOpenApprovelModal(true);
    } else {
      setLoading(true);
      appDispatch(payBill(invoiceParams)).then((response: any) => {
        response && response.message && appDispatch(showAlert(response.message));
        //response && history.push(InvoiceListUrl + InvoiceStatusEnum.PAID);
        response && history.goBack()
        setLoading(false);
      });
    }
  }

  async function approverClickHandler() {
    setOpenAddApproveModal(true);
  }
}

export default FreightBillingPeriodicInvoice;
