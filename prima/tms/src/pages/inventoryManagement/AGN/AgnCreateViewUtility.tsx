import { Add, Close } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { errorDestination, errorOrigin } from '../../../base/constant/MessageUtils';
import { convertDateTimeServerFormat } from "../../../base/utility/DateUtils";
import { isNullValue, isNullValueOrZero } from '../../../base/utility/StringUtils';
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import Button from "../../../component/widgets/button/Button";
import NumberEditText from "../../../component/widgets/NumberEditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchProductList } from '../../../serviceActions/ProductServiceActions';

export function validateAgnData(userParams: any, appDispatch: any) {
    if (isNullValue(userParams.orderId)) {
        return { orderId: "Enter valid order code" }
    } else if (isNullValue(userParams.shipmentId)) {
        return { shipmentId: "Enter valid shipment code" }
    } else if (isNullValue(userParams.origin)) {
        return { origin: errorOrigin }
    } else if (isNullValue(userParams.destination)) {
        return { destination: errorDestination }
    } else if (isNullValue(userParams.expectedDatetime)) {
        return { expectedDatetime: "Select expected date and time " }
    }

    if (!isNullValue(userParams.products)) {
        const productsList = userParams.products.map((element: any) => {
            if (isNullValue(element.product)) {
                element.productError = "Enter valid product name";
            }
            if (isNullValueOrZero(element.units)) {
                element.unitsError = "Enter valid units";
            }
            // if (isNullValue(element.chargeType)) {
            //     element.chargeTypeError = chargeTypeError;
            // }
            // if (isNullValueOrZero(element.chargeAmount)) {
            //     element.chargeAmountError = chargeAmountError;
            // }
            return element;
        });

        const error = productsList.some(function (element: any) {
            return (!isNullValue(element.productError) || !isNullValue(element.unitsError));
            // || !isNullValue(element.chargeTypeError) || !isNullValue(element.chargeAmountError));
        });
        if (error) {
            return {
                ...userParams,
                error: true,
                products: productsList
            };
        }

        return true;
    }
}

export function createAgnParams(userParams: any) {
    return {
        freightOrderCode: userParams.orderId,
        freightShipmentCode: userParams.shipmentId,
        originLocationCode: userParams.origin.value,
        destinationLocationCode: userParams.destination.value,
        expectedDatetime: convertDateTimeServerFormat(userParams.expectedDatetime),
        productDetails: userParams.products.map((element: any) => ({
            productName: element.product.label,
            productSku: element.product.value,
            expectedCount: element.units
        }))

    }
}

interface RenderChargesProps {
    element: any,
    onAdd: any,
    onRemove: any,
    onSelectProduct: any,
    onChangeProduct: any,
    onChangeQuantity: any,
    isAddButton: boolean,
}


export function RenderProducts(props: RenderChargesProps) {
    const appDispatch = useDispatch();
    const { isAddButton, onAdd, onRemove, element, onSelectProduct, onChangeProduct, onChangeQuantity } = props;
    const [articleList, setArticleList] = React.useState<Array<OptionType> | undefined>(undefined);
    return (
        <div className="custom-form-row modal-create-row row">
            <div className="col-10 col-md-11 align-items-center">
                <div className="row align-items-center">
                    <div className="form-group pr-m-0 col-6 col-md-6 col-lg-6 text-overflow">
                        <AutoSuggest
                            label="Product  Name"
                            mandatory
                            placeHolder="Enter Product Name"
                            suggestions={articleList}
                            error={element.productError}
                            value={element.productName}
                            onChange={(text: string) => {
                                onChangeProduct(text, element.index);
                            }}
                            handleSuggestionsFetchRequested={({ value }: any) => {
                                if (value.length > autosuggestSearchLength) {
                                    appDispatch(searchProductList({ query: value })).then((response: any) => {
                                        response && response.results && setArticleList(setAutoCompleteListWithData(response.results, "name", "sku"));
                                    })
                                }
                            }}
                            onSelected={(article: OptionType) => {
                                onSelectProduct(article, element.index)
                            }}
                        />
                    </div>
                    <div className="form-group pr-m-0 pr-0 col-6 col-md-6 col-lg-6">
                        <NumberEditText
                            label="Units"
                            mandatory
                            placeholder="Enter Units"
                            maxLength={9}
                            decimalSeparator={false}
                            value={element.units}
                            error={element.unitsError}
                            onChange={(value: any) => {
                                onChangeQuantity(value, element.index);
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="form-group col-2 col-md-1 col-lg-1 creat-add-btn add-button-wrapp">
                <Button
                    buttonStyle={(isAddButton) ? "add-btn" : "minus-btn"}
                    leftIcon={(isAddButton) ? <Add /> : <Close />}
                    onClick={() => {
                        (isAddButton) ? onAdd(element) : onRemove(element);
                    }}
                />
            </div>
        </div>
    );
}

