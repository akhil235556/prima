import React from 'react';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import TableList from '../../../component/widgets/tableView/TableList';
import ModalContainer from '../../../modals/ModalContainer';
import { contractDetailsBusinessTableColumns, contractDetailsTableColumns } from '../../../templates/IndentTemplates';
import "./SOBAllocationModal.css";

interface SOBAllocationModalProps {
    open: boolean
    onClose: Function
    onApply: Function
    expiredContracts: any
    nonExpiredContracts: any
    onClickViewButton: Function
    onChangeSOBPercent: Function
    loading: boolean
}

function SOBAllocationModal(props: SOBAllocationModalProps) {
    const { open, onClose, onApply, loading, expiredContracts, nonExpiredContracts, onClickViewButton, onChangeSOBPercent } = props;
    return (
        <ModalContainer
            title='Share of Business'
            open={open}
            onClose={onClose}
            loading={loading}
            onApply={onApply}
            styleName={'product-listing-modal sob-modal'}
            primaryButtonTitle={'Proceed'}
        >
            <div className="table-detail-listing">
                <TableList
                    tableColumns={contractDetailsTableColumns(onClickViewButton)}
                    currentPage={1}
                    rowsPerPage={25}
                    rowsPerPageOptions={rowsPerPageOptions}
                    listData={expiredContracts}
                    onChangePage={(event: any, page: number) => {
                        //dispatch(setCurrentPage(page));
                    }}
                    onChangeRowsPerPage={(event: any) => {
                        //dispatch(setRowPerPage(event.target.value))
                    }} />

                <div className='expire-contract-sob'>
                    <p className='m-0'><span className='orange-text'>Note:</span> Expire contract SOB will be assigned to highest level transporters. <br /> If you want to modify this, please input values below</p>
                </div>

                <h5><span className="text-truncate">Share of Business Modify</span></h5>
                <div className='sob-share-modify'>
                    <TableList
                        tableColumns={contractDetailsBusinessTableColumns(onClickViewButton, onChangeSOBPercent)}
                        currentPage={1}
                        rowsPerPage={25}
                        rowsPerPageOptions={rowsPerPageOptions}
                        listData={nonExpiredContracts}
                        onChangePage={(event: any, page: number) => {
                            //dispatch(setCurrentPage(page));
                        }}
                        onChangeRowsPerPage={(event: any) => {
                            //dispatch(setRowPerPage(event.target.value))
                        }} />
                </div>

            </div>
        </ModalContainer>
    )
}

export default SOBAllocationModal;

