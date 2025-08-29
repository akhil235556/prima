import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { DateTimePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { rowsPerPageOptions, sourceTypeEnum } from '../../base/constant/ArrayList';
import { DOListingUrl } from '../../base/constant/RoutePath';
import { convertDateTimeServerFormat, displayDateTimeFormatter } from '../../base/utility/DateUtils';
import { isEmptyArray, isNullValue, isNullValueOrZero, isObjectEmpty } from "../../base/utility/StringUtils";
import CardContentSkeleton from '../../component/widgets/cardContentSkeleton/CardContentSkeleton';
import TableList from "../../component/widgets/tableView/TableList";
import ModalContainer from "../../modals/ModalContainer";
import { setAutoCompleteListWithData } from '../../moduleUtility/DataUtils';
import { createDO, getDOList, getMaterialsList, updateDO } from "../../pages/freight/demandOrders/demandOrdersApi/demandOrderServiceActions";
import { getPOTemplateDetails } from '../../pages/freight/purchaseOrders/purchaseOrdersApi/purchaseOrderServiceActions';
import { getSOTemplateDetails } from '../../pages/freight/so/stockOrdersApi/stockOrderServiceActions';
import { getSTOTemplateDetails } from '../../pages/freight/sto/stockTransferOrdersApi/stoServiceActions';
import { showAlert } from "../../redux/actions/AppActions";
import { convertUom } from '../../serviceActions/MaterialServiceActions';
import { createDemandColumn } from "../../templates/FreightTemplates";
import "./CreateDemandModal.css";

interface CreateDemandModalProps {
    open: boolean
    onClose: any
    onSuccess: any
    selectedElement: any,
    sourceType: any,
    isEditable?: boolean,
}

function CreateDemandModal(props: CreateDemandModalProps) {
    const history = useHistory();
    const { open, onClose, selectedElement, onSuccess, sourceType, isEditable } = props;
    const appDispatch = useDispatch();
    const [params, setParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [details, setDetails] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [createLoading, setCreateLoading] = React.useState<boolean>(false);
    const [productList, setProductList] = React.useState<any>([]);
    const [allValue, setAllValue] = React.useState<any>(false)

    const productErrorInfo = {
        productQuantityError: "",
        // materialNameError: ""
    }

    useEffect(() => {
        if (open && selectedElement) {
            if (isEditable) {
                setLoading(true);
                appDispatch(getDOList({ demandOrderCode: selectedElement.demandOrderCode })).then((response: any) => {
                    if (response && response.data && response.data[0]) {
                        const res = { ...response.data[0] }
                        setParams({
                            ...res,
                            consignee: {
                                consigneeCode: res.consigneeCode,
                                consigneeId: res.consigneeId,
                                consigneeName: res.consigneeName
                            },
                            vendor: {
                                vendorCode: res.vendorCode,
                                vendorId: res.vendorId,
                                vendorName: res.vendorName
                            },
                            lane: {
                                laneCode: res.laneCode,
                                laneDisplayName: res.laneDisplayName
                            }
                        })
                        if (response.data[0] && response.data[0].product) {
                            setList(response.data[0])
                        }
                    }
                })
            } else {
                if (sourceType === sourceTypeEnum.SO) {
                    setLoading(true);
                    appDispatch(getSOTemplateDetails({ id: selectedElement.id })).then((response: any) => {
                        if (response) {
                            setList(response)

                        }
                    })
                } else if (sourceType === sourceTypeEnum.PO) {
                    setLoading(true);
                    appDispatch(getPOTemplateDetails({ id: selectedElement.id })).then((response: any) => {
                        if (response) {
                            setList(response)
                        }
                        // setLoading(false);
                    })
                } else if (sourceType === sourceTypeEnum.STO) {
                    setLoading(true);
                    appDispatch(getSTOTemplateDetails({ id: selectedElement.id })).then((response: any) => {
                        if (response) {
                            setList(response)
                        }
                        // setLoading(false);
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, selectedElement]);

    function setList(listingResponse: any) {
        if (!isEditable) {
            setDetails(listingResponse);
        }
        if (listingResponse.product) {
            let productListArray = listingResponse.product;
            let productCodeArray = productListArray.map((item: any) => {
                return {
                    productCode: item.productCode
                }
            })
            appDispatch(getMaterialsList({ productCodes: productCodeArray })).then((response: any) => {
                if (response) {
                    // setMaterialList(response)
                    productListArray = productListArray.map((product: any) => {
                        return {
                            ...product,
                            materialOptions: getMaterialOptionList(product.productCode, response)?.materialOptions,
                            material: isEditable ? getMaterialOptionList(product.productCode, response, product.materialCode)?.material : null
                        }
                    })
                }
                setProductList(productListArray)
                setLoading(false)
            })
        }

    }

    function getMaterialOptionList(productCode: any, materialList: any, materialCode?: any) {
        if (!isEmptyArray(materialList)) {
            const materials = materialList.find((material: any) => material.productCode === productCode)
            const materialOptions = setAutoCompleteListWithData(materials.materialDetails, "name", "code");
            let material = null;
            if (materialCode && isEditable) {
                material = materialOptions.find((item: any) => item.value === materialCode)
            }
            return {
                materialOptions: materialOptions,
                material: material
            }
        }
        return null;
    }

    return (
        <ModalContainer
            title={selectedElement && selectedElement.sourceNumber}
            primaryButtonTitle={isEditable ? "Update Demand" : "Create Demand"}
            primaryButtonLeftIcon={<img src="/images/Create-demand-white.png" alt="weight" />}
            primaryButtonDisable={loading}
            loading={createLoading}
            open={open}
            onClose={() => {
                onClose();
                onClear();
            }}
            onApply={() => {
                let selectedProductList = productList && productList.filter((item: any) => item.isCheckboxChecked === true);
                if (selectedProductList && selectedProductList.length > 0) {
                    const validate: any = validateData();
                    if (validate === true) {
                        setCreateLoading(true);
                        if (isEditable) {
                            selectedProductList = selectedProductList.map((item: any) => ({
                                lineItemId: item.lineItemId,
                                productQuantity: parseFloat(item.productQuantity),
                                materialName: item.material?.label,
                                materialCode: item.material?.value,
                                doMaterialUnits: item.doMaterialUnits ? parseInt(item.doMaterialUnits) : 0,
                                materialUnits: item.materialUnits
                            }));
                            selectedProductList = selectedProductList.map((item: any) => {
                                delete item['material'];
                                delete item['materialOptions']
                                return {
                                    ...item
                                }
                            })
                            let editDOParams: any = {
                                id: params.id,
                                consignee: params.consignee,
                                vendor: params.vendor,
                                dispatchBy: convertDateTimeServerFormat(params.dispatchBy),
                                lane: params.lane,
                                node: params.node,
                                product: selectedProductList,
                                remark: params.remarks,
                                sourceNumber: params.sourceNumber,
                                sourceType: sourceType,
                            }
                            setCreateLoading(false)
                            appDispatch(updateDO(editDOParams)).then((response: any) => {
                                if (response) {
                                    response.message && appDispatch(showAlert(response.message));
                                    onSuccess();
                                    onClear();
                                }
                                setCreateLoading(false);
                            })
                        }
                        else {
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
                                consignee: details.consignee,
                                vendor: details.vendor,
                                dispatchBy: convertDateTimeServerFormat(params.dispatchBy),
                                lane: details.lane,
                                node: details.node,
                                product: selectedProductList,
                                remarks: params.remarks,
                                sourceNumber: details.sourceNumber,
                                sourceType: sourceType
                            }
                            appDispatch(createDO(createDOparams)).then((response: any) => {
                                if (response) {
                                    response.message && appDispatch(showAlert(response.message));
                                    history.push({
                                        pathname: DOListingUrl,
                                    })
                                    onSuccess();
                                    onClear();
                                }
                                setCreateLoading(false);
                            })
                        }
                    } else if (validate.error) {
                        setProductList(validate.productList);
                    } else {
                        setError(validate);
                    }
                } else {
                    appDispatch(showAlert("Select atleast 1 product", false))
                }
            }}
            styleName={'createDialog'}
        >
            {productList && productList.length > 0 &&
                <>
                    {/* scroll table css add remove */}
                    <div className="table-detail-listing inp-tableList scroll-table">
                        <TableList
                            tableColumns={createDemandColumn(allValue, handleChecks, handleAllChecks, onHandleQuantityValueChangeDispatch, onHandleUnitValueChangeDispatch, onHandleMaterialValueChangeDispatch)}
                            currentPage={0}
                            rowsPerPage={25}
                            rowsPerPageOptions={rowsPerPageOptions}
                            listData={productList}
                            onChangePage={(event: any, page: number) => {
                            }}
                            onChangeRowsPerPage={(event: any) => {
                            }}
                        />
                    </div>
                    <div className="total-demand-qty">
                        <div className="row">
                            <div className="offset-md-2 col-md-4">
                                <p className="justify-content-end d-flex">Total Material Units: <span>{getDemandQTY().totalMaterialUnits}</span></p>
                            </div>
                            <div className="col-md-4">
                                <p className="justify-content-end d-flex">Total Demand QTY: <span>{getDemandQTY().totalDemandQty}</span></p>
                            </div>
                            <div className="col-md-2">
                                <p className="justify-content-end d-flex">UoM: <span>{getDemandQTY().uOM}</span></p>
                            </div>
                        </div>
                    </div>
                </>
            }
            {loading ?
                <CardContentSkeleton
                    row={3}
                    column={3}
                />
                :
                <div className="dispatchInput row">
                    <div className="col-6 col-md-4">
                        <label className="picker-label">{"Dispatch By"}<span className="mandatory-flied">*</span></label>
                        <DateTimePicker
                            className="custom-date-picker"
                            placeholder="Dispatch By"
                            disabled={isEditable}
                            minDate={new Date()}
                            helperText={error.dispatchBy}
                            format={displayDateTimeFormatter}
                            value={params.dispatchBy || null}
                            onChange={(date: any) => {
                                setParams({
                                    ...params,
                                    dispatchBy: date,
                                })
                                setError({})
                            }}
                        />
                    </div>
                    <div className="col-6 col-md-4">
                        <div className="billing-info-remark remark-row">
                            <label>Remarks</label> <br />
                            <TextareaAutosize
                                rowsMin={1}
                                rowsMax={1}
                                aria-label="empty textarea"
                                placeholder="Remarks"
                                value={params.remarks}
                                onChange={(event: any) => {
                                    setParams({
                                        ...params,
                                        remarks: event.target.value
                                    })
                                    setError({})
                                }}
                            />
                        </div>
                    </div>
                </div>}
        </ModalContainer>
    );

    function validateData() {
        let isError = false;
        let productErrorList = productList.map((item: any) => {
            if (item.isCheckboxChecked && isNullValueOrZero(item.productQuantity)) {
                isError = true;
                item.productQuantityError = "Enter Product Quantity";
            }
            if (item.isCheckboxChecked && isObjectEmpty(item.material)) {
                isError = true;
                item.materialNameError = "Please Select Material";
            }
            return item;
        });
        if (isError) {
            return {
                error: true,
                productList: productErrorList,
            };
        }
        if (isNullValue(params.dispatchBy)) {
            return { dispatchBy: "Enter dispatch by date" }
        }
        return true;
    }
    function getDemandQTY(): any {
        let totalDemandQty: any = 0;
        let totalMaterialUnits: any = 0
        if (productList && productList.length > 0) {
            var unit = productList[0].unit;
            let check = productList.some((item: any) => item.unit !== unit);
            if (check) {
                return {
                    totalDemandQty: "......",
                    totalMaterialUnits: "......",
                    uOM: "......"
                }
            } else {
                productList.forEach((item: any) => {
                    if (item.isCheckboxChecked && (item.productQuantity || item.doMaterialUnits)) {
                        totalDemandQty += item.productQuantity ? Number(item.productQuantity) : totalDemandQty
                        totalMaterialUnits += item.doMaterialUnits ? Number(item.doMaterialUnits) : totalMaterialUnits
                    }
                })
            }
        }
        return {
            totalDemandQty: totalDemandQty.toFixed(3),
            totalMaterialUnits: totalMaterialUnits,
            uOM: unit
        }
    }

    function onHandleQuantityValueChangeDispatch(id: any, value: any) {
        setError({})
        let productArray: any = [];
        productArray = productList && productList.map((item: any) => ((item.id === id) ? {
            ...item,
            ...productErrorInfo,
            productQuantity: value,
        } : item))
        setProductList(productArray);
    }

    function onHandleUnitValueChangeDispatch(id: any, value: any) {
        setError({})
        let productArray: any = [];
        productArray = productList && productList.map((item: any) => ((item.id === id) ? {
            ...item,
            ...productErrorInfo,
            doMaterialUnits: value,
            productQuantity: item.materialUnits ? value * item.materialUnits : value
        } : item))
        setProductList(productArray);
    }

    async function onHandleMaterialValueChangeDispatch(id: any, value: any) {
        setError({})
        if (value) {
            let currentProduct: any = productList && productList.find((item: any) => item.id === id)
            currentProduct.material = value
            let materialData = value?.data;
            let unit = currentProduct?.unit;
            let materialNameError = ""
            if (!materialData?.isBulk) {
                if (unit === materialData?.weightUom) {
                    currentProduct.materialUnits = materialData?.weight
                } else if (unit === materialData?.volumeUom) {
                    currentProduct.materialUnits = materialData?.volume
                } else if (unit === "EACH") {
                    currentProduct.materialUnits = materialData?.units
                } else {
                    let params: any = {
                        weight: materialData?.weight,
                        volume: materialData?.volume,
                        weightUom: materialData?.weightUom,
                        volumeUom: materialData?.volumeUom,
                        units: materialData?.units,
                        toUom: unit
                    }
                    let response = await appDispatch(convertUom(params))
                    if (response && response.value) {
                        currentProduct.materialUnits = response.value
                    } else {
                        currentProduct.material = undefined;
                        materialNameError = "Enter valid Material"
                    }
                }
            }
            const productArray = productList.map((data: any) => (data.id === id) ? {
                ...currentProduct,
                ...productErrorInfo,
                materialNameError: materialNameError,
                // material: value,
                doMaterialUnits: '',
                productQuantity: ''
            } : data)
            setProductList(productArray);
        } else {
            const productArray = productList.map((data: any) => (data.id === id) ? {
                ...data,
                ...productErrorInfo,
                material: undefined,
                materialUnits: undefined,
                doMaterialUnits: '',
                productQuantity: ''
            } : data)
            setProductList(productArray);
        }
    }

    function handleChecks(id: any, checked: any) {
        let checkArray: any = [];
        let checkedCounts: any = 0;
        checkArray = productList && productList.map((item: any) => {
            let itemList: any = item;
            if (item.isCheckboxChecked) {
                checkedCounts++;
            }
            if (item.id === id) {
                itemList.isCheckboxChecked = checked;
                if (checked) {
                    checkedCounts++;
                }
            }
            return itemList;
        })
        if (checked) {
            if (checkedCounts === (productList && productList.length)) {
                setAllValue(true);
            }
        } else {
            setAllValue(false);
        }
        setProductList(checkArray);
    }

    function handleAllChecks(checked: any) {
        let checkArray: any = [];
        checkArray = productList && productList.map((item: any) => {
            return {
                ...item,
                isCheckboxChecked: checked
            };
        })
        setProductList(checkArray);
        setAllValue(checked);
    }

    function onClear() {
        setParams({})
        setProductList([])
        setError({})
        setAllValue(false);
    }
}



export default CreateDemandModal;