import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import TableList from '../../../component/widgets/tableView/TableList';
import ModalContainer from '../../../modals/ModalContainer';
import { showAlert } from '../../../redux/actions/AppActions';
import { placementDateTimeTableColumn } from '../../../templates/PlanningTemplates';
import "./PlacementDateTimeApproveModal.css";

interface PlacementDateTimeApproveModalProps {
    open: boolean
    onClose: any
    onSuccess: any
    selectedElement: any,
    rejectModal?: boolean,
    loading?: boolean,
}

function PlacementDateTimeApproveModal(props: PlacementDateTimeApproveModalProps) {
    const appDispatch = useDispatch()
    const { open, onClose, selectedElement, onSuccess, rejectModal, loading } = props;
    const [allValue, setAllValue] = React.useState<any>(false)
    const [shipmentList, setShipmentList] = React.useState<any>([]);

    useEffect(() => {
        if (open && selectedElement) {
            setShipmentList(selectedElement.freightShipment)
            setAllValue(false);
        }
    }, [open, selectedElement])

    const resetShipmentList = () => {
        setAllValue(false)
        const initialState = shipmentList.map((item: any) => {
            item.isCheckboxChecked = false;
            return item;
        })
        setShipmentList(initialState)
        onClose()
    }

    return (
        <ModalContainer
            primaryButtonTitle={rejectModal ? 'Reject' : 'Approve'}
            open={open}
            loading={loading}
            onClose={resetShipmentList}
            styleName="approval-decline-modal"
            onApply={() => {
                const checkedShipment = shipmentList.filter((shipment: any) => shipment.isCheckboxChecked)
                const data = checkedShipment.map((shipment: any) => {
                    return {
                        freightOrderCode: selectedElement.freightOrderCode,
                        freightShipmentCode: shipment.freightShipmentCode,
                        id: shipment.id
                    }
                })
                if (checkedShipment && checkedShipment.length > 0) {
                    onSuccess(data)
                    //setAllValue(false)
                } else {
                    appDispatch(showAlert("Please select atleast one shipment", false))
                }
            }}
            title={rejectModal ? <div>Reject : <span className="orderCode">{"Order Code-" + (selectedElement && selectedElement.freightOrderCode)}</span></div> : <div>Awaiting Approval : <span className="orderCode">{"Order Code -" + (selectedElement && selectedElement.freightOrderCode)}</span></div>} >
            {shipmentList && shipmentList.length > 0 && (
                <>
                    <div className="table-detail-listing inp-tableList scroll-table order-listing-time-date">
                        <TableList
                            tableColumns={placementDateTimeTableColumn(allValue, handleChecks, handleAllChecks)}
                            currentPage={0}
                            rowsPerPage={25}
                            rowsPerPageOptions={rowsPerPageOptions}
                            listData={shipmentList}
                            onChangePage={(event: any, page: number) => {
                            }}
                            onChangeRowsPerPage={(event: any) => {
                            }}
                        />
                    </div>
                </>
            )}

        </ModalContainer>
    )
    function handleChecks(id: any, checked: any) {
        let checkArray: any = [];
        let checkedCounts: any = 0;
        checkArray = shipmentList && shipmentList.map((item: any) => {
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
            if (checkedCounts === (shipmentList && shipmentList.length)) {
                setAllValue(true);
            }
        } else {
            setAllValue(false);
        }
        setShipmentList(checkArray);
    }

    function handleAllChecks(checked: any) {
        let checkArray: any = [];
        checkArray = shipmentList && shipmentList.map((item: any) => {
            return {
                ...item,
                isCheckboxChecked: checked
            };
        })
        setShipmentList(checkArray);
        setAllValue(checked);
    }
}

export default PlacementDateTimeApproveModal;