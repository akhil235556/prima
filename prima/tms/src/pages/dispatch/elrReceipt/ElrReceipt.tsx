import { KeyboardBackspace, PictureAsPdf } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { DispatchUrl } from '../../../base/constant/RoutePath';
import { convertDateFormat, displayDateFormatter } from '../../../base/utility/DateUtils';
import { printPdfFIle } from '../../../base/utility/PdfUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Filter from '../../../component/filter/Filter';
import Button from '../../../component/widgets/button/Button';
import { DocumentCell, DocumentHeader } from '../../../moduleUtility/DocumentUtils';
import { getELrData } from '../../../serviceActions/OrderServiceActions';
import { elrTableColumns } from '../../../templates/DocumentTemplates';
import './ElrReceipt.css';

function ElrReceipt() {
    let history = useHistory();
    const appDispatch = useDispatch();
    const [response, setELRData] = React.useState<any>(undefined);
    const [loading, setLoading] = React.useState<boolean>(false);
    const { freightOrderCode } = useParams<any>();
    const freightShipmentCode = new URLSearchParams(useLocation().search).get("shipmentCode");
    const enable = new URLSearchParams(useLocation().search).get("enable");

    useEffect(() => {
        const getLrData = async () => {
            setLoading(true);
            let queryParams: any = {
                freightOrderCode: freightOrderCode,
                freightShipmentCode: freightShipmentCode,
            }
            appDispatch(getELrData(queryParams)).then((response: any) => {
                setLoading(false);
                response && setELRData(response)
            });
        };
        freightOrderCode && getLrData();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        let unListen: any;
        if (enable) {
            unListen = history.listen((location: any) => {
                if (history.action === 'POP') {
                    history.replace(DispatchUrl)
                }
                setTimeout(() => {
                    unListen();
                })
            })
        }

    }, [enable, history])

    return (
        <div>
            <div className="filter-wrap">
                <Filter
                    pageTitle="E LR Receipt"
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : (enable ? "" : "Back")}
                    leftIcon={enable ? null : <KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                >
                    <Button
                        buttonStyle="btn-blue print-btn"
                        title={isMobile ? " " : "Print E LR"}
                        loading={loading}
                        leftIcon={<PictureAsPdf />}
                        onClick={() => {
                            printPdfFIle((document.getElementById("content") as HTMLInputElement).innerHTML)
                        }}
                    />
                </Filter>
            </div>

            <div className="receipt-wrapp">
                <div id="content" >
                    {response && response.map((data: any, index: number) => (
                        <div className="receipt-content">
                            <div className="table-responsive">
                                <table cellSpacing="20" cellPadding="0" style={{ margin: '0 auto', overflow: 'hidden', width: '1004px', maxWidth: '100 %', }}>
                                    <tr>
                                        <td>
                                            <table cellSpacing="0" cellPadding="0" style={{ width: '100%', marginBottom: '20px' }}>
                                                <tr>
                                                    <td valign='top'>
                                                        {/* Table Header */}
                                                        <table cellSpacing="0" cellPadding="0" style={{ width: '100%', marginBottom: '36px' }}>
                                                            <tr>
                                                                <td style={{ fontSize: '13px', fontWeight: (500), color: '#323232', textAlign: 'center' }}>
                                                                    <strong style={{ fontSize: '24px', lineHeight: '28px', marginBottom: '4px', display: 'block', textDecoration: 'underline', }}>
                                                                        CONSIGNMENT NOTE</strong> {getSubject(data.shipmentDetails)}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table cellSpacing="0" cellPadding="0" style={{ width: '100%', borderCollapse: 'separate', }}>
                                                            <tr>
                                                                <td valign='top' style={{ padding: '7px 10px 7px 10px', border: 'solid 1px #707070' }}>
                                                                    <strong style={{ fontSize: '13px', color: '#323232', fontWeight: (500) }}>Transporter Name &amp; Address</strong>
                                                                    <h3 style={{ margin: '12px 0 4px 0', fontSize: '13px', color: '#323232', textTransform: 'uppercase', fontWeight: (500) }}>
                                                                        {data.partnerDetails && data.partnerDetails.name}</h3>
                                                                    <p style={{ fontSize: '13px', color: '#323232', lineHeight: '15px', }}>
                                                                        {data.partnerDetails && data.partnerDetails.address} <br />
                                                                        {"Ph. " + ((data.partnerDetails && data.partnerDetails.phoneNumber) || "")}</p>

                                                                </td>
                                                                <td style={{ width: '15px' }}>&nbsp;</td>
                                                                <td valign='top' style={{ width: '230px', padding: '16px 10px 7px 14px', border: 'solid 1px #707070' }}>
                                                                    <p style={{ marginBottom: '10px', fontSize: '13px', color: '#323232', lineHeight: '15px', }}>
                                                                        {"GSTIN NO: " + ((data.partnerDetails && data.partnerDetails.gstinNumber) || "")}</p>
                                                                    <p style={{ fontSize: '13px', color: '#323232', lineHeight: '15px', }}>
                                                                        {"PAN NO: " + ((data.partnerDetails && data.partnerDetails.panNumber) || "")}</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td valign='top' style={{ height: '15px', }}></td>
                                                                <td valign='top' style={{ height: '15px', }}></td>
                                                                <td valign='top' style={{ height: '15px', }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td valign='top' style={{ height: '80px', padding: '7px 10px 7px 10px', border: 'solid 1px #707070' }}>
                                                                    <strong style={{ fontSize: '13px', color: '#323232', fontWeight: (500) }}>Consignor’s Name &amp; Address M/s.</strong>
                                                                    <h3 style={{ margin: '12px 0 4px 0', fontSize: '13px', color: '#323232', textTransform: 'uppercase', fontWeight: (500) }}>
                                                                        {data.consignorDetails && data.consignorDetails.name}</h3>
                                                                    <p style={{ fontSize: '13px', color: '#323232', lineHeight: '15px', }}>
                                                                        {data.consignorDetails && data.consignorDetails.locationName} <br />
                                                                        {data.consignorDetails && data.consignorDetails.address}</p>

                                                                </td>
                                                                <td style={{ width: '15px' }}>&nbsp;</td>
                                                                <td valign='top' style={{
                                                                    width: '230px', height: '80px', padding: '16px 10px 7px 14px',
                                                                    border: 'solid 1px #707070'
                                                                }}>
                                                                    <p style={{ marginBottom: '10px', fontSize: '13px', color: '#323232', lineHeight: '15px', }}>
                                                                        GSTIN NO.: {data.consignorDetails && data.consignorDetails.gstinNumber}</p>
                                                                    <p style={{ fontSize: '13px', color: '#323232', lineHeight: '15px', }}>{"PAN NO: " +
                                                                        ((data.consignorDetails && data.consignorDetails.panNumber) || "")}</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td valign='top' style={{ height: '15px', }}></td>
                                                                <td valign='top' style={{ height: '15px', }}></td>
                                                                <td valign='top' style={{ height: '15px', }}></td>
                                                            </tr>
                                                            <tr>
                                                                <td valign='top' style={{ height: '80px', padding: '7px 10px 7px 10px', border: 'solid 1px #707070' }}>
                                                                    <strong style={{ fontSize: '13px', color: '#323232', fontWeight: (500) }}>Consignee’s Name &amp; Address M/s.</strong>
                                                                    <h3 style={{ margin: '12px 0 4px 0', fontSize: '13px', color: '#323232', textTransform: 'uppercase', fontWeight: (500) }}>
                                                                        {data.consigneeDetails && data.consigneeDetails.name}</h3>
                                                                    <p style={{ fontSize: '13px', color: '#323232', lineHeight: '15px', }}>
                                                                        {data.consigneeDetails && data.consigneeDetails.locationName} <br />
                                                                        {data.consigneeDetails && data.consigneeDetails.address} </p>

                                                                </td>
                                                                <td style={{ width: '15px' }}>&nbsp;</td>
                                                                <td valign='top' style={{ width: '230px', height: '80px', padding: '16px 10px 7px 14px', border: 'solid 1px #707070' }}>
                                                                    <p style={{ marginBottom: '10px', fontSize: '13px', color: '#323232', lineHeight: '15px', }}>GSTIN NO.:
                                                                        {data.consigneeDetails && data.consigneeDetails.gstinNumber}</p>
                                                                    <p style={{ fontSize: '13px', color: '#323232', lineHeight: '15px', }}>{"PAN NO: " +
                                                                        ((data.consigneeDetails && data.consigneeDetails.panNumber) || "")}</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td style={{ width: '280px', paddingLeft: '18px', }}>
                                                        <table cellSpacing="0" cellPadding="0" style={{
                                                            width: '100%', borderCollapse: 'separate',
                                                            backgroundColor: '#ffffff', border: 'solid 1px #707070',
                                                        }}>
                                                            <tr>
                                                                <th colSpan={2} style={{
                                                                    padding: '13px 0 12px 0', backgroundColor: '#ebeff3', borderBottom: 'solid 1px #707070',
                                                                    fontSize: '13px', color: '#323232', fontWeight: (500), textAlign: 'center'
                                                                }}>{getSubject(data.shipmentDetails)}</th>
                                                            </tr>
                                                            <tr>
                                                                <td style={{
                                                                    padding: '11px 0 11px 15px', fontSize: '13px', color: '#454545', fontWeight: (500),
                                                                    borderBottom: 'solid 1px #707070',
                                                                }}>G. R. No.</td>
                                                                <td style={{
                                                                    width: '60%', padding: '11px 8px 11px 0', fontSize: '13px', color: '#133751', fontWeight: (500), lineHeight: '20px',
                                                                    borderBottom: 'solid 1px #707070',
                                                                }}>{(data && data.lrNumber) || ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{
                                                                    padding: '11px 0 11px 15px', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>DATED</td>
                                                                <td style={{
                                                                    width: '60%', padding: '11px 8px 11px 0', fontSize: '13px', color: '#133751',
                                                                    fontWeight: (500), lineHeight: '16px', borderBottom: 'solid 1px #707070',
                                                                }}>
                                                                    {data.createdAt && convertDateFormat(data.createdAt, displayDateFormatter)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{
                                                                    padding: '11px 0 11px 15px', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>FROM</td>
                                                                <td style={{
                                                                    width: '60%', padding: '11px 8px 11px 0', fontSize: '13px', color: '#133751',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>
                                                                    {data.fromLocation && data.fromLocation.locationName}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{
                                                                    padding: '13px 0 13px 15px', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>TO</td>
                                                                <td style={{
                                                                    width: '60%', padding: '11px 8px 11px 0', fontSize: '13px', color: '#133751',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>
                                                                    {data.toLocation && data.toLocation.locationName}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{
                                                                    padding: '11px 0 11px 15px', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>Bill / Invoice No.</td>
                                                                <td style={{
                                                                    width: '60%', padding: '11px 8px 11px 0', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>……………….</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{
                                                                    padding: '11px 0 11px 15px', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>VALUE</td>
                                                                <td style={{
                                                                    width: '60%', padding: '11px 8px 11px 0', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>……………….</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{
                                                                    padding: '11px 0 11px 15px', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>Weight(KG)</td>
                                                                <td style={{
                                                                    width: '60%', padding: '11px 8px 11px 0', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>{(data.shipmentDetails && data.shipmentDetails.totalShipmentWeight) ? data.shipmentDetails.totalShipmentWeight : '……………….'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{
                                                                    padding: '11px 0 11px 15px', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>Volume(M3)</td>
                                                                <td style={{
                                                                    width: '60%', padding: '11px 8px 11px 0', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>{(data.shipmentDetails && data.shipmentDetails.totalShipmentVolume) ? data.shipmentDetails.totalShipmentVolume : '……………….'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{
                                                                    padding: '11px 0 11px 15px', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>No of Packages.</td>
                                                                <td style={{
                                                                    width: '60%', padding: '11px 8px 11px 0', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>{(data.shipmentDetails && data.shipmentDetails.totalShipmentQuantity) ? data.shipmentDetails.totalShipmentQuantity : '……………….'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{
                                                                    padding: '11px 0 11px 15px', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>TRUCK NO</td>
                                                                <td style={{
                                                                    width: '60%', padding: '11px 8px 11px 0', fontSize: '13px', color: '#133751',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>
                                                                    {data.shipmentDetails && data.shipmentDetails.vehicleRegistrationNumber}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ padding: '11px 0 11px 15px', verticalAlign: 'top', fontSize: '13px', color: '#323232', fontWeight: (500), borderBottom: 'solid 1px #707070', }}>DRIVER INFO</td>
                                                                <td style={{
                                                                    width: '60%', padding: '11px 8px 11px 0', fontSize: '13px', color: '#133751', fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>{data.shipmentDetails && data.shipmentDetails.primaryDriverNumber}<br />
                                                                    {data.shipmentDetails && data.shipmentDetails.primaryDriverName}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{
                                                                    padding: '11px 0 11px 15px', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>SHIPMENT NO</td>
                                                                <td style={{
                                                                    width: '60%', padding: '11px 8px 11px 0', fontSize: '13px', color: '#133751',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>
                                                                    {data.freightShipmentCode}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{
                                                                    padding: '11px 0 11px 15px', fontSize: '13px', color: '#323232',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>DELIVERY NO</td>
                                                                <td style={{
                                                                    width: '60%', padding: '11px 8px 11px 0', fontSize: '13px', color: '#133751',
                                                                    fontWeight: (500), borderBottom: 'solid 1px #707070',
                                                                }}>
                                                                    {(data.shipmentDetails && data.shipmentDetails.shipmentRefId) ? data.shipmentDetails.shipmentRefId : '……………….'}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table cellSpacing="0" cellPadding="0" style={{ width: '100%', marginBottom: '12px' }}>
                                                <tr>
                                                    <td style={{ color: '#323232', textAlign: 'center' }}>
                                                        <strong style={{ fontSize: '18px', lineHeight: '18px', display: 'block', fontWeight: 500 }}>Consignment Details</strong>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td >

                                            <table cellSpacing="0" cellPadding="0" style={{ width: '100%', border: 'solid 1px #707070' }}>
                                                <DocumentHeader
                                                    headerList={elrTableColumns()}
                                                />
                                                <DocumentCell
                                                    cellData={(data && data.articleDetails) || [1, 2]}
                                                    template={elrTableColumns()}

                                                />
                                                <tr>

                                                    <td colSpan={2} style={{
                                                        borderRight: 'solid 1px #707070', borderTop: 'solid 1px #707070',
                                                        padding: '10px 15px 10px 60px', height: 40, color: '#323232', fontSize: '14px', fontWeight: 500
                                                    }}>Total :</td>
                                                    <td colSpan={1} style={{ borderTop: 'solid 1px #707070', borderRight: 'solid 1px #707070', padding: '10px 15px', height: 40 }}>{getTotalMaterialQty(data)}</td>
                                                    <td colSpan={1} style={{ borderTop: 'solid 1px #707070', borderRight: 'solid 1px #707070', padding: '10px 15px', height: 40 }}>{getTotalProductQty(data)}</td>
                                                    <td colSpan={1} style={{ borderTop: 'solid 1px #707070', padding: '10px 15px', height: 40 }}></td>
                                                </tr>

                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{
                                            padding: '40px 0px 0px 0px',
                                            fontWeight: (500), lineHeight: '14px', color: '#083654', textAlign: 'right',
                                        }}>
                                            Authorized Stamp & Signature
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )

    function getTotalMaterialQty(element: any) {
        if (element.articleDetails && element.articleDetails.length > 0) {
            var totalQty = 0;
            element.articleDetails && element.articleDetails.forEach((item: any) => {
                if (item.totalArticleCount) {
                    totalQty = totalQty + Number(item.totalArticleCount)
                }
            })
            return totalQty
        } else {
            return "";
        }
    }

    function getTotalProductQty(element: any) {
        if (element.articleDetails && element.articleDetails.length > 0) {
            var totalProductQty = 0;
            element.articleDetails && element.articleDetails.forEach((item: any) => {
                if (item.totalArticleQuantity) {
                    totalProductQty = totalProductQty + Number(item.totalArticleQuantity)
                }
            })
            return totalProductQty;
        } else {
            return "";
        }
    }
    function getSubject(shipmentDetails: any) {
        if (shipmentDetails && shipmentDetails.sourceType === "SO") {
            return `(Subject to ${shipmentDetails.originLocationName} Jurisdiction)`
        } else if (shipmentDetails && shipmentDetails.sourceType === "PO") {
            return `(Subject to ${shipmentDetails.destinationLocationName} Jurisdiction) `
        } else {
            return `(Subject to ______________ Jurisdiction)`
        }
    }
}


export default ElrReceipt;