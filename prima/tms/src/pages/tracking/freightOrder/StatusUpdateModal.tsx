import React from "react";
import './ShipmentDetail.css'
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import ModalContainer from "../../../modals/ModalContainer";
import EditText from "../../../component/widgets/EditText";
import { TextareaAutosize } from "@material-ui/core";
import AutoComplete from '../../../component/widgets/AutoComplete';
import { useDispatch } from "react-redux";
import { setAutoCompleteList } from '../../../moduleUtility/DataUtils';
import { getSubStatusList, scanStatus } from "../../../serviceActions/ShipmentServiceActions"
import { isNullOrUndefined } from "util";
import { showAlert } from "../../../redux/actions/AppActions";

interface StatusUpdateModalProps {
    open: boolean
    onClose: any
    selectedElement: any,
    onSuccess: any
}

function StatusUpdateModal(props: StatusUpdateModalProps) {
    const { open, onClose, selectedElement, onSuccess } = props;
    const [userParams, setUserParams] = React.useState<any>({});
    const [subStatusArray, setSubStatusArray] = React.useState<any>([]);
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState(false);
    const appDispatch = useDispatch();

    return (
        <ModalContainer
            title="Status Update"
            styleName="stop-reporting-modal"
            primaryButtonTitle={"SUBMIT"}
            primaryButtonStyle="btn-orange ok-btn"
            open={open}
            loading={loading}
            onApply={() => {
                if (validate()) {
                    setLoading(true);
                    let queryParams: any = {
                        shipmentCode: selectedElement.shipmentCode,
                        statusCode: userParams.statusCode.value,
                        subStatusCode: userParams.subStatusCode.value,
                        address: userParams.address,
                        remarks: userParams.remarks
                    }
                    appDispatch(scanStatus(queryParams)).then((response: any) => {
                        if (response) {
                            response.message && appDispatch(showAlert(response.message));
                            setUserParams({})
                            setError({})
                            onSuccess();
                        }
                        setLoading(false);
                    })
                }
            }}
            onClose={() => {
                onClose()
                setUserParams({})
            }}
        >
            <div className="row">
                {selectedElement.latest && selectedElement.latest.status &&
                    <div className="form-group col-12">
                        <EditText
                            label="Current Status"
                            // mandatory
                            placeholder="Current Status"
                            disabled={true}
                            value={selectedElement.latest && selectedElement.latest.status}
                            maxLength={50}
                            onChange={() => {

                            }}
                        />
                    </div>}
                <div className="form-group col-12">
                    <AutoComplete
                        label={"Status"}
                        mandatory
                        placeHolder={"Select Status"}
                        value={userParams.statusCode}
                        error={error.statusCode}
                        options={selectedElement.statusList}
                        onChange={(element: OptionType) => {
                            setUserParams({
                                ...userParams,
                                statusCode: element,
                                subStatusCode: undefined
                            })
                            setSubStatusArray([]);
                            subStatusList(element.value)
                            setError({})
                        }}
                    />
                </div>
                <div className="form-group col-12">
                    <AutoComplete
                        label={"Sub Status"}
                        mandatory
                        placeHolder={"Select Sub Status"}
                        value={userParams.subStatusCode}
                        error={error.subStatusCode}
                        options={subStatusArray}
                        onChange={(element: OptionType) => {
                            setUserParams({
                                ...userParams,
                                subStatusCode: element
                            })
                            setError({})
                        }}
                    />
                </div>
                <div className="form-group col-12">
                    <EditText
                        label="Address"
                        mandatory
                        placeholder="Enter Address"
                        value={userParams.address}
                        error={error.address}
                        maxLength={50}
                        onChange={(text: any) => {
                            setUserParams({
                                ...userParams,
                                address: text
                            })
                            setError({})
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
                        // value={userParams.remarks}
                        defaultValue={userParams.remarks}
                        onChange={(event: any) => {
                            setUserParams({
                                ...userParams,
                                remarks: event.target.value
                            })
                            setError({})
                        }}
                    />
                </div>
            </div>
        </ModalContainer>
    );

    function subStatusList(code: any) {
        appDispatch(getSubStatusList({ statusCode: code })).then((response: any) => {
            response && setSubStatusArray(setAutoCompleteList(response, "description", "code"))
        })
    }

    function validate() {
        if (isNullOrUndefined(userParams.statusCode)) {
            setError({
                statusCode: "Enter Status"
            });
            return false;
        } else if (isNullOrUndefined(userParams.subStatusCode)) {
            setError({
                subStatusCode: "Enter Sub Status"
            });
            return false;
        } else if (isNullOrUndefined(userParams.address)) {
            setError({
                address: "Enter Address"
            });
            return false;
        }
        return true;
    }
}
export default StatusUpdateModal;
