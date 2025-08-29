import React from 'react';
import { orderDetailsTemplate } from '../../../templates/InvoiceTemplates';

interface OrderDetailsPrintableProps {
    orderDetails: any
    remarks: any
}


function OrderDetailsPrintable(props: OrderDetailsPrintableProps) {
    const { orderDetails, remarks } = props;
    return (
        <table cellSpacing="0" cellPadding="0" style={{ width: '100%' }}>
            <tr>
                <td colSpan={2} style={{ padding: '11px 25px', background: '#eaeff3', borderRadius: '4px 4px 0 0' }}>
                    <h4 style={{
                        marginBottom: 0,
                        fontSize: 17,
                        fontWeight: 400,
                        lineHeight: 1.21,
                        letterSpacing: '0.38px',
                        color: '#083654',
                    }}>Freight Information</h4>
                </td>
            </tr>
            <tr>
                <td>
                    <table cellSpacing="0" cellPadding="0" style={{ width: '100%' }}>
                        {orderDetailsTemplate().map((element: any, index: any) => (

                            <tr style={{
                                background: '#fff',
                            }}>
                                <td style={{
                                    width: '50%', padding: '15px 20px 15px 20px', fontSize: '13px', fontWeight: 'normal',
                                    lineHeight: 1.15,
                                    letterSpacing: '0.26px',
                                    color: '#083654',
                                    textAlign: 'right',
                                    borderBottom: '1px solid #eaeff3',
                                }}>{element.label}
                                </td>
                                <td style={{
                                    padding: '15px 20px 15px 20px', fontSize: '13px', fontWeight: 'normal',
                                    lineHeight: 1.15,
                                    letterSpacing: '0.26px',
                                    color: '#083654',
                                    borderBottom: '1px solid #eaeff3',
                                }}>
                                    {element.format ? element.format(orderDetails[element.id]) : orderDetails[element.id]}</td>
                            </tr>
                        ))}
                        <tr>
                            {remarks && <td colSpan={2} style={{ padding: '16px 0 0 0', }}>
                                <span style={{
                                    marginBottom: '10px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: '#768a9e',
                                    lineHeight: 1.17,
                                    letterSpacing: '0.24px',
                                    display: 'block',
                                }}
                                >Remark</span>
                                <div style={{
                                    height: '70px',
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '4px',
                                    border: '1px solid #cad3dd',
                                    padding: '14px',
                                    fontSize: '13px',
                                    lineHeight: '16px',
                                    color: ' #083654',
                                }}>
                                    {remarks}
                                </div>

                            </td>
                            }
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

    );

}
export default OrderDetailsPrintable;