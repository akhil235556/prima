import {
  Card,
  CardContent,
  CardHeader,
  TextareaAutosize
} from "@material-ui/core";
import {
  FileCopyOutlined,
  KeyboardBackspace,
  Remove
} from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { isNumber } from "util";
import {
  DocType,
  fuelSurchargeTooltipColumn
} from "../../../base/constant/ArrayList";
import {
  contractId,
  debitPriceLabel,
  distancePriceLabel,
  freightTypeLabel,
  lanePriceLabel, laneZoneTitle, modLabel,
  notBillableMessage,
  orderCodeLabel,
  orderDateLabel,
  referenceIdLabel
} from "../../../base/constant/MessageUtils";
import {
  convertDateFormat,
  displayDateTimeFormatter
} from "../../../base/utility/DateUtils";
import {
  convertAmountToNumberFormat,
  floatFormatter
} from "../../../base/utility/NumberUtils";
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import { ListFreightLaneView } from "../../../component/CommonView";
import DataNotFound from "../../../component/error/DataNotFound";
import Filter from "../../../component/filter/Filter";
import Information from "../../../component/information/Information";
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from "../../../component/widgets/button/Button";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomTooltipTable } from "../../../component/widgets/CustomToolTipTable";
import { InfoTooltip } from "../../../component/widgets/tooltip/InfoTooltip";
import { showAlert } from "../../../redux/actions/AppActions";
import {
  generateBill,
  getInvoiceTemplateData,
  orderTransactions
} from "../../../serviceActions/BillGenerateServiceActions";
import { searchContractDetails } from "../../../serviceActions/ContractServiceActions";
import { getDocList } from "../../../serviceActions/DasServiceActions";
import {
  getFreightOrderList,
  getFreightOrderPeriodicInvoiceList,
  getOrderLogList
} from "../../../serviceActions/OrderServiceActions";
import ContractDetailModal from "../../indentManagement/indent/ContractDetailModal";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import {
  getInvoiceParams,
  updatevariablefreightcharge
} from "../InvoiceUtility";
import "./FreightReconciliationInvoice.css";
import InvoiceTable from "./invoiceTable/InvoiceTable";

