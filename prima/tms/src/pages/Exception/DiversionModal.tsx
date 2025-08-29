import { TextareaAutosize } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import { isNullValue } from "../../base/utility/StringUtils";
import AutoSuggest from "../../component/widgets/AutoSuggest";
import EditText from "../../component/widgets/EditText";
import ModalContainer from "../../modals/ModalContainer";
import { autosuggestSearchLength } from "../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../moduleUtility/DataUtils";
import { showAlert } from "../../redux/actions/AppActions";
import { createDiversionRequest, getOrderList } from "../../serviceActions/OrderServiceActions";
import "./DiversionModal.css";

interface DiversionModalProps {
    open: boolean
    onClose: any
    onSuccess: any
}

function DiversionModal(props: DiversionModalProps) {
    const appDispatch = useDispatch()
    const { open, onClose, onSuccess } = props;
    const [params, setParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({})
    const [orderList, setOrderList] = React.useState<any>(undefined)
    const [loading, setLoading] = React.useState<boolean>(false)
    return (
        <ModalContainer
            title={'Diversion'}
            loading={loading}
            primaryButtonTitle={"YES"}
            secondaryButtonTitle={"NO"}
            onClear={() => {
                onClose()
            }}
            open={open}
            onClose={() => {
                setOrderList(undefined)
                setParams({})
                onClose();
                // onClear();
            }}
            onApply={() => {
                if (validateData()) {
                    // const queryParams = {
                    //     freightOrhderCode: params.freightOrderCode,
                    //     remarks: params.remarks
                    // }
                    setLoading(true)
                    appDispatch(createDiversionRequest(params)).then((response: any) => {
                        if (response) {
                            appDispatch(showAlert(response))
                            setParams({})
                            onSuccess()
                        }
                        setLoading(false)
                    })
                }
            }}
            styleName={'common-modal diversion-modal'}
        >
            <div>
                <div className="iconImg">
                    <img src="/images/diversion.png" alt="Diversion" />
                </div>
                <p>Are you sure want to Divert your Freight Order?</p>
                <div className="inputWrap">
                    <label>Freight Order Id </label>
                    <AutoSuggest
                        error={error.freightOrderCode}
                        placeHolder={"Freight Order Id"}
                        value={params.freightOrderCode}
                        handleSuggestionsFetchRequested={(value: any) => {
                            if (value.value.length > autosuggestSearchLength) {
                                appDispatch(getOrderList({ query: value.value })).then((response: any) => {
                                    if (response && response.results) {
                                        setOrderList(setAutoCompleteListWithData(response.results, 'freightOrderCode', 'freightOrderCode'))
                                    }
                                });
                            }
                        }}
                        onChange={(text: string) => {
                            setParams({
                                ...params,
                                freightOrderCode: text
                            });
                            setError({});
                        }}
                        suggestions={orderList}
                        maxLength={30}
                        label={""}
                        onSelected={(element: any) => {
                            setParams({
                                ...params,
                                freightOrderCode: element.value,
                                statusName: element.data?.statusName
                            });
                        }} />
                </div>
                <div className="inputWrap">
                    <label>Order Status </label>
                    <EditText
                        placeholder={"Order Status"}
                        value={params.statusName}
                        disabled={true}
                        onChange={() => {
                        }}
                        maxLength={15}
                    />
                </div>
                <div className="inputWrap textarea-input">
                    <label>Remarks</label>
                    <TextareaAutosize
                        rowsMin={4}
                        rowsMax={4}
                        aria-label="empty textarea"
                        placeholder="Remarks"
                        value={params.remarks}
                        onChange={(event: any) => {
                            setParams({
                                ...params,
                                remarks: event.target.value
                            })
                            setError({})
                        }}
                    />
                </div>
            </div>
        </ModalContainer>
    )
    function validateData() {
        if (isNullValue(params.freightOrderCode)) {
            setError({
                freightOrderCode: "Enter Freight Order Code"
            })
            return false;
        }
        return true
    }
}

export default DiversionModal;