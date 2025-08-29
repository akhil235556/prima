import { Card, CardContent, CardHeader } from "@material-ui/core";
import { ArrowRightAlt, ClearAll, KeyboardBackspace } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { vehicleSourceTypeList } from "../../../base/constant/ArrayList";
import { dedicatedHubPlaceholder, dedicatedLabel } from "../../../base/constant/MessageUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Filter from "../../../component/filter/Filter";
import PageContainer from "../../../component/pageContainer/PageContainer";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import Button from "../../../component/widgets/button/Button";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from '../../../component/widgets/NumberEditText';
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { hideLoader, showAlert } from "../../../redux/actions/AppActions";
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";
import { driverMobileLabel, driverMobilePlaceholder, driverNameLabel, driverNamePlaceholder } from "./base/MasterDriverMessageUtils";
import "./CreateDriver.css";
import { createDriver, getDriversTemplate, updateDriver } from "./masterDriverApi/MasterDriverServiceActions";
import { RenderAddDocs, validateData } from "./MasterDriverUtils";


function CreateDriver() {
    const appDispatch = useDispatch();
    const history = useHistory();
    const location: any = useLocation();
    let editMode: boolean = location.state ? true : false;
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const selectedElement: any = location?.state?.selectedElement ? location?.state?.selectedElement : { certificateList: [{ index: 0 }] }
    const [requiredCertificate, setRequiredCertificate] = React.useState<any>([]);
    const [initialTemplate, setInitialTemplate] = React.useState<any>(undefined);
    const [certificateOptions, setCertificateOptions] = React.useState<any>([]);
    const [dedicatedHubSuggestion, setDedicatedHubSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);

    const addDriverDocsErrorInfo = {
        idNameError: "",
        idNumberError: "",
        idIssueError: "",
        idExpiryError: ""
    }
    useEffect(() => {
        appDispatch(getDriversTemplate()).then((response: any) => {
            if (response) {
                setCertificateOptions(setAutoCompleteListWithData(response, "idDisplayName", "idName"));
            }
        })
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (certificateOptions && certificateOptions.length) {
            const option = certificateOptions.map((info: any) => {
                if (info.data?.isRequired) {
                    return info.value
                }
                return undefined;
            }).filter((ele: any) => ele)
            setRequiredCertificate(option)
        }
        if (editMode) {
            const driverCertificates = setAutoCompleteListWithData(selectedElement?.identityProofs, "idDisplayName", "idType");
            const list: any = driverCertificates?.map((element: any, index: number) => ({
                index: index,
                certName: certificateOptions[index]?.data?.expiryRequired ? { ...element, data: { ...element.data, expiryRequired: true } } : element,
                idName: element.data.idType,
                idNumber: element.data.idNumber,
                idExpiry: element.data.idExpiry,
                idIssue: element.data.idIssue
            }))
            list.push({ index: driverCertificates.length })
            const remainingCert = certificateOptions.filter((element: any, index: number) => !element.data?.isRequired)
                .map((element: any, index: number) => ({
                    ...element,
                    index: index,
                }))
            const remainingList = JSON.parse(JSON.stringify(remainingCert))
            const initTemplate = {
                initialList: list,
                nonReqdInitialList: remainingList
            }
            setInitialTemplate(initTemplate)
            setUserParams({
                ...userParams,
                ...selectedElement,
                driverName: selectedElement?.driverName,
                contactNumber: selectedElement?.contactNumber,
                isActive: selectedElement?.isActive,
                certificateList: list,
                nonReqdCertificateList: remainingCert,
                isDedicated: {
                    label: selectedElement?.isDedicated === true ? "Dedicated" : "Market",
                    value: selectedElement?.isDedicated ? String(selectedElement?.isDedicated) : "false",
                },
                locationName: {
                    label: selectedElement?.locationName,
                    value: selectedElement?.locationCode
                }

            });
            return;
        }
        if (certificateOptions) {
            const reqdList: any = certificateOptions?.filter((element: any, index: number) => element.data?.isRequired)
                .map((element: any, index: number) => ({
                    index: index,
                    certName: element,
                }))
            reqdList.push({ index: reqdList.length })
            const nonReqdList = certificateOptions.filter((element: any, index: number) => !element.data?.isRequired)
                .map((element: any, index: number) => ({
                    ...element,
                    index: index,
                }))
            const initialList = JSON.parse(JSON.stringify(reqdList))
            const nonReqdInitialList = JSON.parse(JSON.stringify(nonReqdList))
            const initTemplate = {
                initialList: initialList,
                nonReqdInitialList: nonReqdInitialList
            }
            setInitialTemplate(initTemplate)
            setUserParams({
                ...userParams,
                ...selectedElement,
                driverName: selectedElement?.driverName,
                contactNumber: selectedElement?.contactNumber,
                certificateList: reqdList,
                nonReqdCertificateList: nonReqdList
            });
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [certificateOptions]);
    return (<><div className="filter-wrap">
        <Filter
            pageTitle={editMode ? "Driver Details" : "Create Driver"}
            buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
            buttonTitle={isMobile ? " " : "Back"}
            leftIcon={<KeyboardBackspace />}
            onClick={() => {
                history.goBack()
            }}
        >
        </Filter>
    </div>
        <PageContainer>
            <Card className="creat-contract-wrapp creat-wrapp">
                <CardHeader className="creat-contract-header"
                    title="Driver Details"
                />
                {loading ?
                    <CardContentSkeleton
                        row={2}
                        column={3}
                    />
                    : (
                        <CardContent className="creat-contract-content">
                            <div className="custom-form-row row align-items-end">
                                <div className="form-group col-md-4">
                                    <EditText
                                        label={driverNameLabel}
                                        mandatory
                                        placeholder={driverNamePlaceholder}
                                        maxLength={20}
                                        value={userParams.driverName}
                                        error={error.driverName}
                                        // disabled={editMode}
                                        onChange={(text: any) => {
                                            setUserParams({
                                                ...userParams,
                                                driverName: text
                                            });
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <NumberEditText
                                        label={driverMobileLabel}
                                        mandatory
                                        placeholder={driverMobilePlaceholder}
                                        maxLength={10}
                                        value={userParams.contactNumber}
                                        allowNegative={false}
                                        required
                                        error={error.contactNumber}
                                        type='number'
                                        onChange={(text: any) => {
                                            setUserParams({
                                                ...userParams,
                                                contactNumber: text
                                            });
                                            setError({})
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <AutoComplete
                                        label="Source Type"
                                        placeHolder="Select Source Type"
                                        options={vehicleSourceTypeList}
                                        mandatory
                                        value={userParams && userParams.isDedicated}
                                        error={error.isDedicated}
                                        onChange={(value: OptionType) => {
                                            setUserParams({
                                                ...userParams,
                                                isDedicated: value,
                                                locationName: ""
                                            });
                                            setError({});
                                        }}
                                    />
                                </div>
                                {userParams?.isDedicated?.value === 'true' &&
                                    <div className="form-group col-md-4">
                                        <div>
                                            <AutoSuggest
                                                label={dedicatedLabel}
                                                placeHolder={dedicatedHubPlaceholder}
                                                value={userParams.locationName.label}
                                                error={error.dedicatedHubError}
                                                suggestions={dedicatedHubSuggestion}
                                                handleSuggestionsFetchRequested={({ value }: any) => {
                                                    if (value.length > autosuggestSearchLength) {
                                                        getSuggestionList(value, "origin");
                                                    }
                                                }}
                                                onSelected={(element: OptionType) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        locationName: element
                                                    });
                                                    setError({})
                                                }}
                                                onChange={(text: string) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        origin: undefined,
                                                        locationName: { label: text, value: "" }
                                                    });
                                                    setError({})
                                                }}
                                            />
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="custom-form-row row align-items-center">
                                <div className="form-group col-md-12">
                                    <p className="certificate-heading">Add Certificates</p>
                                    {userParams && userParams.certificateList && userParams.certificateList.map((element: any, index: number) => (
                                        <RenderAddDocs
                                            key={index}
                                            element={element}
                                            requiredCertificate={requiredCertificate}
                                            certificateOptions={userParams.nonReqdCertificateList}
                                            onAdd={onAdd}
                                            onRemove={onRemove}
                                            totalLength={userParams.certificateList.length}
                                            // isAddButton={index === 0}
                                            onChangeCertNameType={(idType: any, selectedIndex: number) => {
                                                const addDriverArrayList = userParams.certificateList.map(
                                                    (data: any) => ((data.index === selectedIndex) ? {
                                                        ...data,
                                                        ...addDriverDocsErrorInfo,
                                                        certName: idType,
                                                    } : data));
                                                onChangeDriverDocs(addDriverArrayList)
                                                setError({});
                                            }}
                                            onChangeCertNumber={(idNumber: any, selectedIndex: number) => {
                                                const addDriverArrayList = userParams.certificateList.map(
                                                    ((data: any) => (data.index === selectedIndex) ? {
                                                        ...data,
                                                        ...addDriverDocsErrorInfo,
                                                        idNumber: idNumber,
                                                    } : data)
                                                );
                                                onChangeDriverDocs(addDriverArrayList)
                                                setError({});
                                            }}
                                            onSelectCertIssueDate={(idIssue: any, selectedIndex: number) => {
                                                const addDriverArrayList = userParams.certificateList.map(
                                                    (data: any) => ((data.index === selectedIndex) ? {
                                                        ...data,
                                                        ...addDriverDocsErrorInfo,
                                                        idIssue: idIssue,
                                                    } : data));
                                                onChangeDriverDocs(addDriverArrayList)
                                                setError({});
                                            }}
                                            onSelectCertExpiryDate={(idExpiry: any, selectedIndex: number) => {
                                                const addDriverArrayList = userParams.certificateList.map(
                                                    (data: any) => ((data.index === selectedIndex) ? {
                                                        ...data,
                                                        ...addDriverDocsErrorInfo,
                                                        idExpiry: idExpiry,
                                                    } : data));
                                                onChangeDriverDocs(addDriverArrayList)
                                                setError({});
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    )
                }
            </Card>
            <div className="row text-right">
                <div className="col indent-btn-wrap">
                    {!editMode && <Button
                        buttonStyle={"btn-orange mr-3"}
                        title={"Clear"}
                        leftIcon={<ClearAll />}
                        onClick={() => {
                            setUserParams({
                                driverName: selectedElement?.drivername,
                                contactNumber: selectedElement?.driverNumber,
                                certificateList: initialTemplate?.initialList,
                                nonReqdCertificateList: initialTemplate?.nonReqdInitialList
                            })
                            setError({})
                        }}
                    />}
                    <Button
                        buttonStyle={"btn-blue"}
                        title={editMode ? "Update" : "Create"}
                        loading={loading}
                        leftIcon={<ArrowRightAlt />}
                        onClick={() => {
                            const validate = validateData(userParams, requiredCertificate)
                            if (validate === true) {
                                setLoading(true);
                                const driverAction = editMode ? updateDriver : createDriver
                                const createDriverParams = addDriverParams(userParams);
                                appDispatch(driverAction(createDriverParams)).then((response: any) => {
                                    appDispatch(hideLoader())
                                    if (response) {
                                        setUserParams({});
                                        setError({});
                                        appDispatch(showAlert(response.message));
                                        // dispatch(refreshList());
                                        history.goBack();
                                    }
                                    setLoading(false);
                                })
                            } else if (validate.error) {
                                setUserParams({
                                    ...userParams,
                                    certificateList: validate.certificateList
                                })
                            }
                            else {
                                setError(validate)
                            }
                        }}
                    />
                </div>
            </div>
        </PageContainer>
    </>
    );
    function addDriverParams(params: any) {
        let driverParams: any = {
            contactNumber: params.contactNumber,
            driverName: params.driverName,
            isActive: true,
            driverId: params.id,
            isDedicated: params?.isDedicated?.value,
            locationName: params?.locationName?.label,
            locationCode: params?.locationName?.value,
            driverIds: params.certificateList.filter((item: any) => item.hasOwnProperty('certName')).map((item: any) =>
            ({
                idType: item.idName ? item.idName : item.certName.value,
                idNumber: item.idNumber,
                idExpiry: item.idExpiry,
                idIssue: item.idIssue
            })
            )
        }
        return driverParams;
    }

    function onAdd() {
        const newDriverArr = [...userParams.certificateList, { index: userParams.certificateList.length }];
        setUserParams({
            ...userParams,
            certificateList: newDriverArr
        })
    }

    function onRemove(element: any) {
        let newCertificatesArr = userParams.certificateList && userParams.certificateList.filter((_: any, i: Number) => (element.index !== i));
        let newDriverArr = newCertificatesArr.map((item: any, index: any) => {
            return {
                ...item,
                index: index,
            }
        })
        setUserParams({
            ...userParams,
            certificateList: newDriverArr,
        })
    }

    function onChangeDriverDocs(certificateList: any) {
        setUserParams({
            ...userParams,
            certificateList: certificateList
        })

    }

    function getSuggestionList(text: string, type: string) {
        let queryParams: any = { query: text };
        if (type === "origin") {
            queryParams.node = true;
        }
        appDispatch(searchLocationList(queryParams)).then((response: any) => {
            if (response) {
                setDedicatedHubSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
            }
        })
    }


}

export default CreateDriver;