import React from "react";
import './VehicleTracking.css'
import ModalContainer from "../../modals/ModalContainer";
import { DateTimePicker } from "@material-ui/pickers";
import { displayDateTimeFormatter, convertDateTimeServerFormat } from "../../base/utility/DateUtils";
import { TextareaAutosize } from "@material-ui/core";

interface ReportingTimeModalProps {
    open: boolean
    onClose: any
    selectedElement: any,
    loading: any
    onSuccess: any
}

function ReportingTimeModal(props: ReportingTimeModalProps) {
    const { open, onClose, selectedElement, onSuccess, loading } = props;
    const [userParams, setUserParams] = React.useState<any>({});

    return (
        <ModalContainer
            title="Report Vehicle"
            styleName="stop-reporting-modal"
            // secondaryButtonTitle={"SUBMIT"}
            primaryButtonTitle={"SUBMIT"}
            primaryButtonStyle="btn-orange ok-btn"
            loading={loading}
            open={open}
            onApply={() => {
                onSuccess(userParams, selectedElement.index, selectedElement.element);
                setUserParams({})
            }}
            onClose={() => {
                onClose()
                setUserParams({})
            }}
        >
            <div className="row">
                <div className="form-group col-12">
                    <label className="picker-label">{"Reporting Date and Time"}<span className="mandatory-flied">*</span></label>
                    <DateTimePicker
                        className="custom-date-picker"
                        placeholder="Enter Date and Time"
                        hiddenLabel
                        minDate={selectedElement.element && selectedElement.element.tripStartTime}
                        disableFuture
                        format={displayDateTimeFormatter}
                        value={userParams.tripEndTime || new Date()}
                        onChange={(date: any) => {
                            setUserParams({
                                ...userParams,
                                tripEndTime: convertDateTimeServerFormat(date)
                            })
                        }}
                    />
                </div>
                <div className="form-group col-12 reporting-comment">
                    <label>Comments</label>
                    <TextareaAutosize
                        rowsMax={3}
                        rowsMin={3}
                        aria-label="maximum height"
                        placeholder="Comments"
                        // value={userParams.comments}
                        defaultValue={userParams.comments}
                        onChange={(event: any) => {
                            setUserParams({
                                ...userParams,
                                comments: event.target.value
                            })
                        }}
                    />
                </div>
            </div>
        </ModalContainer>
    );
}
export default ReportingTimeModal;
