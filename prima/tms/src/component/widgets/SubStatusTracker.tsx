import { createStyles } from '@material-ui/core';
import Step from '@material-ui/core/Step';
import { StepIconProps } from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Done } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import { convertDateFormat, displayDateTimeFormatter } from "../../base/utility/DateUtils";
import '../widgets/LaneStepper.css';
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
            border: 'solid 2px #1fc900',
        },
        active: {
            background: '#1fc900',
            border: 'solid 2px #1fc900',
            borderRadius: '50%',
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

interface SubStatusTrackerProps {
    steps: Array<any>,
}


export default function SubStatusTracker(props: SubStatusTrackerProps) {
    const classes = useStyles(props);
    const steps = props.steps;

    return (
        <div className="lane-stepper-wrap shipment-stepper-wrap">
            <Stepper
                activeStep={steps && steps.length}
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
                            height: 100,
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
                        <div>
                            <label className="label text-truncate">
                                {element && element.subStatus}
                            </label>
                            <InfoTooltip
                                title={element && element.address}
                                disableInMobile={false}
                                valueClassName="item-title text-truncate"
                                infoText={(element && element.address) || " "}
                            />
                            <div className="item-title text-truncate">{element && element.scanTime && convertDateFormat(element.scanTime, displayDateTimeFormatter)}</div>
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
}