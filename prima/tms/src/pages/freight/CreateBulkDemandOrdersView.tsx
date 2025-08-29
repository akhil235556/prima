
import { KeyboardBackspace } from "@material-ui/icons";
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { sourceTypeEnum } from "../../base/constant/ArrayList";
import { DOListingUrl, POListingUrl, SOListingUrl, STOListingUrl } from "../../base/constant/RoutePath";
import { convertDateTimeServerFormat } from "../../base/utility/DateUtils";
import { isNullValue, isNullValueOrZero, isObjectEmpty } from "../../base/utility/StringUtils";
import { isMobile } from "../../base/utility/ViewUtils";
import Filter from "../../component/filter/Filter";
import BulkCard from "../../component/widgets/BulkCard";
import Button from "../../component/widgets/button/Button";
import ListingSkeleton from "../../component/widgets/listingSkeleton/ListingSkeleton";
import { setAutoCompleteListWithData } from "../../moduleUtility/DataUtils";
import { showAlert } from "../../redux/actions/AppActions";
import ApplyAll from "./ApplyAll";
import "./CreateBulkDemandOrdersView.css";
import { createBulkDO } from "./demandOrders/demandOrdersApi/demandOrderServiceActions";
import { getBulkPOTemplateDetails } from "./purchaseOrders/purchaseOrdersApi/purchaseOrderServiceActions";
import { getBulkSOTemplateDetails } from "./so/stockOrdersApi/stockOrderServiceActions";
import { getBulkSTOTemplateDetails } from "./sto/stockTransferOrdersApi/stoServiceActions";

