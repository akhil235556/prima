import React from "react";
import { approxDistanceLabel, destinationLabel, integrationIDLabel, originLabel, wayPointLabel } from '../../../base/constant/MessageUtils';
import Information from "../../../component/information/Information";
import { InfoTooltip } from "../../../component/widgets/tooltip/InfoTooltip";
import './LaneDetails.css';


interface LaneDetailsProps {
    response: any
}

function LaneDetails(props: LaneDetailsProps) {
    const { response } = props;
    return (
        <div className="order-detail-wrapper">
            <div className="custom-form-row row">
                <div className="col-md-4 billing-group col-4">
                    <Information
                        title={originLabel}
                        customView={
                            <InfoTooltip
                                title={response.originName || "....."}
                                placement={"top"}
                                disableInMobile={"false"}
                                infoText={response.originName || "....."}
                            />
                        }
                    />
                </div>
                <div className="col-md-4 billing-group col-4">
                    <Information
                        title={destinationLabel}
                        customView={
                            <InfoTooltip
                                title={response.destinationName || "....."}
                                placement={"top"}
                                disableInMobile={"false"}
                                infoText={response.destinationName || "....."}
                            />
                        }
                    />
                </div>
                <div className="col-md-4 billing-group col-4">
                    <Information
                        title={integrationIDLabel}
                        text={response.integrationId}
                    />
                </div>
                <div className="col-md-4 billing-group col-4">
                    <Information
                        title={approxDistanceLabel}
                        text={response.approximateDistance}
                    />
                </div>
                <div className="col-md-4 billing-group col-4">
                    <Information
                        title={wayPointLabel}
                        customView={
                            <InfoTooltip
                                title={(response.waypoints && response.waypoints.map((element: any) => element.label).join(',')) || "....."}
                                placement={"top"}
                                disableInMobile={"false"}
                                infoText={(response.waypoints && response.waypoints.map((element: any) => element.label).join(',')) || "....."}
                            />
                        }
                    />
                </div>

            </div>
        </div>
    );
}

export default LaneDetails;

