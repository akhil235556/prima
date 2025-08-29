import React, { useEffect } from 'react';
import './Epod.css';
import { useDispatch } from 'react-redux';
import { PictureAsPdf, KeyboardBackspace } from "@material-ui/icons";
import Filter from '../../../component/filter/Filter';
import Button from '../../../component/widgets/button/Button';
import { useHistory, useParams } from "react-router-dom";
import { isMobile } from '../../../base/utility/ViewUtils';
import { getEpodData } from '../../../serviceActions/OrderServiceActions';
import { printPdfFIle } from '../../../base/utility/PdfUtils';
import { epodTableColumns } from '../../../templates/DocumentTemplates';
import { DocumentHeader, DocumentCell } from '../../../moduleUtility/DocumentUtils';
import { convertDateFormat, displayDateTimeFormatter } from '../../../base/utility/DateUtils';
import { FreightType } from '../../../base/constant/ArrayList';

function Epod() {
    const appDispatch = useDispatch();
    let history = useHistory();
    const { id, freightShipmentCode } = useParams();
    const [data, setEpodData] = React.useState<any>({});
    const [unloadingCharge, setUnloadingCharge] = React.useState<any>();
    const [otherCharge, setOtherCharge] = React.useState<any>();
    const [remarks, setRemarks] = React.useState<any>("");

    useEffect(() => {

        const getTemplate = async () => {
            // setLoading(true);
            let queryParams: any = {
                freightOrderCode: id,
                freightShipmentCode: freightShipmentCode
            }
            appDispatch(getEpodData(queryParams)).then((response: any) => {
                // setLoading(false);
                if (response) {
                    setEpodData(response);
                    response.freightCharges && response.freightCharges.forEach((item: any) => {
                        if (item.chargeName === "unloading_charge") {
                            item.amount && setUnloadingCharge(item.amount)
                        }
                        if (item.chargeName === "other_charge") {
                            item.amount && setOtherCharge(item.amount)
                        }
                    })
                }

            })
        }
        getTemplate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="epod-wrapper">
            <div className="filter-wrap">
                <Filter
                    pageTitle="Epod"
                    buttonStyle="btn-detail back-btn"
                    buttonTitle="Back"
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                >
                    <Button
                        buttonStyle="btn-orange print-btn"
                        title={isMobile ? " " : "Print"}
                        leftIcon={<PictureAsPdf />}
                        onClick={() => {
                            printPdfFIle((document.getElementById("content") as HTMLInputElement).innerHTML)
                        }}
                    />
                </Filter>
            </div>

            <div className="epod-container">
                <div id="content" className="epod-content">
                    <div className="table-responsive">
                        <table cellSpacing="20" cellPadding="0" style={{ width: '100%' }}>
                            <tr>
                                <td>
                                    <table cellSpacing="0" cellPadding="0" style={{ width: '100%', marginBottom: '33px' }}>
                                        <tr>
                                            <td valign='top'>
                                                {/* Table Header */}
                                                <table cellSpacing="0" cellPadding="0" style={{ width: '100%', marginBottom: '36px' }}>
                                                    <tr>
                                                        <td style={{ fontSize: '13px', fontWeight: (500), color: '#323232', textAlign: 'center' }}>
                                                            <strong style={{ fontSize: '24px', lineHeight: '28px', marginBottom: '4px', display: 'block', fontWeight: 500, textDecoration: 'underline', }}>CONSIGNMENT NOTE</strong>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <table cellSpacing="0" cellPadding="0" style={{ width: '100%', borderCollapse: 'separate', }}>
                                                    <tr>
                                                        <td valign='top' style={{ width: '49%', padding: '7px 10px 7px 10px', border: 'solid 1px #707070' }}>
                                                            <strong style={{ fontSize: '13px', color: '#323232', fontWeight: (500) }}>Transporter Name &amp; Address</strong>
                                                            <h3 style={{ margin: '10px 0 4px 0', fontSize: '13px', color: '#323232', textTransform: 'uppercase', fontWeight: (500) }}>
                                                                {data.partnerDetails && data.partnerDetails.name}</h3>
                                                            <p style={{ fontSize: '13px', color: '#323232', lineHeight: '15px', }}>
                                                                {data.partnerDetails && data.partnerDetails.address}</p>
                                                            <p style={{ fontSize: '13px', color: '#323232', lineHeight: '15px', }}>
                                                                {"Ph. " + ((data.partnerDetails && data.partnerDetails.phoneNumber) || "")}
                                                            </p>
                                                        </td>
                                                        <td style={{ width: '15px' }}>&nbsp;</td>
                                                        <td valign='top' style={{ width: '49%', padding: '20px', border: 'solid 1px #707070' }}>
                                                            <table cellSpacing="0" cellPadding="0" style={{ width: '100%', borderCollapse: 'separate', }}>
                                                                <tr>
                                                                    <td valign='top' style={{ paddingRight: '15px' }}>
                                                                        <p style={{ marginBottom: 10, fontSize: '12px', fontWeight: 500, color: '#323232' }}>
                                                                            <strong style={{ paddingRight: '15px' }}>GSTIN NO :</strong>
                                                                            {data && data.partnerDetails && data.partnerDetails.gstinNumber}
                                                                        </p>
                                                                        <p style={{ marginBottom: 10, fontSize: '12px', fontWeight: 500, color: '#323232' }}>
                                                                            <strong style={{ paddingRight: '15px' }}>PAN NO :</strong>
                                                                            {data && data.partnerDetails && data.partnerDetails.panNumber}
                                                                        </p>
                                                                        <p style={{ marginBottom: 10, fontSize: '12px', fontWeight: 500, color: '#323232' }}>
                                                                            <strong style={{ paddingRight: '15px' }}>
                                                                                {"Ref No.: " + ((data.orderDetails && data.orderDetails.referenceId) || "")}
                                                                            </strong>
                                                                        </p>
                                                                        <p style={{ marginBottom: 10, fontSize: '12px', fontWeight: 500, color: '#323232' }}>
                                                                            <strong style={{ paddingRight: '15px' }}>Date :
                                                                            {data.orderDetails && data.orderDetails.createdAt &&
                                                                                    convertDateFormat(data.orderDetails.createdAt, displayDateTimeFormatter)}
                                                                            </strong>
                                                                        </p>
                                                                    </td>
                                                                    <td valign='top' style={{}}>
                                                                        <p style={{ marginBottom: 10, fontSize: '12px', fontWeight: 500, color: '#323232' }}>
                                                                            <strong style={{ paddingRight: '15px' }}>Vehicle Reg No :</strong>
                                                                            {data && data.vehicleDetails && data.vehicleDetails.vehicleRegistrationNumber}
                                                                        </p>
                                                                        <p style={{ marginBottom: 10, fontSize: '12px', fontWeight: 500, color: '#323232' }}>
                                                                            <strong style={{ paddingRight: '15px' }}>Freight Type :</strong>
                                                                            {data && data.orderDetails && data.orderDetails.freightTypeCode}
                                                                        </p>
                                                                        {data && data.orderDetails && data.orderDetails.freightTypeCode && FreightType.FTL &&
                                                                            <p style={{ marginBottom: 10, fontSize: '12px', fontWeight: 500, color: '#323232' }}>
                                                                                <strong style={{ paddingRight: '15px' }}>Vehicle Type :</strong>
                                                                                {data && data.shipmentDetails && data.shipmentDetails.vehicleTypeName}
                                                                            </p>
                                                                        }
                                                                    </td>

                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td valign='top' style={{ height: '15px', }}></td>
                                                        <td valign='top' style={{ height: '15px', }}></td>
                                                        <td valign='top' style={{ height: '15px', }}></td>
                                                    </tr>
                                                    <tr>
                                                        <td valign='top' style={{ height: '80px', padding: '7px 10px 7px 10px', border: 'solid 1px #707070' }}>
                                                            <strong style={{ fontSize: '13px', color: '#323232' }}>Consignor Name &amp; Address</strong>
                                                            <h3 style={{ margin: '12px 0 4px 0', fontSize: '13px', color: '#323232', textTransform: 'uppercase', fontWeight: (500) }}>
                                                                {data.consignorDetails && data.consignorDetails.name}</h3>
                                                            <p style={{ fontSize: '13px', color: '#323232', lineHeight: '15px', }}>
                                                                {data.consignorDetails && data.consignorDetails.locationName} <br />
                                                                {data.consignorDetails && data.consignorDetails.address}</p>
                                                        </td>

                                                        <td style={{ width: '15px' }}>&nbsp;</td>
                                                        <td valign='top' style={{ height: '80px', padding: '7px 10px 7px 10px', border: 'solid 1px #707070' }}>
                                                            <strong style={{ fontSize: '13px', color: '#323232' }}>Consignee Name &amp; Address</strong>
                                                            <h3 style={{ margin: '12px 0 4px 0', fontSize: '13px', color: '#323232', textTransform: 'uppercase', fontWeight: (500) }}>
                                                                {data.consigneeDetails && data.consigneeDetails.name}</h3>
                                                            <p style={{ fontSize: '13px', color: '#323232', lineHeight: '15px', }}>
                                                                {data.consigneeDetails && data.consigneeDetails.locationName} <br />
                                                                {data.consigneeDetails && data.consigneeDetails.address} </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td valign='top' style={{ height: '15px', }}></td>
                                                        <td valign='top' style={{ height: '15px', }}></td>
                                                        <td valign='top' style={{ height: '15px', }}></td>
                                                    </tr>

                                                </table>
                                                <table cellSpacing="0" cellPadding="0" style={{ width: '100%', borderCollapse: 'separate', }}>
                                                    <tr>
                                                        <td valign='top' style={{
                                                            height: '40px', width: '500px',
                                                            padding: '0px 10px', border: 'solid 1px #707070', borderRight: 'none', lineHeight: '40px'
                                                        }}>
                                                            <p style={{ marginBottom: 0, fontSize: '12px', fontWeight: 500, color: '#323232' }}>
                                                                <strong style={{ paddingRight: '15px' }}>Vehicle Reported In Date and Time :</strong>
                                                                {data.shipmentDetails && data.shipmentDetails.destinationGateInTime
                                                                    && convertDateFormat(data.shipmentDetails.destinationGateInTime, displayDateTimeFormatter)}
                                                            </p>
                                                        </td>
                                                        <td valign='top' style={{ height: '40px', padding: '0px 10px', border: 'solid 1px #707070', borderLeft: 'none', lineHeight: '40px' }}>
                                                            <p style={{ marginBottom: 0, fontSize: '12px', fontWeight: 500, color: '#323232' }}>
                                                                <strong style={{ paddingRight: '15px' }}>Vehicle Unloading Date and Time :</strong>
                                                                {data.shipmentDetails && data.shipmentDetails.destinationGateOutTime &&
                                                                    convertDateFormat(data.shipmentDetails.destinationGateOutTime, displayDateTimeFormatter)}
                                                            </p>

                                                        </td>

                                                    </tr>
                                                </table>
                                            </td>

                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            {/* Table Heading */}
                            <tr>
                                <td>
                                    <table cellSpacing="0" cellPadding="0" style={{ width: '100%', marginBottom: '12px' }}>
                                        <tr>
                                            <td style={{ color: '#323232', textAlign: 'center' }}>
                                                <strong style={{ fontSize: '18px', lineHeight: '18px', display: 'block', fontWeight: 500 }}>Good Receipt Details</strong>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            {/* table data */}
                            <tr>
                                <td >
                                    <table cellSpacing="0" cellPadding="0" style={{ width: '100%', borderCollapse: 'separate', border: 'solid 1px #707070' }}>
                                        <DocumentHeader
                                            headerList={epodTableColumns()}
                                        />
                                        <DocumentCell
                                            cellData={(data && data.articleDetails) || [1, 2]}
                                            template={epodTableColumns()}

                                        />
                                        <tr>
                                            <td colSpan={2} style={{ borderTop: 'solid 1px #707070', padding: '10px 15px', height: 40 }}></td>
                                            <td colSpan={2} style={{ borderRight: 'solid 1px #707070', borderTop: 'solid 1px #707070', padding: '10px 15px 10px 60px', height: 40, color: '#323232', fontSize: '14px', fontWeight: 500 }}>Total :</td>
                                            <td colSpan={3} style={{ borderTop: 'solid 1px #707070', padding: '10px 15px', height: 40 }}></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td >
                                    <table cellSpacing="0" cellPadding="0" style={{ width: '100%', borderCollapse: 'separate', border: 'solid 1px #707070', marginTop: '11px' }}>
                                        <tr>
                                            <td style={{ borderRight: 'solid 1px #707070', padding: '20px', fontSize: 11 }}>
                                                <p><strong>Unloading Charges:</strong> {unloadingCharge}</p>
                                            </td>
                                            <td style={{ borderRight: 'solid 1px #707070', padding: '20px', fontSize: 11 }}>
                                                <p><strong>Other Charges:</strong> {otherCharge}</p>
                                            </td><td style={{ borderRight: 'solid 1px #707070', padding: '20px', fontSize: 11 }}>
                                                <strong>Paid To MR.</strong>
                                            </td><td style={{ padding: '20px', fontSize: 11 }}>
                                                <strong>Mobile No.:</strong>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td style={{ padding: '10px 0', fontSize: '12px', color: '#768a9e' }}>
                                    Delivery at: We are not responsible for leakage, Breakage & Damage for <br /> Liquid drum and ..
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table cellSpacing="0" cellPadding="0" style={{ width: '100%' }}>
                                        <tr>
                                            <td style={{ verticalAlign: 'top', }}>
                                                <label style={{ fontSize: '12px', fontWeight: (500), paddingRight: 10, color: '#083654', margin: 0, verticalAlign: "top" }}>Remarks:</label>
                                                <textarea
                                                    id="remark"
                                                    style={{ width: 330, padding: '0 10px', height: 32, border: 'solid 1px #707070;' }}
                                                    value={remarks}
                                                    onChange={(event: any) => {
                                                        setRemarks(event.target.value)
                                                    }}
                                                />

                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td style={{ fontSize: '12px', fontWeight: (500), lineHeight: '14px', color: '#083654', textAlign: 'right', }}>
                                    Consignee Stamp & Signature
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className='text-right mt-3'>
                    <Button
                        buttonStyle="btn-orange"
                        title="Print"
                        leftIcon={<PictureAsPdf />}
                        onClick={() => {
                            printPdfFIle((document.getElementById("content") as HTMLInputElement).innerHTML)
                        }}
                    />
                </div>
            </div>


        </div >
    );

}
export default Epod;