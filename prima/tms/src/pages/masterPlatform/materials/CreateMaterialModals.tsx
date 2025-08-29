import { ArrowRightAlt, ClearAll } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    codeHint,
    codePlaceholder, createMaterialTitle, descriptionHint, descriptionPlaceholder, heighthPlaceholder, lengthPlaceholder, maxWeightHint, maxWeightPlaceholder, nameHint, namePlaceholder, skuCodeLabel, skuCodePlaceholder, unitsLabel, unitsPlaceholder,
    widthPlaceholder
} from '../../../base/constant/MessageUtils';
import { isNullValue, isNullValueOrZero, isObjectEmpty } from "../../../base/utility/StringUtils";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from '../../../component/widgets/NumberEditText';
import ModalContainer from "../../../modals/ModalContainer";
import { descriptionLength } from "../../../moduleUtility/ConstantValues";
import { materialElementData } from "../../../moduleUtility/MaterialUtility";
import { showAlert } from '../../../redux/actions/AppActions';
import { Material } from '../../../redux/storeStates/MaterialStoreInterface';
import { createMaterial } from '../../../serviceActions/MaterialServiceActions';

interface CreateMaterialModalsProps {
    open: boolean
    onClose: any
    onSuccess: any,
    selectedElement: any,
}

function CreateMaterialModals(props: CreateMaterialModalsProps) {
    const appDispatch = useDispatch();
    const { open, onClose, selectedElement, onSuccess } = props;
    let editMode = !isObjectEmpty(selectedElement)
    const [userParams, setUserParams] = React.useState<Material>(materialElementData);
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);

    useEffect(() => {
        open && editMode && setUserParams(selectedElement);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedElement, open]);

    return (
        <ModalContainer
            title={editMode ? "Material Details" : createMaterialTitle}
            primaryButtonTitle={editMode ? "Update" : "Create"}
            secondaryButtonTitle={editMode ? "" : "Clear"}
            open={open}
            loading={loading}
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
                    let params = {
                        ...userParams,
                        units: Number(userParams.units)
                    }
                    appDispatch(createMaterial(params, editMode)).then((response: any) => {
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

            <div className="custom-form-row row">
                <div className="form-group col-md-6">
                    <EditText
                        label={nameHint}
                        mandatory
                        placeholder={namePlaceholder}
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
                        placeholder={codePlaceholder}
                        maxLength={25}
                        required
                        disabled={editMode}
                        error={error.code}
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
                <div className="form-group col-md-6">
                    <NumberEditText
                        label={"Length (m)"}
                        placeholder={lengthPlaceholder}
                        maxLength={7}
                        decimalScale={4}
                        allowNegative={false}
                        required
                        mandatory
                        error={error.length}
                        type='number'
                        value={userParams.length}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                length: Number(text)
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        label={"Height (m)"}
                        placeholder={heighthPlaceholder}
                        maxLength={7}
                        decimalScale={4}
                        allowNegative={false}
                        required
                        mandatory
                        error={error.height}
                        type='number'
                        value={userParams.height}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                height: Number(text)
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        label={"Width (m)"}
                        placeholder={widthPlaceholder}
                        maxLength={7}
                        decimalScale={4}
                        allowNegative={false}
                        required
                        mandatory
                        error={error.width}
                        type='number'
                        value={userParams.width}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                width: Number(text)
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        label={maxWeightHint}
                        placeholder={maxWeightPlaceholder}
                        maxLength={6}
                        decimalScale={3}
                        allowNegative={false}
                        type='number'
                        required
                        mandatory
                        error={error.maxWeight}
                        value={userParams.maxWeight}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                maxWeight: Number(text)
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
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
                <div className="form-group col-md-6">
                    <NumberEditText
                        label={unitsLabel}
                        placeholder={unitsPlaceholder}
                        maxLength={8}
                        mandatory
                        allowNegative={false}
                        decimalScale={3}
                        allowZero
                        value={userParams.units}
                        error={error.units}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                units: text
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-12">
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

    function clearData() {
        setUserParams(materialElementData);
        setError({});
    }

    function validateData() {
        if (isNullValue(userParams.name)) {
            setError({
                name: "Enter valid name."
            });
            return false;
        } else if (isNullValue(userParams.code)) {
            setError({
                code: "Enter valid code"
            });
            return false;
        } else if (isNullValueOrZero(userParams.length)) {
            setError({
                length: "Enter valid length"
            });
            return false;
        } else if (isNullValueOrZero(userParams.height)) {
            setError({
                height: "Enter valid height"
            });
            return false;
        } else if (isNullValueOrZero(userParams.width)) {
            setError({
                width: "Enter valid width"
            });
            return false;
        } else if (isNullValueOrZero(userParams.maxWeight)) {
            setError({
                maxWeight: "Enter valid max weight"
            });
            return false;
        } else if (isNullValue(userParams.skuCode)) {
            setError({
                skuCode: "Enter valid SKU code"
            });
            return false;
        } else if (isNullValueOrZero(userParams.units)) {
            setError({
                units: "Enter valid max units"
            });
            return false;
        }
        // else if (isNullValue(userParams.description)) {
        //     setError({
        //         description: "Enter valid description"
        //     });
        //     return false;
        // }
        return true;

    }

}

export default CreateMaterialModals;
