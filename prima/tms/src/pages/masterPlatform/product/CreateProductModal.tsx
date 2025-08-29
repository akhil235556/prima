import { ArrowRightAlt, ClearAll } from "@material-ui/icons";
import React from "react";
import { useDispatch } from 'react-redux';
import { productTypeOptions } from "../../../base/constant/ArrayList";
import { productTypeLabel, productTypePlaceholder } from '../../../base/constant/MessageUtils';
import { isNullValue } from '../../../base/utility/StringUtils';
import AutoComplete from '../../../component/widgets/AutoComplete';
import EditText from "../../../component/widgets/EditText";
import NumberEditText from "../../../component/widgets/NumberEditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import ModalContainer from "../../../modals/ModalContainer";
import { descriptionLength } from "../../../moduleUtility/ConstantValues";
import { showAlert } from '../../../redux/actions/AppActions';
import { createProduct } from '../../../serviceActions/ProductServiceActions';

interface CreateVehicleModalProps {
    open: boolean
    onClose: any
    selectedElement: any
    onSuccess: any
}

function CreateProductModal(props: CreateVehicleModalProps) {

    const appDispatch = useDispatch();
    const { open, onClose, onSuccess } = props;
    // let editMode = !isObjectEmpty(selectedElement);
    let editMode = false;

    const [params, setParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);

    return (
        <ModalContainer
            title={editMode ? "Product Details" : "Create Product"}
            primaryButtonTitle={editMode ? "Update" : "Create"}
            secondaryButtonTitle={editMode ? "" : "Clear"}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            loading={loading}
            secondaryButtonDisable={loading}
            open={open}
            onClose={() => {
                setParams({});
                setError({});
                onClose();
            }}
            onApply={() => {
                if (validateData()) {
                    setLoading(true);

                    appDispatch(createProduct(params)).then((response: any) => {
                        if (response) {
                            setParams({});
                            setError({});
                            appDispatch(showAlert(response.message));
                            onSuccess();
                        }
                        setLoading(false);
                    });
                }
            }}
            onClear={() => {
                setParams({});
                setError({});
            }}
        >
            <div className="custom-form-row row">
                <div className="form-group col-md-6">
                    <EditText
                        label={"Product Name"}
                        placeholder={"Enter Product Name"}
                        maxLength={50}
                        mandatory
                        error={error.name}
                        value={params.name}
                        onChange={(text: any) => {
                            setParams({
                                ...params,
                                name: text
                            });
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <AutoComplete
                        label={productTypeLabel}
                        placeHolder={productTypePlaceholder}
                        // mandatory
                        value={params && params.productTypeCode ? {
                            label: params.productTypeName,
                            value: params.productTypeCode
                        } : undefined}
                        error={error.productTypeCode}
                        options={productTypeOptions}
                        onChange={(element: OptionType) => {
                            setParams({
                                ...params,
                                productTypeName: element.label,
                                productTypeCode: element.value
                            })
                            setError({});
                        }}

                    />
                </div>
                <div className="form-group col-md-6">
                    <EditText
                        label={"SKU"}
                        placeholder={"Enter SKU"}
                        maxLength={25}
                        mandatory
                        value={params.sku}
                        error={error.sku}
                        onChange={(text: any) => {
                            setError({});
                            setParams({
                                ...params,
                                sku: text
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        label={"Price ( \u20B9 )"}
                        placeholder={"Enter price"}
                        maxLength={7}
                        decimalScale={2}
                        allowNegative={false}
                        error={error.mrp}
                        type='number'
                        value={params.mrp}
                        onChange={(text: any) => {
                            setParams({
                                ...params,
                                mrp: isNullValue(text) ? 0 : text
                            });
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <EditText
                        label={"Description"}
                        placeholder={"Enter Description"}
                        maxLength={descriptionLength}
                        value={params.description}
                        onChange={(text: any) => {
                            setParams({
                                ...params,
                                description: text
                            });
                            setError({});
                        }}
                    />
                </div>
            </div>

        </ModalContainer>
    );


    function validateData() {
        if (isNullValue(params.name)) {
            setError({
                name: "Enter valid product name"
            });
            return false;
        }
        // else if (isNullValue(params.productTypeCode)) {
        //     setError({
        //         productTypeCode: "Select product type"
        //     });
        //     return false;
        // }
        else if (isNullValue(params.sku)) {
            setError({
                sku: "Enter valid SKU"
            });
            return false;
        }
        return true;
    }

}

export default CreateProductModal;
