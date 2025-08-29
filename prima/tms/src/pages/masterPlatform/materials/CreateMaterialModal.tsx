import { ArrowRightAlt, ClearAll } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { materialPackagingOptionsList, volumeUomOptionsList, weightUomOptionsList } from "../../../base/constant/ArrayList";
import { codeHint, createMaterialTitle, descriptionHint, descriptionPlaceholder, nameHint, skuCodeLabel, skuCodePlaceholder } from '../../../base/constant/MessageUtils';
import { isNullValue, isNullValueOrZero, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import CheckboxWidget from '../../../component/widgets/checkbox/CheckboxWidget';
import EditText from "../../../component/widgets/EditText";
import NumberEditText from '../../../component/widgets/NumberEditText';
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import ModalContainer from "../../../modals/ModalContainer";
import { descriptionLength } from "../../../moduleUtility/ConstantValues";
import { showAlert } from '../../../redux/actions/AppActions';
import { createMaterial } from '../../../serviceActions/MaterialServiceActions';

interface CreateMaterialModalProps {
    open: boolean
    onClose: any
    onSuccess: any,
    selectedElement: any,
}

function CreateMaterialModal(props: CreateMaterialModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, selectedElement, onSuccess } = props;
    let editMode = !isObjectEmpty(selectedElement)
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isBulk, setIsBulk] = React.useState<boolean>(false);

    useEffect(() => {
        if (open) {
            if (selectedElement && editMode) {
                if (selectedElement.isBulk === true) {
                    setIsBulk(true);
                };
                setUserParams({
                    ...selectedElement,
                    packagingElement: {
                        label: selectedElement.packaging,
                        value: selectedElement.packaging,
                    },
                    volumeUomElement: {
                        label: selectedElement.volumeUom,
                        value: selectedElement.volumeUom,
                    },
                    weightUomElement: {
                        label: selectedElement.weightUom,
                        value: selectedElement.weightUom,
                    }
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedElement, open]);

    return (
        <ModalContainer
            title={editMode ? "Material Details" : createMaterialTitle}
            primaryButtonTitle={editMode ? "Update" : "Create"}
            secondaryButtonTitle={editMode ? "" : "Clear"}
            open={open}
            loading={loading}
            styleName="createMaterialModal"
            primaryButtonType="submit"
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            onClose={() => {
                clearData();
                onClose();
            }}
            onApply={() => {
                if (validateData()) {
                    setLoading(true);
                    let materialParams: any = {
                        ...userParams,
                        isBulk: isBulk,
                    }
                    appDispatch(createMaterial(materialParams, editMode)).then((response: any) => {
                        if (response && response.message) {
                            clearData();
                            appDispatch(showAlert(response.message));
                            onSuccess();
                        }
                        setLoading(false);
                    });
                }
            }}
            onClear={() => {
                clearData();
            }}
        >
            <div className="custom-form-row row createMaterial">
                <div className="form-group col-md-12 reduce-margin">
                    <CheckboxWidget
                        checked={isBulk}
                        onCheckChange={() => {
                            setIsBulk((prevCheck) => !prevCheck)
                            updateParams()
                        }}

                    />
                    <span className="checkLabel">Bulk</span>
                </div>
                <div className="form-group col-md-6">
                    <EditText
                        label={nameHint}
                        mandatory
                        placeholder={"Select Name"}
                        required={true}
                        name="name"
                        error={error.name}
                        maxLength={50}
                        value={userParams.name}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                name: text
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <EditText
                        label={codeHint}
                        mandatory
                        placeholder={"Enter Code"}
                        maxLength={50}
                        required
                        error={error.code}
                        disabled={editMode}
                        value={userParams.code}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                code: text
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-3 input-pr-0">
                    <NumberEditText
                        label={"Weight"}
                        placeholder={"Enter Weight"}
                        maxLength={7}
                        decimalScale={4}
                        allowNegative={false}
                        required={!isBulk}
                        mandatory={!isBulk}
                        disabled={isBulk}
                        error={error.weight}
                        type='number'
                        value={isBulk === true ? '' : userParams && userParams.weight}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                weight: Number(text),
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-3">
                    <AutoComplete
                        label="UOM"
                        placeHolder="Select Weight Unit"
                        options={weightUomOptionsList}
                        value={!isBulk && userParams && userParams.weightUomElement}
                        error={error.weightUomElement}
                        mandatory={!isBulk}
                        isDisabled={isBulk}
                        onChange={(value: OptionType) => {
                            setUserParams({
                                ...userParams,
                                weightUomElement: value,
                                weightUom: value?.value,
                            });
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group col-md-3 input-pr-0">
                    <NumberEditText
                        label={"Volume"}
                        placeholder={"Enter Volume"}
                        maxLength={7}
                        decimalScale={4}
                        allowNegative={false}
                        required={!isBulk}
                        mandatory={!isBulk}
                        error={error.volume}
                        type='number'
                        value={isBulk === true ? '' : userParams && userParams.volume}
                        disabled={isBulk}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                volume: Number(text),
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-3">
                    <AutoComplete
                        label="UoM"
                        placeHolder="Select Volume Unit"
                        error={error.volumeUomElement}
                        isDisabled={isBulk}
                        mandatory={!isBulk}
                        value={!isBulk && userParams && userParams.volumeUomElement}
                        options={volumeUomOptionsList}
                        onChange={(value: OptionType) => {
                            setUserParams({
                                ...userParams,
                                volumeUomElement: value,
                                volumeUom: value?.value,
                            });
                            setError({});
                        }}
                    />
                </div>
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-3 p-0">
                            <div className="form-group col-md-12 input-pr-0">
                                <AutoComplete
                                    label="Packaging"
                                    placeHolder="Select Packaging Type"
                                    error={error.packagingElement}
                                    isDisabled={isBulk}
                                    mandatory={!isBulk}
                                    value={isBulk === true ? [] : userParams && userParams.packagingElement}
                                    options={materialPackagingOptionsList}
                                    onChange={(value: OptionType) => {
                                        setUserParams({
                                            ...userParams,
                                            packagingElement: value,
                                            packaging: value?.value,
                                        });
                                        setError({});
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="row">
                                <div className="form-group col-md-3 input-pr-0">
                                    <NumberEditText
                                        label={"Length(m)"}
                                        placeholder={"Enter Length"}
                                        maxLength={7}
                                        decimalScale={4}
                                        allowNegative={false}
                                        required={!isBulk}
                                        disabled={isBulk}
                                        error={error.length}
                                        type='number'
                                        value={isBulk === true ? '' : userParams && userParams.length}
                                        onChange={(text: any) => {
                                            setError({});
                                            setUserParams({
                                                ...userParams,
                                                length: Number(text),
                                            });
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-3 input-pr-0">
                                    <NumberEditText
                                        label={"Breadth(m)"}
                                        placeholder={"Enter Breadth"}
                                        maxLength={6}
                                        decimalScale={3}
                                        allowNegative={false}
                                        type='number'
                                        required={!isBulk}
                                        disabled={isBulk}
                                        error={error.width}
                                        value={isBulk === true ? '' : userParams && userParams.width}
                                        onChange={(text: any) => {
                                            setError({});
                                            setUserParams({
                                                ...userParams,
                                                width: Number(text),
                                            });
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-3 input-pr-0">
                                    <NumberEditText
                                        label={"Height(m)"}
                                        placeholder={"Enter Height"}
                                        maxLength={6}
                                        decimalScale={3}
                                        allowNegative={false}
                                        type='number'
                                        required={!isBulk}
                                        disabled={isBulk}
                                        error={error.height}
                                        value={isBulk === true ? '' : userParams && userParams.height}
                                        onChange={(text: any) => {
                                            setError({});
                                            setUserParams({
                                                ...userParams,
                                                height: Number(text),
                                            });
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <NumberEditText
                                        label={"Units"}
                                        placeholder={"Enter Units"}
                                        maxLength={6}
                                        decimalScale={3}
                                        allowNegative={false}
                                        type='number'
                                        required={!isBulk}
                                        mandatory={!isBulk}
                                        disabled={isBulk}
                                        error={error.units}
                                        value={isBulk === true ? '' : userParams && userParams.units}
                                        onChange={(text: any) => {
                                            setError({});
                                            setUserParams({
                                                ...userParams,
                                                units: Number(text),
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group col-md-5">
                    <EditText
                        label={skuCodeLabel}
                        placeholder={skuCodePlaceholder}
                        maxLength={50}
                        mandatory
                        value={userParams.skuCode}
                        error={error.skuCode}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                skuCode: text
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-7">
                    <EditText
                        label={descriptionHint}
                        placeholder={descriptionPlaceholder}
                        maxLength={descriptionLength}
                        required
                        error={error.description}
                        value={userParams.description}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                description: text
                            });
                        }}
                    />
                </div>
            </div>
        </ModalContainer>
    );

    function updateParams() {
        if (isBulk === true) {
            setUserParams((userParams: any) => {
                return {
                    name: userParams.name,
                    code: userParams.code,
                    skuCode: userParams.skuCode,
                    description: userParams.description,
                    isBulk: isBulk,
                }
            });
        }
    }
    function clearData() {
        setUserParams({});
        setError({});
        setIsBulk(false);
    }

    function validateData() {

        if (isNullValue(userParams.name)) {
            setError({
                name: "Enter valid name"
            });
            return false;
        } else if (isNullValue(userParams.code)) {
            setError({
                code: "Enter valid code"
            });
            return false;
        }

        if (isBulk === false) {
            if (isNullValueOrZero(userParams.weight)) {
                setError({
                    weight: "Enter valid weight"
                });
                return false;
            } else if (userParams.weightUomElement && isNullValue(userParams.weightUomElement.value)) {
                setError({
                    weightUomElement: "Select valid Weight Unit"
                });
                return false;
            } else if (isNullValueOrZero(userParams.volume)) {
                setError({
                    volume: "Enter valid Volume"
                });
                return false;
            } else if (userParams.volumeUomElement && isNullValue(userParams.volumeUomElement.value)) {
                setError({
                    volumeUomElement: "Select valid Volume Unit"
                });
                return false;
            } else if (userParams.packagingElement && isNullValue(userParams.packagingElement.value)) {
                setError({
                    packagingElement: "Select valid Packaging Method"
                });
                return false;
            } else if (isNullValueOrZero(userParams.units)) {
                setError({
                    units: "Enter valid units"
                });
                return false;
            }
        }
        if (isNullValue(userParams.skuCode)) {
            setError({
                skuCode: "Enter valid SKU code"
            });
            return false;
        }
        return true;
    }

}

export default CreateMaterialModal;
