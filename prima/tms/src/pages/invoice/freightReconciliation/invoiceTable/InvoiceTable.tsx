import { Publish, Visibility } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { disputeReasonTableColumn, podStatusEnum } from "../../../../base/constant/ArrayList";
import { tatLabelWithoutUnit } from '../../../../base/constant/MessageUtils';
import { convertHoursInDays } from '../../../../base/utility/DateUtils';
import FileAction from '../../../../component/fileAction/FileAction';
import { CustomTooltipTable } from '../../../../component/widgets/CustomToolTipTable';
import NumberEditText from '../../../../component/widgets/NumberEditText';
import { InfoTooltip } from '../../../../component/widgets/tooltip/InfoTooltip';
import EditBillModal from '../../EditBillModal';
import UploadBillModal from '../../UploadBillModal';
import UploadPodModal from '../../UploadPodModal';
import ViewAttachmentsModal from "../../ViewAttachmentsModal";
import ViewPodModal from "../../ViewPodModal";
import FileUploadedWarningModal from '../FileUploadedWarningModal';
import InvoiceShipmentModal from '../InvoiceShipmentModal';
import './InvoiceTable.css';

interface InvoiceTableProps {
    template: any,
    shipmentTransactionData: any,
    onChangeAmount: any,
    onChangePodData?: any
    id?: any,
    editable?: boolean,
    podData?: any
    viewPdf?: any
    onChangeBillData?: any,
    billData?: any,
    orderLogs?: any,
    setCharges?: any;
}

