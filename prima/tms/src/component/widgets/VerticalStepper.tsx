import React, { useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { StepIconProps } from '@material-ui/core/StepIcon';
import clsx from 'clsx';
import './VerticalStepper.css';
import { convertDateFormat, trackingDisplayDateFormatter } from '../../base/utility/DateUtils';
import { calculateBarHeight } from '../../pages/tracking/TrackingFunctions';
import { createStyles } from '@material-ui/core';
import { CustomToolTip } from './CustomToolTip';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        actionsContainer: {
            marginBottom: theme.spacing(2),
        },
        root: {
            backgroundColor: '#bababa',
            zIndex: 1,
            color: '#fff',
            width: 11,
            height: 11,
            display: 'flex',
            borderRadius: '50%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        active: {
            background: (props: any) => props.isRunning ? '#006cc9' : "red",
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
            animation: "shadow-pulse 1s infinite;"
        },
        completed: {
            background:
                '#1fc900',
        },
    }),
);

interface VerticalLinearStepperProps {
    steps: Array<any>,
    isDelayed?: any,
    isRunning?: boolean,
    tripTotalDistance?: any,
}


export default function VerticalLinearStepper(props: VerticalLinearStepperProps) {
    const classes = useStyles(props);
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = props.steps;
    const delayStatus = props.isDelayed;

    useEffect(() => {
        setActiveStep(0);
        steps && steps.filter((element: any, index: any) => {
            element && element.currentVehicleLocation && setActiveStep(index);
            return null;
        });
    }, [setActiveStep, steps])

    return (
        <div className="stepper-wrap">
            <Stepper activeStep={activeStep}
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
                            height: (index + 1) < (props.steps && props.steps.length) ? calculateBarHeight(props.steps[index + 1], props.tripTotalDistance) : 50,
                        }}
                        classes={{
                            active: props.isRunning ? "stopped" : " stopped"
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
                                </div>
                            );
                        }}>
                        {<>
                            <CustomToolTip
                                title={element.address}
                            >
                                <div className="item-title text-truncate">{element.address}</div>
                            </CustomToolTip>
                            <div className={(delayStatus && delayStatus.delay === true) ? " delayed" : " item-detail"}>{
                                ((element.notStarted && element.notStarted) ||
                                    (element.timeStamp && convertDateFormat(element.timeStamp, trackingDisplayDateFormatter)))
                            }</div>
                        </>}
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