function FreightReconciliationTripInvoice() {
  const appDispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams<any>();
  const [templateResponse, setTemplateResponse] = React.useState<any>();
  const [orderDetails, setOrderDetails] = React.useState<any>({});
  const [contractDetails, setContractDetails] = React.useState<any>({});
  const [transactionsResponse, setTransactionsResponse] = React.useState<any>(
    {}
  );
  const [transactions, setTransactions] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<any>();
  const [totalAmount, setTotalAmount] = React.useState<any>();
  const [deductions, setDeductions] = React.useState<any>();
  const [payable, setPayable] = React.useState<any>();
  const [gstAmount, setGSTAmount] = React.useState<any>();
  const [remarks, setRemarks] = React.useState<any>("");
  const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
  const [podData, setPodData] = React.useState<any>({});
  const [billData, setBillData] = React.useState<any>({});
  const [openContractDetailModal, setOpenContractDetailModal] =
    React.useState<boolean>(false);
  const [orderLogResponse, setOrderLogResponse] = React.useState<any>({});
  const [totalFuelSurcharge, setTotalFuelSurcharge] = React.useState<any>();
  const [totalVariableFuelSurcharge, setTotalVariableFuelSurcharge] =
    React.useState<any>();
  const [totalFixedFuelSurcharge, setTotalFixedFuelSurcharge] =
    React.useState<any>();
  const [isBillable, setisBillable] = React.useState<any>();

  useEffect(() => {
    const getAllDetails = async () => {
      setLoading(true);
      let orderParams: any = {
        page: 1,
        pageSize: 25,
        id: id,
      };

      try {
        const freightOrderCodeResponse = await appDispatch(
          getFreightOrderPeriodicInvoiceList(orderParams)
        );
        const freightOrderCode =
          freightOrderCodeResponse &&
          freightOrderCodeResponse.results &&
          freightOrderCodeResponse.results[0] &&
          freightOrderCodeResponse.results[0].freightOrderCode;
        const orderDetailsResp = await appDispatch(
          getFreightOrderList({ freightOrderCode: freightOrderCode })
        );
        const freightTypeCode =
          orderDetailsResp &&
          orderDetailsResp.results &&
          orderDetailsResp.results[0] &&
          orderDetailsResp.results[0].freightTypeCode;
        const invoiceTemplateResp = await appDispatch(
          getInvoiceTemplateData({
            billingEntity: "CLIENT",
            pageType: "CREATE",
            freightType: freightTypeCode,
          })
        );
        invoiceTemplateResp &&
          invoiceTemplateResp.details &&
          setTemplateResponse(invoiceTemplateResp.details.fields);
        var fields =
          invoiceTemplateResp &&
          invoiceTemplateResp.details &&
          invoiceTemplateResp.details.fields;
        if (
          orderDetailsResp &&
          orderDetailsResp.results &&
          orderDetailsResp.results[0]
        ) {
          let orderInfo = orderDetailsResp.results[0];
          setisBillable(orderInfo?.isBillable);
          setOrderDetails(orderInfo);
          let invoiceParams: any = {
            freightId: freightOrderCode,
            freightTypeCode: freightTypeCode,
            partnerCode: orderInfo.shipmentDetails[0].partnerCode,
          };
          appDispatch(orderTransactions(invoiceParams))
            .then(async (response: any) => {
              if (response && response.details) {
                let tempPodList: any = [];
                response.details.shipmentTransactionData &&
                  response.details.shipmentTransactionData.forEach(
                    (item: any) => {
                      if (
                        item.shipmentDetails &&
                        item.shipmentDetails.podUploaded
                      ) {
                        tempPodList.push({
                          shipmentCode: item.shipmentDetails.shipmentCode,
                          uploaded: true,
                        });
                      } else {
                        tempPodList.push({
                          shipmentCode: item.shipmentDetails.shipmentCode,
                          uploaded: false,
                        });
                      }
                    }
                  );

                var totalVariableFuelCost = 0;
                var fixedFuelSurcharge =
                  response.details.fixedFuelSurcharge &&
                  Number(response.details.fixedFuelSurcharge);
                response.details.shipmentTransactionData.forEach(
                  (transaction: any) => {
                    if (transaction.variableFuelSurcharge) {
                      totalVariableFuelCost =
                        totalVariableFuelCost +
                        transaction.variableFuelSurcharge;
                    }
                  }
                );
                var totalFuelSurchargeAmount;
                if (totalVariableFuelCost && fixedFuelSurcharge) {
                  totalFuelSurchargeAmount =
                    Number(totalVariableFuelCost) + Number(fixedFuelSurcharge);
                } else if (totalVariableFuelCost) {
                  totalFuelSurchargeAmount = Number(totalVariableFuelCost);
                } else if (fixedFuelSurcharge) {
                  totalFuelSurchargeAmount = Number(fixedFuelSurcharge);
                }
                setTotalFixedFuelSurcharge(
                  convertAmountToNumberFormat(
                    fixedFuelSurcharge,
                    floatFormatter
                  )
                );
                setTotalVariableFuelSurcharge(
                  convertAmountToNumberFormat(
                    totalVariableFuelCost,
                    floatFormatter
                  )
                );
                setTotalFuelSurcharge(
                  convertAmountToNumberFormat(
                    totalFuelSurchargeAmount,
                    floatFormatter
                  )
                );

                setPodData(tempPodList);
                setTransactionsResponse(response.details);
                setTransactions(response.details.shipmentTransactionData);
                let contractInfo: any;
                if (orderInfo.contractCode) {
                  contractInfo = await appDispatch(
                    searchContractDetails({
                      contractCode: orderInfo.contractCode,
                    })
                  );
                  if (contractInfo) {
                    setContractDetails(contractInfo);
                  }
                }
                response.details.shipmentTransactionData &&
                  getAmount(
                    response.details.shipmentTransactionData,
                    fields,
                    response.details,
                    contractInfo
                  );
              }
              setLoading(false);
              return appDispatch(
                getOrderLogList({
                  freightOrderCode: freightOrderCode,
                  actionName: "DELIVERED",
                })
              );
            })
            .then((innerResponse: any) => {
              if (innerResponse) {
                setOrderLogResponse(innerResponse);
              } else {
                setOrderLogResponse({});
              }
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    };
    getAllDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="freignt-recon-info-wrap">
      <div className="filter-wrap">
        <Filter
          pageTitle={"Freights Reconciliation"}
          buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
          buttonTitle={isMobile ? " " : "Back"}
          leftIcon={<KeyboardBackspace />}
          onClick={() => {
            history.goBack();
          }}
        ></Filter>
      </div>

      <LanePointsDisplayModal
        open={openPointModal}
        laneCode={orderDetails && orderDetails.laneCode}
        onClose={() => {
          setOpenPointModal(false);
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
          freightType={orderDetails && orderDetails.freightTypeCode}
          onSuccess={() => {
            setOpenContractDetailModal(false);
          }}
          onClose={() => {
            setOpenContractDetailModal(false);
          }}
        />}

      {!loading && isObjectEmpty(orderDetails) ? (
        <DataNotFound />
      ) : (
        <PageContainer>
          <Card className="creat-contract-wrapp card-detail-wrap">
            <div className="billing-info-header">
              <h4>Freight Information</h4>
            </div>
            {loading ? (
              <CardContentSkeleton row={3} column={3} />
            ) : (
              <CardContent className="creat-contract-content">
                <div className="custom-form-row row">
                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={orderCodeLabel}
                      text={orderDetails && orderDetails.freightOrderCode}
                    />
                  </div>
                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={freightTypeLabel}
                      text={orderDetails && orderDetails.freightTypeCode}
                    />
                  </div>
                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={laneZoneTitle}
                      text={(orderDetails?.originZoneName && orderDetails?.destinationZoneName) && (orderDetails?.originZoneName + " -> " + orderDetails?.destinationZoneName)}
                      customView={orderDetails?.laneName &&
                        <ListFreightLaneView
                          element={orderDetails}
                          onClickLaneCode={(data: any) => {
                            setOpenPointModal(true);
                          }}
                        />
                      }
                    />
                  </div>
                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={referenceIdLabel}
                      text={orderDetails && orderDetails.referenceId}
                    />
                  </div>
                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={lanePriceLabel}
                      text={
                        transactionsResponse &&
                        (transactionsResponse.baseFreightCharge || "0")
                      }
                    />
                  </div>
                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={orderDateLabel}
                      text={
                        orderDetails &&
                        orderDetails.createdAt &&
                        convertDateFormat(
                          orderDetails.createdAt,
                          displayDateTimeFormatter
                        )
                      }
                    />
                  </div>
                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={"Status"}
                      text={orderDetails && orderDetails.statusName}
                      valueClassName="orange-text"
                    />
                  </div>
                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={debitPriceLabel}
                      text={
                        transactionsResponse &&
                        (transactionsResponse.debitCharge || "0")
                      }
                      tooltip={() => (
                        <CustomTooltipTable
                          tableColumn={[
                            {
                              description: "Freight Order",
                              name: "freightOrder",
                            },
                            { description: "Lane", name: "lane" },
                            { description: "Amounts", name: "amount" },
                            { description: "Remarks", name: "remark" },
                          ]}
                          tableData={
                            transactionsResponse &&
                            transactionsResponse.debitChargeBreakup
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="col-md-3 billing-group col-6">
                    <Information
                      title={distancePriceLabel}
                      text={
                        transactionsResponse &&
                        transactionsResponse.distanceCharge &&
                        (convertAmountToNumberFormat(
                          transactionsResponse.distanceCharge,
                          floatFormatter
                        ) ||
                          "0")
                      }
                      tooltip={() => (
                        <CustomTooltipTable
                          tableColumn={[
                            { description: "Type", name: "distanceType" },
                            { description: "Run(km)", name: "distance" },
                            { description: "Charges", name: "amount" },
                          ]}
                          tableData={
                            transactionsResponse &&
                            transactionsResponse.distanceChargeBreakup
                          }
                        />
                      )}
                    />
                  </div>
                  {orderDetails.contractCode && (
                    <div className="col-md-3 billing-group col-6">
                      <Information
                        title={contractId}
                        valueClassName="blue-text"
                        customView={
                          <span
                            className="blue-text cursor-pointer"
                            onClick={() => {
                              setOpenContractDetailModal(true);
                            }}
                          >
                            {orderDetails.contractCode}
                          </span>
                        }
                      />
                    </div>
                  )}
                  {orderDetails.serviceabilityModeCode && (
                    <>
                      <div className="col-md-3 billing-group col-6">
                        <Information
                          title={modLabel}
                          text={orderDetails.serviceabilityModeCode}
                        />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {((transactionsResponse &&
            transactionsResponse.shipmentTransactionData &&
            transactionsResponse.shipmentTransactionData.length) ||
            loading) && (
              <Card className="creat-contract-wrapp list-info-wrap">
                <CardHeader
                  className="creat-contract-header"
                  title="Payment Information"
                />
                {loading ? (
                  <CardContentSkeleton row={3} column={3} />
                ) : (
                  <CardContent className="creat-contract-content">
                    <InvoiceTable
                      template={templateResponse}
                      shipmentTransactionData={
                        transactionsResponse &&
                        transactionsResponse.shipmentTransactionData
                      }
                      onChangeAmount={(data: any) => {
                        getAmount(
                          data,
                          templateResponse,
                          transactionsResponse,
                          contractDetails
                        );
                        setTransactions(data);
                        updatevariablefreightcharge(
                          data,
                          setTotalVariableFuelSurcharge,
                          setTotalFuelSurcharge,
                          totalFixedFuelSurcharge
                        );
                      }}
                      id={orderDetails?.freightOrderCode}
                      podData={podData}
                      onChangePodData={(data: any) => {
                        setPodData(data);
                      }}
                      viewPdf={true}
                      onChangeBillData={(data: any) => {
                        setBillData((prevData: any) => ({
                          ...prevData,
                          ...data,
                        }));
                      }}
                      billData={billData}
                      orderLogs={orderLogResponse}
                    />
                    <div className="row">
                      <div className="col-md-5">
                        <div className="billing-info-remark remark-row">
                          <div className="form-group">
                            <label>Remark</label>
                            <TextareaAutosize
                              rowsMax={3}
                              rowsMin={3}
                              aria-label="maximum height"
                              placeholder="Remarks"
                              defaultValue={remarks}
                              onChange={(event: any) => {
                                setRemarks(event.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-7 d-flex justify-content-md-end info-total">
                        <div className="billing-info-footer">
                          <div className="form-group input-wrap fuel-surcharge">
                            <div className="d-flex">
                              <label className="total-amount-content">
                                Fuel Surcharge :
                              </label>
                            </div>
                            <div className="total-amount">
                              <img src="/images/rupee-black.svg" alt="" />{" "}
                              <strong>{totalFuelSurcharge}</strong>
                              <CustomTooltipTable
                                tableColumn={fuelSurchargeTooltipColumn}
                                tableData={[
                                  {
                                    variableFuelSurcharge: `₹ ${totalVariableFuelSurcharge}`,
                                    fixedFuelSurcharge: `₹ ${totalFixedFuelSurcharge}`,
                                  },
                                ]}
                              />
                            </div>
                          </div>
                          <div className="form-group input-wrap">
                            <div className="d-flex">
                              <label className="total-amount-content">
                                Total :
                              </label>
                            </div>
                            <div className="total-amount">
                              <img src="/images/rupee-black.svg" alt="" />{" "}
                              <strong>{totalAmount}</strong>
                            </div>
                          </div>
                          <div className="form-group input-wrap">
                            <div className="d-flex">
                              <label className="total-amount-content">
                                Deductions :
                              </label>
                            </div>
                            <div className="total-amount">
                              <Remove />
                              <img src="/images/rupee-red.svg" alt="" />
                              <strong className="red-text">{deductions}</strong>
                            </div>
                          </div>
                          {contractDetails.gstActive && (
                            <div className="form-group input-wrap">
                              <div className="d-flex">
                                <label className="total-amount-content">
                                  {"GST @" + contractDetails.gst + "%:"}
                                </label>
                              </div>
                              <div className="total-amount">
                                <img src="/images/rupee-black.svg" alt="" />
                                <strong>{gstAmount}</strong>
                              </div>
                            </div>
                          )}
                          <div className="form-group input-wrap total-payable">
                            <div className="d-flex">
                              <label className="total-amount-content blue-text">
                                Payable :
                              </label>
                            </div>
                            <div className="total-amount">
                              <img src="/images/rupee-blue.svg" alt="" />
                              <strong className="blue-text">{payable}</strong>
                            </div>
                          </div>
                          <div className="form-group text-right mt-2">
                            <>
                              {isBillable ? (
                                <Button
                                  buttonStyle="btn-blue"
                                  title="Generate Bill"
                                  loading={loading}
                                  leftIcon={<FileCopyOutlined />}
                                  onClick={async () => {
                                    // var check = checkUploadPod(podData)
                                    // if (check === true) {
                                    setLoading(true);
                                    let billParams: any = {
                                      entityId:
                                        orderDetails &&
                                        orderDetails.freightOrderCode,
                                      entityType: DocType.EBILL,
                                    };
                                    let billArray = await appDispatch(
                                      getDocList(billParams)
                                    );
                                    let params: any = getInvoiceParams(
                                      orderDetails,
                                      orderDetails.freightOrderCode,
                                      remarks,
                                      payable,
                                      transactions,
                                      totalAmount,
                                      deductions,
                                      transactionsResponse,
                                      contractDetails,
                                      billArray,
                                      podData
                                    );
                                    appDispatch(generateBill(params)).then(
                                      (response: any) => {
                                        response &&
                                          response.message &&
                                          appDispatch(
                                            showAlert(response.message)
                                          );
                                        response && history.goBack();
                                        setLoading(false);
                                      }
                                    );
                                    // } else {
                                    //     appDispatch(showAlert("Upload Pod for " + check, false))
                                    // }
                                  }}
                                />
                              ) : (
                                <InfoTooltip
                                  title={notBillableMessage}
                                  placement={"top"}
                                  customIcon={
                                    <Button
                                      buttonStyle="btn-blue disabled"
                                      title="Generate Bill"
                                      leftIcon={<FileCopyOutlined />}
                                    // disable={true}
                                    />
                                  }
                                />
                              )}
                            </>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )}
        </PageContainer>
      )}
    </div>
  );

  function getAmount(
    transactionsTotal: any,
    template: any,
    transactionsResponse: any,
    contractInfo: any
  ) {
    var total =
      (transactionsResponse &&
        transactionsResponse.baseFreightCharge &&
        Number(transactionsResponse.baseFreightCharge)) ||
      0;
    total =
      total +
      ((transactionsResponse &&
        transactionsResponse.distanceCharge &&
        Number(transactionsResponse.distanceCharge)) ||
        0);
    var deductionsTotal =
      (transactionsResponse &&
        transactionsResponse.debitCharge &&
        Number(transactionsResponse.debitCharge)) ||
      0;
    if (transactionsTotal && template) {
      for (let i = 0; i < transactionsTotal.length; i++) {
        for (const property in transactionsTotal[i]) {
          if (
            isNumber(transactionsTotal[i][property]) &&
            template.credit.includes(property)
          ) {
            total = total + transactionsTotal[i][property];
          } else if (
            isNumber(transactionsTotal[i][property]) &&
            template.debit.includes(property)
          ) {
            deductionsTotal = deductionsTotal + transactionsTotal[i][property];
          }
        }
      }
      total +=
        (transactionsResponse &&
          transactionsResponse.fixedFuelSurcharge &&
          Number(transactionsResponse.fixedFuelSurcharge)) ||
        0;
      var payableTotal = total - deductionsTotal;
      setTotalAmount(convertAmountToNumberFormat(total, floatFormatter));
      setDeductions(
        convertAmountToNumberFormat(deductionsTotal, floatFormatter)
      );
      setPayable(convertAmountToNumberFormat(payableTotal, floatFormatter));
      if (contractInfo && contractInfo.gstActive && contractInfo.gst) {
        getGstAmount(contractInfo.gst, payableTotal);
      }
    }
  }

  function getGstAmount(gst: any, total: any) {
    try {
      let gstvalue = convertAmountToNumberFormat(
        (gst / 100) * total,
        floatFormatter
      );
      setGSTAmount(convertAmountToNumberFormat(gstvalue, floatFormatter));
      setPayable(
        convertAmountToNumberFormat(total + Number(gstvalue), floatFormatter)
      );
    } catch (error) {
      return 0.0;
    }
  }

  // function checkUploadPod(podData: any) {
  //     for (let i = 0; i < podData.length; i++) {
  //         if (podData[i].uploaded === false) {
  //             return podData[i].shipmentCode
  //         }
  //     }
  //     return true
  // }
}
export default FreightReconciliationTripInvoice;
