import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { setAutoCompleteListWithData } from "../../moduleUtility/DataUtils";
import { getNodalLocationList } from "../../serviceActions/LocationServiceActions";
import { getUserEnableLocations } from '../../serviceActions/UserServiceActions';

function useUserLocation(userInfo: any, predicate: boolean = true, addAll: boolean = true) {
    const appDispatch = useDispatch();
    const [location, setLocation] = useState<any>(undefined);

    useEffect(() => {
        const getList = async () => {
            (userInfo.isAdminUser ? appDispatch(getNodalLocationList()) : appDispatch(getUserEnableLocations())).then((response: any) => {
                if (response) {
                    const list = response.map((element: any) => userInfo.isAdminUser ? element : element.location);
                    var locationsList: any = []
                    locationsList = setAutoCompleteListWithData(list, "locationName", "locationCode");
                    if (userInfo.isAdminUser && addAll) {
                        locationsList.unshift({
                            label: "All",
                            value: "_ALL_",
                            data: {
                                locationTypeName: "NODE",
                                locationName: "All",
                            }
                        })
                    }
                    setLocation(locationsList);
                } else {
                    setLocation([])
                }
            });
        }
        userInfo && predicate && getList();
    }, [userInfo, predicate, addAll, appDispatch]);
    return location
}

export default useUserLocation;