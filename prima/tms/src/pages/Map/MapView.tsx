import React, { useEffect } from "react";
import { DirectionsRenderer, GoogleMap, InfoWindow, Marker, withGoogleMap } from "react-google-maps";
import { isNullValue } from "../../base/utility/StringUtils";
// import {MarkerWithLabel} from "react-google-maps/lib/components/addons/MarkerWithLabel";
import MapSkeleton from "./MapSkeleton";
import "./MapView.css";

interface MapViewProps {
    // isMarkerShown: boolean
    mapStyleInfo: any
    mapData?: any
}

export const MapView = withGoogleMap((props: MapViewProps) => {
    const { mapData, mapStyleInfo } = props
    const [directionArray, setDirectionArray] = React.useState<any>([])
    const [locationArray, setLocationArray] = React.useState<any>([])
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isMarkerOpen, setIsMarkerOpen] = React.useState<any>([]);
    const [isOriginMarkerOpen, setIsOriginMarkerOpen] = React.useState<boolean>(false)
    const [originData, setOriginData] = React.useState<any>({})
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
            scale: 1.50,
            anchor: new google.maps.Point(89, 33),
            labelOrigin: new google.maps.Point(91, 11)
        }
    }
    useEffect(() => {
        setLoading(true)
        let locationArray: any[] = []
        let temp_marker: any = []
        setDirectionArray([])
        let bounds = new google.maps.LatLngBounds()
        mapData && mapData.forEach((data: any, idx: number) => {
            locationArray.push({
                ...data.destination,
                colorData: data.polyLineOptions,
                text: `${idx + 1}/${String.fromCharCode(65 + data.waypoints.length)}`,
                uom: data.UOM
            })
            bounds.extend(new google.maps.LatLng(data.destination.latitude, data.destination.longitude))
            temp_marker.push(false);
            data.waypoints && data.waypoints.forEach((location: any, index: number) => {
                locationArray.push({
                    ...location,
                    colorData: data.polyLineOptions,
                    text: `${idx + 1}/${String.fromCharCode(65 + index)}`,
                    uom: data.UOM
                })
                temp_marker.push(false);
                bounds.extend(new google.maps.LatLng(location.latitude, location.longitude))
            })
            drawRoute(data.origin, data.destination, data.waypoints, data.polyLineOptions)
        })
        if (mapData && mapData[0] && mapData[0].origin) {
            setOriginData({
                ...mapData[0].origin,
                uom: mapData[0].UOM
            })
            bounds.extend(new google.maps.LatLng(mapData[0].origin.latitude, mapData[0].origin.longitude))
        }
        setIsMarkerOpen(temp_marker);
        setLocationArray(locationArray)
        if (locationArray && locationArray.length > 0 && !isNullValue(mapRef.current)) {
            const mapCenter = bounds.getCenter()
            setMapCenter(mapCenter)
            mapRef.current.panToBounds(bounds)
            mapRef.current.fitBounds(bounds)
        }
        setLoading(false)
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
                    {locationArray && locationArray.length > 0 && locationArray.map((location: any, index: any) => {
                        return (
                            <Marker
                                key={index}
                                onClick={() => {
                                    let temp_marker = [...isMarkerOpen];
                                    temp_marker = temp_marker.map((item: any) => false)
                                    temp_marker[index] = true;
                                    setIsMarkerOpen(temp_marker)
                                }}
                                label={{
                                    text: location.text,
                                    color: "white",
                                    fontSize: "12px",
                                    fontWeight: "bold"
                                }}
                                icon={svgMarker("#EC633E")}
                                visible={true}
                                position={new google.maps.LatLng(location.latitude, location.longitude)} >
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
                                            {/* <li className="map=tool-tip-data">{`Destination:${location["location_name"]}`}</li>
                                            <li className="map=tool-tip-data">{`Load:${location.load} ${location.uom ? location.uom : ""}`}</li> */}
                                            <li className="map=tool-tip-data">{`ETA:${location["ETA"]} `}</li>
                                        </ul>
                                    </InfoWindow>
                                }
                            </Marker>

                        )
                    })
                    }
                    {mapData && mapData[0] && mapData[0].origin &&
                        <Marker
                            onClick={() => {
                                setIsOriginMarkerOpen((isOriginMarkerOpen: boolean) => !isOriginMarkerOpen)
                            }}
                            position={new google.maps.LatLng(mapData[0].origin.latitude, mapData[0].origin.longitude)}
                            icon={{
                                url: "/images/warehouse.png",
                                scaledSize: new google.maps.Size(50, 42),
                            }}
                        >
                            {isOriginMarkerOpen &&
                                <InfoWindow
                                    onCloseClick={() => {
                                        setIsOriginMarkerOpen((isOriginMarkerOpen: boolean) => !isOriginMarkerOpen)
                                    }}>
                                    <ul className="map-tool-tip">
                                        <li className="map=tool-tip-data">{`Origin:${originData["location_name"]}`}</li>
                                    </ul>
                                </InfoWindow>
                            }
                        </Marker>
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