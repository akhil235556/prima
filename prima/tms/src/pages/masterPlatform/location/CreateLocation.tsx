import { Card, CardContent, CardHeader } from "@material-ui/core";
import { ArrowRightAlt, Cancel, Create, Info, KeyboardBackspace } from '@material-ui/icons';
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import {
    cityLabel,
    cityPlaceHolder, countryLabel, countryPlaceHolder,
    gpsradiusLabel, gpsradiusPlaceHolder, locationAddressLabel, locationAddressPlaceHolder, locationAreaOfficeLabel, locationAreaOfficePlaceHolder, locationDistrictLabel, locationDistrictPlaceHolder, locationLatitudeLabel, locationLatitudePlaceHolder, locationLongitudePlaceHolder, locationLongitudesLabel, locationNameLabel, locationNamePlaceHolder, locationTalukaLabel, locationTalukaPlaceHolder, locationTypeLabel, locationTypePlaceHolder, locationZoneLabel, locationZonePlaceHolder, pinCodeLabel, pinCodePlaceHolder, simradiusLabel, simradiusPlaceHolder, slaLabel, slaPlaceHolder, stateLabel, statePlaceHolder
} from "../../../base/constant/MessageUtils";
import { isNullValue } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Filter from "../../../component/filter/Filter";
import Information from "../../../component/information/Information";
import PageContainer from "../../../component/pageContainer/PageContainer";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import Button from '../../../component/widgets/button/Button';
import CardContentSkeleton from '../../../component/widgets/cardContentSkeleton/CardContentSkeleton';
import { CustomToolTip } from "../../../component/widgets/CustomToolTip";
import EditText from "../../../component/widgets/EditText";
import { LocationSearchInput } from '../../../component/widgets/googleAddressSearch/LocationSearchInput';
import NumberEditText from '../../../component/widgets/NumberEditText';
import TableList from "../../../component/widgets/tableView/TableList";
import { InfoTooltip } from "../../../component/widgets/tooltip/InfoTooltip";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { hideLoader, showAlert } from '../../../redux/actions/AppActions';
import { getCityList, getStateList } from '../../../serviceActions/AppServiceActions';
import { searchCustomer } from "../../../serviceActions/ConsigneeServiceActions";
import { checkSubLocation, createLocation, getLocationType, getMasterLocationDetails, getSubLocationList, updateLocation } from '../../../serviceActions/LocationServiceActions';
import { loctionDetailsTable } from "../../../templates/MasterTemplates";
import LocationErrorModal from './LocationErrorModal';
import { createLocationParams, createSubLocationParams, LocationRender, updateLocationParams, validateData } from './LocationRender';

const initObject = {
    locationArr: [{ id: 0 }],
    gpsRadius: 500,
    simRadius: 5000,
    country: "India"
}

const warningObj: any = {
    open: false,
    message: ""
}

