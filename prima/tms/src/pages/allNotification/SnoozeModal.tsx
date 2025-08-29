import React, { useEffect } from "react";
import ModalContainer from "../../modals/ModalContainer";
import EditText from "../../component/widgets/EditText";
import { OptionType } from "../../component/widgets/widgetsInterfaces";
import AutoComplete from "../../component/widgets/AutoComplete";
import { useDispatch } from "react-redux";
import { getSnoozeReasons, postSnoozeReason } from "../../serviceActions/AlertServiceActions"
import { setAutoCompleteListWithData } from "../../moduleUtility/DataUtils";
import { isObjectEmpty } from "../../base/utility/StringUtils";
import { showAlert } from "../../redux/actions/AppActions";

interface SnoozeModalProps {
    open: boolean
    onClose: any
    selectedElement: any,
    onSuccess: any
}

function SnoozeModal(props: SnoozeModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, selectedElement, onSuccess } = props;
    const [userParams, setUserParams] = React.useState<any>({});
    const [reasonsResponse, setReasonsResponse] = React.useState<any>(undefined);
    const [loading, setLoading] = React.useState<boolean>(false);

    useEffect(() => {
        const getReasons = async () => {
            
            let queryParams: any = {
                alertType: selectedElement && selectedElement.alert_details && selectedElement.alert_details.type,
                enable: "true"
            }
            appDispatch(getSnoozeReasons(queryParams)).then((response: any) => {
                setReasonsResponse(setAutoCompleteListWithData(response, "reason", "id"))
            })
        }
        open && getReasons()
        // eslint-disable-next-line
    }, [open])

    return (
        <ModalContainer
            title="Snooze"
            styleName="stop-reporting-modal"
            primaryButtonTitle={"SUBMIT"}
            primaryButtonStyle="btn-orange ok-btn"
            primaryButtonDisable={isObjectEmpty(userParams) ? true : false}
            open={open}
            loading={loading}
            onApply={() => {
                setLoading(true);
                let queryParams: any = {
                    alertReasonId: userParams.data && userParams.data.value,
                    alertsId: selectedElement && selectedElement.alert_details && selectedElement.alert_details.id
                }
                appDispatch(postSnoozeReason(queryParams)).then((response: any) => {
                    if (response) {
                        response.message && appDispatch(showAlert(response.message));
                        onSuccess();
                        setUserParams({});
                    }
                    setLoading(false);
                })
            }}
            onClose={() => {
                onClose()
                setUserParams({})
            }}
        >
            <div className="custom-form-row row">
                <div className="form-group col-12">
                    <AutoComplete
                        label="Snooze Reason"
                        placeHolder="Select Field"
                        value={userParams.data}
                        options={reasonsResponse}
                        onChange={(value: OptionType) => {
                            setUserParams({
                                coolingPeriod: value.data && value.data.coolingPeriod,
                                data: value
                            })
                        }}
                    />
                </div>
                <div className="form-group col-12 ">
                    <EditText
                        label="Snooze Period (Minutes)"
                        placeholder="Snooze Period"
                        disabled
                        value={userParams.coolingPeriod}
                        maxLength={50}
                        onChange={(text: any) => {

                        }}
                    />
                </div>
            </div>
        </ModalContainer>
    );
}
export default SnoozeModal;
