import { ArrowRightAlt, ClearAll } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { locationTypeLabel, locationTypePlaceHolder } from "../../../base/constant/MessageUtils";
import { isNullValue } from '../../../base/utility/StringUtils';
import AutoComplete from "../../../component/widgets/AutoComplete";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import ModalContainer from "../../../modals/ModalContainer";
import { getStringAutoCompleteData } from "../../../moduleUtility/DataUtils";
import { showAlert } from '../../../redux/actions/AppActions';
import { enableUserlocationType, getAllLocationTypeList } from "../../../serviceActions/LocationServiceActions";
import './LocationTypeModal.css';
interface LocationTypeModalProps {
    open: boolean
    onClose: any
    onSuccess: any
}
function LocationTypeModal(props: LocationTypeModalProps) {
    const { open, onClose, onSuccess } = props;
    const appDispatch = useDispatch();
    const [error, setError] = React.useState<any>();
    const [loading, setLoading] = React.useState<any>(false);
    const [locationTypeList, setLocationTypeList] = React.useState<any>();
    const [selectedLocationType, setSelectedLocationType] = React.useState<any>();

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            let locationTypes = await appDispatch(getAllLocationTypeList());
            locationTypes && locationTypes.length && setLocationTypeList(getStringAutoCompleteData(locationTypes));
            setLoading(false);
        }
        open && getList();
    }, [open, appDispatch]);
    return (
        <ModalContainer
            title="Enable Location Type"
            primaryButtonTitle={"Enable"}
            secondaryButtonTitle={"Clear"}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            loading={loading}
            styleName="enable-location-modal"
            open={open}
            onClose={() => {
                clearData();
                onClose();
            }}
            onApply={async () => {
                if (isNullValue(selectedLocationType)) {
                    setError("Select valid locationtype");
                    return
                }
                let params: any = {
                    locationTypeName: selectedLocationType.value
                }
                setLoading(true);
                let enableLocationTypeResponse = await appDispatch(enableUserlocationType(params));
                enableLocationTypeResponse && enableLocationTypeResponse.message && appDispatch(showAlert(enableLocationTypeResponse.message));
                setLoading(false);
                onSuccess();

            }}
            onClear={() => {
                clearData();
            }}
        >
            <div className="custom-form-row row">
                <div className="form-group col-md-12">
                    <AutoComplete
                        label={locationTypeLabel}
                        placeHolder={locationTypePlaceHolder}
                        error={error}
                        value={selectedLocationType}
                        options={locationTypeList}
                        onChange={(value: OptionType) => {
                            setSelectedLocationType(value);
                            setError("");
                        }}
                    />
                </div>
            </div>
        </ModalContainer >
    );
    function clearData() {
        setSelectedLocationType(null);
        setError("");
    }
}
export default LocationTypeModal;