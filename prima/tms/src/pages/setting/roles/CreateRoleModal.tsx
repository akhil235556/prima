import { Tab, Tabs } from "@material-ui/core";
import { ArrowRightAlt } from "@material-ui/icons";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { permissionTab } from "../../../base/constant/ArrayList";
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import CheckList from "../../../component/widgets/checkLIst/CheckList";
import EditText from "../../../component/widgets/EditText";
import ModalContainer from "../../../modals/ModalContainer";
import { setAutoCompleteList } from "../../../moduleUtility/DataUtils";
import { createRolesParams, createRolesPermissionParams, getSelectedPermission, validateRoleData } from "../../../moduleUtility/RolesUtility";
import { enableActionButton, showAlert } from "../../../redux/actions/AppActions";
import { createRole, getPermissionsList, getRolePermissionsList, setRolePermissionsList } from '../../../serviceActions/RolesServiceActions';
import { TabPanel } from "../roles/PermissionTab";


interface CreateRoleModalProps {
    open: boolean
    onClose: any
    selectedElement: any,
    onSuccess: any,
}

function CreateRoleModal(props: CreateRoleModalProps) {
    const [value, setValue] = React.useState(0);
    let message = "";
    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };
    const appDispatch = useDispatch();
    const { open, onClose, selectedElement, onSuccess } = props;
    let editMode = !isObjectEmpty(selectedElement);
    const permissionList = useSelector((state: any) => state.appReducer.permissionList, shallowEqual);
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);

    useEffect(() => {
        const getRolesAndPermission = async () => {
            setLoading(true);
            const promiseArray = [appDispatch(getPermissionsList())];
            if (editMode && !(selectedElement && selectedElement.isSystemRole)) {
                promiseArray.push(appDispatch(getRolePermissionsList({
                    roleId: selectedElement.id
                })));
            }

            Promise.all(promiseArray).then((response: any) => {
                if (selectedElement && selectedElement.isSystemRole && response && response[0]) {
                    setUserParams({
                        ...selectedElement,
                        permission: setAutoCompleteList(response[0], "name", "id"),
                    });
                } else if (response && response.length >= 2 && response[0] && response[1]) {
                    const list = getSelectedPermission(response[0], response[1]);
                    setUserParams({
                        ...selectedElement,
                        permission: setAutoCompleteList(list, "name", "id"),
                    });
                }
                setLoading(false);
            });
        };
        open && getRolesAndPermission();
        // eslint-disable-next-line
    }, [open]);

    return (
        <ModalContainer
            title={editMode ? "Update Role" : "Create Role"}
            primaryButtonTitle={editMode ? (!(selectedElement && selectedElement.isSystemRole) ? "Update" : "") : "Create"
            }
            primaryButtonLeftIcon={< ArrowRightAlt />}
            open={open}
            loading={loading}
            onClose={() => {
                clearData();
                onClose();
            }}
            onApply={() => {
                const validate = validateRoleData(userParams, appDispatch);
                if (validate === true) {
                    createNewRole()
                } else {
                    setError(validate);
                }
            }}
            onClear={() => {
                clearData();
            }}
        >
            <div className="custom-form-row row">
                {loading ? <CardContentSkeleton className=" col-md-6" row={6} column={1} /> : <div className="col-md-6">
                    <div className="form-group">
                        <EditText
                            label="Role Name"
                            mandatory
                            placeholder="Roles"
                            maxLength={25}
                            value={userParams.name}
                            disabled={editMode}
                            error={error.name}
                            onChange={(text: string) => {
                                setUserParams({
                                    ...userParams,
                                    name: text,
                                })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <EditText
                            label="Description"
                            mandatory
                            placeholder="Enter Your Message"
                            maxLength={250}
                            value={userParams.description}
                            disabled={editMode}
                            error={error.description}
                            onChange={(text: string) => {
                                setUserParams({
                                    ...userParams,
                                    description: text,
                                })
                            }}
                        />
                    </div>
                </div>
                }
                {loading ? <CardContentSkeleton className=" col-md-6" row={6} column={1} /> : <div className="col-md-6">
                    <div className="permission-tab tab-nav">
                        <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
                            {permissionTab.map((element, index) => (
                                <Tab
                                    key={index}
                                    label={element} />
                            ))}
                        </Tabs>
                    </div>

                    <div className="role-permission-wrapp">
                        {permissionTab.map((element, index) => (
                            <TabPanel
                                key={index}
                                value={value}
                                index={index}>
                                <CheckList
                                    listData={setAutoCompleteList(permissionList, "name", "id")}
                                    selectedPermission={userParams.permission}
                                    disabled={selectedElement && selectedElement.isSystemRole}
                                    onValueSelection={(value: any) => {
                                        editMode && appDispatch(enableActionButton());
                                        setUserParams({
                                            ...userParams,
                                            permission: value,
                                        });
                                    }}
                                />
                            </TabPanel>
                        ))}

                    </div>
                </div>
                }
            </div>
        </ModalContainer >
    );

    function clearData() {
        editMode && appDispatch(enableActionButton());
        setUserParams({});
        setError({});
    }

    function createNewRole() {
        setLoading(true);
        if (userParams.id) {
            let UserRolesAndPermissionsParams = createRolesPermissionParams(userParams, userParams.id);
            appDispatch(setRolePermissionsList(UserRolesAndPermissionsParams)).then((response: any) => {
                if (response) {
                    if (message) {
                        appDispatch(showAlert(message))
                    } else {
                        response.message && appDispatch(showAlert(response.message));
                    }
                    clearData();
                    onSuccess();
                }
                setLoading(false);
            });

        } else {
            let newRoleParams = createRolesParams(userParams);
            appDispatch(createRole(newRoleParams)).then((response: any) => {
                if (response && response.details && response.details.id) {
                    message = response.message && response.message;
                    setUserParams({
                        ...userParams,
                        id: response.details.id
                    });
                    let UserRolesAndPermissionsParams = createRolesPermissionParams(userParams, response.details.id);
                    return appDispatch(setRolePermissionsList(UserRolesAndPermissionsParams));
                }
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
                setLoading(false);
            })
        }
    }
}

export default CreateRoleModal;
