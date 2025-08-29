import React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import DoneIcon from '@material-ui/icons/Done';
import './Stepper.css';

function Stepper() {
  return (
    
         <div className='stepper-plan'>
                    <ul>
                        <li>
                            <span><img src="/images/success-check.png" alt="sucess-img" /></span>
                           <span> <img className="icon" src="/images/inventory.svg" alt="" /></span>
                            <span>Plan</span>
                        </li>
                        <li>
                            <span className='tick-icon'> <DoneIcon /></span>
                            <span> <img className="icon" src="/images/factCheck.svg" alt="" /></span>
                            <span>Load Creation</span>
                        </li>
                        <li>
                            <span className='tick-icon'><DoneIcon /></span>
                            <span><DriveEtaIcon /></span>
                            <span>Vehicles Type</span>

                        </li>
                        <li>
                            <span><img src="/images/success-check.png" alt="sucess-img" /></span>
                            <span><SettingsIcon /> </span>
                            <span>Configuration</span>
                        </li>
                    </ul>
                </div>
  )
}

export default Stepper
