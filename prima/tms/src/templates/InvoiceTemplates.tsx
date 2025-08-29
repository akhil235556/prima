import { Checkbox } from "@material-ui/core";
import {
  AddCircle,
  Edit,
  FileCopyOutlined,
  Visibility
} from "@material-ui/icons";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Numeral from "numeral";
import React from "react";
import {
  billPeriodTableColumns,
  externalBillTooltipColumn,
  InvoiceStatusEnum
} from "../base/constant/ArrayList";
import {
  billPercentageLabel,
  notBillableMessage
} from "../base/constant/MessageUtils";
import {
  convertDateFormat,
  displayDateFormatter,
  displayDateTimeFormatter
} from "../base/utility/DateUtils";
import { isNullValueOrZero } from "../base/utility/StringUtils";
import { isMobile } from "../base/utility/ViewUtils";
import { LaneView } from "../component/CommonView";
import Information from "../component/information/Information";
import Button from "../component/widgets/button/Button";
import CheckboxWidget from "../component/widgets/checkbox/CheckboxWidget";
import { CustomTooltipTable } from "../component/widgets/CustomToolTipTable";
import { InfoTooltip } from "../component/widgets/tooltip/InfoTooltip";
import { ColumnStateModel } from "../Interfaces/AppInterfaces";

export const freightReconcilationPeriodicTableColumns = (
  onClickOrderCode: any,
  onClickLaneCode: Function,
  onClickUpdateButton: Function,
  defaultOpenIndex: any
) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightOrderCode",
      label: "Freight Order",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        return (
          <label
            className="lane-wrap lane-content lane-content-mobile"
            onClick={() => {
              onClickOrderCode(element);
            }}
          >
            {element.freightOrderCode}
          </label>
        );
      },
    },
    {
      id: "orderCreatedDatetime",
      label: "Order Date and Time",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    {
      id: "modeOfTransport",
      label: "Mode of Transport",
      format: (value: any) => value || "NA",
    },
    {
      id: "lane",
      label: "Lane/Zone",
      format: (value: any) => value || "NA",
      customView: (element: any) => ((element?.originZoneName && element.destinationZoneName) ? (element?.originZoneName + " -> " + element.destinationZoneName) : element?.laneName ?
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        /> : "NA"
      ),
    },
    {
      id: "orderStatus",
      label: "Status",
      format: (value: any) => value || "NA",
      class: () => "orange-text",
    },
    // {
    //   id: "deduction",
    //   label: "Deduction(₹)",
    //   format: (value: any) => "- ₹ " + (value || "0"),
    // },
    {
      id: "pendingPods",
      label: "Pod Status",
      format: (value: any) =>
        (isNullValueOrZero(value) ? "Completed" : "Pending") || "0",
      customView: (element: any) => {
        return !element?.pendingPods ? (
          <div className="d-flex pod-status completed-icon">
            <CheckCircleIcon />
            <p>Completed</p>
          </div>
        ) : (
          <div className="d-flex pod-status">
            <svg width="20" height="20" viewBox="0 0 20 20">
              {" "}
              <g id="pending_actions_black_24dp" transform="translate(0 0.42)">
                {" "}
                <rect
                  id="Rectangle_2014"
                  data-name="Rectangle 2014"
                  width="20"
                  height="20"
                  transform="translate(0 -0.42)"
                  fill="none"
                />{" "}
                <path
                  id="Path_11135"
                  data-name="Path 11135"
                  d="M14.606,9.974a4.079,4.079,0,1,0,4.079,4.079A4.081,4.081,0,0,0,14.606,9.974Zm1.346,6L14.2,14.216V11.606h.816v2.276l1.509,1.509Zm-.53-13.339H12.827a2.438,2.438,0,0,0-4.6,0H5.632A1.636,1.636,0,0,0,4,4.263V16.5a1.636,1.636,0,0,0,1.632,1.632h4.985A5.5,5.5,0,0,1,9.458,16.5H5.632V4.263H7.263V6.711H13.79V4.263h1.632V8.408a5.736,5.736,0,0,1,1.632.489V4.263A1.636,1.636,0,0,0,15.421,2.632ZM10.527,4.263a.816.816,0,1,1,.816-.816A.818.818,0,0,1,10.527,4.263Z"
                  transform="translate(-0.737 -0.184)"
                  fill="#F7931E"
                />{" "}
              </g>
            </svg>
            <p>Pending</p>
          </div>
        );
      },
    },
    {
      id: "",
      label: "Action",
      type: "multiAction",
      class: () => (isMobile ? "col-12" : " "),
      customView: (element: any) => {
        return (
          (
            <div className="mobile-btn">
              <Button
                buttonStyle="btn-detail mobile-btn btn-sm mr-2"
                title="Update"
                leftIcon={<Edit />}
                disable={element.rowIndex === defaultOpenIndex}
                onClick={() => {
                  element && onClickUpdateButton(element);
                }}
              />
            </div>
          ) || "NA"
        );
      },
    },
  ];
  return columnList;
};

