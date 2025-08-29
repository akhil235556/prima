import React, { useEffect } from "react";
import { GoogleMap, withGoogleMap } from "react-google-maps";
import DirectionsRenderer from "react-google-maps/lib/components/DirectionsRenderer";
import InfoWindow from "react-google-maps/lib/components/InfoWindow";
import Marker from "react-google-maps/lib/components/Marker";
import { isNullValue } from "../../base/utility/StringUtils";
// import {MarkerWithLabel} from "react-google-maps/lib/components/addons/MarkerWithLabel";
import MapSkeleton from "./MapSkeleton";
import "./MultiMapView.css";

interface MapViewProps {
    // isMarkerShown: boolean
    mapStyleInfo: any
    mapData?: any
}

export const MultiMapView = withGoogleMap((props: MapViewProps) => {
    const { mapData, mapStyleInfo } = props
    const [directionArray, setDirectionArray] = React.useState<any>([])
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isMarkerOpen, setIsMarkerOpen] = React.useState<any>([]);
    const [markerDetailArray, setMarkerDetailArray] = React.useState<any>([])
    const [mapCenter, setMapCenter] = React.useState<any>(new google.maps.LatLng(28.615843, 77.202233))
    const mapRef = React.useRef<any>()
    let delayFactor = 0
    const svgMarker = (strokeColour: any) => {
        return {
            path: "M103.1,6.044C100.958,2.347,96.38.089,92.149,0c-.181,0-.362,0-.543,0C87.375.089,82.8,2.347,80.654,6.044a12.287,12.287,0,0,0-.16,12.141l9.526,12.65.012.021c.379.661,1.083,1.843,1.845,1.843s1.466-1.182,1.845-1.843l.012-.021,9.526-12.65a12.289,12.289,0,0,0-.16-12.141Z",
            fillColor: strokeColour,
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2.5,
            anchor: new google.maps.Point(89, 33),
            labelOrigin: new google.maps.Point(91, 11)
        }
    }

    function getLatLongCombinedString(lat: number, long: number) {
        return `${lat}_${long}`
    }
    useEffect(() => {
        setLoading(true)
        let temp_marker: any = []
        setDirectionArray([])
        let bounds = new google.maps.LatLngBounds()
        const markerArray: any = []
        const markerDetailArray: any = [];
        mapData && mapData.forEach((data: any, index: number) => {
            if (data.origin) {
                let key = getLatLongCombinedString(data.origin.latitude, data.origin.longitude)
                if (!markerArray.includes(String(data.origin.latitude) + "_" + String(data.origin.longitude))) {
                    markerArray.push(String(data.origin.latitude) + "_" + String(data.origin.longitude))
                    markerDetailArray.push({
                        [key]: [{ ...data.origin, polyline: data.polyLineOptions, type: "Origin", routeNo: index + 1 }]
                    })
                    temp_marker.push(false)
                    bounds.extend(new google.maps.LatLng(data.origin.latitude, data.origin.longitude))
                }
                else {
                    markerDetailArray.forEach((marker: any, idx: number) => {
                        if (Object.keys(marker)[0] === key) {
                            markerDetailArray[idx][key].push(
                                { ...data.origin, polyline: data.polyLineOptions, type: "Origin", routeNo: index + 1 }
                            )
                        }
                    })
                }
            }
            if (data.destination) {
                const key = getLatLongCombinedString(data.destination.latitude, data.destination.longitude)
                if (!markerArray.includes(String(data.destination.latitude) + "_" + String(data.destination.longitude))) {
                    markerArray.push(String(data.destination.latitude) + "_" + String(data.destination.longitude))
                    markerDetailArray.push({
                        [key]: [{ ...data.destination, polyline: data.polyLineOptions, type: "Destination", routeNo: index + 1 }]
                    })
                    temp_marker.push(false)
                    bounds.extend(new google.maps.LatLng(data.destination.latitude, data.destination.longitude))
                }
                else {
                    markerDetailArray.forEach((marker: any, idx: number) => {
                        if (Object.keys(marker)[0] === key) {
                            markerDetailArray[idx][key].push(
                                { ...data.destination, polyline: data.polyLineOptions, type: "Destination", routeNo: index + 1 }
                            )
                        }
                    })
                }
            }
            if (data.waypoints) {
                data.waypoints.forEach((waypoint: any) => {
                    if (waypoint) {
                        const key = getLatLongCombinedString(waypoint.latitude, waypoint.longitude)
                        if (!markerArray.includes(String(waypoint.latitude) + "_" + String(waypoint.longitude))) {
                            markerArray.push(String(waypoint.latitude) + "_" + String(waypoint.longitude))
                            markerDetailArray.push({
                                [key]: [{ ...waypoint, polyline: data.polyLineOptions, routeNo: index + 1 }]
                            })
                            temp_marker.push(false)
                            bounds.extend(new google.maps.LatLng(waypoint.latitude, waypoint.longitude))
                        }
                        else {
                            markerDetailArray.forEach((marker: any, idx: number) => {
                                if (Object.keys(marker)[0] === key) {
                                    markerDetailArray[idx][key].push(
                                        { ...waypoint, polyline: data.polyLineOptions, routeNo: index + 1 }
                                    )
                                }
                            })
                        }

                    }

                })
            }
            drawRoute(data.origin, data.destination, data.waypoints, data.polyLineOptions)
        })
        setMarkerDetailArray(markerDetailArray);
        if (markerDetailArray && markerDetailArray.length > 0 && !isNullValue(mapRef.current)) {
            const mapCenter = bounds.getCenter()
            setMapCenter(mapCenter)
            mapRef.current.panToBounds(bounds)
            mapRef.current.fitBounds(bounds)
        }
        setLoading(false)
        // mapData && mapData.forEach((data: any, idx: number) => {
        //     locationArray.push({
        //         ...data.destination,
        //         colorData: data.polyLineOptions,
        //         text: `${idx + 1}/${String.fromCharCode(65 + data.waypoints.length)}`,
        //         uom: data.UOM
        //     })
        //     bounds.extend(new google.maps.LatLng(data.destination.latitude, data.destination.longitude))
        //     temp_marker.push(false);
        //     data.waypoints && data.waypoints.forEach((location: any, index: number) => {
        //         locationArray.push({
        //             ...location,
        //             colorData: data.polyLineOptions,
        //             text: `${idx + 1}/${String.fromCharCode(65 + index)}`,
        //             uom: data.UOM
        //         })
        //         temp_marker.push(false);
        //         bounds.extend(new google.maps.LatLng(location.latitude, location.longitude))
        //     })
        //     drawRoute(data.origin, data.destination, data.waypoints, data.polyLineOptions)
        // })
        // // if (mapData && mapData[0] && mapData[0].origin) {
        // //     setOriginData({
        // //         ...mapData[0].origin,
        // //         uom: mapData[0].UOM
        // //     })
        // //     bounds.extend(new google.maps.LatLng(mapData[0].origin.latitude, mapData[0].origin.longitude))
        // // }
        // setIsMarkerOpen(temp_marker);
        // setLocationArray(locationArray)
        // if (locationArray && locationArray.length > 0 && !isNullValue(mapRef.current)) {
        //     const mapCenter = bounds.getCenter()
        //     setMapCenter(mapCenter)
        //     mapRef.current.panToBounds(bounds)
        //     mapRef.current.fitBounds(bounds)
        // }
        // setLoading(false)
        //eslint-disable-next-line
    }, [mapData])
    return (
        <>
            {loading ? <MapSkeleton />
                :
                <GoogleMap
                    options={{
                        mapTypeControl: false,
                        styles: mapStyleInfo,
                        disableDefaultUI: true,
                    }}
                    ref={mapRef}
                    zoom={10}
                    center={mapCenter}
                // defaultCenter={new google.maps.LatLng(28.615843, 77.202233)}
                >
                    {markerDetailArray && markerDetailArray.length > 0 && markerDetailArray.map((marker: any, index: any) => {
                        const key = Object.keys(marker)
                        const latlongArr = key[0].split("_");
                        const lat = +latlongArr[0];
                        const long = +latlongArr[1];
                        if (marker[key[0]][0] && (marker[key[0]][0].type === 'Origin' || marker[key[0]][0].type === 'Destination')) {
                            return (
                                <Marker
                                    onClick={() => {
                                        let temp_marker = [...isMarkerOpen];
                                        temp_marker = temp_marker.map((item: any) => false)
                                        temp_marker[index] = true;
                                        setIsMarkerOpen(temp_marker)
                                    }}
                                    key={index}
                                    icon={{
                                        url: "/images/truck-icon.png",
                                        scaledSize: new google.maps.Size(50, 42),
                                    }}

                                    // icon={svgMarker(location.colorData.strokeColor)}
                                    visible={true}
                                    position={new google.maps.LatLng(lat, long)} >
                                    {
                                        isMarkerOpen[index] === true &&
                                        <InfoWindow
                                            onCloseClick={() => {
                                                let temp_marker = [...isMarkerOpen];
                                                temp_marker[index] = false;
                                                setIsMarkerOpen(temp_marker)
                                            }}
                                        >
                                            <ul className="map-tool-tip">
                                                {marker[key[0]][0]["location_name"] && <li className="map-tool-tip-data">{`Location: ${marker[key[0]][0]["location_name"]}`}</li>}
                                                <hr></hr>
                                                {marker[key[0]].map((mark: any, index: number) => (
                                                    <React.Fragment key={index}>
                                                        {mark.routeNo && <li className="map-tool-tip-data">{`Route No: ${mark.routeNo}`}</li>}
                                                        {mark.type && <li className="map-tool-tip-data">{`Type: ${mark.type}`}</li>}
                                                        {mark.load !== 0 && <li className="map-tool-tip-data">{`Load: ${mark.load}`}</li>}
                                                        {mark.volume !== 0 && <li className="map-tool-tip-data">{`Volume: ${mark.volume}`}</li>}
                                                        {((mark.type !== "Origin" && mark.type !== "Destination") && mark["ETA"]) && <li className="map-tool-tip-data">{`ETA: ${mark["ETA"]} `}</li>}
                                                        <hr></hr>
                                                    </React.Fragment>
                                                ))}

                                            </ul>
                                        </InfoWindow>
                                    }
                                </Marker>
                            )
                        }
                        else {
                            return (
                                <Marker
                                    onClick={() => {
                                        let temp_marker = [...isMarkerOpen];
                                        temp_marker = temp_marker.map((item: any) => false)
                                        temp_marker[index] = true;
                                        setIsMarkerOpen(temp_marker)
                                    }}
                                    label={{
                                        text: marker[key[0]][0].type,
                                        color: "white",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        // className: "map-tool-tip-data"

                                    }}
                                    key={index}
                                    icon={svgMarker(marker[key[0]][0].polyline.strokeColor)}
                                    visible={true}
                                    position={new google.maps.LatLng(lat, long)} >
                                    {
                                        isMarkerOpen[index] === true &&
                                        <InfoWindow
                                            onCloseClick={() => {
                                                let temp_marker = [...isMarkerOpen];
                                                temp_marker[index] = false;
                                                setIsMarkerOpen(temp_marker)
                                            }}
                                        >
                                            <ul className="map-tool-tip">
                                                {marker[key[0]][0]["location_name"] && <li className="map-tool-tip-data">{`Location: ${marker[key[0]][0]["location_name"]}`}</li>}
                                                <hr></hr>
                                                {marker[key[0]].map((mark: any, index: number) => (
                                                    <React.Fragment key={index}>
                                                        {mark.routeNo && <li className="map-tool-tip-data">{`Route No: ${mark.routeNo}`}</li>}
                                                        {mark.type && <li className="map-tool-tip-data">{`Type: ${mark.type}`}</li>}
                                                        {mark.load && mark.load !== "0" && <li className="map-tool-tip-data">{`Load: ${mark.load}`}</li>}
                                                        {mark.volume && mark.volume !== "0" && <li className="map-tool-tip-data">{`Volume: ${mark.volume}`}</li>}
                                                        {mark["ETA"] && <li className="map-tool-tip-data">{`ETA: ${mark["ETA"]} `}</li>}
                                                        <hr></hr>
                                                    </React.Fragment>
                                                ))}
                                            </ul>
                                        </InfoWindow>
                                    }
                                </Marker>
                            )
                        }
                    })
                    }
                    {directionArray && directionArray.map((direction: any, idx: any) => {
                        return (
                            < DirectionsRenderer
                                key={idx}
                                directions={direction}
                                options={{
                                    polylineOptions: direction.data,
                                    preserveViewport: true,
                                    suppressMarkers: true
                                    // suppressMarkers : {}
                                }}
                            />
                        )
                    })}
                </GoogleMap >
            }
        </>
    )

    function drawRoute(origin: any, destination: any, wayPoint: any, data: any) {
        const DirectionsService = new google.maps.DirectionsService();
        const setWayPoints = () => {
            let waypoints: Array<any> = [];
            waypoints = wayPoint && wayPoint.map((element: any) => ({
                location: new google.maps.LatLng(element.latitude, element.longitude),
                stopover: true
            }))
            return waypoints;
        };
        DirectionsService.route({
            origin: origin ? new google.maps.LatLng(origin.latitude, origin.longitude) : "",
            destination: origin ? new google.maps.LatLng(destination.latitude, destination.longitude) : "",
            waypoints: setWayPoints(),
            travelMode: google.maps.TravelMode.DRIVING,
            // optimizeWaypoints: true,
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                const newResult: any = { ...result, data }
                setDirectionArray((directionArray: any) => {
                    return [
                        ...directionArray,
                        newResult,
                    ]
                })
            }
            else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
                delayFactor++;
                setTimeout(function () {
                    drawRoute(origin, destination, wayPoint, data)
                }, delayFactor * 1000);
            }
        });
    }
}
)


// export default MapView;