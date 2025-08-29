import { ArrowRightAlt, ClearAll } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { isNullValue, isNullValueOrZero, isObjectEmpty } from "../../../base/utility/StringUtils";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from '../../../component/widgets/NumberEditText';
import ModalContainer from "../../../modals/ModalContainer";
import { vehicleTypeElementData } from "../../../moduleUtility/VehicleTypeUtility";
import { hideLoader, showAlert } from '../../../redux/actions/AppActions';
import { createVehicleType } from '../../../serviceActions/VehicleTypeServiceActions';

interface CreateVehicleModalProps {
    open: boolean
    onClose: any
    onSuccess: any
    selectedElement: any,
}

function CreateVehicleModal(props: CreateVehicleModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, selectedElement, onSuccess } = props;
    let editMode = !isObjectEmpty(selectedElement);
    const [userParams, setUserParams] = React.useState<any>(vehicleTypeElementData);
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);

    useEffect(() => {
        editMode && setUserParams(selectedElement);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedElement]);

    return (
        <ModalContainer
            title={editMode ? "Vehicle Type Details" : "Create Vehicle Type"}
            primaryButtonTitle={editMode ? "Update" : "Create"}
            secondaryButtonTitle={editMode ? "" : "Clear"}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            loading={loading}
            open={open}
            onClose={() => {
                setUserParams(vehicleTypeElementData)
                setError({})
                onClose()
            }}
            onApply={() => {
                if (validateData()) {
                    setLoading(true);
                    appDispatch(createVehicleType(userParams, editMode)).then((response: any) => {
                        appDispatch(hideLoader())
                        if (response) {
                            setUserParams(vehicleTypeElementData);
                            setError({});
                            appDispatch(showAlert(response.message));
                            onSuccess();
                        }
                        setLoading(false);
                    })
                }
            }}
            onClear={() => {
                setUserParams(vehicleTypeElementData);
                setError({});
            }}
        >
            <div className="custom-form-row row align-items-end">
                <div className="form-group col-md-6">
                    <EditText
                        label="Type"
                        mandatory
                        placeholder="Enter Vehicle Type"
                        maxLength={20}
                        value={userParams.type}
                        error={error.type}
                        disabled={editMode}
                        onChange={(text: any) => {
                            setUserParams({
                                ...userParams,
                                type: text
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        label="Length (m)"
                        mandatory
                        placeholder="Enter Length"
                        maxLength={7}
                        value={userParams.length}
                        decimalScale={4}
                        allowNegative={false}
                        required
                        error={error.length}
                        type='number'
                        onChange={(text: any) => {
                            setUserParams({
                                ...userParams,
                                length: Number(text)
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        label="Breadth (m)"
                        mandatory
                        placeholder="Enter Breadth"
                        maxLength={7}
                        value={userParams.breadth}
                        decimalScale={4}
                        allowNegative={false}
                        required
                        error={error.breadth}
                        type='number'
                        onChange={(text: any) => {
                            setUserParams({
                                ...userParams,
                                breadth: Number(text)
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        label="Height (m)"
                        mandatory
                        placeholder="Enter Height"
                        maxLength={7}
                        value={userParams.height}
                        decimalScale={4}
                        allowNegative={false}
                        required
                        error={error.height}
                        type='number'
                        onChange={(text: any) => {
                            setUserParams({
                                ...userParams,
                                height: Number(text)
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        label="Weight Load Capacity (Kg)"
                        mandatory
                        placeholder="Enter Weight Load Capacity"
                        maxLength={6}
                        value={userParams.loadCapacity}
                        decimalScale={3}
                        allowNegative={false}
                        required
                        error={error.loadCapacity}
                        type='number'
                        onChange={(text: any) => {
                            setUserParams({
                                ...userParams,
                                loadCapacity: Number(text)
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        label="Volume Load Capacity (m³)"
                        mandatory
                        placeholder="Enter Volume Load Capacity"
                        maxLength={6}
                        value={userParams.volumeLoadCapacity}
                        decimalScale={3}
                        allowNegative={false}
                        required
                        error={error.volumeLoadCapacity}
                        type='number'
                        onChange={(text: any) => {
                            setUserParams({
                                ...userParams,
                                volumeLoadCapacity: Number(text)
                            });
                        }}
                    />
                </div>
            </div>
        </ModalContainer>
    );

    function validateData() {
        if (isNullValue(userParams.type)) {
            setError({
                type: "Enter valid Vehicle Type."
            });
            return false;
        } else if (isNullValueOrZero(userParams.length && userParams.length)) {
            setError({
                length: "Enter Length."
            });
            return false;
        } else if (isNullValueOrZero(userParams.breadth && userParams.breadth)) {
            setError({
                breadth: "Enter Breadth."
            });
            return false;
        } else if (isNullValueOrZero(userParams.height && userParams.height)) {
            setError({
                height: "Enter Height."
            });
            return false;
        } else if (isNullValueOrZero(userParams.loadCapacity && userParams.loadCapacity)) {
            setError({
                loadCapacity: "Enter Weight Load Capacity."
            });
            return false;
        } else if (isNullValueOrZero(userParams.volumeLoadCapacity && userParams.volumeLoadCapacity)) {
            setError({
                volumeLoadCapacity: "Enter Volume Load Capacity."
            });
            return false;
        }
        return true;

    }
}



export default CreateVehicleModal;