export const freightTableColumns = (onClickBillView: Function) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightType",
      label: "Freight Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "nodeName",
      label: "Node",
      format: (value: any) => value || "NA",
    },
    {
      id: "billType",
      label: "Billing Period",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        return (
          (
            <div className="view-text blue-text d-flex align-items-center">
              <p className="mb-0 mr-1 freight-text">{element.billType}</p>
              {element.billType !== "trip" && (
                <CustomTooltipTable
                  tableColumn={billPeriodTableColumns}
                  tableData={[
                    {
                      startDate: element.startDate,
                      endDate: element.endDate,
                    },
                  ]}
                />
              )}
            </div>
          ) || "NA"
        );
      },
    },

    {
      id: "totalTrips",
      label: "Total trips",
      format: (value: any) => value || "NA",
    },
    {
      id: "transportType",
      label: "Mode of Transportation",
      format: (value: any) => value || "NA",
    },
    {
      id: "pendingPods",
      label: "PoD Status",
      format: (value: any) => (value > 0 ? "Pending" : "Completed" || "0"),
      customView: (element: any) => {
        return !element?.pendingPods ? (
          <div className="d-flex pod-status completed-icon">
            <CheckCircleIcon />
            <p>Completed</p>
          </div>
        ) : (
          <div className="d-flex pod-status">
            <svg width="20" height="20" viewBox="0 0 20 20">
              {" "}
              <g id="pending_actions_black_24dp" transform="translate(0 0.42)">
                {" "}
                <rect
                  id="Rectangle_2014"
                  data-name="Rectangle 2014"
                  width="20"
                  height="20"
                  transform="translate(0 -0.42)"
                  fill="none"
                />{" "}
                <path
                  id="Path_11135"
                  data-name="Path 11135"
                  d="M14.606,9.974a4.079,4.079,0,1,0,4.079,4.079A4.081,4.081,0,0,0,14.606,9.974Zm1.346,6L14.2,14.216V11.606h.816v2.276l1.509,1.509Zm-.53-13.339H12.827a2.438,2.438,0,0,0-4.6,0H5.632A1.636,1.636,0,0,0,4,4.263V16.5a1.636,1.636,0,0,0,1.632,1.632h4.985A5.5,5.5,0,0,1,9.458,16.5H5.632V4.263H7.263V6.711H13.79V4.263h1.632V8.408a5.736,5.736,0,0,1,1.632.489V4.263A1.636,1.636,0,0,0,15.421,2.632ZM10.527,4.263a.816.816,0,1,1,.816-.816A.818.818,0,0,1,10.527,4.263Z"
                  transform="translate(-0.737 -0.184)"
                  fill="#F7931E"
                />{" "}
              </g>
            </svg>
            <p>Pending</p>
          </div>
        );
      },
    },

    {
      id: "totalVolume",
      label: "Total Order Volume (m³)",
      format: (value: any) => (value && Numeral(value).format("0,0.00")) || "NA",
    },
    {
      id: "totalWeight",
      label: "Total Order Weight (Kg)",
      format: (value: any) => (value && Numeral(value).format("0,0.00")) || "NA",
    },
    {
      id: "totalDistance",
      label: "Total Kms",
      format: (value: any) => (value > 0 && value) || "NA",
    },
    {
      id: "",
      label: "Action",
      format: (value: any) => value || "NA",
      type: "multiAction",
      class: () => (isMobile ? "col-12" : " "),
      customView: (element: any) => {
        return (
          (element ? (
            <div className="mobile-btn">
              <Button
                buttonStyle="btn-detail mobile-btn btn-sm mr-2"
                title="Reconcile Bill"
                leftIcon={<FileCopyOutlined />}
                onClick={() => {
                  onClickBillView(element);
                  // billDetail()
                }}
              />
            </div>
          ) : (
            <InfoTooltip
              title={notBillableMessage}
              customIcon={
                <Button
                  buttonStyle="btn-detail mobile-btn btn-sm mr-2 disabled"
                  title="Bill Details"
                  leftIcon={<FileCopyOutlined />}
                  onClick={() => { }}
                />
              }
            />
          )) || "NA"
        );
      },
    },
  ];
  return columnList;
};

