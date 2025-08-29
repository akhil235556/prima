import React from 'react';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import DataNotFound from '../../../component/error/DataNotFound';
import TableList from '../../../component/widgets/tableView/TableList';
import ModalContainer from "../../../modals/ModalContainer";
import { materialListTableColumn } from '../../../templates/PlanningTemplates';
import './MaterialTableModal.css';

interface MaterialTableModalProps {
    open: boolean
    onClose: any
    selectedElement: any,
}
function MaterialTableModal(props: MaterialTableModalProps) {
    const { open, onClose, selectedElement } = props;
    return (
        <>
            <ModalContainer
                title="Material and Qty"
                open={open}
                primaryButtonTitle={""}
                onApply={() => {

                }}
                onClose={() => {
                    onClose();
                }}
                styleName={'product-listing-modal'}
            >
                {selectedElement && selectedElement.length > 0 ?
                    (
                        <div className="table-detail-listing">
                            <TableList
                                tableColumns={materialListTableColumn()}
                                currentPage={1}
                                rowsPerPage={25}
                                rowsPerPageOptions={rowsPerPageOptions}
                                listData={selectedElement}
                                onChangePage={(event: any, page: number) => {
                                    //dispatch(setCurrentPage(page));
                                }}
                                onChangeRowsPerPage={(event: any) => {
                                    //dispatch(setRowPerPage(event.target.value))
                                }}
                            />
                        </div>
                    ) :
                    <DataNotFound
                        header=""
                        customMessage="No Material Found !"
                    />
                }

            </ ModalContainer >
        </>
    );

}

export default MaterialTableModal;