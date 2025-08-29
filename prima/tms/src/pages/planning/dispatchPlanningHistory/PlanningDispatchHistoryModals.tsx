import React from "react";
import "./PlanningDispatchHistoryModals.css";
import ModalContainer from "../../../modals/ModalContainer";
import TableList from "../../../component/widgets/tableView/TableList";
import { rowsPerPageOptions, jobStatus } from "../../../base/constant/ArrayList";
import DataNotFound from "../../../component/error/DataNotFound";
import { historyLogTableColumns } from "../../../templates/PlanningTemplates";
import { isObjectEmpty } from '../../../base/utility/StringUtils';

interface PlanningDispatchHistoryModalsProps {
    open: boolean
    onClose: any
    selectedElement: any,
}

function PlanningDispatchHistoryModals(props: PlanningDispatchHistoryModalsProps) {
    const { open, onClose, selectedElement } = props;

    return (
        <ModalContainer
            title="History Logs"
            open={open}
            onClose={() => {
                onClose()
            }}
        >
            <div className="article-list-wrapp article-code">
                <div className="article-list-content display-all-data">
                    {((selectedElement && selectedElement.logs && selectedElement.logs.length > 0 && !isObjectEmpty(selectedElement.logs[0]) && <TableList
                        tableColumns={historyLogTableColumns()}
                        currentPage={0}
                        rowsPerPage={500}
                        rowsPerPageOptions={rowsPerPageOptions}
                        listData={selectedElement && selectedElement.logs}
                        onChangePage={(event: any, page: number) => {
                        }}
                        onChangeRowsPerPage={(event: any) => {
                        }}
                    />) ||
                        <DataNotFound
                            message={getMessage(selectedElement.status)}
                            header={selectedElement.status}
                            image={getImage(selectedElement.status)}
                        />
                    )}
                </div>
            </div>
        </ModalContainer>
    );

    function getImage(status: string) {
        switch (status) {
            case jobStatus.PENDING:
                return "";
            case jobStatus.IN_PROCESS:
                return "";
            case jobStatus.COMPLETED:
                return "";
            default:
                return "";
        }
    }

    function getMessage(status: string) {
        switch (status) {
            case jobStatus.PENDING:
                return "Planning request pending";
            case jobStatus.IN_PROCESS:
                return "Planning request under process";
            case jobStatus.COMPLETED:
                return "Planning request completed";
            default:
                return " ";
        }

    }
}
export default PlanningDispatchHistoryModals;