// export const frightTableColumns = (onClickLaneCode: Function, onClickBillView: Function) => {
//     const columnList: ColumnStateModel[] = [
//         { id: 'freightOrderCode', label: 'Order Code', format: (value: any) => value || "NA" },
//         { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
//         { id: 'shipmentDetails', label: 'Transporter', format: (value: any) => (value && value[0] && value[0].partnerName) || "NA" },
//         {
//             id: 'lane', label: 'Lane', format: (value: any) => (value && value.displayName) || "NA",
//             customView: (element: any) => <ListFreightLaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
//         },
//         { id: 'totalOrderVolume', label: 'Total Order Volume (m³)', format: (value: any) => (value && Numeral(value).format('0,0.00')) || "NA" },
//         { id: 'totalOrderWeight', label: 'Total Order Weight (Kg)', format: (value: any) => (value && Numeral(value).format('0,0.00')) || "NA" },
//         { id: 'createdAt', label: 'Order Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
//         {
//             id: 'action', label: 'Action', format: (value: any) => value || "NA", type: "multiAction",
//             class: () => isMobile ? "col-12" : " ",
//             customView: (element: any) => {
//                 return ((element && (element.isBillable ?
//                     <div className="mobile-btn">
//                         <Button
//                             buttonStyle="btn-detail mobile-btn btn-sm mr-2"
//                             title="Reconcile Bill"
//                             leftIcon={<FileCopyOutlined />}
//                             onClick={() => {
//                                 onClickBillView(element)
//                                 // billDetail()
//                             }}
//                         />

//                     </div> :
//                     <InfoTooltip
//                         title={notBillableMessage}
//                         customIcon={
//                             <Button
//                                 buttonStyle="btn-detail mobile-btn btn-sm mr-2 disabled"
//                                 title="Bill Details"
//                                 leftIcon={<FileCopyOutlined />}
//                                 onClick={() => {
//                                 }}
//                             />}
//                     />

//                 )) || "NA")
//             }
//         },
//     ]
//     return columnList;
// };

// export const frightTableMobileColumns = (onClickLaneCode: Function, onClickBillView: Function) => {
//     const columnList: ColumnStateModel[] = [
//         { id: 'freightOrderCode', label: 'Order Code', format: (value: any) => value || "NA" },
//         { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
//         { id: 'shipmentDetails', label: 'Transporter', format: (value: any) => (value && value[0] && value[0].partnerName) || "NA" },
//         {
//             id: 'lane', label: 'Lane', format: (value: any) => (value && value.displayName) || "NA",
//             customView: (element: any) => <ListFreightLaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
//         },
//         { id: 'totalOrderVolume', label: 'Total Order Volume (m³)', format: (value: any) => (value && Numeral(value).format('0,0.00')) || "NA" },
//         { id: 'totalOrderWeight', label: 'Total Order Weight (Kg)', format: (value: any) => (value && Numeral(value).format('0,0.00')) || "NA" },
//         { id: 'createdAt', label: 'Order Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
//         {
//             id: 'action', label: 'Action', format: (value: any) => value || "NA", type: "multiAction",
//             customView: (element: any) => {
//                 return ((element && (element.isBillable ?
//                     <Button
//                         buttonStyle="btn-detail btn-sm table-col-btn"
//                         title="Generate Bill"
//                         leftIcon={<FileCopyOutlined />}
//                         onClick={() => {
//                             onClickBillView(element)
//                         }}
//                     /> :
//                     <InfoTooltip
//                         title={notBillableMessage}
//                         customIcon={
//                             <Button
//                                 buttonStyle="btn-detail btn-sm table-col-btn disabled"
//                                 title="Generate Bill"
//                                 leftIcon={<FileCopyOutlined />}
//                                 onClick={() => {
//                                 }}
//                             />}
//                     />
//                 )) || "NA")
//             }
//         },
//         {
//             id: 'expand', label: 'See More', buttonLabel: "Gate In", type: "expand", leftIcon: <ArrowForward />,
//         }
//     ]
//     return columnList;
// };

