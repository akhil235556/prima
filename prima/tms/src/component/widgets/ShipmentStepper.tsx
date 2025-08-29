import { createStyles } from '@material-ui/core';
import Step from '@material-ui/core/Step';
import { StepIconProps } from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Done } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import { shipmentPickupETA } from "../../base/constant/ArrayList";
import { convertDateFormat, convertMinutesInHours, displayDateTimeFormatter } from "../../base/utility/DateUtils";
import InTransitModal from '../../pages/tracking/freightOrder/InTransitModal';
import './LaneStepper.css';
import './ShipmentStepper.css';
import { InfoTooltip } from './tooltip/InfoTooltip';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        actionsContainer: {
            marginBottom: theme.spacing(2),
        },
        root: {
            backgroundColor: '#fff',
            zIndex: 1,
            color: '#fff',
            width: 25,
            height: 25,
            display: 'flex',
            borderRadius: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'solid 2px #acb6c0',
        },
        active: {
            background: '#1fc900',
            border: 'solid 2px #1fc900',
        },
        completed: {
            background: '#1fc900',
            border: 'solid 2px #1fc900',
            borderRadius: '50%',
        },
        circle: {

        },
    }),
);

interface ShipmentStepperProps {
    steps: Array<any>,
    eta: any,
    latestStatus: any
}


export default function ShipmentStepper(props: ShipmentStepperProps) {
    const { eta, latestStatus } = props;
    const classes = useStyles(props);
    const steps = props.steps;
    const [statusModal, openStatusModal] = React.useState<any>(false);
    const [selectedScan, setSelectedScan] = React.useState<any>([]);

    return (
        <div className="lane-stepper-wrap shipment-stepper-wrap">
            <InTransitModal
                open={statusModal}
                selectedScan={selectedScan}
                onClose={() => {
                    openStatusModal(false)
                }}
            />
            <Stepper
                activeStep={getActiveStep(steps)}
                orientation="vertical">
                {
                    steps && steps.map((element: any, index: number) => (
                        drawStepper(element, index)
                    ))
                }
            </Stepper>
        </div>
    );


    function drawStepper(element: any, index: number) {
        try {
            return (
                <Step key={index}>
                    <StepLabel
                        style={{
                            height: 50,
                        }}
                        StepIconComponent={(props: StepIconProps) => {
                            const { active, completed } = props;
                            return (
                                <div
                                    className={clsx(classes.root, {
                                        [classes.active]: active,
                                        [classes.completed]: completed,
                                    })}
                                >
                                    {(completed || active) ? <Done className={classes.completed} /> : <div className={classes.circle} />}
                                </div>
                            );
                        }}>
                        <div className="stepper-detail-wrap">
                            <label className="label">
                                {element.description}
                            </label>

                            <div className="item-title text-truncate">{element.latestScan && element.latestScan.subStatus}</div>
                            <InfoTooltip
                                title={element.latestScan && element.latestScan.address}
                                disableInMobile={false}
                                valueClassName="item-title text-truncate"
                                infoText={(element.latestScan && element.latestScan.address) || " "}
                            />

                            {element.description !== "To be picked" &&
                                <div className="item-title text-truncate">{element.latestScan && element.latestScan.scanTime && convertDateFormat(element.latestScan.scanTime, displayDateTimeFormatter)}</div>}
                            {
                                element.description === "To be picked" &&
                                getPendingEta(latestStatus, element)
                            }
                            {element.description === "Delivered" && (!element.latestScan || !element.latestScan.scanTime) &&
                                <>
                                    <div className="item-title text-truncate ex-delivery-date">Expected Delivery Date</div>
                                    <div className="item-title text-truncate font-italic" >
                                        {eta && convertDateFormat(eta, displayDateTimeFormatter)}
                                    </div>
                                </>
                            }
                            {element.scans && element.scans.length > 1 &&
                                <span className="all-update"
                                    onClick={() => {
                                        setSelectedScan(element.scans)
                                        openStatusModal(true);
                                    }}>See all updates</span>
                            }
                        </div>
                    </StepLabel>
                </Step>
            );
        } catch (error) {
            return <div
                key={index}
            />;
        }

    }

    function getActiveStep(steps: any) {
        let indexNumber: any = 0;
        let flag = 0;
        for (let i = 0; i < steps.length; i++) {
            if (steps[i].completed === true) {
                continue
            } else {
                flag = 1
                indexNumber = i;
                break;
            }
        }
        if (flag === 1) {
            return indexNumber - 1
        } else {
            return steps.length - 1
        }
    }

    function getPendingEta(latestStatus: any, element: any) {
        if (latestStatus.subStatusCode === 'pending001' &&
            (latestStatus.etaLabel && latestStatus.newEtaDatetime)) {
            let statusClass = "";
            let timeStatus = "";
            if (latestStatus.etaLabel === shipmentPickupETA.ON_TIME) {
                statusClass = "green-text"
            } else if (latestStatus.etaLabel === shipmentPickupETA.DELAYED) {
                statusClass = "red-text"
                timeStatus = convertMinutesInHours(latestStatus.diffMinutes)
            } else if (latestStatus.etaLabel === shipmentPickupETA.ARRIVING_EARLY) {
                statusClass = "blue-text"
                timeStatus = convertMinutesInHours(latestStatus.diffMinutes)
            }
            return (
                <>
                    <div className={"item-title text-truncate ex-delivery-date pt-1 " + statusClass}>{timeStatus ? `${latestStatus.etaLabel} by ${timeStatus}` : `${latestStatus.etaLabel} - Pickup Date`}</div>
                    {timeStatus && <div className={"item-title text-truncate ex-delivery-date " + statusClass}>Pickup Date</div>}
                    <div className="item-title text-truncate font-italic" >
                        {convertDateFormat(latestStatus.newEtaDatetime, displayDateTimeFormatter)}
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className="item-title text-truncate">{element.latestScan && element.latestScan.scanTime && convertDateFormat(element.latestScan.scanTime, displayDateTimeFormatter)}</div>
                </>
            )
        }
    }

}