function CreateBulkDemandOrders() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [productErrors, setProductErrors] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [bulkProductList, setBulkProductList] = React.useState<any>([]);
    const bulkProductRef = React.useRef<Array<any>>([]);
    const selectedOrdersList: any = history.location.state;
    let doHistoryUrl: string = "";
    let doTypeUrl = history.location.pathname;


    useEffect(() => {
        bulkProductRef.current = bulkProductList
    }, [bulkProductList])

    //function for determining from which type of listing we came from to this component
    const sourceType = () => {
        if (doTypeUrl.includes("bulk-so")) {
            doHistoryUrl = SOListingUrl
            return sourceTypeEnum.SO
        }
        else if (doTypeUrl.includes("bulk-po")) {
            doHistoryUrl = POListingUrl
            return sourceTypeEnum.PO
        } else {
            doHistoryUrl = STOListingUrl
            return sourceTypeEnum.STO
        }
    }

    useEffect(() => {
        let doIds: any = []
        selectedOrdersList && selectedOrdersList.forEach((element: any) => {
            doIds.push(element.id)
        });

        //calling Api for getting listing details
        if (selectedOrdersList) {
            if (sourceType() === sourceTypeEnum.SO) {
                setLoading(true);
                appDispatch(getBulkSOTemplateDetails({ ids: doIds })).then((response: any) => {
                    if (response) {
                        setList(response)
                    }
                })
            } else if (sourceType() === sourceTypeEnum.PO) {
                setLoading(true);
                appDispatch(getBulkPOTemplateDetails({ ids: doIds })).then((response: any) => {
                    if (response) {
                        setList(response)
                    }
                    // setLoading(false);
                })
            } else if (sourceType() === sourceTypeEnum.STO) {
                setLoading(true);
                appDispatch(getBulkSTOTemplateDetails({ ids: doIds })).then((response: any) => {
                    if (response) {
                        setList(response)
                    }
                    // setLoading(false);
                })
            }
        }
        // eslint-disable-next-line
    }, []);


    //function for setting all Stock orders and their products checked
    function setList(listingResponse: any) {
        let bulkProductListArray: any = [];
        bulkProductListArray = listingResponse?.map((element: any) => {
            let updatedElement: any = { ...element }
            let productArray = element && element.product.map((product: any) => {
                let materialOptions: any = setAutoCompleteListWithData(product.materialDetails, "name", "code")
                return {
                    ...product,
                    materialOptions: materialOptions,
                    material: null,
                    isCheckboxChecked: true,
                }
            })
            updatedElement.product = productArray
            updatedElement.isCheckboxChecked = true
            return updatedElement;
        })
        setBulkProductList(bulkProductListArray)
        setLoading(false)
    }

    return (
        <div className="do-creation-wrapper">
            <div className="filter-wrap">
                <Filter
                    pageTitle={"DO Creation"}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        sourceType()
                        history.push({
                            pathname: doHistoryUrl,
                            state: { isBulk: true }
                        })
                    }}
                >
                </Filter>
            </div>
            <div className="dispatch-card-wrapper">
                <ApplyAll
                    onApply={applyBulk}
                />
                {loading ?
                    <ListingSkeleton /> :
                    bulkProductList && bulkProductList.map((item: any, index: number) => (
                        <BulkCard
                            key={index}
                            orderData={item}
                            productErrors={productErrors}
                            updateBulkproductList={updateBulkproductList}
                        />
                    ))
                }
                <div className="row text-right">
                    <div className="col indent-btn-wrap">
                        <Button
                            title={"Cancel"}
                            onClick={onCancel}
                            rightIcon={""}
                            leftIcon={<CloseIcon />}
                            buttonStyle={"btn-orange mr-3"}
                            primaryButton={false}
                        />
                        <Button
                            title={"Create Demand"}
                            onClick={onClickCreateDemand}
                            rightIcon={""}
                            leftIcon={<img src="/images/Create-demand-white.png" alt="weight" />}
                            buttonStyle={"btn-blue demand-icon-white"}
                            primaryButton={true}
                        />
                    </div>
                </div>
            </div>
        </div>)


    //function for creating bulk demand orders on click or //Create Demand// button
    function onClickCreateDemand() {
        setBulkProductList(bulkProductRef.current)
        let selectedOrdersList = bulkProductRef.current.filter((item: any, index: any) => item.isCheckboxChecked === true);
        if (selectedOrdersList && selectedOrdersList.length > 0) {
            let createBulkDoParams: any = []
            let errors: any = {}
            selectedOrdersList.forEach((order: any) => {
                let selectedProductList = order.product && order.product.filter((product: any) => (product.isCheckboxChecked === true))
                if (selectedProductList && selectedProductList.length > 0) {
                    const validate: any = validateData(selectedProductList, order)
                    if (validate === false) {
                        selectedProductList = selectedProductList.map((item: any) => {
                            return {
                                ...item,
                                productQuantity: parseFloat(item.productQuantity),
                                materialName: item.material?.label,
                                materialCode: item.material?.value,
                                doMaterialUnits: item.doMaterialUnits ? parseInt(item.doMaterialUnits) : 0
                            }
                        })
                        selectedProductList = selectedProductList.map((item: any) => {
                            delete item['material'];
                            delete item['materialOptions']
                            return {
                                ...item
                            }
                        })
                        let createDOparams: any = {
                            consignee: order.consignee,
                            vendor: order.vendor,
                            dispatchBy: convertDateTimeServerFormat(order.dispatchBy),
                            lane: order.lane,
                            node: order.node,
                            product: selectedProductList,
                            remarks: order.remarks,
                            sourceNumber: order.sourceNumber,
                            sourceType: sourceType()
                        }
                        createBulkDoParams.push(createDOparams)

                    } else {
                        errors = {
                            ...errors,
                            ...validate
                        }
                    }
                }
            })
            if (createBulkDoParams.length === selectedOrdersList.length) {
                setLoading(true)
                appDispatch(createBulkDO({ demandOrderDetails: createBulkDoParams })).then((response: any) => {
                    if (response) {

                        response.message && appDispatch(showAlert(response.message));
                        history.push({
                            pathname: DOListingUrl,
                        })
                    }
                    setLoading(false)
                })
            }
            else {

                setLoading(true)
                //setBulkProductList(() => bulkProductRef)
                setProductErrors(errors)
                setTimeout(() => setLoading(false), 0)
            }
        } else {
            appDispatch(showAlert("Select atleast 1 source order.", false))
        }
    }


    //function for validating data and setting errors to each field in all demand orders to be created
    function validateData(selectedProductList: any, order: any) {
        let isError = false;
        let prevErrors: any = {}
        selectedProductList.forEach((item: any) => {
            let productErrorList: any = {};
            if (item.isCheckboxChecked && isNullValueOrZero(item.productQuantity)) {
                isError = true;
                productErrorList.productQuantityError = "Enter Product Quantity";
            }
            if (item.isCheckboxChecked && isObjectEmpty(item.material)) {
                isError = true;
                productErrorList.materialNameError = "Please Select Material";
            }
            prevErrors["P" + item.id] = productErrorList
        })
        if (isNullValue(order.dispatchBy)) {
            isError = true;
            prevErrors["O" + order.id] = "Enter dispatch by date"
        }
        if (isError === true) {
            return prevErrors;

        } else {
            return false
        }
    }


    //function for updating //bulkProductRef// when every time user makes chnages in Bulkcard component
    function updateBulkproductList(updatedOrder: any) {
        const temppBulkProductList = bulkProductRef.current.map((order: any) => updatedOrder.id === order.id ? updatedOrder : order)
        bulkProductRef.current = temppBulkProductList
    }


    //function for setting dispatch by and remrks to all stock Order on click of //Apply all// button
    function applyBulk(params: any) {
        setLoading(true)
        let bulkProductArray: any = []
        bulkProductArray = bulkProductRef.current.map((data: any) => {
            if (params.dispatchBy && params.remarks) {
                return {
                    ...data,
                    dispatchBy: params.dispatchBy,
                    remarks: params.remarks,
                }
            } else if (params.dispatchBy) {
                return {
                    ...data,
                    dispatchBy: params.dispatchBy,
                }
            } else {
                return {
                    ...data,
                    remarks: params.remarks,
                }
            }

        })
        bulkProductRef.current = bulkProductArray

        setBulkProductList(bulkProductArray)
        setProductErrors({})
        setTimeout(() => setLoading(false), 0)
        //setLoading(false)
    }


    //function for //Cancel// button
    function onCancel() {
        sourceType()
        history.push({
            pathname: doHistoryUrl,
            state: { isBulk: true }
        })
    }
}


export default CreateBulkDemandOrders;