// const PendingLaneItem = ({ item }: any) => (
//     <div>
//         <a href="">
//             <span
//                 className="blue-text"
//             > Delhi - Banglore
//             </span>
//         </a>
//     </div>
// );

export const freightBillingPeriodicTableColumns = (
  onClickOrderCode: Function,
  onClickLaneCode: Function,
  isOwnerClient: boolean,
  onClickUpdateButton: Function,
  onClickDisputeButton: Function,
  defaultOpenIndex: any,
  showAddReasonButton: boolean,
  orderDetails: any
) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightId",
      label: "Freight Order",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        return (
          <label
            className="lane-wrap lane-content lane-content-mobile"
            onClick={() => {
              onClickOrderCode(element);
            }}
          >
            {element.freightId}
          </label>
        );
      },
    },
    {
      id: "lane",
      label: "Lane/Zone",
      format: (value: any) => value || "NA",
      customView: (element: any) => ((element?.originZoneName && element.destinationZoneName) ? (element?.originZoneName + " -> " + element.destinationZoneName) : element?.laneName ?
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        /> : "NA"
      ),
    },
    {
      id: "totalDistanceInKms",
      label: "Total Kilometers",
      format: (value: any) => value || "NA",
    },
    {
      id: "vehicleTypeName",
      label: "Vehicle Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "shipmentTransactionData",
      label: "Vehicle Number",
      format: (value: any) =>
        (value &&
          value[0] &&
          value[0].shipmentDetails &&
          value[0].shipmentDetails.vehicleRegistrationNumber) ||
        "NA",
    },
    {
      id: "totalDeduction",
      label: "Deduction(₹)",
      format: (value: any) => "- " + (value || "0"),
      class: () => "red-text"
    },
    {
      id: "totalPayable",
      label: "Payable Amount (₹)",
      customView: (element: any) => {
        return (
          element && (
            <div className="d-flex">
              <span className="mr-2">{element?.totalPayable || "0"}</span>
              {element?.isDisputed && (
                <InfoTooltip
                  title={"Dispute"}
                  placement={"top"}
                  customIcon={<img src="/images/dispute.svg" alt="dispute" />}
                />
              )}
            </div>
          )
        );
      },
    },
    {
      id: "",
      label: "",
      format: (value: any) => value || "NA",
      type: "multiAction",
      class: () => (isMobile ? "col-12" : " "),
      customView: (element: any) => {
        return (
          element && (
            <div className="mobile-btn">
              <Button
                buttonStyle="btn-detail mobile-btn btn-sm mr-2"
                title={isOwnerClient ? "Update" : "View"}
                disable={element.rowIndex === defaultOpenIndex}
                leftIcon={isOwnerClient ? <Edit /> : <Visibility />}
                onClick={() => {
                  element && onClickUpdateButton(element);
                }}
              />
              {showAddReasonButton &&
                orderDetails.billStatus === InvoiceStatusEnum.PENDING && (
                  <Button
                    buttonStyle="btn-orange"
                    title={!element.isDisputed ? "Add Reason" : "Update Reason"}
                    leftIcon={<AddCircle />}
                    onClick={() => {
                      onClickDisputeButton(element);
                    }}
                  />
                )}
            </div>
          )
        );
      },
    },
  ];
  return columnList;
};

