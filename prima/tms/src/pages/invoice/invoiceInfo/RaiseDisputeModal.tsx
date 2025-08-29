import { TextareaAutosize } from '@material-ui/core';
import React from "react";
import { useDispatch } from "react-redux";
import { isNullValue } from "../../../base/utility/StringUtils";
import MultiSelect from "../../../component/widgets/MultiSelect";
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import ModalContainer from "../../../modals/ModalContainer";
import { createDispute } from '../../../serviceActions/BillGenerateServiceActions';
import "./RaiseDisputeModal.css";
interface CommentModalProps {
    open: boolean,
    onClose: any,
    onSuccess: any,
    billNo: any,
    orderDetails?: any,
    status: any
    reasonsList: Array<OptionType> | undefined,
}

function RaiseDisputeModal(props: CommentModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, billNo, orderDetails, reasonsList } = props;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});

    return (
        <ModalContainer
            title={"Raise Dispute"}
            open={open}
            loading={loading}
            primaryButtonTitle={"SUBMIT"}
            primaryButtonStyle="btn-orange ok-btn"
            primaryButtonDisable={userParams.reasons ? (userParams.reasons.length > 0 && userParams.reasons[0].value === "Others" && (userParams.comment ? (userParams.comment.length === 0) : true)) : true}
            onClose={() => {
                onClose()
                setUserParams({});
            }}
            onApply={() => {
                if (validate()) {
                    setLoading(true)
                    let multipleReasons: String | any = "";
                    userParams.reasons.forEach((reason: OptionType) => {
                        multipleReasons += reason.value + ",";
                    })
                    let queryParams = {
                        billNo: billNo,
                        clientName: orderDetails && orderDetails.clientName,
                        partner: {
                            name: orderDetails && orderDetails.partnerName,
                            code: orderDetails && orderDetails.partnerCode,
                        },
                        comment: userParams.comment,
                        reason: multipleReasons.slice(0, multipleReasons.length - 1),
                    }
                    appDispatch(createDispute(queryParams)).then((response: any) => {
                        // setRefresh((prev) => !prev);
                        if (response) {
                            props.onSuccess();
                            setUserParams({
                                ...userParams,
                                reasons: []
                            })
                        }
                        setLoading(false)
                    });
                }
            }}
            styleName={"comment-modal"}
        >
            <div className="row">
                <div className="form-group col-12">
                    {<MultiSelect
                        label={"Dispute Reason"}
                        mandatory
                        placeHolder={"Select Dispute Reason"}
                        value={userParams.reasons}
                        error={error.reasons}
                        options={reasonsList}
                        onChange={(element: Array<OptionType>) => {
                            let reasons = amendSelectedReasons(element)
                            setUserParams({
                                ...userParams,
                                reasons: reasons,
                            })
                            setError({})
                        }}
                    />}
                </div>
                <div className="form-group col-12 reporting-comment">
                    <label>Comments</label>
                    <TextareaAutosize
                        aria-label="minimum height"
                        rowsMax={3}
                        rowsMin={3}
                        placeholder="Type your message…"
                        defaultValue={userParams.comment}
                        onChange={(event: any) => {
                            setUserParams({
                                ...userParams,
                                comment: event.target.value
                            })
                        }}
                    />
                </div>
            </div>
        </ModalContainer>
    );

    function validate() {
        if (isNullValue(userParams.reasons)) {
            setError({ reasons: "Select Reason" });
            return;
        }
        return true
    }

    function amendSelectedReasons(reasons: Array<OptionType>) {
        if (reasons && reasons.length > 1 && reasons[0].value === "Others") {
            return reasons.slice(1);
        }
        else if (reasons && reasons.length > 1 && reasons[reasons.length - 1].value === "Others") {
            return reasons.slice(reasons.length - 1)
        }
        else {
            return reasons
        }
    }
}
export default RaiseDisputeModal;
