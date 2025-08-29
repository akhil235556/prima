import React from "react";
import './VehicleTracking.css'
import ModalContainer from "../../modals/ModalContainer";
import NumberEditText from "../../component/widgets/NumberEditText";
import EditText from "../../component/widgets/EditText";
import { useDispatch } from 'react-redux';
import { editDriverDetails } from '../../serviceActions/TrackingServiceActions';
import { isNullValue, isNullValueOrZero } from "../../base/utility/StringUtils";
// import { showAlert } from "../../redux/actions/AppActions";

interface EditDriverModalProps {
    open: boolean
    onClose: any
    selectedElement: any,
    onSuccess: any
}

function EditDriverModal(props: EditDriverModalProps) {
    const { open, onClose, selectedElement, onSuccess } = props;
    const appDispatch = useDispatch();
    const [userParams, setUserParams] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [changed, setChanged] = React.useState<boolean>(true);
    const [error, setError] = React.useState<any>({});

    React.useEffect(() => {
        if (open && selectedElement) {
            setChanged(true)
            setUserParams({
                driverName: selectedElement.driverName,
                driverNumber: selectedElement.driverNumber
            });
        }
        // eslint-disable-next-line
    }, [open]);

    return (
        <ModalContainer
            title="Driver Information"
            styleName="stop-reporting-modal"
            primaryButtonTitle={"SUBMIT"}
            primaryButtonStyle="btn-orange ok-btn"
            primaryButtonDisable={changed}
            loading={loading}
            open={open}
            onApply={() => {
                if (validateData()) {
                    setLoading(true);
                    let queryParams: any = {
                        driverName: userParams.driverName,
                        driverNumber: userParams.driverNumber,
                        tripCode: selectedElement.tripCode
                    }
                    appDispatch(editDriverDetails(queryParams)).then((response: any) => {
                        setLoading(false);
                        if (response) {
                            // response.message && appDispatch(showAlert(response.message))
                            onSuccess();
                            setUserParams({})
                        }
                    })
                }
            }}
            onClose={() => {
                onClose()
                setUserParams({})
            }}
        >
            <div className="row">
                <div className="form-group col-12">
                    <EditText
                        label={"Driver Name"}
                        mandatory
                        placeholder={"Enter Driver Name"}
                        maxLength={30}
                        error={error.driverName}
                        value={userParams && userParams.driverName}
                        onChange={(text: any) => {
                            setChanged(false)
                            setUserParams({
                                ...userParams,
                                driverName: text
                            });
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group col-12">
                    <NumberEditText
                        label={"Driver Number"}
                        mandatory
                        placeholder={"Enter Driver Number"}
                        maxLength={10}
                        allowNegative={false}
                        required
                        decimalSeparator={false}
                        error={error.driverNumber}
                        type='number'
                        value={userParams && userParams.driverNumber}
                        onChange={(text: any) => {
                            setChanged(false)
                            setUserParams({
                                ...userParams,
                                driverNumber: text
                            });
                            setError({});
                        }}
                    />
                </div>
            </div>
        </ModalContainer>
    );

    function validateData() {
        if (isNullValue(userParams.driverName)) {
            setError({
                driverName: "Enter Driver Name"
            });
            return false;
        } else if (isNullValueOrZero(userParams.driverNumber)) {
            setError({
                driverNumber: "Enter Driver Number"
            });
            return false;
        }
        return true;

    }
}
export default EditDriverModal;
