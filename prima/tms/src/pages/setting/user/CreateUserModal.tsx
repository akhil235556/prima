import { IconButton, Tab, Tabs } from "@material-ui/core";
import { ArrowRightAlt, ClearAll, Visibility, VisibilityOff } from "@material-ui/icons";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { userTabs, userTabsEnum } from '../../../base/constant/ArrayList';
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import CheckList from "../../../component/widgets/checkLIst/CheckList";
import EditText from "../../../component/widgets/EditText";
import MultiSelect from "../../../component/widgets/MultiSelect";
import NumberEditText from '../../../component/widgets/NumberEditText';
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import ModalContainer from "../../../modals/ModalContainer";
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { createGateParams, createLocationParams, createUserParams, createUserRolesAndPermission, validateUserData } from "../../../moduleUtility/UsersUtility";
import { enableActionButton, showAlert } from '../../../redux/actions/AppActions';
import { getNodalLocationList, getUserGateList, updateUserGateInfo } from "../../../serviceActions/LocationServiceActions";
import { getAllRoles, getPermissionsList } from '../../../serviceActions/RolesServiceActions';
import { createUser, getUserEnableLocations, getUserRolePermissionsList, setUserRolePermission, updateUserLocation } from '../../../serviceActions/UserServiceActions';
import { TabPanel } from "../../setting/user/RolePermissionTab";

interface CreateUserModalProps {
    open: boolean
    onClose: any,
    onSuccess: any,
    selectedElement: any,
    gatesList?: any,
}

