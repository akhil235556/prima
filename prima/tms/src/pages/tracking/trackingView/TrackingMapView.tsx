import React from 'react';
import './TrackingMapView.css'
import MapView from '../../../component/widgets/MapView';
import { mapStyleInfo } from '../../../component/widgets/MapStyle';
import MapSkeleton from '../trackingSkeleton/MapSkeleton';
interface TrackingMapView {
    currentLocation: any,
    directions: any,
    path: any,
    selectedElement: any
    loading?: boolean
    taggedLocations?: any,
}

function TrackingMapView(props: TrackingMapView) {
    
    return (
        <div className="mapViewSec">
            <div id="map">
                {props.loading ? <MapSkeleton /> : <MapView
                    mapStyleInfo={mapStyleInfo}
                    currentLocation={props.currentLocation && props.currentLocation[0]}
                    containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    directions={props.directions}
                    path={props.path}
                    selectedElement={props.selectedElement}
                    taggedLocations={props.taggedLocations}
                />}


            </div>
        </div>
    );
}

export default TrackingMapView;