function CreateLocation() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const locationCode = new URLSearchParams(useLocation().search).get("locationCode");
    let editMode = !isNullValue(locationCode);
    const [userParams, setUserParams] = React.useState<any>(initObject);
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [refreshPage, setRefreshPage] = React.useState<boolean>(false);
    const [customerList, setCustomerList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [locationTypeList, setlocationTypeList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [enableEditMode, setEnableEditMode] = React.useState<boolean>(false);
    const [warning, setWarningModal] = React.useState<any>(warningObj)


    const identifier = React.useRef(0);
    const cityList = useSelector((state: any) =>
        state.appReducer.cityList, shallowEqual
    );
    const stateList = useSelector((state: any) =>
        state.appReducer.stateList, shallowEqual
    );

    useEffect(() => {
        const getCityListData = async () => {
            setLoading(true);
            await appDispatch(getCityList());
            await appDispatch(getStateList());
            let locationTypeList = await appDispatch(getLocationType());
            locationTypeList && locationTypeList.length && setlocationTypeList(setAutoCompleteListWithData(locationTypeList, "locationTypeName", "id"));
            if (editMode) {
                let locationInfo = await appDispatch(getMasterLocationDetails({ query: locationCode }));
                let locationDetails = locationInfo && locationInfo.length && locationInfo[0];
                let subLocationList: any;
                if (locationDetails) {
                    subLocationList = await appDispatch(getSubLocationList({ locationId: locationDetails.id }));

                    if (subLocationList && subLocationList.length) {
                        subLocationList = subLocationList.map((element: any) => ({
                            locationName: element.locationName,
                            locationCode: element.locationCode,
                            id: element.id,
                            locationData: {
                                value: element.locationCode,
                                label: element.locationName,
                                data: element
                            },
                            locationType: {
                                value: element.subLocationTag,
                                label: element.subLocationTag
                            }
                        }))
                    } else {
                        subLocationList = [{ id: 0 }];
                    }
                    setUserParams({
                        ...locationDetails,
                        id: locationDetails.id,
                        address: locationDetails.address,
                        locationName: locationDetails.locationName,
                        locationCode: locationDetails.locationCode,
                        consigneeName: locationDetails.consigneeName,
                        latitude: locationDetails.latitude,
                        longitude: locationDetails.longitude,
                        integrationId: locationDetails.integrationId,
                        avgLoadingTime: locationDetails.avgLoadingTime,
                        stateName: locationDetails.stateName,
                        pincode: locationDetails.pincode,
                        simRadius: locationDetails.simRadius || 5000,
                        gpsRadius: locationDetails.gpsRadius || 500,
                        country: "India",
                        locationType: {
                            value: locationDetails.locationType,
                            label: locationDetails.locationTypeName
                        },
                        city: {
                            label: locationDetails.cityName,
                            value: locationDetails.cityCode
                        },
                        state: {
                            label: locationDetails.stateName,
                            value: locationDetails.stateCode
                        },
                        locationArr: subLocationList,
                    });
                }
                setLoading(false);
            } else {
                setLoading(false);
            }

        }
        getCityListData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshPage]);
    return (
        <div className="order-detail-wrapper">
            <div className="filter-wrap">
                <Filter
                    pageTitle={editMode ? "Location Details" : "Create Location"}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                >
                    {editMode && !enableEditMode && <Button
                        buttonStyle={"btn-blue mob-btn-blue"}
                        title={isMobile ? "" : "Edit"}
                        leftIcon={<Create />}
                        onClick={() => {
                            setEnableEditMode(true)
                        }}
                    />}
                    {editMode && enableEditMode && <Button
                        buttonStyle={"btn-orange mob-btn-orange"}
                        title={isMobile ? "" : "Cancel"}
                        leftIcon={<Cancel />}
                        onClick={() => {
                            setEnableEditMode(false)
                        }}
                    />}

                </Filter>
            </div>
            <LocationErrorModal
                open={warning.open}
                warningMessage={warning.message}
                onSuccess={() => {
                    setWarningModal({ open: false, message: "" });
                    editMode ? updateLocationData() : createNewLocation();
                }}
                onClose={() => {
                    setWarningModal({ open: false, message: "" });
                }}
            />

            <PageContainer>
                {(!editMode || enableEditMode) ?
                    <>
                        <Card className="creat-contract-wrapp creat-wrapp">
                            <CardHeader className="creat-contract-header"
                                title="Location Details"
                            />
                            <CardContent className="creat-contract-content">
                                <div className="custom-form-row row align-items-end">
                                    <div className="form-group col-md-8">
                                        <LocationSearchInput
                                            label={locationAddressLabel}
                                            placeHolder={locationAddressPlaceHolder}
                                            value={(userParams && userParams.address) || ""}
                                            error={error.address}
                                            mandatory
                                            setSuggestion={(placeInfo: any) => {
                                                let stateName: string = "";
                                                if (placeInfo && placeInfo.terms && placeInfo.terms.length > 0) {
                                                    let count = placeInfo.terms.length;
                                                    // country = (count - 1) >= 0 ? placeInfo.terms[count - 1].value : "";
                                                    stateName = (count - 2) >= 0 ? placeInfo.terms[count - 2].value : "";
                                                }
                                                setUserData({ stateName: stateName })
                                            }}
                                            handleChange={(value: any) => {
                                                setUserData({
                                                    ...userParams,
                                                    address: value,
                                                });
                                            }}
                                            getLocationLatLong={(latLong: any, address: string) => {
                                                setUserData({
                                                    address: address,
                                                    longitude: latLong.lng + "",
                                                    latitude: latLong.lat + "",
                                                });
                                            }}
                                        />

                                    </div>

                                    <div className="form-group col-md-4">
                                        <EditText
                                            label={locationNameLabel}
                                            // mandatory
                                            placeholder={locationNamePlaceHolder}
                                            maxLength={50}
                                            // disabled={editMode}
                                            error={error.locationName}
                                            value={userParams.locationName}
                                            onChange={(text: any) => {
                                                var replaced_text = text.replace(/[^ A-Za-z0-9_/&-]/g, "")
                                                setUserData({ locationName: replaced_text })
                                            }}
                                        />
                                    </div>

                                    <div className="col-md-4 form-group">
                                        <AutoSuggest
                                            label="Consignee"
                                            error={error.consigneeName}
                                            placeHolder="Enter Consignee Name"
                                            value={userParams.consigneeName}
                                            suggestions={customerList}
                                            onChange={(text: string) => {
                                                setUserData({
                                                    ...userParams,
                                                    consigneeName: text,
                                                    consigneeCode: "",
                                                });
                                            }}
                                            handleSuggestionsFetchRequested={({ value }: any) => {
                                                if (value.length > autosuggestSearchLength) {
                                                    appDispatch(searchCustomer({ query: value })).then((response: any) => {
                                                        response && setCustomerList(setAutoCompleteListWithData(response, "customerName", "customerCode"));
                                                    })
                                                }
                                            }}
                                            onSelected={(element: OptionType) => {
                                                setUserData({
                                                    consigneeName: element.label,
                                                    consigneeCode: element.value,
                                                })
                                            }}
                                        />
                                    </div>

                                    <div className="col-md-4 col-lg-4">
                                        <div className="row">
                                            <div className="form-group col-md-6 col-lg-6">
                                                <NumberEditText
                                                    label={simradiusLabel}
                                                    placeholder={simradiusPlaceHolder}
                                                    value={userParams.simRadius}
                                                    maxLength={3}
                                                    required={true}
                                                    decimalScale={0}
                                                    disabled={editMode}
                                                    error={error.simRadius}
                                                    type="number"
                                                    toolTip={() => (
                                                        <CustomToolTip title="Used in sim fencing" placement="top">
                                                            <Info className="blue-text info-icon" />
                                                        </CustomToolTip>
                                                    )}
                                                    onChange={(text: any) => {
                                                        setUserData({
                                                            simRadius: text
                                                        })
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group col-md-6 col-lg-6">
                                                <NumberEditText
                                                    label={gpsradiusLabel}
                                                    placeholder={gpsradiusPlaceHolder}
                                                    value={userParams.gpsRadius}
                                                    maxLength={3}
                                                    required={true}
                                                    decimalScale={0}
                                                    disabled={editMode}
                                                    error={error.gpsRadius}
                                                    type="number"
                                                    toolTip={() => (
                                                        <CustomToolTip title="Used in geo fencing" placement="top">
                                                            <Info className="blue-text info-icon" />
                                                        </CustomToolTip>
                                                    )}
                                                    onChange={(text: any) => {
                                                        setUserData({
                                                            gpsRadius: text
                                                        })
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group col-md-4">
                                        <NumberEditText
                                            mandatory
                                            label={locationLatitudeLabel}
                                            placeholder={locationLatitudePlaceHolder}
                                            maxLength={25}
                                            value={userParams.latitude}
                                            error={error.latitude}
                                            onChange={(text: any) => {
                                                setUserData({
                                                    latitude: text
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <NumberEditText
                                            mandatory
                                            label={locationLongitudesLabel}
                                            placeholder={locationLongitudePlaceHolder}
                                            maxLength={25}
                                            value={userParams.longitude}
                                            error={error.longitude}
                                            onChange={(text: any) => {
                                                setUserData({
                                                    longitude: text
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <EditText
                                            label={"Integration ID"}
                                            // mandatory
                                            placeholder={"Enter Integration ID"}
                                            maxLength={25}
                                            // disabled={editMode}
                                            error={error.integrationId}
                                            value={userParams.integrationId}
                                            onChange={(text: any) => {
                                                setUserData({ integrationId: text })
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <NumberEditText
                                            label={slaLabel}
                                            placeholder={slaPlaceHolder}
                                            maxLength={25}
                                            value={userParams.avgLoadingTime}
                                            onChange={(value: any) => {
                                                setUserData({
                                                    avgLoadingTime: Number(value)
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <AutoComplete
                                            label={locationTypeLabel}
                                            mandatory
                                            placeHolder={locationTypePlaceHolder}
                                            value={(userParams && userParams.locationType) || ""}
                                            options={locationTypeList}
                                            error={error.locationType}
                                            isDisabled={editMode}
                                            onChange={(value: any) => {
                                                setUserData({
                                                    locationType: value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <EditText
                                            label={locationAreaOfficeLabel}
                                            placeholder={locationAreaOfficePlaceHolder}
                                            maxLength={25}
                                            error={error.areaOffice}
                                            value={userParams.areaOffice}
                                            onChange={(text: any) => {
                                                setUserData({
                                                    areaOffice: text
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <EditText
                                            label={locationTalukaLabel}
                                            placeholder={locationTalukaPlaceHolder}
                                            maxLength={25}
                                            error={error.taluka}
                                            value={userParams.taluka}
                                            onChange={(text: any) => {
                                                setUserData({
                                                    taluka: text
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <EditText
                                            label={locationZoneLabel}
                                            placeholder={locationZonePlaceHolder}
                                            maxLength={25}
                                            error={error.zone}
                                            value={userParams.zone}
                                            onChange={(text: any) => {
                                                setUserData({
                                                    zone: text
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <EditText
                                            label={locationDistrictLabel}
                                            placeholder={locationDistrictPlaceHolder}
                                            maxLength={25}
                                            error={error.district}
                                            value={userParams.district}
                                            onChange={(text: any) => {
                                                setUserData({
                                                    district: text
                                                })
                                            }}
                                        />
                                    </div>

                                    <div className="form-group col-md-4">
                                        <AutoComplete
                                            label={cityLabel}
                                            mandatory
                                            placeHolder={cityPlaceHolder}
                                            value={(userParams && userParams.city) || ""}
                                            isDisabled={editMode}
                                            error={error.cityName}
                                            options={setAutoCompleteListWithData(cityList, "cityName", "cityCode")}
                                            onChange={(value: any) => {
                                                setUserData({
                                                    city: value,
                                                    cityCode: value.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <NumberEditText
                                            label={pinCodeLabel}
                                            mandatory
                                            placeholder={pinCodePlaceHolder}
                                            maxLength={6}
                                            error={error.pincode}
                                            value={userParams.pincode}
                                            onChange={(text: any) => {
                                                setUserData({
                                                    pincode: text
                                                })
                                            }}
                                        />
                                    </div>
                                    {/* <div className="form-group col-md-4">
                                        <EditText
                                            label={stateLabel}
                                            mandatory
                                            placeholder={statePlaceHolder}
                                            maxLength={25}
                                            disabled={editMode}
                                            error={error.stateName}
                                            value={userParams.stateName}
                                            onChange={(text: any) => {
                                                setUserData({
                                                    stateName: text
                                                })
                                            }}
                                        /> */}
                                    <div className="form-group col-md-4">
                                        <AutoComplete
                                            label={stateLabel}
                                            mandatory
                                            placeHolder={statePlaceHolder}
                                            value={(userParams && userParams.state) || ""}
                                            isDisabled={editMode}
                                            error={error.stateName}
                                            options={setAutoCompleteListWithData(stateList, "stateName", "stateName")}
                                            onChange={(value: any) => {
                                                setUserData({
                                                    state: value,
                                                    stateName: value.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <EditText
                                            label={countryLabel}
                                            mandatory
                                            placeholder={countryPlaceHolder}
                                            maxLength={25}
                                            error={error.country}
                                            value={userParams.country}
                                            disabled={editMode}
                                            onChange={(text: any) => {
                                                // setUserData({
                                                //     countryName: text
                                                // })
                                            }}
                                        />
                                    </div>



                                </div>
                            </CardContent>
                        </Card>
                        <Card className="creat-contract-wrapp creat-wrapp">
                            <CardHeader className="creat-contract-header"
                                title="Tag Location"
                            />
                            <CardContent className="creat-contract-content mt-10">
                                {userParams.locationArr && userParams.locationArr.map((item: any, index: Number) => (
                                    <LocationRender
                                        error={error}
                                        userParams={userParams}
                                        setUserParams={setUserParams}
                                        onAdd={onAddLocation}
                                        onRemove={onRemoveLocation}
                                        appDispatch={appDispatch}
                                        element={item}
                                        index={index}
                                        key={item.id}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </>
                    :
                    <div className="location-details">
                        <Card className="creat-contract-wrapp creat-wrapp">
                            <CardHeader className="creat-contract-header"
                                title="Location Details"
                            />
                            {loading ? <CardContentSkeleton row={4} column={3} /> :
                                <CardContent className="creat-contract-content">
                                    <div className="custom-form-row row">
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"Location Name"}
                                                customView={
                                                    <InfoTooltip
                                                        title={userParams.locationName || "....."}
                                                        placement={"top"}
                                                        disableInMobile={"false"}
                                                        infoText={userParams.locationName || "....."}
                                                    />
                                                }
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"Address"}
                                                customView={
                                                    <InfoTooltip
                                                        title={userParams.address || "....."}
                                                        placement={"top"}
                                                        disableInMobile={"false"}
                                                        infoText={userParams.address || "....."}
                                                    />
                                                }
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"Consignee"}
                                                text={userParams.consigneeName}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"GPS Radius (meter)"}
                                                text={userParams.gpsRadius}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"SIM Radius (meter)"}
                                                text={userParams.simRadius}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"Location Latitude"}
                                                text={userParams.latitude}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"Location Longitude"}
                                                text={userParams.longitude}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"Integration ID"}
                                                text={userParams.integrationId}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"Average Loading Time (hr)"}
                                                text={userParams.avgLoadingTime}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"Location Type"}
                                                text={userParams.locationType && userParams.locationType.label}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={locationAreaOfficeLabel}
                                                text={userParams.areaOffice}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={locationTalukaLabel}
                                                text={userParams.taluka}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={locationZoneLabel}
                                                text={userParams.zone}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={locationDistrictLabel}
                                                text={userParams.district}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"City"}
                                                text={userParams.cityName}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"Pin Code"}
                                                text={userParams.pincode}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"State Name"}
                                                text={userParams.stateName}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={"Country"}
                                                text={"India"}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">

                                        </div>


                                    </div>
                                </CardContent>
                            }
                        </Card>
                        {userParams.locationArr && userParams.locationArr[0] && userParams.locationArr[0].locationType &&
                            <Card className="creat-contract-wrapp creat-wrapp">
                                <CardHeader className="creat-contract-header"
                                    title="Tag Location"
                                />
                                <CardContent className="creat-contract-content">
                                    <div className="table-detail-listing ">
                                        <TableList
                                            tableColumns={loctionDetailsTable()}
                                            currentPage={0}
                                            rowsPerPage={25}
                                            rowsPerPageOptions={rowsPerPageOptions}
                                            listData={userParams.locationArr}
                                            onChangePage={(event: any, page: number) => {
                                            }}
                                            onChangeRowsPerPage={(event: any) => {

                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        }
                    </div>
                }
                {(!editMode || enableEditMode) &&
                    <div className="row text-right">
                        <div className="col indent-btn-wrap">
                            <Button
                                buttonStyle="btn-blue"
                                title={editMode ? "Update" : "Create"}
                                loading={loading}
                                onClick={async () => {
                                    const validate = validateData(userParams);
                                    if (validate === true) {
                                        let checkValidate = await checkSubLocationDetails();
                                        if (checkValidate) {
                                            editMode ? updateLocationData() : createNewLocation();
                                        }
                                    } else if (validate.error) {
                                        setUserParams(validate);
                                        // setError(validate.userError);
                                    } else {
                                        setError(validate);
                                    }
                                }}
                                leftIcon={<ArrowRightAlt />}
                            />
                        </div>
                    </div>
                }

            </PageContainer>
        </div>

    );


    function setUserData(inputParams: any) {
        inputParams && setUserParams({
            ...userParams,
            ...inputParams
        });
        setError({});
    }

    // function clearData() {
    //     setUserParams(initObject);
    //     setError({});
    // }

    async function checkSubLocationDetails() {
        setLoading(true);
        let params = createSubLocationParams(userParams);
        if (params && params.length) {
            let checkLocationParams: any = {
                subLocation: params
            }
            if (editMode && userParams) {
                checkLocationParams.location_id = userParams.id
            }
            return appDispatch(checkSubLocation(checkLocationParams)).then((response: any) => {
                setLoading(false);
                if (response && response.error) {
                    setWarningModal({ open: true, message: response && response.error });
                    return false;
                }
                return response && !response.error;
            })
        } else {
            return true
        }
    }

    function createNewLocation() {
        setLoading(true);
        let params = createLocationParams(userParams);
        appDispatch(createLocation(params)).then((response: any) => {
            if (response && response.message) {
                history.goBack();
                appDispatch(hideLoader());
            }
            setLoading(false);
        });
    }

    function onAddLocation() {
        identifier.current += 1;
        const newLocationArr = [...userParams.locationArr, { id: identifier.current }];
        setUserParams({
            ...userParams,
            locationArr: newLocationArr
        })
    }
    function onRemoveLocation(index: Number) {
        const newLocationArr = userParams.locationArr.filter((_: any, i: Number) => (index !== i));
        setUserParams({
            ...userParams,
            locationArr: newLocationArr
        })
    }

    function updateLocationData() {
        let params = updateLocationParams(userParams);
        appDispatch(updateLocation(params)).then((response: any) => {
            if (response && response.message) {
                setEnableEditMode(false);
                setUserParams(initObject)
                appDispatch(showAlert(response.message));
                setRefreshPage((prev) => !prev)
            }
            setLoading(false);
        });
    }
}

export default CreateLocation;
