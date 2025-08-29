import { Collapse } from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { invoiceNumberLabel } from "../../../base/constant/MessageUtils";

import EditText from "../../../component/widgets/EditText";
import TableList from "../../../component/widgets/tableView/TableList";
import ModalContainer from "../../../modals/ModalContainer";
import { showAlert } from "../../../redux/actions/AppActions";
import { addArticleInvoice } from "../../../serviceActions/OrderServiceActions";
import { invoiceTableColumns } from "../../../templates/DispatchTemplates";

interface InvoiceShipmentModalProps {
  open: boolean;
  onClose: any;
  onSuccess: any;
  selectedShipmentDetails: any;
}
function InvoiceShipmentModal(props: InvoiceShipmentModalProps) {
  const appDispatch = useDispatch();
  const { open, onClose, selectedShipmentDetails, onSuccess } = props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [shipmentDetails, setShipmentDetails] = React.useState<any>();

  React.useEffect(() => {
    let modalShipmentdetails = selectedShipmentDetails?.map((shipment: any) =>
      shipment?.articleDetails.length === 1 &&
      Object.keys(shipment?.articleDetails[0]).length === 0
        ? {
            ...shipment,
            shipmentInvoiceNumber: shipment.shipmentInvoiceNumber
              ? shipment.shipmentInvoiceNumber
              : "",
          }
        : (function () {
            let newArticles = shipment?.articleDetails.map(
              (article: any, index: number) => ({
                ...article,
                invoiceNumber: article.invoiceNumber
                  ? article.invoiceNumber
                  : "",
                index: index,
              })
            );

            return { ...shipment, articleDetails: newArticles };
          })()
    );
    setShipmentDetails(modalShipmentdetails);
    // eslint-disable-next-line
  }, [open]);
  return (
    <ModalContainer
      title={"Material and Quantity"}
      open={open}
      styleName="material-and-quantity--modal"
      loading={loading}
      onClose={() => {
        onClose();
      }}
      primaryButtonTitle={"Save"}
      primaryButtonStyle={"btn-blue"}
      onApply={() => {
        setLoading(true);
        let params = {};
        let articleInvoiceDetails: Array<any> = [];
        let freightOrderCode;
        shipmentDetails?.map((shipment: any) => {
          freightOrderCode = shipment.freightOrderCode;
          let articles;
          shipment?.articleDetails.length === 1 &&
          Object.keys(shipment?.articleDetails[0]).length === 0
            ? (articles = [
                {
                  freightShipmentCode: shipment.freightShipmentCode,
                  invoiceNumber: shipment.shipmentInvoiceNumber,
                },
              ])
            : (articles = shipment.articleDetails.map((article: any) => {
                return {
                  articleCode: article.articleCode,
                  freightShipmentCode: shipment.freightShipmentCode,
                  invoiceNumber: article.invoiceNumber,
                  productSku: article.productSku,
                };
              }));
          articleInvoiceDetails = [...articleInvoiceDetails, ...articles];
        });
        params = {
          articleInvoiceDetails: articleInvoiceDetails,
          freightOrderCode: freightOrderCode,
        };

        appDispatch(addArticleInvoice(params)).then((response: any) => {
          if (response) {
            if (response) {
              response.message && appDispatch(showAlert(response.message));
              onSuccess();
            }
          }
          setLoading(false);
        });
      }}

    >
      <div className="order-detail-wrapper shipment-detail-wrap">
        {shipmentDetails?.map((element: any, index: number) => (
          <>
            <div className="shipment-modal-header">
              <h4>
                <span>Shipment Code:</span> {element.freightShipmentCode}
              </h4>
              {element?.articleDetails.length === 1 &&
              Object.keys(element?.articleDetails[0]).length === 0 ? (
                <EditText
                  label={""}
                  placeholder={invoiceNumberLabel}
                  maxLength={20}
                  value={element.shipmentInvoiceNumber}
                  onChange={(value: any) => {
                    element.shipmentInvoiceNumber = value;
                    let tempShipmentDetails = [...shipmentDetails];
                    tempShipmentDetails[index] = element;
                    setShipmentDetails(tempShipmentDetails);
                  }}
                />
              ) : (
                <span
                  onClick={() => {
                    let shipmentList = shipmentDetails?.map(
                      (innerElement: any) => {
                        return innerElement.freightShipmentCode ===
                          element.freightShipmentCode
                          ? {
                              ...innerElement,
                              showDetails: innerElement.showDetails
                                ? !innerElement.showDetails
                                : true,
                            }
                          : {
                              ...innerElement,
                              showDetails: false,
                            };
                      }
                    );
                    setShipmentDetails(shipmentList);
                  }}
                >
                  {element.showDetails === true ? <Remove /> : <Add />}
                </span>
              )}
            </div>
            {!(
              element?.articleDetails.length === 1 &&
              Object.keys(element?.articleDetails[0]).length === 0
            ) && (
              <Collapse in={element.showDetails} timeout="auto" unmountOnExit>
                <div className="table-detail-listing">
                <TableList
                  listData={element.articleDetails}
                  rowsPerPage={20}
                  rowsPerPageOptions={[]}
                  currentPage={0}
                  tableColumns={invoiceTableColumns(
                    onChangeShipmentValues,
                    element.freightShipmentCode
                  )}
                  onChangePage={() => {}}
                  onChangeRowsPerPage={() => {}}
                />
                </div>
              </Collapse>
            )}
          </>
        ))}
      </div>
    </ModalContainer>
  );

  function onChangeShipmentValues(
    value: any,
    shipmentCode: String,
    index: any
  ) {
    let allShipments = shipmentDetails?.map((currentShipment: any) =>
      currentShipment.freightShipmentCode === shipmentCode
        ? (function () {
            currentShipment.articleDetails[index].invoiceNumber = value;
            return currentShipment;
          })()
        : currentShipment
    );
    setShipmentDetails(allShipments);
  }
}

export default InvoiceShipmentModal;
