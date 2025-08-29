import React, { useEffect } from 'react';
import { isNumber } from 'lodash';

interface InvoiceDetailsPrintableProps {
    invoiceDetails: any,
    templateData: any,
}


function InvoiceDetailsPrintable(props: InvoiceDetailsPrintableProps) {
    const { invoiceDetails, templateData } = props;
    const [totalAmount, setTotalAmount] = React.useState<any>();
    const [deductions, setDeductions] = React.useState<any>();
    const [payable, setPayable] = React.useState<any>();

    useEffect(() => {
        templateData && invoiceDetails && invoiceDetails.transactionData && getAmount(invoiceDetails.transactionData, templateData)
    }, [invoiceDetails, templateData]);

    return (
        <table cellSpacing="0" cellPadding="o" style={{ width: '100%' }}>
            <tr>
                <td colSpan={2} style={{ padding: '11px 25px', background: '#eaeff3', borderRadius: '4px 4px 0 0' }}>
                    <h4 style={{
                        marginBottom: 0,
                        fontSize: 17,
                        fontWeight: 400,
                        lineHeight: 1.21,
                        letterSpacing: '0.38px',
                        color: '#083654',
                    }}>Payment Information</h4>
                </td>
            </tr>
            <tr>
                <td>
                    <table cellSpacing="0" cellPadding="0" style={{ width: '100%' }}>
                        {templateData && templateData.attributes && templateData.attributes.map((item: any, index: any) => (
                            <tr style={{

                                background: '#fff',
                            }}>
                                <td style={{
                                    width: '50%', padding: '0 20px', fontSize: '13px', fontWeight: 'normal',
                                    borderBottom: '1px solid #eaeff3',
                                    lineHeight: 1.15,
                                    letterSpacing: '0.26px',
                                    color: '#083654',
                                    height: '48px',
                                    textAlign: 'right',
                                    verticalAlign: 'midle',
                                }}>{item.description + " :"}
                                </td>
                                <td style={{
                                    letterSpacing: '0.26px', padding: '0 20px',
                                    borderBottom: '1px solid #eaeff3',
                                    verticalAlign: 'midle',
                                }}>
                                    <div style={{
                                        height: 34,
                                        border: 'solid 1px #cad3dd',
                                        padding: '0 15px',
                                        width: 150,
                                        lineHeight: '34px',
                                        color: '#083654',
                                        fontSize: 14,
                                    }}>
                                        <img src="/images/rupee.svg" alt="rupee" style={{ marginRight: 7, width: '8px', height: '12px', verticalAlign: 'middle' }} />
                                        {(invoiceDetails.transactionData && invoiceDetails.transactionData[item.name]) || "0.00"}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        <tr style={{
                            background: '#eaeff3',
                        }}>
                            <td style={{
                                borderBottom: '1px solid #f9f9f9',
                                padding: '0 20px', fontSize: 14, fontWeight: 500,
                                lineHeight: 1.15,
                                letterSpacing: '0.26px',
                                color: '#083654',
                                height: '48px',
                                textAlign: 'right',
                            }}>Total Amount :</td>
                            <td style={{
                                letterSpacing: '0.26px', padding: '0 20px 0 20px', fontSize: 17, fontWeight: 500,
                                color: '#083654',
                                borderBottom: '1px solid #f9f9f9',
                            }}>
                                <img src="/images/rupee-black.svg" alt="rupee" style={{ marginRight: 7, }} />
                                {totalAmount}
                            </td>
                        </tr>
                        <tr style={{
                            background: '#eaeff3',
                        }}>
                            <td style={{
                                width: '50%', padding: '0 20px', fontSize: 14, fontWeight: 500,
                                lineHeight: 1.15,
                                letterSpacing: '0.26px',
                                color: '#083654',
                                height: '48px',
                                textAlign: 'right',
                                borderBottom: '1px solid #f9f9f9',
                            }}>Deductions :</td>
                            <td style={{
                                width: '50%', letterSpacing: '0.26px', padding: '0 20px 0 20px', fontSize: 17, fontWeight: 500,
                                color: '#f72f1e',
                                borderBottom: '1px solid #f9f9f9',
                            }}>
                                <img src="/images/rupee-red.svg" alt="rupee" style={{ marginRight: 7 }} />
                                {deductions}
                            </td>
                        </tr>
                        <tr style={{
                            background: '#eaeff3',
                        }}>
                            <td style={{
                                width: '50%', padding: '0 20px', fontSize: 16, fontWeight: 500,
                                lineHeight: 1.15,
                                letterSpacing: '0.26px',
                                color: '#006cc9',
                                height: '48px',
                                textAlign: 'right',
                                borderBottom: '1px solid #f9f9f9',
                            }}>Payable :</td>
                            <td style={{
                                width: '50%', letterSpacing: '0.26px', padding: '0 20px 0 20px', fontSize: 20, fontWeight: 500,
                                color: '#006cc9',
                                borderBottom: '1px solid #f9f9f9',
                            }}>
                                <img src="/images/rupee-blue.svg" alt="rupee" style={{ marginRight: 7 }} />
                                {payable}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

    );

    function getAmount(transactionsTotal: any, template: any) {
        var total = 0, deductionsTotal = 0;
        for (const property in transactionsTotal) {
            if (isNumber(transactionsTotal[property]) && template && template.credit && template.credit.includes(property)) {
                total = total + transactionsTotal[property];
            } else if (isNumber(transactionsTotal[property]) && template && template.debit && template.debit.includes(property)) {
                deductionsTotal = deductionsTotal + transactionsTotal[property];
            }
        }
        var payableTotal = total - deductionsTotal;
        setTotalAmount(total.toFixed(2));
        setDeductions(deductionsTotal.toFixed(2));
        setPayable(payableTotal.toFixed(2));
    }

}
export default InvoiceDetailsPrintable;