export const disputeModalTableColumns = (onClickLaneCode: Function) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightId",
      label: "Freight Order",
      format: (value: any) => value || "NA",
    },
    {
      id: "laneName",
      label: "Lane",
      format: (value: any) => value || "NA",
      customView: (element: any) => (
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        />
      ),
    },
    {
      id: "vehicleRegistrationNumber",
      label: "Vehicle Number",
      format: (value: any) => value || "NA",
    },
    {
      id: "totalPayable",
      label: "Payable Amount (₹)",
      format: (value: any) => value || "NA",
    },
  ];
  return columnList;
};

export const pendingTableColumns = (
  handleChecks: Function,
  handleAllChecks: Function,
  allValue: boolean,
  onClickViewButton: Function,
  onClickLaneCode: Function,
  tabName: string,
  userParams?: Array<any>
) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "billNo",
      label: "Bill Number",
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "billCreatedByName",
      label: "Raised By",
      format: (value: any) => value || "NA",
      customView: (element: any) => (
        <div>
          {element.owner === "CLIENT"
            ? element.clientName || "NA"
            : element.partnerName || "NA"}
        </div>
      ),
    },
    {
      id: "freightType",
      label: "Order Type",
      format: (value: any) => value || "NA",
    },
    {
      id: 'externalShipmentBillDetails', label: 'External Order Bill', format: (value: any) => value || "NA",
      customView: (element: any) => {
        return ((
          <CustomTooltipTable
            tableColumn={externalBillTooltipColumn}
            tableData={element && element.externalShipmentBillDetails}
            customIcon={<ul className="order-bill-btn-wrap d-flex align-items-center">
              <li><span>{(element && element.externalShipmentBillCount) || 0}</span></li>
              <li>E - O - Bill</li>
            </ul>}
          />
        ) || "NA")
      }
    },
    {
      id: "nodeName",
      label: "Node",
      format: (value: any) => value || "NA",
    },
    {
      id: "billType",
      label: "Billing Period",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        return (
          (
            <div className="view-text blue-text d-flex align-items-center">
              <p className="mb-0 mr-1 freight-text">{element.billType}</p>
              {element.billType !== "trip" && (
                <CustomTooltipTable
                  tableColumn={billPeriodTableColumns}
                  tableData={[
                    {
                      startDate: element.startDate,
                      endDate: element.endDate,
                    },
                  ]}
                />
              )}
            </div>
          ) || "NA"
        );
      },
    },
    {
      id: "billCreatedDate",
      label: "Raised Date and Time",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    {
      id: "totalAmount",
      label: "Total Amount",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        return (
          (element && (
            <div className="amount">
              <img className="mr-2" src="/images/rupee-black.svg" alt="rupee" />
              {(element &&
                element.amount &&
                Numeral(element.amount).format("0,0.00")) ||
                "NA"}
            </div>
          )) ||
          "NA"
        );
      },
    },
    {
      id: "action",
      label: "Action",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        return (
          (element && (
            <div className="action-btn-wrap">
              <Button
                buttonStyle="btn-detail btn-sm"
                title={
                  element.isApprover === 1 &&
                    element.status === InvoiceStatusEnum["AWAITING APPROVAL"]
                    ? "Approve"
                    : "View"
                }
                leftIcon={<Visibility />}
                onClick={() => {
                  onClickViewButton(element);
                }}
              />
            </div>
          )) ||
          "NA"
        );
      },
    },
  ];

  if (tabName === "APPROVED") {
    columnList.splice(0, 0, {
      id: "#",
      label: "#",
      format: (value: any) => value || "NA",
      customHead: () => (
        <div className="checkbox-warp">
          <Checkbox
            onChange={(e) => {
              handleAllChecks(e.target.checked);
            }}
            checked={allValue}
          />
          All
        </div>
      ),
      customView: (element: any) => {
        return (
          <div className="checkbox-warp">
            <CheckboxWidget
              onCheckChange={(e: any) => {
                handleChecks(element.billNo, e.target.checked);
              }}
              checked={
                userParams &&
                  userParams.find((item: any) => item.billNo === element.billNo)
                  ? true
                  : false
              }
            />
          </div>
        );
      },
    });
  }

  if (tabName === "AWAITING APPROVAL") {
    columnList.splice(5, 0, {
      id: 'approverData', label: 'Approvers', format: (value: any) => value || "NA",
      customView: (data: any) => {
        let element = data.approverData;

        let userApprovedCount = ((element && element.filter((approvers: any) => approvers.approveMarked).length) || 0);
        return (element && <div>
          <Information
            title=""
            customView={
              <CustomTooltipTable
                customIcon={
                  <span className="blue-text approve-text">
                    {
                      element.length === 1 ? `${element.length} Approver` : `${element.length} Approvers`
                    }
                  </span>
                }
                wrap={true}
                arrow={true}
                tableColumn={[{
                  description: (
                    userApprovedCount === element.length
                      ? "Approved"
                      : `${element.length - userApprovedCount} Approvals needed`
                  ),
                  name: "taggedLocationName",
                  customView: (value: any) => (
                    <ul>
                      <li className="row align-items-center approve-user">
                        <div className="col-8">
                          <div className="media">
                            <img className="mr-2" src="/images/user-icon.svg" alt="user icon" />
                            <div className="mddia-body approve-user-content">
                              <strong>
                                {value.userName}
                              </strong>
                              <span>
                                {value.userEmail}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-4 user-status-type">
                          {
                            value.approveMarked ?
                              (
                                <>
                                  <img className="mr-2" src="/images/approve.png" alt="Approved" />
                                  <span className="green-text">Approved</span>
                                </>
                              )
                              :
                              (
                                <>
                                  <img className="mr-2" src="/images/pending.png" alt="Pending" />
                                  <span className="orange-text" >Pending</span>
                                </>
                              )
                          }
                        </div>
                      </li>
                    </ul>

                  )
                }
                ]}
                tableData={element}
                showStringValue={true}
                style={{
                  tooltip: {
                    minWidth: isMobile ? 320 : 320,
                    maxWidth: isMobile ? 320 : 400,
                    marginTop: 8,
                    overflow: 'visible',
                  },
                }}
              />

            }
          />
        </div>
        )
      }
    }, {
      id: 'billValuePercentage', label: billPercentageLabel, format: (value: any) => (value && `${value + "%"}`) || "NA",
    })
  }
  return columnList;
};

