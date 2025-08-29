import Step from '@material-ui/core/Step';
import StepConnector from '@material-ui/core/StepConnector';
import { StepIconProps } from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import { LocalShipping } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import clsx from 'clsx';
import React from 'react';
import "./stepper.css";

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      background:
        '#0063D0',
    },
  },
  completed: {
    '& $line': {
      background:
        '#0063D0',
    },
  },
  line: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#fff',
    zIndex: 1,
    color: '#768A9E',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #E9EFF4'
  },
  active: {
    background:
      '#0063D0',
    color: '#fff'
  },
  completed: {
    background:
      '#fff',
    border: '1px solid #0063D0',
    color: '#006CC9',
  },
});

function ColorlibStepIcon(props: StepIconProps) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <CallSplitIcon />,
    2: <AddIcon />,
    3: <VerifiedUserIcon />,
    4: <LocalShipping />,
    5: <DoneAllIcon />,
  };

  return (

    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

function getSteps() {
  return ['Cancelled FO', 'Create FO', 'Confirmed', 'Placed', 'Dispatched'];
}

interface CustomizedStepperProps {
  activeStep?: any
}


export default function CustomizedStepper(props: CustomizedStepperProps) {
  const { activeStep } = props
  const classes = useStyles();
  // const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  return (
    <div id="stepper" className={classes.root}>
      <div className="stepper-line">Stepper</div>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label: any) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className="stepper-line-last"></div>
    </div >
  );
}