function CreateUserModal(props: CreateUserModalProps) {
    const [value, setValue] = React.useState(0);
    let message = "";

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };
    const appDispatch = useDispatch();
    const { open, onClose, onSuccess, selectedElement, gatesList } = props;
    let editMode = !isObjectEmpty(selectedElement);
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});

    const rolesList = useSelector((state: any) => state.appReducer.rolesList, shallowEqual);
    const permissionList = useSelector((state: any) => state.appReducer.permissionList, shallowEqual);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [nodalLocationList, setNodalLocationList] = React.useState<Array<OptionType> | undefined>();
    const [isPermissionChange, setPermissionChange] = React.useState<boolean>(false);
    const [isLocationChange, setLocationChange] = React.useState<boolean>(false);
    const [isGatesChange, setGatesChange] = React.useState<boolean>(false);
    const [gateOptions, setGateOptions] = React.useState<any>([]);

    useEffect(() => {
        const getRolesAndPermission = async () => {
            setLoading(true);
            if (!isObjectEmpty(selectedElement)) {
                setUserParams(selectedElement);
            }

            let nodalLocation: any = await Promise.all([appDispatch(getNodalLocationList()), appDispatch(getAllRoles()), appDispatch(getPermissionsList({
                serviceName: "tms"
            }))]);

            nodalLocation[0] && nodalLocation[0].length && setNodalLocationList(setAutoCompleteListWithData(nodalLocation[0], "locationName", "locationCode"));
            setGateOptions(gatesList);

            if (editMode) {
                let queryParams = {
                    userId: selectedElement.userId
                }
                let params: any = {
                    userId: selectedElement.userId,
                    isActive: true
                }
                Promise.all([appDispatch(getUserRolePermissionsList(queryParams)),
                appDispatch(getUserEnableLocations({ user_id: selectedElement.userId })), appDispatch(getUserGateList(params))]).then((response: any) => {
                    let locationList: any = [];
                    let gateListResponseOptions: any = [];

                    let roleList: any = [];
                    let permissionList: any = [];
                    if (response && response.length > 0 && response[0]) {
                        permissionList = setAutoCompleteListWithData(response[0].userPermissions, "name", "id");
                        roleList = setAutoCompleteListWithData(response[0].roles, "roleName", "roleId");
                    }
                    if (response && response.length >= 2 && response[1]) {
                        locationList = response[1].map((element: any) => ({ ...element.location, locationTypeName: element.location.locationType }))
                    }

                    if (response && response.length >= 3 && response[2]) {
                        gateListResponseOptions = setAutoCompleteListWithData(response[2], "gateName", "gateCode");
                    }

                    setUserParams({
                        ...selectedElement,
                        locations: setAutoCompleteListWithData(locationList, "locationName", "locationCode"),
                        roles: roleList,
                        permission: permissionList,
                        gates: gateListResponseOptions,
                    })
                });
            }
            setLoading(false);
        };
        open && getRolesAndPermission();
        // eslint-disable-next-line
    }, [open]);


    return (
        <ModalContainer
            title={editMode ? "Update User" : "Create User"}
            primaryButtonTitle={editMode ? "Update" : "Submit"}
            secondaryButtonTitle={editMode ? "" : "Clear"}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            loading={loading}
            open={open}
            onClose={() => {
                clearData();
                onClose();
            }}
            onApply={() => {
                const validate = validateUserData(userParams, appDispatch);
                if (validate === true || editMode) {
                    editMode ? updateUser() : createNewUser()
                } else {
                    setError(validate);
                }
            }}
            onClear={() => {
                clearData();
            }}
            styleName="users-modal"
        >
            <div className="custom-form-row row">
                {loading ? <CardContentSkeleton className=" col-md-6" row={6} column={1} /> : <div className="col-md-6">
                    <div className="form-group ">
                        <EditText
                            label="Name"
                            mandatory
                            placeholder="Enter Name"
                            maxLength={35}
                            value={userParams.name}
                            disabled={editMode}
                            error={error.name}
                            onChange={(text: string) => {
                                setUserParams({
                                    ...userParams,
                                    name: text,
                                });
                                setError({});
                            }}
                        />
                    </div>
                    <div className="form-group ">
                        <NumberEditText
                            label="Mobile Number"
                            mandatory
                            placeholder="Enter Mobile Number"
                            maxLength={10}
                            disabled={editMode}
                            value={userParams.phoneNumber}
                            error={error.phoneNumber}
                            onChange={(text: string) => {
                                setUserParams({
                                    ...userParams,
                                    phoneNumber: text,
                                });
                                setError({});
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <EditText
                            label="Email"
                            mandatory
                            placeholder="Enter Email"
                            maxLength={50}
                            disabled={editMode}
                            value={userParams.email}
                            error={error.email}
                            onChange={(text: string) => {
                                setUserParams({
                                    ...userParams,
                                    email: text,
                                });
                                setError({});
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <MultiSelect
                            label="Gate"
                            placeHolder="Select Gates"
                            error={error.gates}
                            value={userParams.gates}
                            options={gateOptions}
                            onChange={(value: any) => {
                                editMode && appDispatch(enableActionButton());
                                editMode && setGatesChange(true);
                                setUserParams({
                                    ...userParams,
                                    gates: value
                                });
                                setError({});
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <MultiSelect
                            label="Locations"
                            placeHolder="Select Locations"
                            error={error.locations}
                            value={userParams.locations}
                            options={nodalLocationList}
                            onChange={(value: any) => {
                                editMode && appDispatch(enableActionButton());
                                editMode && setLocationChange(true);
                                setUserParams({
                                    ...userParams,
                                    locations: value
                                });
                                setError({});
                            }}
                        />
                    </div>
                    <div className="form-group ">
                        <EditText
                            label="User Name"
                            mandatory
                            placeholder="Enter User Name"
                            maxLength={25}
                            disabled={editMode}
                            value={userParams.username}
                            error={error.username}
                            onChange={(text: string) => {
                                setUserParams({
                                    ...userParams,
                                    username: text,
                                });
                                setError({});
                            }}
                        />
                    </div>
                    {!editMode &&
                        <div className="form-group ">
                            <EditText
                                label="Password"
                                mandatory
                                placeholder="Enter Password"
                                type={!showPassword ? "password" : "Text"}
                                maxLength={25}
                                disabled={editMode}
                                value={editMode ? "********" : userParams.password}
                                error={error.password}
                                endAdornment={
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => {
                                            setShowPassword(!showPassword);
                                        }}
                                        onMouseDown={() => {
                                            setShowPassword(!showPassword);
                                        }}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                }
                                onChange={(text: string) => {
                                    setUserParams({
                                        ...userParams,
                                        password: text,
                                    });
                                    setError({});
                                }}
                            />
                        </div>
                    }

                </div>
                }
                {loading ? <CardContentSkeleton className=" col-md-6" row={6} column={1} /> : <div className="col-md-6">
                    <div className="permission-tab tab-nav">
                        <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
                            {userTabs.map((element, index) => (
                                <Tab
                                    key={index}
                                    label={element} />
                            ))}
                        </Tabs>
                    </div>

                    <div className="role-permission-wrapp">
                        {userTabs.map((element, index) => (
                            <TabPanel
                                key={index}
                                value={value}
                                index={index}>
                                {pageContent(element)}
                            </TabPanel>
                        ))}

                    </div>
                </div>
                }
            </div>
        </ModalContainer >
    );
    function pageContent(tab: string) {
        const isRoleTab: boolean = (tab === userTabsEnum.Role);
        return (
            <div>
                <CheckList
                    listData={isRoleTab ? setAutoCompleteListWithData(rolesList, "name", "id") : setAutoCompleteListWithData(permissionList, "name", "id")}
                    selectedPermission={isRoleTab ? userParams.roles : userParams.permission}
                    // checkOnlyValue={true}
                    onValueSelection={(value: any) => {
                        editMode && appDispatch(enableActionButton());
                        editMode && setPermissionChange(true);
                        if (isRoleTab) {
                            setUserParams({
                                ...userParams,
                                roles: value,
                            });
                        } else {
                            setUserParams({
                                ...userParams,
                                permission: value,
                            });

                        }

                    }}
                />
            </div>
        )

    }
    function clearData() {
        editMode && appDispatch(enableActionButton());
        setUserParams({ locations: null });
        setError({});
    }


    function createNewUser() {
        setLoading(true);
        if (userParams.userId) {
            let UserRolesAndPermissionsParams = createUserRolesAndPermission(userParams, userParams.userId);
            appDispatch(setUserRolePermission(UserRolesAndPermissionsParams)).then((response: any) => {
                if (response) {
                    if (message) {
                        appDispatch(showAlert(message))
                    } else {
                        response.message && appDispatch(showAlert(response.message));
                    }
                    clearData();
                    onSuccess();
                }
                editMode && appDispatch(enableActionButton());
                setLoading(false);
            });

        } else {
            let newUserParams = createUserParams(userParams);
            appDispatch(createUser(newUserParams)).then((response: any) => {
                if (response && response.details && response.details.userId) {
                    message = response.message && response.message;
                    setUserParams({
                        ...userParams,
                        userId: response.details.userId
                    });
                    let UserRolesAndPermissionsParams = createUserRolesAndPermission(userParams, response.details.userId);
                    let updateGateParams = createGateParams(userParams, response.details.userId);
                    return Promise.all([appDispatch(setUserRolePermission(UserRolesAndPermissionsParams)), appDispatch(updateUserGateInfo(updateGateParams))]);
                }
                editMode && appDispatch(enableActionButton());
                setLoading(false);
            }).then((response: any) => {
                if (response) {
                    if (message) {
                        appDispatch(showAlert(message))
                    } else {
                        response.message && appDispatch(showAlert(response.message));
                    }
                    clearData();
                    onSuccess();
                }
                editMode && appDispatch(enableActionButton());
                setLoading(false);
            })
        }
    }

    function updateUser() {
        if (isLocationChange && isPermissionChange && isGatesChange) {
            setLoading(true);
            let UserRolesAndPermissionsParams = createUserRolesAndPermission(userParams, userParams.userId);
            let userLocationParams = createLocationParams(userParams, userParams.userId);
            let gateParams = createGateParams(userParams, userParams.userId);

            Promise.all([appDispatch(updateUserLocation(userLocationParams)),
            appDispatch(setUserRolePermission(UserRolesAndPermissionsParams)), appDispatch(updateUserGateInfo(gateParams))]).then((response: any) => {
                if (response && response.length > 2 && response[0] && response[1] && response[2]) {
                    response[2] && response[2].message && appDispatch(showAlert(response[2].message));
                    clearData();
                    onSuccess();
                }
                editMode && appDispatch(enableActionButton());
                setLoading(false);
            }) 

        } else {
            if (isLocationChange) {
                setLoading(true);
                let userLocationParams = createLocationParams(userParams, userParams.userId);
                appDispatch(updateUserLocation(userLocationParams)).then((response: any) => {
                    if (response) {
                        response.message && appDispatch(showAlert(response.message));
                        clearData();
                        onSuccess();
                    }
                    editMode && appDispatch(enableActionButton());
                    setLoading(false);
                });
            }
            if (isPermissionChange) {
                setLoading(true);
                let UserRolesAndPermissionsParams = createUserRolesAndPermission(userParams, userParams.userId);
                appDispatch(setUserRolePermission(UserRolesAndPermissionsParams)).then((response: any) => {
                    if (response) {
                        response.message && appDispatch(showAlert(response.message));
                        clearData();
                        onSuccess();
                    }
                    editMode && appDispatch(enableActionButton());
                    setLoading(false);
                });
            }
            if (isGatesChange) {
                setLoading(true);
                let gateParams = createGateParams(userParams, userParams.userId);
                appDispatch(updateUserGateInfo(gateParams)).then((response: any) => {
                    if (response) {
                        response.message && appDispatch(showAlert(response.message));
                        clearData();
                        onSuccess();
                    }
                    editMode && appDispatch(enableActionButton());
                    setLoading(false);
                });
            }
        }
    }
}

export default CreateUserModal;