export const orderDetailsTemplate = () => {
  const columnList: ColumnStateModel[] = [
    {
      label: "Order Code :",
      id: "freightOrderCode",
    },
    {
      label: "Shipment Code:",
      id: "freightShipmentCode",
    },
    {
      label: "Freight Type :",
      id: "freightTypeCode",
    },
    {
      label: "Vehicle Type :",
      id: "vehicleType",
    },
    {
      label: "Transporter :",
      id: "partnerName",
    },
    {
      label: "Lane :",
      id: "freightShipmentCode",
    },
    {
      label: "LR No. :",
      id: "lrNumber",
    },
    {
      label: "Status :",
      id: "statusName",
    },
    {
      label: "Vehicle Number :",
      id: "vehicleRegistrationNumber",
    },
    {
      label: "Driver Name :",
      id: "primaryDriverName",
    },
    {
      label: "Driver Number :",
      id: "primaryDriverNumber",
    },
    {
      label: "Unloading Date and Time :",
      id: "destinationGateOutTime",
      format: (value: any) =>
        value && convertDateFormat(value, displayDateFormatter),
    },
    {
      label: "Reporting Date and Time :",
      id: "destinationGateInTime",
      format: (value: any) =>
        value && convertDateFormat(value, displayDateFormatter),
    },
  ];
  return columnList;
};

