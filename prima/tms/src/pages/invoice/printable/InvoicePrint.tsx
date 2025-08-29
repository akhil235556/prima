import React, { useEffect } from 'react';
import Filter from '../../../component/filter/Filter';
import { isMobile } from '../../../base/utility/ViewUtils';
import { KeyboardBackspace, PictureAsPdf } from '@material-ui/icons';
import Button from '../../../component/widgets/button/Button';
import {
    useHistory,
    useParams
} from "react-router-dom";
import OrderDetailsPrintable from './OrderDetailsPrintable';
import './InvoicePrint.css';
import PageContainer from '../../../component/pageContainer/PageContainer';
import InvoiceDetailsPrintable from './InvoiceDetailsPrintable';
import { useDispatch } from 'react-redux';
import { getInvoiceTemplateData, invoiceTransactions } from '../../../serviceActions/BillGenerateServiceActions';
import { orderDetail } from '../../../serviceActions/OrderServiceActions';
import { printPdfFIle } from '../../../base/utility/PdfUtils';



function InvoicePrint() {
    let history = useHistory();
    const { id } = useParams();
    const appDispatch = useDispatch();
    const [response, setResponse] = React.useState<any>({});
    const [loading, setLoading] = React.useState<any>();
    const [orderDetails, setOrderDetails] = React.useState<any>({});
    const [templateResponse, setTemplateResponse] = React.useState<any>();

    useEffect(() => {
        const getAllDetails = async () => {
            setLoading(true);
            let invoiceParams: any = {
                billNo: id
            }
            var promise = [appDispatch(invoiceTransactions(invoiceParams)), appDispatch(getInvoiceTemplateData())];
            Promise.all(promise).then((response: any) => {
                if (response && response.length >= 1) {
                    response[0] && response[0].details && setResponse(response[0].details)
                    response[1] && response[1].details && setTemplateResponse(response[1].details.fields);
                    if (response[0] && response[0].details && response[0].details.freightId) {
                        let orderParams: any = {
                            freightOrderCode: response[0].details.freightId
                        }
                        return appDispatch(orderDetail(orderParams));
                    }

                }
                setLoading(false);
            }).then((response: any) => {
                response && response.details && setOrderDetails(response.details[0]);
                setLoading(false);
            })
        }
        getAllDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="invoice-print-wrapper">
            <Filter
                pageTitle="Print"
                buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                buttonTitle={isMobile ? " " : "Back"}
                leftIcon={<KeyboardBackspace />}
                onClick={() => {
                    history.goBack();
                }}
            >
                <Button
                    buttonStyle="btn-orange"
                    title={isMobile ? "" : ("Print")}
                    loading={loading}
                    leftIcon={<PictureAsPdf />}
                    onClick={() => {
                        printPdfFIle((document.getElementById("content") as HTMLInputElement).innerHTML);
                    }}
                />

            </Filter>
            <PageContainer>
                <div id="content" className="table-responsive invoice-print-table" >
                    <table cellSpacing="0" cellPadding="0" style={{ width: '1004px', maxWidth: '100%', margin: 'auto' }}>
                        <tr>
                            <td style={{ width: '49%', verticalAlign: 'top', border: '1px solid #f9f9f9', }}>
                                <OrderDetailsPrintable
                                    orderDetails={orderDetails}
                                    remarks={response && response.remarks}
                                />

                            </td>
                            <td style={{ width: '3%' }}></td>
                            <td style={{ width: '48%', verticalAlign: 'top', border: '1px solid #f9f9f9', }}>
                                <InvoiceDetailsPrintable
                                    invoiceDetails={response}
                                    templateData={templateResponse}
                                />
                            </td>
                        </tr>
                    </table>
                </div>
            </PageContainer>
        </div>
    );
}
export default InvoicePrint;