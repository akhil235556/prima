import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { DateTimePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { demandOrderTabsEnum, rowsPerPageOptions } from '../../base/constant/ArrayList';
import { DOListingUrl } from '../../base/constant/RoutePath';
import { displayDateTimeFormatter } from '../../base/utility/DateUtils';
import { isEmptyArray, isNullValue, isNullValueOrZero, isObjectEmpty } from "../../base/utility/StringUtils";
import CardContentSkeleton from '../../component/widgets/cardContentSkeleton/CardContentSkeleton';
import TableList from "../../component/widgets/tableView/TableList";
import ModalContainer from "../../modals/ModalContainer";
import { setAutoCompleteListWithData } from '../../moduleUtility/DataUtils';
import { getMaterialsList, modifyAcceptDO } from "../../pages/freight/demandOrders/demandOrdersApi/demandOrderServiceActions";
import { showAlert } from "../../redux/actions/AppActions";
import { modifyApproveDemandColumn, modifyGetProductColumn } from "../../templates/FreightTemplates";
import "./ModifyDemandModal.css";

interface ModifyDemandModalProps {
    open: boolean
    onClose: any
    onSuccess: any
    selectedElement: any,
    sourceType: any,
}

function ModifyDemandModal(props: ModifyDemandModalProps) {
    const history = useHistory();
    const { open, onClose, selectedElement, onSuccess } = props;
    const appDispatch = useDispatch();
    const [params, setParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [createLoading, setCreateLoading] = React.useState<boolean>(false);
    const [productList, setProductList] = React.useState<any>([]);
    const [allValue, setAllValue] = React.useState<any>(false)
    //const [materialList, setMaterialList] = React.useState<any>([])

    const productErrorInfo = {
        requestQuantityError: "",
        materialNameError: ""
    }

    useEffect(() => {
        setLoading(true);
        if (open && selectedElement) {
            setParams({
                ...selectedElement,
                consignee: {
                    consigneeCode: selectedElement.consigneeCode,
                    consigneeId: selectedElement.consigneeId,
                    consigneeName: selectedElement.consigneeName
                },
                vendor: {
                    vendorCode: selectedElement.vendorCode,
                    vendorId: selectedElement.vendorId,
                    vendorName: selectedElement.vendorName
                },
                lane: {
                    laneCode: selectedElement.laneCode,
                    laneDisplayName: selectedElement.laneDisplayName
                }

            });
            setLoading(false);
            let productListArray = selectedElement.product;
            let productCodeArray = productListArray.map((item: any) => {
                return {
                    productCode: item.productCode
                }
            })
            appDispatch(getMaterialsList({ productCodes: productCodeArray })).then((response: any) => {
                if (response) {
                    productListArray = productListArray.map((product: any) => {
                        return {
                            ...product,
                            materialOptions: getMaterialOptionList(product.productCode, response)?.materialOptions,
                            material: getMaterialOptionList(product.productCode, response, product.materialCode)?.material,
                        }
                    })
                }
                setProductList(productListArray)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, selectedElement]);

    return (
        <ModalContainer
            title={selectedElement && selectedElement.sourceNumber}
            primaryButtonTitle={"Accept Demand"}
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
                        let productArray = productList && productList.filter((item: any) => item.isCheckboxChecked);
                        productArray = productArray.map((item: any) => (
                            {
                                currentQuantity: !isNullValue(item.balanceQuantity) ? parseFloat(item.balanceQuantity) : 0,
                                lineItemId: item.lineItemId,
                                updatedQuantity: parseFloat(item.requestQuantity),
                                materialName: item.material?.label,
                                materialCode: item.material?.value,
                                doMaterialUnits: parseFloat(item.doMaterialUnits),
                                updatedDoMaterialUnits: item.updatedDoMaterialUnits ? parseInt(item.updatedDoMaterialUnits) : 0,
                                materialUnits: item?.materialUnits
                            }));
                        productArray = productArray.map((item: any) => {
                            delete item['material'];
                            delete item['materialOptions']
                            return {
                                ...item
                            }
                        })
                        let modifyAcceptParams: any = {
                            dispatchBy: params.dispatchBy,
                            id: params.id,
                            product: productArray,
                            quantity: params?.quantity,
                            remark: params.remarks,
                            sourceNumber: params.sourceNumber,
                            sourceType: params.sourceType,
                        };
                        appDispatch(modifyAcceptDO(modifyAcceptParams)).then((response: any) => {
                            if (response) {
                                response.message && appDispatch(showAlert(response.message));
                                history.push({
                                    pathname: DOListingUrl + demandOrderTabsEnum.APPROVED,
                                })
                                onSuccess();
                                onClear();
                            }
                            setCreateLoading(false);
                        });
                        setCreateLoading(false);
                    } else if (validate.error) {
                        setProductList(validate.productList);
                    } else {
                        setError(validate);
                    }
                } else {
                    appDispatch(showAlert("Select atleast 1 product", false))
                }
            }}
            styleName={'createDialog createDemand'}
        >
            <div className="table-detail-listing">
                <TableList
                    tableColumns={modifyGetProductColumn()}
                    currentPage={0}
                    rowsPerPage={25}
                    rowsPerPageOptions={rowsPerPageOptions}
                    listData={selectedElement && selectedElement.modifyProduct}
                    onChangePage={(event: any, page: number) => {
                    }}
                    onChangeRowsPerPage={(event: any) => {
                    }}
                />
                <h5>Update Demand:</h5>
            </div>

            {productList && productList.length > 0 &&
                <>
                    <div className="table-detail-listing inp-tableList">

                        <TableList
                            tableColumns={modifyApproveDemandColumn(allValue, handleChecks, handleAllChecks, onHandleQuantityValueChangeDispatch, onHandleUnitValueChangeDispatch, onHandleMaterialValueChangeDispatch, getMaterialOptionList)}
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
                                <p className="justify-content-end d-flex">UoM: <span>{getDemandQTY().unit}</span></p>
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
                            disabled
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

    function getMaterialOptionList(productCode: any, materialList: any, materialCode?: any) {
        if (!isEmptyArray(materialList)) {
            const materials = materialList.find((material: any) => material.productCode === productCode)
            const materialOptions = setAutoCompleteListWithData(materials.materialDetails, "name", "code");
            let material = null;
            if (materialCode) {
                material = materialOptions.find((item: any) => item.value === materialCode)
            }
            return {
                materialOptions: materialOptions,
                material: material
            }
        }
        return null;
    }

    function validateData() {
        let isError = false;
        let productErrorList = productList.map((item: any) => {
            if (item.isCheckboxChecked && isNullValueOrZero(item.requestQuantity)) {
                isError = true;
                item.requestQuantityError = "Enter quantity";
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
        let totalMaterialUnits: any = 0;
        let unit = "";
        if (productList && productList.length > 0) {
            unit = productList[0].unit;
            let check = productList.some((item: any) => item.unit !== unit);
            if (check) {
                return "......"
            } else {
                productList.forEach((item: any) => {
                    if (item.isCheckboxChecked && (item.requestQuantity || item.updatedDoMaterialUnits)) {
                        totalDemandQty += item.requestQuantity ? Number(item.requestQuantity) : totalDemandQty
                        totalMaterialUnits += item.updatedDoMaterialUnits ? Number(item.updatedDoMaterialUnits) : totalMaterialUnits
                    }
                })
            }
        }
        return {
            totalDemandQty: totalDemandQty.toFixed(3),
            totalMaterialUnits: totalMaterialUnits,
            unit: unit,
        }
    }

    function onHandleQuantityValueChangeDispatch(id: any, value: any) {
        setError({})
        let productArray: any = [];

        productArray = productList && productList.map((item: any) => ((item.id === id) ? {
            ...item,
            ...productErrorInfo,
            requestQuantity: value,
        } : item))
        setProductList(productArray);
    }

    function onHandleUnitValueChangeDispatch(id: any, value: any) {
        setError({})
        let productArray: any = [];

        productArray = productList && productList.map((item: any) => ((item.id === id) ? {
            ...item,
            ...productErrorInfo,
            updatedDoMaterialUnits: value,
            requestQuantity: item.materialUnits ? value * item.materialUnits : value
        } : item))
        setProductList(productArray);
    }

    function onHandleMaterialValueChangeDispatch(id: any, value: any) {
        setError({})
        let productArray: any = [];
        productArray = []; productArray = productList && productList.map((item: any) => ((item.id === id) ? {
            ...item,
            ...productErrorInfo,
            material: value,
            materialUnits: value?.data?.units,
            updatedDoMaterialUnits: '',
            requestQuantity: ''
        } : item))
        setProductList(productArray);
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



export default ModifyDemandModal;