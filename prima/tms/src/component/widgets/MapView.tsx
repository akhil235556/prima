import React, { useEffect } from 'react';
import './MapView.css'
import {
    withGoogleMap,
    GoogleMap,
    DirectionsRenderer,
    Marker,
    InfoWindow,
    GoogleMapProps,
    Polyline
} from "react-google-maps";
import {convertDateFormat, displayDateTimeFormatter} from '../../base/utility/DateUtils'

interface MapViewProps extends GoogleMapProps {
    currentLocation: any,
    mapStyleInfo: any
    directions: any
    path: any
    selectedElement: any,
    taggedLocations?: any
}


const MapView = withGoogleMap((props: MapViewProps) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isMarkerOpen, setIsMarkerOpen] = React.useState<any>([]);
    const [taggedMarkerOpen, setTaggedMarkerOpen] = React.useState<any>([]);

    useEffect(() => {
        const markerData = () => {
            let temp_marker: any = []
            props.selectedElement.forEach((item: any) => {
                temp_marker.push(false);
            })
            setIsMarkerOpen(temp_marker);
        }
        props.path && props.selectedElement && markerData();
        // eslint-disable-next-line
    }, [props.selectedElement])

    // useEffect(() => {
    //     if (props.taggedLocations) {

    //     }
    // }, [props.taggedLocations])

    const getTaggedLocationIcons = (taggedLocation: any): string => {
        if (taggedLocation.taggedLocationType === 'PICKUP') {
            if (taggedLocation.completed) {
                return '/images/done-icon.png'
            }
            return '/images/unloading-icon.png'
        }

        if (taggedLocation.taggedLocationType === 'DROP') {
            if (taggedLocation.completed) {
                return '/images/done-icon.png'
            }
            return '/images/loading-icon.png'
        }
        return '/images/loading-icon.png'
    }

    return <GoogleMap
        defaultZoom={8}
        options={{
            mapTypeControl: false,
            styles: props.mapStyleInfo
        }}
        defaultCenter={props.currentLocation && props.currentLocation.latitude && props.currentLocation.longitude ?
            new google.maps.LatLng(props.currentLocation.latitude, props.currentLocation.longitude) :
            new google.maps.LatLng(28.615843, 77.202233)}
    >

        {props.currentLocation && props.currentLocation.latitude && props.currentLocation.longitude &&
            <Marker
                key={0}
                icon={{
                    url: "/images/truck-icon.png",
                    scaledSize: new google.maps.Size(50, 42),
                }}
                position={new google.maps.LatLng(props.currentLocation.latitude, props.currentLocation.longitude)}
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
            >
                {isOpen &&
                    <InfoWindow
                        onCloseClick={() => {
                            setIsOpen(false)
                        }}
                    >
                        <span>{props.currentLocation.address}</span>
                    </InfoWindow>
                }

            </Marker>
        }

        {
            props.taggedLocations &&
            props.taggedLocations.map((location: any, index: any) => {
                if (location.displayInMap) {
                    return (
                        <Marker
                            key={location.taggedLocationCode}
                            icon={{
                                url: getTaggedLocationIcons(location),
                                scaledSize: new google.maps.Size(35, 50),
                                // scaledSize: new google.maps.Size(50, 43),

                            }}
                            position={new google.maps.LatLng(location.taggedLocationLatitude, location.taggedLocationLongitude)}
                            onClick={() => {
                                const newTaggedMarkerOpen = [...taggedMarkerOpen]
                                newTaggedMarkerOpen[index] = true;
                                setTaggedMarkerOpen(newTaggedMarkerOpen);
                            }}
                        >
                            {taggedMarkerOpen[index] &&
                                <InfoWindow
                                    onCloseClick={() => {
                                        const newTaggedMarkerOpen = [...taggedMarkerOpen]
                                        newTaggedMarkerOpen[index] = false;
                                        setTaggedMarkerOpen(newTaggedMarkerOpen);
                                    }}
                                >
                                    <div className="map-tool-tip">
                                        <span className="map-tool-tip-heading">{location.taggedLocationName}</span>
                                        <span className="map-tool-tip-address">{location.taggedLocationAddress}</span>
                                        <span className="map-tool-tip-location">{location.taggedLocationType}</span>
                                        {
                                            location.eventTime && <span className="map-tool-tip-address">{convertDateFormat(location.eventTime, displayDateTimeFormatter)}</span>
                                        }
                                        <span className="map-tool-tip-status">{location.status}</span>
                                    </div>

                                </InfoWindow>
                            }

                        </Marker>
                    )
                }

                return null;
                
            })
        }

        {props.path &&
            <>
                {
                    props.selectedElement && props.selectedElement.map((item: any, index: any) => {
                        return (
                            <Marker
                                position={{ lat: item.latitude, lng: item.longitude }}
                                key={index + 1}
                                label={{
                                    text: String.fromCharCode(65 + index),
                                    color: "white",
                                    fontSize: '16px'
                                }}
                                onClick={() => {
                                    let temp_marker = [...isMarkerOpen];
                                    temp_marker = temp_marker.map((item: any) => false)
                                    temp_marker[index] = true;
                                    setIsMarkerOpen(temp_marker)
                                }}
                            >
                                {
                                    isMarkerOpen[index] === true &&
                                    <InfoWindow
                                        onCloseClick={() => {
                                            let temp_marker = [...isMarkerOpen];
                                            temp_marker[index] = false;
                                            setIsMarkerOpen(temp_marker)
                                        }}
                                    >
                                        <span>{item.address}</span>
                                    </InfoWindow>
                                }
                            </Marker>
                        )
                    })
                }
                <Polyline
                    path={props.path}
                    options={{
                        strokeColor: '#1a6ac7',
                        strokeOpacity: 0.7,
                        strokeWeight: 6,
                    }}
                />
            </>
        }
        {
            props.directions && <DirectionsRenderer
                directions={props.directions}
                options={{
                    polylineOptions: {
                        strokeColor: '#1a6ac7',
                        strokeOpacity: 0.7,
                        strokeWeight: 6,
                    },
                }}
            />
        }
    </GoogleMap >
});


export default MapView;