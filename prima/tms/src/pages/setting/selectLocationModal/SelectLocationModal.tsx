import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useUserLocation from "../../../base/hooks/useUserLocation";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import CheckList from "../../../component/widgets/checkLIst/CheckList";
import ModalContainer from "../../../modals/ModalContainer";
import { showAlert } from "../../../redux/actions/AppActions";
import { setUserLocation } from '../../../serviceActions/UserServiceActions';
import './SelectLocationModal.css';


interface SelectLocationModalProps {
    open: boolean
    onClose: any
    onSuccess: any
    locations: any
}

function SelectLocationModal(props: SelectLocationModalProps) {
    const { open, onClose, locations, onSuccess } = props;
    const appDispatch = useDispatch();
    const userInfo = useSelector((state: any) => state.appReducer.userInfo, shallowEqual);
    const [loading, setLoading] = React.useState<any>(false);
    const [saveLoading, setSaveLoading] = React.useState<any>(false);
    const [selectedLocation, setSelectedLocation] = React.useState<any>();
    const userLocations = useUserLocation(userInfo, open && !locations);

    useEffect(() => {
        if (!userLocations && !locations) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [userLocations, locations])

    useEffect(() => {
        if (open) {
            if (userInfo && userInfo.locationName && userInfo.locationCode)
                setSelectedLocation([{
                    label: userInfo.locationName,
                    value: userInfo.locationCode,
                    data: {
                        locationType: userInfo.locationType,
                        locationName: userInfo.locationName,
                        locationTypeName: userInfo.locationType,
                    }
                }])
        }
    }, [open, userInfo])

    return (
        <ModalContainer
            title="Select Location"
            secondaryButtonTitle={"Continue"}
            secondaryButtonLoading={loading || saveLoading}
            open={open}
            hideCloseButton={userInfo && userInfo.locationName ? false : true}
            onClear={() => {
                if (selectedLocation && selectedLocation[0]) {
                    let locationType = userInfo.isAdminUser ? selectedLocation[0].data && selectedLocation[0].data.locationTypeName
                        : selectedLocation[0].data && selectedLocation[0].data.locationType;
                    let params = {
                        locationName: selectedLocation[0].data && selectedLocation[0].data.locationName,
                        locationCode: selectedLocation[0].value,
                        locationType: locationType,
                    }
                    if (params.locationCode === userInfo.locationCode) {
                        onClose();
                    } else {
                        setSaveLoading(true);
                        appDispatch(setUserLocation(params)).then((response: any) => {
                            if (response) {
                                localStorage.setItem("partition", JSON.stringify(params));
                                onSuccess();
                            }
                            setSaveLoading(false);
                        });
                    }
                } else {
                    appDispatch(showAlert("Select Location", false))
                }
            }}
            onClose={() => {
                onClose();
            }}
            styleName={"select-location-modal"}
        >
            {loading ?
                <CardContentSkeleton className=" col-md-6" row={4} column={1} /> :
                <CheckList
                    selectedPermission={selectedLocation}
                    listData={userLocations || locations}
                    onValueSelection={(value: any) => {
                        if (value && value.length > 0) {
                            setSelectedLocation([{
                                label: value[value.length - 1].label,
                                value: value[value.length - 1].value,
                                data: value[value.length - 1].data
                            }])
                        } else {
                            setSelectedLocation([])
                        }
                    }}
                    imagePath={"/images/warehouse.png"}
                />}

        </ModalContainer>
    );
}

export default SelectLocationModal;

