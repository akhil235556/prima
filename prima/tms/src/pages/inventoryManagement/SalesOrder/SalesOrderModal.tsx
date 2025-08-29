import React from "react";
import "./SalesOrder.css";
import ModalContainer from "../../../modals/ModalContainer";
import TableList from "../../../component/widgets/tableView/TableList";
import { articleTableColumns } from "../../../templates/InventoryTemplates";
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";

interface SalesOrderModalProps {
    open: boolean
    onClose: any
    selectedElement: any,
}

function SalesOrderModal(props: SalesOrderModalProps) {
    const { open, onClose, selectedElement } = props;

    return (
        <ModalContainer
            title="Articles"
            open={open}
            onClose={() => {
                onClose()
            }}
        >
            {open && <div className="article-list-wrapp article-code">
                <div className="article-list-content">
                    <TableList
                        tableColumns={articleTableColumns()}
                        currentPage={0}
                        rowsPerPage={500}
                        rowsPerPageOptions={rowsPerPageOptions}
                        listData={selectedElement && selectedElement.sku}
                        onChangePage={(event: any, page: number) => {
                        }}
                        onChangeRowsPerPage={(event: any) => {
                        }}
                    />
                </div>
            </div>
            }
        </ModalContainer>
    );
}
export default SalesOrderModal;
