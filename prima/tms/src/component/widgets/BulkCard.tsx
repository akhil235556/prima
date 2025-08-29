import { Card, Checkbox, TextareaAutosize } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import { DateTimePicker } from '@material-ui/pickers';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { displayDateTimeFormatter } from '../../base/utility/DateUtils';
import { convertUom } from '../../serviceActions/MaterialServiceActions';
import { createBulkDemandColumn } from '../../templates/FreightTemplates';
import TableList from './tableView/TableList';

interface BulkOrderProps {
    orderData: any,
    productErrors: any,
    updateBulkproductList: any,
}

function BulkCard(props: BulkOrderProps) {
    const { orderData, productErrors, updateBulkproductList } = props;
    const [isCollapsed, setIsCollapsed] = React.useState<boolean>(true);
    const [productList, setProductList] = React.useState<any>(orderData);
    const [cardError, setCardError] = React.useState<any>(productErrors);
    const appDispatch = useDispatch();

    useEffect(() => {
        updateBulkproductList(productList)
        // eslint-disable-next-line
    }, [productList])

    useEffect(() => {
        setProductList(orderData)
    }, [orderData])

    useEffect(() => {
        setCardError(productErrors)
    }, [productErrors])

    const productErrorInfo = {
        // productQuantityError: "",
        // materialNameError: ""
    }

    return (
        <Card className="creat-contract-wrapp creat-wrapp do-create-row">
            <div className="billing-info-header shipment-checkbox">
                <Checkbox className="custom-checkbox"
                    onChange={(e) => {
                        handleOrderCheck(e.target.checked)
                    }}
                    checked={productList.isCheckboxChecked} name="checked" />
                <h4 className="blue-text">{productList.sourceNumber}</h4>
            </div>
            <div className="collapseBtn">
                <button onClick={() => setIsCollapsed((prevState) => !prevState)}>{isCollapsed ? <Remove /> : <Add />}</button>
            </div>
            {isCollapsed !== false &&
                <>
                    <div className="table-detail-listing inp-tableList scroll-table">
                        <TableList
                            tableColumns={createBulkDemandColumn(handleChecks, onHandleQuantityValueChangeDispatch, onHandleUnitValueChangeDispatch, onHandleMaterialValueChangeDispatch, cardError)}
                            currentPage={0}
                            rowsPerPage={25}
                            rowsPerPageOptions={[]}
                            listData={productList.product}
                            onChangePage={(event: any, page: number) => {
                            }}
                            onChangeRowsPerPage={(event: any) => {
                            }}
                        />
                    </div>
                    <div className="total-demand-qty">
                        <div className="row dispatch-row-item">
                            <div className="col-md-1">
                                <label className="picker-label">{"Dispatch By"}<span className="mandatory-flied">*</span></label>
                            </div>
                            <div className="col-md-2">
                                <DateTimePicker
                                    className="custom-date-picker"
                                    placeholder="Dispatch By"
                                    minDate={new Date()}
                                    helperText={cardError["O" + productList.id] ? cardError["O" + productList.id] : ""}
                                    format={displayDateTimeFormatter}
                                    value={productList.dispatchBy || null}
                                    onChange={(date: any) => {
                                        let errors = { ...cardError }
                                        errors["O" + productList.id] = ""
                                        setCardError(errors)
                                        let currentStockOrder: any = { ...productList }
                                        currentStockOrder.dispatchBy = date
                                        setProductList(currentStockOrder);
                                    }}
                                />
                            </div>
                            <div className="col-md-2">
                                <div className="billing-info-remark">
                                    <TextareaAutosize
                                        rowsMin={1}
                                        rowsMax={1}
                                        aria-label="empty textarea"
                                        placeholder="Remarks"
                                        value={productList.remarks || ""}
                                        onChange={(event: any) => {
                                            let currentStockOrder: any = { ...productList }
                                            currentStockOrder.remarks = event.target.value
                                            setProductList(currentStockOrder);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <p className="justify-content-end d-flex">Total Material Units: <span>{getDemandQTY().totalMaterialUnits}</span></p>
                            </div>
                            <div className="col-md-3">
                                <p className="justify-content-end d-flex">Total Demand QTY: <span>{getDemandQTY().totalDemandQty}</span></p>
                            </div>
                            <div className="col-md-2">
                                <p className="justify-content-end d-flex">UoM: <span>{getDemandQTY().uom}</span></p>
                            </div>
                        </div>
                    </div>
                </>}
        </Card>
    )

    async function onHandleMaterialValueChangeDispatch(id: any, value: any) {
        let errors = { ...cardError }
        if (errors["P" + id]) {
            errors["P" + id].materialNameError = ""
        }
        let currentProduct: any = productList && productList.product.find((item: any) => item.id === id)
        if (value) {
            currentProduct.material = value
            let materialData = value?.data;
            let unit = currentProduct?.unit;
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
                        let obj = {
                            materialNameError: "Enter Valid Material"
                        }
                        errors["P" + id] = obj
                    }
                }
            }
            const productArray = productList && productList.product.map((productItem: any) => (productItem.id === id) ? {
                ...currentProduct,
                // ...productErrorInfo,
                // material: value,
                doMaterialUnits: '',
                productQuantity: ''
            } : productItem)
            setCardError(errors)

            setProductList({
                ...productList,
                product: productArray
            });
        } else {
            const productArray = productList && productList.product.map((productItem: any) => (productItem.id === id) ? {
                ...productItem,
                ...productErrorInfo,
                material: undefined,
                materialUnits: undefined,
                doMaterialUnits: '',
                productQuantity: ''
            } : productItem)
            setProductList({
                ...productList,
                product: productArray
            });
        }
    }

    function onHandleQuantityValueChangeDispatch(id: any, value: any) {
        let errors = { ...cardError }
        if (errors["P" + id]) {
            errors["P" + id].productQuantityError = ""
        }
        setCardError(errors)

        let productArray: any = [];
        productArray = productList && productList.product.map((productItem: any) => ((productItem.id === id) ? {
            ...productItem,
            ...productErrorInfo,
            productQuantity: value,
        } : productItem))
        setProductList({
            ...productList,
            product: productArray
        });
    }

    function onHandleUnitValueChangeDispatch(id: any, value: any) {
        let productArray: any = [];
        productArray = productList && productList.product.map((productItem: any) => ((productItem.id === id) ? {
            ...productItem,
            ...productErrorInfo,
            doMaterialUnits: value,
            productQuantity: productItem.materialUnits ? value * productItem.materialUnits : value
        } : productItem))
        setProductList({
            ...productList,
            product: productArray
        });
    }

    function getDemandQTY(): any {
        let totalDemandQty: any = 0;
        let totalMaterialUnits: any = 0
        if (productList.product && productList.product.length > 0) {
            var unit = productList.product[0].unit;
            let check = productList.product.some((item: any) => item.unit !== unit);
            if (check) {
                return {
                    totalDemandQty: "......",
                    totalMaterialUnits: "......",
                    uom: "......"
                }
            } else {
                productList.product.forEach((item: any) => {
                    if (item.isCheckboxChecked && item.productQuantity) {
                        totalDemandQty += Number(item.productQuantity)
                    }
                    if (item.isCheckboxChecked && item.doMaterialUnits) {
                        totalMaterialUnits += Number(item.doMaterialUnits)
                    }
                })
            }
        }
        return {
            totalDemandQty: totalDemandQty.toFixed(3),
            totalMaterialUnits: totalMaterialUnits,
            uom: unit
        }
    }


    function handleChecks(id: any, checked: any) {
        let checkedCounts: any = 0;
        let productArray = productList && productList.product.map((Product: any) => {
            let currentProduct = { ...Product }
            if (currentProduct.isCheckboxChecked && currentProduct.isCheckboxChecked === true) {
                checkedCounts++;
            }
            if (currentProduct.id === id) {
                currentProduct.isCheckboxChecked = checked;
                if (checked) {
                    checkedCounts++
                } else {
                    checkedCounts--
                }
                return currentProduct
            }
            return Product
        })
        setProductList({
            ...productList,
            product: productArray,
            isCheckboxChecked: checkedCounts === 0 ? false : true
        });
    }

    function handleOrderCheck(checked: boolean) {
        const productArray = productList && productList.product.map((productItem: any) => {
            return {
                ...productItem,
                isCheckboxChecked: checked
            }
        })
        setProductList({
            ...productList,
            product: productArray,
            isCheckboxChecked: checked
        })
    }
}

export default BulkCard