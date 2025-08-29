import { Close } from '@material-ui/icons';
import React from 'react';
import Button from '../../../component/widgets/button/Button';
import { mapStyleInfo } from '../../Map/MapStyle';
import { MapView } from '../../Map/MapView';
import "./CreatePlanMap.css";

const CreatePlanMap = (props: any) => {
    const { onClose, mapData } = props;

    return (
        <div className="createPlan-map">
            <div className="map-closeBtn">
                <Button
                    buttonStyle="btn"
                    leftIcon={<Close />}
                    onClick={onClose}
                />
            </div>
            <MapView
                mapData={mapData ? [mapData] : mapData}
                mapStyleInfo={mapStyleInfo}
                containerElement={<div style={{ height: `100%`, width: `100%` }} />}
                mapElement={<div style={{ height: `597px`, borderRadius: '5px 5px 0 0' }} />}
            />

        </div>
    )
}
export default CreatePlanMap