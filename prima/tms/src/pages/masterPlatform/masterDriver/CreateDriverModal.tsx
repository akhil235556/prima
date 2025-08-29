import { ArrowRightAlt, ClearAll } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { isNullValue } from "../../../base/utility/StringUtils";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from '../../../component/widgets/NumberEditText';
import ModalContainer from "../../../modals/ModalContainer";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { hideLoader, showAlert } from "../../../redux/actions/AppActions";
import { driverMobileLabel, driverMobilePlaceholder, driverNameLabel, driverNamePlaceholder } from "./base/MasterDriverMessageUtils";
import { createDriver, updateDriver } from "./masterDriverApi/MasterDriverServiceActions";
import { RenderAddDocs, validateData } from "./MasterDriverUtils";

interface CreateDriverModalProps {
    open: boolean
    onClose: any
    selectedElement: any
    onSuccess: any,
    certificateOptions: any,
}

function CreateDriverModal(props: CreateDriverModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, selectedElement, onSuccess, certificateOptions } = props;
    let editMode = !isNullValue(selectedElement.driverName);
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [requiredCertificate, setRequiredCertificate] = React.useState<any>([]);
    const [initialTemplate, setInitialTemplate] = React.useState<any>(undefined);

    const addDriverDocsErrorInfo = {
        idNameError: "",
        idNumberError: "",
        idIssueError: "",
        idExpiryError: ""
    }
    useEffect(() => {
        if (open) {
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
                const driverCertificates = setAutoCompleteListWithData(selectedElement.identityProofs, "idDisplayName", "idType");
                const list: any = driverCertificates?.map((element: any, index: number) => ({
                    index: index,
                    certName: element,
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
                    driverName: selectedElement.driverName,
                    contactNumber: selectedElement.contactNumber,
                    isActive: selectedElement.isActive,
                    certificateList: list,
                    nonReqdCertificateList: remainingCert
                });
                return;
            }
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
                driverName: selectedElement.driverName,
                contactNumber: selectedElement.contactNumber,
                certificateList: reqdList,
                nonReqdCertificateList: nonReqdList
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <ModalContainer
            title={editMode ? "Driver Details" : "Create Driver"}
            primaryButtonTitle={editMode ? "Update" : "Create"}
            secondaryButtonTitle={editMode ? "" : "Clear"}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            loading={loading}
            open={open}
            onClose={() => {
                setUserParams({})
                setError({})
                onClose()
            }}
            onApply={() => {
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
                            onSuccess();
                            // dispatch(refreshList());
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
            onClear={() => {
                setUserParams({
                    driverName: selectedElement.drivername,
                    contactNumber: selectedElement.driverNumber,
                    certificateList: initialTemplate?.initialList,
                    nonReqdCertificateList: initialTemplate?.nonReqdInitialList
                })
                setError({})
            }}
        >
            <div className="custom-form-row row align-items-end">
                <div className="form-group col-md-6">
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
                <div className="form-group col-md-6">
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
                <div className="form-group col-md-12">
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
        </ModalContainer>
    );
    function addDriverParams(params: any) {
        let driverParams: any = {
            contactNumber: params.contactNumber,
            driverName: params.driverName,
            isActive: true,
            driverId: params.id,
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


}

export default CreateDriverModal;