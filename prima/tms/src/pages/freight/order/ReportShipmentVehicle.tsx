import { DateTimePicker } from '@material-ui/pickers';
import React from "react";
import { useDispatch } from "react-redux";
import { errorFutureDateTimeError } from '../../../base/constant/MessageUtils';
import { convertDateTimeServerFormat, displayDateTimeFormatter, isDateGreater } from '../../../base/utility/DateUtils';
import { isNullValue } from '../../../base/utility/StringUtils';
import ModalContainer from "../../../modals/ModalContainer";
import { showAlert } from "../../../redux/actions/AppActions";
import { shipmentReport } from '../../../serviceActions/OrderServiceActions';
import './MarkDelivered.css';

interface CreateJobsModalProps {
    open: boolean;
    onClose: any;
    onApply: any;
    freightOrderCode: any,
    freightShipmentCode: any,
}

function ReportShipmentVehicle(props: CreateJobsModalProps) {
    const { open, onClose, onApply, freightOrderCode, freightShipmentCode } = props;
    const appDispatch = useDispatch();
    const [dateTime, setDateTime] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    return (
        <ModalContainer
            title={"Report Vehicle"}
            primaryButtonTitle={"Submit"}
            primaryButtonStyle="btn-orange"
            open={open}
            loading={loading}
            onClose={onClose}
            onApply={() => {
                if (isNullValue(dateTime)) {
                    setError({ dateTime: "Enter valid Date and Time" });
                    return;
                } else if (dateTime && isDateGreater(dateTime, new Date())) {
                    setError({ dateTime: errorFutureDateTimeError });
                    return
                }
                setLoading(true);
                let params: any = {
                    destinationGateInTime: convertDateTimeServerFormat(dateTime),
                    freightOrderCode: freightOrderCode,
                    freightShipmentCodes: [freightShipmentCode],
                }
                appDispatch(shipmentReport(params)).then((response: any) => {
                    response && response.message && appDispatch(showAlert(response.message));
                    response && onApply();
                    setLoading(false);
                })
            }}
            styleName="initiate-planning-modal"
        >
            <div className="form-group">
                <label className="picker-label">{"Reporting Date and Time"}</label>
                <DateTimePicker
                    className="custom-date-picker"
                    hiddenLabel
                    disableFuture
                    placeholder="Expected Date"
                    helperText={error.dateTime}
                    format={displayDateTimeFormatter}
                    value={dateTime}
                    onChange={(date: any) => {
                        setDateTime(date)
                    }}
                />
            </div>
        </ModalContainer>
    );

}

export default ReportShipmentVehicle;
