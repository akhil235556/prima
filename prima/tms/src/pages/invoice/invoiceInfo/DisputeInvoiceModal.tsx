import { ArrowRightAlt, Clear } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { isNullValue } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import ExpendableCardList from "../../../component/widgets/cardlist/ExpendableCardList";
import TableCollapseList from "../../../component/widgets/tableView/tableCollapseList/TableCollapseList";
import ModalContainer from "../../../modals/ModalContainer";
import { showAlert } from "../../../redux/actions/AppActions";
import { setDefaultExpandRowIndex } from "../../../redux/actions/FreightReconciliationAction";
import { createDisputeV2, disputeModalOrderDetails } from "../../../serviceActions/BillGenerateServiceActions";
import { disputeModalTableColumns } from "../../../templates/InvoiceTemplates";
import DisputeChildTable from "./DisputeChildTable";
import "./DisputeInvoiceModal.css";

interface DisputeInvoiceModalProps {
  open: boolean
  onClose: any
  onSuccess?: any
  billNo: any
  disputeDetails: any,
  reasonsList?: any
  stateDispatcher?: any,
  freightId?: any,
  isPeriodic?: boolean,
}
function DisputeInvoiceModal(props: DisputeInvoiceModalProps) {
  const { open, onClose, onSuccess, billNo, reasonsList, disputeDetails, stateDispatcher, freightId, isPeriodic } = props;
  const appDispatch = useDispatch();
  const [orderList, setOrderList] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [shipmentList, setShipmentList] = React.useState<any>([]);
  const [disputeDetailsArray, setDisputeDetailsArray] = React.useState<any>([{ index: 0 }]);

  useEffect(() => {
    const getList = () => {
      const params = {
        billNo: billNo,
        freightId: freightId ? freightId : disputeDetails.freightId
      }
      setLoading(true);
      appDispatch(disputeModalOrderDetails(params)).then((response: any) => {
        if (response) {
          const tempDisputeArray: any = [];
          let index = 0;
          response[0]?.shipmentDisputeDetails?.forEach((element: any) => {
            if (element.reason || element.comment) {
              tempDisputeArray.push({
                index: index,
                shipmentData: {
                  label: element.freightShipmentCode,
                  value: element.freightShipmentCode,
                },
                reasonData: {
                  label: element.reason,
                  value: element.reason
                },
                comment: element.comment
              })
              index++;
            }
          })
          tempDisputeArray?.length > 0 && setDisputeDetailsArray(tempDisputeArray)
          setOrderList(response);
          const tempShipmentArray: any = [];
          response[0]?.freightShipmentCodes?.forEach((item: any) => {
            tempShipmentArray.push({
              label: item,
              value: item
            })
          })
          response[0] && setShipmentList(tempShipmentArray)
        }
        setLoading(false);
      })
    }
    open && getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <ModalContainer
      title={"Dispute Freight Bill"}
      open={open}
      primaryButtonTitle="Save"
      primaryButtonStyle="btn-blue"
      primaryButtonLeftIcon={<ArrowRightAlt />}
      secondaryButtonTitle="Clear"
      secondaryButtonStyle="btn-orange"
      secondaryButtonLeftIcon={<Clear />}
      onClear={clearData}
      onClose={() => {
        clearData()
        onClose()
      }}
      loading={loading}
      onApply={() => {
        const validate: any = disputeDetails.isDisputed ? validateOnUpdateReasons() : validateOnAddReasons();
        if (validate === true) {
          setLoading(true);
          const tempShipmentDetails: any = disputeDetailsArray?.map((item: any) => {
            let tempShipmentObject: any = {}
            tempShipmentObject.comment = item?.comment;
            tempShipmentObject.freightShipmentCode = item?.shipmentData?.value;
            tempShipmentObject.reason = item?.reasonData?.value
            if (tempShipmentObject.freightShipmentCode !== undefined) {
              return tempShipmentObject
            }
          })

          const createDisputeParams: any = {
            billNo: billNo,
            freightId: freightId ? freightId : disputeDetails.freightId,
            shipmentDisputeDetails: tempShipmentDetails,
          }
          appDispatch(createDisputeV2(createDisputeParams)).then((response: any) => {
            if (response) {
              response.message && isPeriodic && appDispatch(showAlert(response.message));
              onSuccess();
              onClose();
              clearData();
            }
            setLoading(false)
          })
        } else {
          setDisputeDetailsArray(validate)
        }
        setLoading(false);
      }}
      styleName="dispute--modal"
    >
      {loading ? <CardContentSkeleton
        row={1}
        column={3}
      /> :
        <div>
          {isMobile ? (
            <ExpendableCardList
              listData={orderList}
              tableColumns={disputeModalTableColumns(onClickLaneCode)}
              childElementKey={"dispute-modal"}
            />
          ) : (
            <div className="table-detail-listing">
              <TableCollapseList
                currentPage={1}
                rowsPerPage={25}
                rowsPerPageOptions={rowsPerPageOptions}
                listData={orderList}
                tableColumns={disputeModalTableColumns(onClickLaneCode)}
                onChangePage={() => { }}
                onChangeRowsPerPage={() => { }}
                collapseCustomView={true}
                onClickIconButton={onClickIconButton}
                expandRowIndex={1}
              >
                <DisputeChildTable
                  shipmentList={shipmentList}
                  reasonsList={reasonsList}
                  isDisputed={disputeDetails.isDisputed}
                  disputeDetailsArray={disputeDetailsArray}
                  onChangeReason={(element: any, reasonIndex: any) => {
                    const disputeTempArray = disputeDetailsArray?.map((item: any) => (
                      item.index === reasonIndex ? {
                        ...item,
                        commentError: "",
                        reasonError: "",
                        shipmentError: "",
                        reasonData: {
                          label: element.label,
                          value: element.value
                        }
                      } : item
                    ))
                    setDisputeDetailsArray(disputeTempArray)
                  }}
                  onChangeShipment={(element: any, shipmentIndex: any) => {
                    const disputeTempArray = disputeDetailsArray?.map((item: any) => (
                      item.index === shipmentIndex ? {
                        ...item,
                        commentError: "",
                        reasonError: "",
                        shipmentError: "",
                        shipmentData: {
                          label: element.label,
                          value: element.value
                        }
                      } : item
                    ))
                    setDisputeDetailsArray(disputeTempArray)
                  }}
                  onChangeComment={(element: any, commentIndex: any) => {
                    const disputeTempArray = disputeDetailsArray?.map((item: any) => (
                      item.index === commentIndex ? {
                        ...item,
                        commentError: "",
                        reasonError: "",
                        shipmentError: "",
                        comment: element
                      } : item
                    ))
                    setDisputeDetailsArray(disputeTempArray)
                  }}
                  onAdd={() => {
                    const disputeTempArray = [...disputeDetailsArray];
                    disputeTempArray.push({ index: disputeTempArray.length })
                    setDisputeDetailsArray(disputeTempArray)
                  }}
                  onRemove={(removeRowIndex: any) => {
                    const disputeTempArray = disputeDetailsArray.filter((item: any) => item.index !== removeRowIndex).map((element: any, index: number) => ({
                      ...element,
                      index: index
                    }));
                    setDisputeDetailsArray(disputeTempArray)
                  }}
                />
              </TableCollapseList>
            </div>
          )}
        </div>}
    </ModalContainer>
  );

  function clearData() {
    setDisputeDetailsArray([{ index: 0 }])
  }

  function onClickIconButton(element: any) {
    stateDispatcher(setDefaultExpandRowIndex(element.rowIndex))
  }

  function onClickLaneCode(element: any) {

  }

  function validateOnAddReasons() {
    let isError = false;
    const errorDisputeDetailsArray = disputeDetailsArray.map((element: any) => {
      if (isNullValue(element.shipmentData)) {
        isError = true;
        element.shipmentError = "Select Shipment";
      }
      if (isNullValue(element.reasonData)) {
        isError = true;
        element.reasonError = "Select Reason";
      }
      if (element?.reasonData?.label === 'Others' && (isNullValue(element.comment) || element.comment === "")) {
        isError = true;
        element.commentError = "Enter Comment";
      }
      return element;
    })
    if (isError) {
      return errorDisputeDetailsArray;
    } else {
      return true;
    }
  }
  function validateOnUpdateReasons() {
    let isError = false;
    disputeDetailsArray?.map((element: any) => {
      if (!(isNullValue(element.shipmentData) && isNullValue(element.reasonData) && (isNullValue(element.comment) || element.comment === ""))) {
        isError = true
      }
    })
    if (isError) {
      return validateOnAddReasons()
    } else {
      return true
    }
  }
}

export default DisputeInvoiceModal;