function InvoiceTable(props: InvoiceTableProps) {
    const [transactions, setTransactions] = React.useState<any>(undefined);
    const { template, shipmentTransactionData, onChangeAmount, id, editable, onChangePodData, podData, viewPdf, onChangeBillData, billData, orderLogs, setCharges } = props;
    const [shipmentModalData, setShipmentModalData] = React.useState<any>({});
    const [viewPod, setViewPod] = React.useState<boolean>(false);
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
    const [uploadPod, setUploadPod] = React.useState<boolean>(false);
    const [uploadBill, setUploadBill] = React.useState<boolean>(false);
    const [editBill, setEditBill] = React.useState<boolean>(false);
    const [shipmentId, setShipmentId] = React.useState<boolean>(false);
    const [csvFile] = React.useState<any>();
    const [openFileWarning, setOpenFileWarning] = React.useState<boolean>(false);
    const [fileType, setFileType] = React.useState<any>("");
    const [viewAttachments, setViewAttachments] = React.useState<any>(false)

    useEffect(() => {
        const getList = async () => {
            shipmentTransactionData && setTransactions(shipmentTransactionData)
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shipmentTransactionData]);

    return (
        <div className="invoice-table-wrap">
            <FileUploadedWarningModal
                open={openFileWarning}
                file={fileType}
                onClose={() => {
                    setOpenFileWarning(false);
                }}
                proceedAnyWay={() => {
                    fileType === "POD" ? setUploadPod(true) : setUploadBill(true);
                    setOpenFileWarning(false);
                }}
            />
            <InvoiceShipmentModal
                open={openPointModal}
                selectedElement={shipmentModalData}
                onSuccess={() => {
                    setOpenPointModal(false)
                }}
                onClose={() => {
                    setOpenPointModal(false)
                }}
            />

            <ViewPodModal
                shipmentId={shipmentId}
                open={viewPod}
                orderId={id}
                onClose={() => {
                    setViewPod(false);
                }} />
            <ViewAttachmentsModal
                shipmentId={shipmentId}
                open={viewAttachments}
                orderId={id}
                onClose={() => {
                    setViewAttachments(false);
                }} />
            <UploadPodModal
                open={uploadPod}
                shipmentId={shipmentId}
                orderId={id}
                file={csvFile}
                onApply={(value: any) => {
                    if (value) {
                        let tempPodData: any = podData
                        for (let i = 0; i < tempPodData.length; i++) {
                            if (tempPodData[i].shipmentCode === shipmentId) {
                                tempPodData[i].uploaded = true;
                                break;
                            }
                        }
                        onChangePodData(tempPodData)
                        setUploadPod(false);
                    }
                }}
                onClose={() => {
                    setUploadPod(false);
                }} />


            <UploadBillModal
                open={uploadBill}
                shipmentId={shipmentId}
                orderId={id}
                file={csvFile}
                flag={false}
                onApply={(value: any) => {
                    onChangeBillData(value)
                    setUploadBill(false);

                }}
                onClose={() => {
                    setUploadBill(false);
                }} />
            <EditBillModal
                shipmentId={shipmentId}
                open={editBill}
                orderId={id}
                flag={false}
                onEditClickHandler={() => {
                    setEditBill(false);
                    setUploadBill(true);
                }}
                editable={viewPdf}
                onClose={() => {
                    setEditBill(false);
                }} />

            <div className="table-scroll-container">
                <div className="table-scroll-area">
                    <div className="table-list-invoice">
                        {transactions && transactions.map((element: any, index: any) => (
                            <div className="table-body" key={index}>
                                <div className="table-info">
                                    <div className="row no-gutters flex-md-wrap flex-nowrap">
                                        <ul className="list-inline col list-line-1">
                                            <li className="list-inline-item"><small className="key">Shipment Code</small><span className="value">
                                                <span className="text blue-text"
                                                    onClick={() => {
                                                        setShipmentModalData({
                                                            freightOrderCode: id,
                                                            freightShipmentCode: element.shipmentDetails && element.shipmentDetails.shipmentCode
                                                        })
                                                        setOpenPointModal(true)
                                                    }}
                                                >{
                                                        <InfoTooltip
                                                            title={(element.shipmentDetails && element.shipmentDetails.shipmentCode) || "....."}
                                                            placement={"top"}
                                                            disableInMobile={"false"}
                                                            infoText={(element.shipmentDetails && element.shipmentDetails.shipmentCode) || "....."}
                                                        />
                                                    }{/*element.shipmentDetails && element.shipmentDetails.shipmentCode*/}
                                                </span>
                                            </span>
                                            </li>
                                            <li className="list-inline-item"><small className="key">Pickup Point</small><span className="value"><span className="text">{
                                                <InfoTooltip
                                                    title={((element.shipmentDetails && element.shipmentDetails.pickupPoint) || "NA") || "....."}
                                                    placement={"top"}
                                                    disableInMobile={"false"}
                                                    infoText={((element.shipmentDetails && element.shipmentDetails.pickupPoint) || "NA") || "....."}
                                                />
                                            }{/*8(element.shipmentDetails && element.shipmentDetails.pickupPoint) || "NA"*/}</span></span></li>
                                            <li className="list-inline-item"><small className="key">Drop Point</small><span className="value"><span className="text">{
                                                <InfoTooltip
                                                    title={((element.shipmentDetails && element.shipmentDetails.dropPoint) || "NA") || "....."}
                                                    placement={"top"}
                                                    disableInMobile={"false"}
                                                    infoText={((element.shipmentDetails && element.shipmentDetails.dropPoint) || "NA") || "....."}
                                                />
                                            }{/*(element.shipmentDetails && element.shipmentDetails.dropPoint) || "NA"*/}</span></span></li>
                                            <li className="list-inline-item"><small className="key">{tatLabelWithoutUnit}</small><span className="value"><span className="text">{(element.shipmentDetails && element.shipmentDetails.tat && convertHoursInDays(element.shipmentDetails.tat)) || "NA"}</span></span></li>
                                            <li className="list-inline-item"><small className="key">Detention</small><span className="value"><span className="text">{(element.shipmentDetails && element.shipmentDetails.detentionHours && convertHoursInDays(element.shipmentDetails.detentionHours)) || 0}</span></span></li>
                                            <li className="list-inline-item"><small className="key">Transporter</small><span className="value"><span className="text">{(element.shipmentDetails && element.shipmentDetails.partnerName) || "NA"}</span></span></li>
                                            <li className="list-inline-item"><small className="key">Vehicle No.</small><span className="value"><span className="text">{(element.shipmentDetails && element.shipmentDetails.vehicleRegistrationNumber) || "NA"}</span></span></li>
                                            <li className="list-inline-item"><small className="key">LR No.</small><span className="value"><span className="text">{
                                                <InfoTooltip
                                                    title={((element.shipmentDetails && element.shipmentDetails.lrNumber) || "NA") || "....."}
                                                    placement={"top"}
                                                    disableInMobile={"false"}
                                                    infoText={((element.shipmentDetails && element.shipmentDetails.lrNumber) || "NA") || "....."}
                                                />
                                            }</span></span></li>
                                            <li className="list-inline-item"><small className="key">Waybill No.</small><span className="value"><span className="text">{(element.shipmentDetails && element.shipmentDetails.airwaybillNumber) || "NA"}</span></span></li>
                                            {(element && element.disputeDetails && element.disputeDetails.length > 0) && <li className="list-inline-item"><small className="key">Dispute Reason</small><span className="value">
                                                <span className="text">{<CustomTooltipTable
                                                    tableColumn={disputeReasonTableColumn}
                                                    tableData={element?.disputeDetails}
                                                    customIcon={<img src="/images/dispute.svg" alt="dispute" />}
                                                />}</span></span></li>}
                                        </ul>
                                        <ul className="col-auto list-inline list-line-2 justify-content-end d-flex">


                                            {<li className="list-inline-item"><small className="key"><span>Attachments&nbsp;</span></small>
                                                <span className="value">
                                                    <span
                                                        className={(element.shipmentDetails && element.shipmentDetails.supportingDocsUploaded) ? "text blue-text" : "text gray-text"}
                                                        onClick={() => {
                                                            if (element.shipmentDetails && element.shipmentDetails.supportingDocsUploaded) {
                                                                setViewAttachments(true);
                                                                setShipmentId(element.shipmentDetails.shipmentCode)
                                                            }
                                                        }}
                                                    ><Visibility /> View
                                                    </span>
                                                </span>
                                            </li>}


                                            {(podData &&
                                                (<li className="list-inline-item"><small className="key">{checkIsEpod(element) ? (<span>ePOD&nbsp;{checkIsPodClean(element) ? <img src="/images/Success@2x.png" alt="sucess-img" /> : checkIsPodDisputed(element) ? <img src="/images/error@2x.png" alt="sucess-img" /> : ""}</span>) : "POD"}</small>
                                                    <span className="value">
                                                        <span
                                                            className={(podData[index] && podData[index].uploaded) ? "text blue-text" : "text gray-text"}
                                                            onClick={() => {
                                                                if (podData[index] && podData[index].uploaded) {
                                                                    setViewPod(true);
                                                                    setShipmentId(element.shipmentDetails.shipmentCode)
                                                                }
                                                            }}
                                                        ><Visibility /> View
                                                        </span>
                                                    </span>
                                                </li>)) ||
                                                (<li className="list-inline-item"><small className="key">POD</small>
                                                    <span className="value">
                                                        <span
                                                            className={"text blue-text"}
                                                            onClick={() => {
                                                                setViewPod(true);
                                                                setShipmentId(element.shipmentDetails.shipmentCode)
                                                            }}
                                                        ><Visibility /> View
                                                        </span>
                                                    </span>
                                                </li>)
                                            }
                                            <li className="list-inline-item"><small className="key">Bill</small>
                                                <span
                                                    className="value"
                                                >
                                                    <span
                                                        className={(
                                                            (
                                                                element.shipmentDetails &&
                                                                element.shipmentDetails.externalBillUploaded
                                                            ) ||
                                                            (
                                                                element.shipmentDetails &&
                                                                element.shipmentDetails.eBillSubNo
                                                            ) ||
                                                            (
                                                                billData &&
                                                                element.shipmentDetails &&
                                                                billData[element.shipmentDetails.shipmentCode]
                                                            )
                                                        ) ? "text blue-text" : "text gray-text"}

                                                        onClick={() => {
                                                            if (
                                                                (
                                                                    element.shipmentDetails &&
                                                                    element.shipmentDetails.externalBillUploaded
                                                                ) ||
                                                                (
                                                                    element.shipmentDetails &&
                                                                    element.shipmentDetails.eBillSubNo
                                                                ) ||
                                                                (
                                                                    billData &&
                                                                    element.shipmentDetails &&
                                                                    billData[element.shipmentDetails.shipmentCode]
                                                                )
                                                            ) {
                                                                setEditBill(true)
                                                                setShipmentId(element.shipmentDetails.shipmentCode)
                                                            }
                                                        }}
                                                    ><Visibility /> View
                                                    </span>
                                                </span>
                                            </li>
                                            {
                                                viewPdf && (
                                                    <li className="file-upload">
                                                        <FileAction
                                                            options={checkIsEpod(element) ? [
                                                                {
                                                                    menuTitle: "Upload Bill",
                                                                    Icon: Publish,
                                                                    onClick: () => {
                                                                        setFileType("Bill");
                                                                        element.shipmentDetails && setShipmentId(element.shipmentDetails.shipmentCode);
                                                                        if ((
                                                                            element.shipmentDetails &&
                                                                            element.shipmentDetails.externalBillUploaded
                                                                        ) ||
                                                                            (
                                                                                element.shipmentDetails &&
                                                                                element.shipmentDetails.eBillSubNo
                                                                            ) ||
                                                                            (
                                                                                billData &&
                                                                                element.shipmentDetails &&
                                                                                billData[element.shipmentDetails.shipmentCode]
                                                                            )) {
                                                                            setOpenFileWarning(true);
                                                                            return
                                                                        }
                                                                        setUploadBill(true);
                                                                    }
                                                                }
                                                            ] : [
                                                                {
                                                                    menuTitle: "Upload POD",
                                                                    Icon: Publish,
                                                                    onClick: () => {
                                                                        setFileType("POD");
                                                                        podData && podData[index] &&
                                                                            podData[index].uploaded ? setOpenFileWarning(true) : setUploadPod(true);
                                                                        element.shipmentDetails && setShipmentId(element.shipmentDetails.shipmentCode);
                                                                    }
                                                                },
                                                                {
                                                                    menuTitle: "Upload Bill",
                                                                    Icon: Publish,
                                                                    onClick: () => {
                                                                        setFileType("Bill");
                                                                        element.shipmentDetails && setShipmentId(element.shipmentDetails.shipmentCode);
                                                                        if ((
                                                                            element.shipmentDetails &&
                                                                            element.shipmentDetails.externalBillUploaded
                                                                        ) ||
                                                                            (
                                                                                element.shipmentDetails &&
                                                                                element.shipmentDetails.eBillSubNo
                                                                            ) ||
                                                                            (
                                                                                billData &&
                                                                                element.shipmentDetails &&
                                                                                billData[element.shipmentDetails.shipmentCode]
                                                                            )) {
                                                                            setOpenFileWarning(true);
                                                                            return
                                                                        }
                                                                        setUploadBill(true);
                                                                    }
                                                                },
                                                            ]}
                                                        />
                                                    </li>
                                                )
                                            }

                                        </ul>
                                    </div>

                                </div>
                                <ul className="list-inline table-li-body">
                                    {template && template.attributes && template.attributes.map((item: any, pos: any) => {
                                        return (
                                            <li className="li-item">
                                                <NumberEditText
                                                    label={item.description}
                                                    name={item.name}
                                                    placeholder="0.00"
                                                    maxLength={6}
                                                    decimalScale={2}
                                                    disabled={(item.edit) ? editable : true}
                                                    allowNegative={true}
                                                    value={transactions[index] && transactions[index][item.name]}
                                                    type='number'
                                                    onChange={(value: any) => {
                                                        let transactionCopy: any = []
                                                        transactionCopy = Object.assign(transactionCopy, transactions)
                                                        transactionCopy[index][item.name] = Number(value)
                                                        setTransactions(transactionCopy);
                                                        onChangeAmount(transactionCopy);
                                                        setCharges && setCharges(transactionCopy)
                                                    }}
                                                />
                                            </li>
                                        )

                                    })}
                                </ul>
                            </div>
                        ))}
                        <div className="table-body">
                            <ul className="list-inline table-li-body total-value">
                                {template && template.attributes && template.attributes.map((item: any, pos: any) => {
                                    return (
                                        <li className="li-item">
                                            <NumberEditText
                                                label={"Total " + item.description}
                                                name={item.name}
                                                placeholder="0.00"
                                                maxLength={6}
                                                decimalScale={2}
                                                allowNegative={true}
                                                disabled={true}
                                                value={getTotalAmount(item.name)}
                                                type='number'
                                                onChange={(value: any) => {
                                                }}
                                            />
                                        </li>
                                    )

                                })}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );

    function getTotalAmount(key: any) {
        let total = 0;
        transactions && transactions.forEach((item: any) => {
            total = total + (Number(item[key]) || 0)
        })
        return total
    }

    function checkIsPodClean(element: any) {
        if (element.shipmentDetails && element.shipmentDetails.podDetails && element.shipmentDetails.podDetails.statusCode === podStatusEnum.CLEAN) {
            return true;
        }
        return false;
    }

    function checkIsPodDisputed(element: any) {
        if (element.shipmentDetails && element.shipmentDetails.podDetails && element.shipmentDetails.podDetails.statusCode === podStatusEnum.DISPUTED) {
            return true;
        }
        return false;
    }

    function checkIsEpod(element: any) {
        if ((((element.shipmentDetails.podUploaded && element.shipmentDetails && element.shipmentDetails.podUploadedSource === "Consignee"))
            || (element.shipmentDetails && element.shipmentDetails.shipmentCode && orderLogs && orderLogs[element.shipmentDetails.shipmentCode] && orderLogs[element.shipmentDetails.shipmentCode].userType === "customer"))) {
            return true;
        }
        return false;
    }

}

export default InvoiceTable;