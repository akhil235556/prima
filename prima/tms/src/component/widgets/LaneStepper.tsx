import { createStyles } from '@material-ui/core';
import Step from '@material-ui/core/Step';
import { StepIconProps } from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { CustomToolTip } from './CustomToolTip';
import './LaneStepper.css';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        actionsContainer: {
            marginBottom: theme.spacing(2),
        },
        completed: {
            backgroundColor: '#006CC9',
            zIndex: 1,
            color: '#ffffff',
            width: 14,
            height: 14,
            display: 'flex',
            borderRadius: '50%',
            justifyContent: 'center',
            alignItems: 'center'
        },
    }),
);

interface LaneStepperProps {
    steps: Array<any>,
}


export default function LaneStepper(props: LaneStepperProps) {
    const classes = useStyles(props);
    const steps = props.steps;

    return (
        <div className="lane-stepper-wrap">
            <Stepper activeStep={steps.length - 1}
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
                            const { completed } = props;
                            return (
                                <div
                                    className={clsx(classes.completed, {
                                        [classes.completed]: completed,
                                    })}
                                >
                                </div>
                            );
                        }}>
                        <CustomToolTip
                            title={element.address}
                        >
                            <div>
                                <label className="label">
                                    {index === 0 ? "Origin" : (index === (steps.length - 1) ? "Destination" : "Waypoint")}
                                </label>
                                <div className="d-flex align-items-center">
                                    <img
                                        className="pr-1"
                                        style={{
                                            height: 20,
                                            width: 20
                                        }}
                                        src={(element && element.node) ? "/images/Node.svg" : "/images/Address.svg"}
                                        alt="lane"
                                    />
                                    {element && element.address && <div className="item-title text-truncate">{element.address}</div>}
                                </div>

                            </div>
                        </CustomToolTip>
                    </StepLabel>
                </Step >
            );
        } catch (error) {
            return <div
                key={index}
            />;
        }

    }


}