export const invoiceBulkApprovalTableColumns = (
  handleChecks: Function,
  handleAllChecks: Function,
  allValue: boolean,
  onClickLaneCode: Function
) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "#",
      label: "#",
      format: (value: any) => value || "NA",
      customHead: () => (
        <div className="checkbox-warp">
          <Checkbox
            onChange={(e) => {
              handleAllChecks(e.target.checked);
            }}
            checked={allValue}
          />
          All
        </div>
      ),
      customView: (element: any) => (
        <div className="checkbox-warp">
          <Checkbox
            onChange={(e) => {
              handleChecks(element.billNo, e.target.checked);
            }}
            checked={element.isCheckboxChecked ? true : false}
            name="checked"
          />
        </div>
      ),
    },
    {
      id: "billNo",
      label: "Bill Number",
      format: (value: any) => value || "NA",
    },
    {
      id: "partner",
      label: "Transporter",
      format: (value: any) => (value && value.name) || "NA",
    },
    {
      id: "billCreatedByName",
      label: "Raised By",
      format: (value: any) => value || "NA",
      customView: (element: any) => (
        <div>
          {element.owner === "CLIENT"
            ? element.clientName || "NA"
            : (element.partner && element.partner.name) || "NA"}
        </div>
      ),
    },
    {
      id: "freightType",
      label: "Order Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "externalShipmentBillDetails",
      label: "External Order Bill",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        return (
          (
            <CustomTooltipTable
              tableColumn={externalBillTooltipColumn}
              tableData={element && element.externalShipmentBillDetails}
              customIcon={
                <ul className="order-bill-btn-wrap d-flex align-items-center">
                  <li>
                    <span>
                      {(element && element.externalShipmentBillCount) || 0}
                    </span>
                  </li>
                  <li>E - O - Bill</li>
                </ul>
              }
            />
          ) || "NA"
        );
      },
    },
    {
      id: "approverData",
      label: "Approvers",
      format: (value: any) => value || "NA",
      customView: (data: any) => {
        let element = data.approverData;

        let userApprovedCount =
          (element &&
            element.filter((approvers: any) => approvers.approveMarked)
              .length) ||
          0;
        return (
          element && (
            <div>
              <Information
                title=""
                customView={
                  <CustomTooltipTable
                    customIcon={
                      <span className="blue-text approve-text">
                        {element.length === 1
                          ? `${element.length} Approver`
                          : `${element.length} Approvers`}
                      </span>
                    }
                    wrap={true}
                    arrow={true}
                    tableColumn={[
                      {
                        description:
                          userApprovedCount === element.length
                            ? "Approved"
                            : `${element.length - userApprovedCount
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
                                    <strong>{value.userName}</strong>
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
                                    <span className="green-text">Approved</span>
                                  </>
                                ) : (
                                  <>
                                    <img
                                      className="mr-2"
                                      src="/images/pending.png"
                                      alt="Pending"
                                    />
                                    <span className="orange-text">Pending</span>
                                  </>
                                )}
                              </div>
                            </li>
                          </ul>
                        ),
                      },
                    ]}
                    tableData={element}
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
          )
        );
      },
    },
    {
      id: 'billValuePercentage', label: billPercentageLabel, format: (value: any) => (value && `${value + "%"}`) || "NA",
    },
    {
      id: "nodeName",
      label: "Node",
      format: (value: any) => value || "NA",
    },
    {
      id: "billType",
      label: "Billing Period",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        return (
          (
            <div className="view-text blue-text d-flex align-items-center">
              <p className="mb-0 mr-1 freight-text">{element.billType}</p>
              {element.billType !== "trip" && (
                <CustomTooltipTable
                  tableColumn={billPeriodTableColumns}
                  tableData={[
                    {
                      startDate: element.startDate,
                      endDate: element.endDate,
                    },
                  ]}
                />
              )}
            </div>
          ) || "NA"
        );
      },
    },
    {
      id: "createdAt",
      label: "Raised Date and Time",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    {
      id: "totalAmount",
      label: "Total Amount",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        return (
          (element && (
            <div className="amount">
              <img className="mr-2" src="/images/rupee-blue.svg" alt="rupee" />
              {(element &&
                element.amount &&
                Numeral(element.amount).format("0,0.00")) ||
                "NA"}
            </div>
          )) ||
          "NA"
        );
      },
    },
  ];
  return columnList;
};
