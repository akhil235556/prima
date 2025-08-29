import { Card, CardContent, CardHeader } from "@material-ui/core";
import { ArrowRightAlt, ClearAll, Edit, KeyboardBackspace } from '@material-ui/icons';
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { approxDistanceLabel, integrationIDLabel, integrationIDPlaceholder } from '../../../base/constant/MessageUtils';
import { LaneUrl } from '../../../base/constant/RoutePath';
import { isNullValue } from '../../../base/utility/StringUtils';
import { isMobile } from "../../../base/utility/ViewUtils";
import { LocationTypeNameMultiSelect, LocationTypeNameOption } from "../../../component/CommonView";
import Filter from "../../../component/filter/Filter";
import PageContainer from "../../../component/pageContainer/PageContainer";
import AutoSuggest from '../../../component/widgets/AutoSuggest';
import Button from '../../../component/widgets/button/Button';
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import EditText from "../../../component/widgets/EditText";
import MultiSelect from "../../../component/widgets/MultiSelect";
import NumberEditText from '../../../component/widgets/NumberEditText';
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { showAlert } from '../../../redux/actions/AppActions';
import { getClientFreightTypeList } from "../../../serviceActions/FreightTypeServiceActions";
import { createLane, getMasterLaneDetails, updateLane } from '../../../serviceActions/LaneServiceActions';
import { getAllLocation, searchLocationList } from '../../../serviceActions/LocationServiceActions';
import { getAllVehicleTypeList } from '../../../serviceActions/VehicleTypeServiceActions';
import LaneDetails from './LaneDetails';
import { createLaneParams, validateData } from './LaneViewUtils';

