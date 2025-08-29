import React from 'react';
import { convertDateFormat, displayDateTimeFormatter } from '../../../base/utility/DateUtils';
import './flashMessage.css';
interface FlashMessageProps {
    type: String;
    heading?: any;
    message: any;
    onClose: any;
    open: any;
}
const FlashMessage = ({
    message,
    open,
}: FlashMessageProps) => {
    return (
        open ? (
            <div className="row">
                <div className={`container-fluid`}>
                    <div className="media container-message">
                        <img src="/images/info-icon.png" className="mr-3 img-fluid" alt="" />
                        <div className="media-body">
                            <h6>{disputeReasonAmend()}</h6>
                            <span className="date-time">{message && message.createdAt && convertDateFormat(message.createdAt, displayDateTimeFormatter)}</span>
                            <p>{message && message.comment}</p>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    )
    function disputeReasonAmend() {
        let reasonArray = message && message.reason.split(",")
        let amendReasons = reasonArray && reasonArray.join(", ")
        return amendReasons
    }
}
export default FlashMessage;