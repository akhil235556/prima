import { CheckCircle, Create, LocalShippingOutlined, SendRounded, TimelapseRounded } from '@material-ui/icons';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TrackingUrl } from '../../../base/constant/RoutePath';
import { useQuery } from '../../../base/utility/Routerutils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Button from '../../../component/widgets/button/Button';
import { showAlert } from '../../../redux/actions/AppActions';
import { refreshList } from '../../../redux/actions/TrackingActions';
import { getDriverConsent } from '../../../serviceActions/TrackingServiceActions';
import EditDriverDetailsModal from '../EditDriverDetailsModal';
import StoppageSkeleton from '../trackingSkeleton/StoppageSkeleton';
import { Context } from '../VehicleTracking';

interface VehicleInformationProps {
    element: any,
    loading?: boolean
}

const VehicleInformation = (props: VehicleInformationProps) => {
    const appDispatch = useDispatch();
    const history = useHistory();
    const params = useQuery();

    // eslint-disable-next-line
    const [state, dispatch] = useContext(Context);
    const [loadingConsent, setLoadingConsent] = React.useState(false);
    const [toggleModal, setToggleModal] = React.useState(false);

    return (
        <div className="track-vehicle-details">
            <EditDriverDetailsModal
                open={toggleModal}
                selectedElement={props.element}
                onSuccess={(userParams: any) => {
                    // dispatch(driverDetailsRefresh())
                    setToggleModal(false);
                    dispatch(refreshList())
                    !isMobile && history.push({
                        pathname: TrackingUrl + props.element.id,
                        search: params.toString()
                    });
                    if (isMobile) {
                        // let params: any = {
                        //     id: props.element.id
                        // }
                        // appDispatch(getTripDetail(params)).then((response: any) => {
                        //     dispatch(setSelectedTrip(response));

                        // })
                        history.goBack();
                    }
                }}
                onClose={() => {
                    setToggleModal(false)
                }}
            />
            {props.loading ? <StoppageSkeleton /> :
                <>
                    <h4 className="track-detail-head"> Vehicle Information </h4>
                    <div className="track-detail-card">
                        <p> <img src="/images/freight_type.svg" alt="Freight Type" />{props.element && props.element.freightType}</p>
                        <p> <LocalShippingOutlined />{props.element && props.element.vehicleNumber}</p>
                        <p> <img src="/images/vehicletype1.svg" alt="Vehicle Type" />{(props.element && props.element.vehicleTypeName) || "NA"}</p>
                        <p> <img src="/images/Servicability.svg" alt="Servicability" />{(props.element && props.element.serviceabilityModeName) || "NA"}</p>
                        <p> <img src="/images/TAT-Crossed.png" alt="TAT Breached" />{"TAT Breached : " + (props.element && props.element.isTatBreached ? "Yes" : "No")}</p>
                    </div>
                    {props.element && props.element.driverName &&
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="driver-head track-detail-head"> Driver Information </h4>

                                <>
                                    <Button
                                        loading={loadingConsent}
                                        title={'Edit'}
                                        buttonStyle={'btn-orange small-btn trigger-btn'}
                                        onClick={() => {
                                            setToggleModal(true)
                                        }}
                                        leftIcon={<Create />}
                                    />
                                </>

                            </div>
                            <div className="track-detail-card">
                                <p>
                                    <PersonIcon /> {props.element && props.element.driverName}
                                </p>
                                <p>
                                    <PhoneIcon /> {props.element && props.element.driverNumber}
                                </p>
                            </div>
                        </>
                    }

                    {props.element && props.element.partnerInfo &&
                        <>
                            <h4 className="track-detail-head"> Transporter Information </h4>
                            <div className="track-detail-card">
                                <p>
                                    <PersonIcon /> {props.element.partnerInfo.partnerName || "NA"}
                                </p>
                                <p>
                                    <PhoneIcon /> {props.element.partnerInfo.partnerContact || "NA"}
                                </p>
                            </div>
                        </>
                    }

                    {props.element && props.element.consentStatus &&
                        <div>
                            <h4 className="track-detail-head">Driver Consent </h4>
                            <div className="track-detail-card">
                                <div className="row align-items-center">
                                    <span className="col">
                                        {props.element && props.element.consentStatus === 'ALLOWED'
                                            ?
                                            <p>
                                                <CheckCircle className="green-text" style={{ fontSize: '24px' }} />
                                                Allowed</p>
                                            :
                                            props.element && props.element.consentStatus === 'PENDING' ?
                                                <p className="pending-case">
                                                    <TimelapseRounded className="white-text" style={{ fontSize: '24px' }} />
                                                    Pending</p>
                                                :
                                                ''
                                        }
                                    </span>
                                    {props.element && props.element.consentStatus === 'PENDING'

                                        ?
                                        <span className="col-auto">
                                            <>
                                                <Button
                                                    loading={loadingConsent}
                                                    title={'Trigger'}
                                                    buttonStyle={'btn-blue small-btn trigger-btn'}
                                                    onClick={consent}
                                                    leftIcon={<SendRounded />}
                                                />
                                            </>
                                        </span>
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                        </div>

                    }
                </>}


        </div>
    );

    function consent() {
        // let params: any = {
        //     numbers: props.element && props.element.driverNumber
        // }
        let params: any = {
            phoneNumber: props.element && props.element.driverNumber,
            provider: props.element && props.element.trackingInfo && props.element.trackingInfo.integrationVendor
        }
        setLoadingConsent(true);
        appDispatch(getDriverConsent(params)).then((response: any) => {
            if (response) {
                response.message && appDispatch(showAlert(response.message));
                // setTimeout(() => {
                //     window.location.reload();
                // }, 1000)
            }
            setLoadingConsent(false);
        })


    }
}


export default VehicleInformation;