function CreateLane() {
    const appDispatch = useDispatch();
    const history = useHistory();
    const locationList = useSelector((state: any) => state.appReducer.locationList, shallowEqual);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [reloadPage, setReloadPage] = React.useState<boolean>(false);
    const [isValueChanged, setIsValueChanged] = React.useState<boolean>(true);
    const [isIntegrationIDChanged, setisIntegrationIDChanged] = React.useState<boolean>(false);
    const laneCode = new URLSearchParams(useLocation().search).get("laneCode");
    let editMode = !isNullValue(laneCode);
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [editable, setEditable] = React.useState<boolean>(false);
    const [originSuggestion, setOriginSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [destinationSuggestion, setDestinationSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);

    useEffect(() => {
        let sobDetails = [{
            index: 0,
            partnersList: [{
                index: 0,
            }]
        }]

        const getAllLocationList = async () => {
            setLoading(true);
            Promise.all([appDispatch(getClientFreightTypeList()), appDispatch(getAllLocation()), appDispatch(getAllVehicleTypeList())])
                .then((response: any) => {
                    if (response && response.length > 0) {
                        if (!editMode) {
                            setUserParams({
                                sobDetails: sobDetails,
                            })
                        }
                        setIsValueChanged(true)
                    }
                    setLoading(false);
                });
        };
        getAllLocationList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (editMode) {
            setLoading(true);
            Promise.all([appDispatch(getMasterLaneDetails({ query: laneCode }))]).then((response: any) => {
                let selectedElement: any = {}
                if (response && response[0] && response[0][0]) {
                    selectedElement = response[0][0];
                }
                setUserParams({
                    ...selectedElement,
                    originName: selectedElement.origin && selectedElement.origin.name,
                    destinationName: selectedElement.destination && selectedElement.destination.name,
                    waypoints: selectedElement.waypoints && (selectedElement.waypoints.map((element: any) => ({ label: element.name, value: element.code }))),
                    integrationId: selectedElement.integrationId,
                })
                setIsValueChanged(true)
                setLoading(false);
            })
        }
        // eslint-disable-next-line
    }, [reloadPage]);

    return (
        <div>
            <div className="filter-wrap">
                <Filter
                    pageTitle={editMode ? "Edit Lane" : "Create Lane"}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        if (editable) {
                            setEditable(false)
                        } else {
                            history.goBack();
                        }

                    }}
                >
                    {(!editable && editMode) && <Button
                        buttonStyle={"btn-orange"}
                        title={isMobile ? "" : "Edit"}
                        loading={loading}
                        leftIcon={<Edit />}
                        onClick={() => setEditable(true)}
                    />
                    }
                </Filter >
            </div>

            <PageContainer>
                <Card className="creat-contract-wrapp creat-wrapp">
                    <CardHeader className="creat-contract-header"
                        title="Lane Details"
                    />
                    {loading ?
                        <CardContentSkeleton
                            row={2}
                            column={3}
                        />
                        : (
                            ((editMode && editable) || !editMode) ?
                                <CardContent className="creat-contract-content">
                                    <div className="custom-form-row row align-items-end">
                                        <div className={editMode ? "form-group col-md-4" : "form-group col-md-6"}>
                                            <AutoSuggest
                                                label="Origin"
                                                mandatory
                                                placeHolder="Enter Origin Name"
                                                isDisabled={editMode}
                                                error={error.origin}
                                                value={userParams.originName}
                                                suggestions={originSuggestion}
                                                handleSuggestionsFetchRequested={({ value }: any) => {
                                                    if (value.length > autosuggestSearchLength) {
                                                        getSuggestionList(value, "origin");
                                                    }
                                                }}
                                                renderOption={(optionProps: any) => <LocationTypeNameOption optionProps={optionProps} />}
                                                onSelected={(element: OptionType) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        originName: element.label,
                                                        origin: element,
                                                    });
                                                    setError({});
                                                }}
                                                onChange={(text: string) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        origin: undefined,
                                                        originName: text
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className={editMode ? "form-group col-md-4" : "form-group col-md-6"}>
                                            <AutoSuggest
                                                label="Destination"
                                                mandatory
                                                placeHolder="Enter Destination Name"
                                                isDisabled={editMode}
                                                error={error.destination}
                                                value={userParams.destinationName}
                                                suggestions={destinationSuggestion}
                                                handleSuggestionsFetchRequested={({ value }: any) => {
                                                    if (value.length > autosuggestSearchLength) {
                                                        getSuggestionList(value, "destination");
                                                    }
                                                }}
                                                renderOption={(optionProps: any) => <LocationTypeNameOption optionProps={optionProps} />}
                                                onSelected={(element: OptionType) => {
                                                    setError({});
                                                    setUserParams({
                                                        ...userParams,
                                                        destinationName: element.label,
                                                        destination: element,
                                                    });
                                                }}
                                                onChange={(text: string) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        destinationName: text,
                                                        destination: undefined,
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className={editMode ? "form-group col-md-4" : "form-group col-md-6"}>
                                            <EditText
                                                label={integrationIDLabel}
                                                placeholder={integrationIDPlaceholder}
                                                value={userParams.integrationId}
                                                error={error.integrationId}
                                                maxLength={30}
                                                onChange={(text: any) => {
                                                    setError({});
                                                    setisIntegrationIDChanged(true)
                                                    setIsValueChanged(false)
                                                    setUserParams({
                                                        ...userParams,
                                                        integrationId: text
                                                    })
                                                }}
                                            />
                                        </div>
                                        {/* {editMode && <div className="form-group tat-form col-md-4">
                                            <EditText
                                                label={integrationIDLabel}
                                                placeholder={integrationIDPlaceholder}
                                                value={userParams.integrationId}
                                                error={error.integrationId}
                                                maxLength={30}
                                                onChange={(text: any) => {
                                                    setError({});
                                                    setisIntegrationIDChanged(true)
                                                    setIsValueChanged(false)
                                                    setUserParams({
                                                        ...userParams,
                                                        integrationId: text
                                                 })
                                                }}
                                            />

                                        </div>} */}
                                        {editMode && <div className="form-group tat-form col-md-4">
                                            <NumberEditText
                                                label={approxDistanceLabel}
                                                placeholder={"Distance"}
                                                maxLength={3}
                                                disabled
                                                decimalSeparator={false}
                                                value={userParams.approximateDistance || "NA"}
                                                onChange={(text: any) => {
                                                }}
                                            />
                                        </div>}
                                        <div className="form-group col-md-6">
                                            <MultiSelect
                                                label="WayPoints"
                                                placeHolder="Select WayPoint"
                                                isDisabled={editMode}
                                                error={error.waypoints}
                                                value={userParams.waypoints}
                                                renderOption={(optionProps: any) => <LocationTypeNameMultiSelect optionProps={optionProps} />}
                                                options={setAutoCompleteListWithData(locationList, "locationName", "locationCode")}
                                                onChange={(value: any) => {
                                                    setError({});
                                                    setUserParams({
                                                        ...userParams,
                                                        waypoints: value
                                                    });
                                                }}
                                            />
                                        </div>


                                    </div>
                                </CardContent> :
                                <LaneDetails
                                    response={userParams || {}}
                                />
                        )
                    }
                </Card>
                <div className="row text-right">
                    <div className="col indent-btn-wrap">
                        {!editMode &&
                            <Button
                                buttonStyle="btn-orange mr-3"
                                title="Clear"
                                disable={loading}
                                leftIcon={<ClearAll />}
                                onClick={() => {
                                    clearData();
                                }}
                            />}
                        {((editMode && editable) || !editMode) &&
                            <>
                                <Button
                                    buttonStyle="btn-blue"
                                    title={editMode ? "Update" : "Create"}
                                    loading={loading}
                                    disable={editMode && isValueChanged}
                                    onClick={() => {
                                        const validate = validateData(userParams, appDispatch);
                                        if (validate === true) {
                                            editMode ? updateLaneData() : createNewLane();
                                        } else if (validate.error) {
                                            setUserParams(validate);
                                        } else {
                                            setError(validate);
                                        }
                                    }}
                                    leftIcon={<ArrowRightAlt />}
                                />
                            </>
                        }
                    </div>
                </div>
            </PageContainer>
        </div>
    );

    function getSuggestionList(text: string, type: string) {
        let params: any = { query: text };
        appDispatch(searchLocationList(params)).then((response: any) => {
            if (response) {
                switch (type) {
                    case "origin":
                        setOriginSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
                        break;
                    case "destination":
                        setDestinationSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
                        break;
                }

            }
        })
    }

    function clearData() {
        setOriginSuggestion(undefined);
        setDestinationSuggestion(undefined);
        setUserParams({
            waypoints: null,
            sobDetails: [{
                index: 0,
                partnersList: [{
                    index: 0,
                }]
            }]
        });
        setError({});
    }

    function createNewLane() {
        setLoading(true);
        let laneParams = createLaneParams(userParams);
        appDispatch(createLane(laneParams)).then((response: any) => {
            if (response) {
                setUserParams({
                    ...userParams,
                    laneCode: response.details
                });

                response.message && appDispatch(showAlert(response.message));
                clearData();
                setLoading(false);
                history.push(LaneUrl);


            }
        }).then((response: any) => {
            if (response) {
                response.message && appDispatch(showAlert(response.message));
                clearData();
                setLoading(false);
                history.push(LaneUrl);
            }
            setLoading(false);
        })

    }

    function updateLaneData() {
        let updateLaneParams: any = {
            laneCode: userParams.laneCode,
            integrationId: userParams.integrationId
        };
        if (isIntegrationIDChanged) {
            updateLaneIntegrationID(updateLaneParams);
        }
    }

    function updateLaneIntegrationID(params: any) {
        setLoading(true);
        appDispatch(updateLane(params)).then((response: any) => {
            setLoading(false);
            if (response) {
                response.message && appDispatch(showAlert(response.message));
                setReloadPage((prev) => !prev);
                setEditable(false);
            }
        });
    }
}

export default CreateLane;
