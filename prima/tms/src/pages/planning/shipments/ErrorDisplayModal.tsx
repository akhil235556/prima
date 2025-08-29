import { CardContent } from '@material-ui/core';
import { Visibility } from '@material-ui/icons';
import React from 'react';
import DataNotFound from '../../../component/error/DataNotFound';
import TableList from '../../../component/widgets/tableView/TableList';
import { ColumnStateModel } from '../../../Interfaces/AppInterfaces';
import ModalContainer from '../../../modals/ModalContainer';
import "./ErrorDisplayModal.css";
import ErrorModal from './ErrorModal';

interface ErrorDisplayModalProps {
    details: any
    open: any
    onClose: any
    uploadError?: any
}

function ErrorDisplayModal(props: ErrorDisplayModalProps) {
    const { details, open, onClose, uploadError = false } = props;
    const [jsonError, setJsonError] = React.useState<any>({})
    const [toggleModal, setToggleModal] = React.useState<any>(false)
    return (
        <div>
            <ModalContainer
                open={open}
                onClose={() => {
                    // setJsonError(undefined)
                    onClose()
                }}
                title={"Error Detail"}
                styleName="error-modal--list"
            >
                <ErrorModal
                    open={toggleModal}
                    selectedElement={jsonError}
                    onClose={() => {
                        setJsonError(undefined)
                        setToggleModal(false)
                    }}
                />
                <div className="table-detail-listing">
                    <CardContent className="creat-contract-content display-all-data">
                        <div className="article-list-wrapp error-code">
                            <div className="article-list-content">
                                {((details?.errors?.length > 0 &&
                                    <TableList
                                        tableColumns={uploadError ? uploadErrorTableColumns(onClickViewErrorButton) : errorCodeTableColumns(onClickViewButton)}
                                        currentPage={0}
                                        rowsPerPage={500}
                                        rowsPerPageOptions={[25, 50, 100]}
                                        listData={details?.errors}
                                        onChangePage={(event: any, page: number) => {
                                        }}
                                        onChangeRowsPerPage={(event: any) => {
                                        }}
                                    />)
                                    ||
                                    <div className="img-upload">
                                        <DataNotFound
                                        // message={""}
                                        // header={details.jobName}
                                        // image={getImage(details.status)}

                                        />
                                    </div>
                                )
                                }

                            </div>
                        </div>
                    </CardContent>
                </div>
                {/* </Card> */}
                {/* </div> */}
            </ModalContainer>
        </div>
    )

    function uploadErrorTableColumns(onClickViewButton: Function) {
        const columnList: ColumnStateModel[] = [
            { id: 'sheet', label: 'Sheet', format: (value: any) => value || "OdaPincode" },
            { id: 'rowNumber', label: 'Row Number', format: (value: any) => value || "NA" },
            { id: 'errorDescription', label: 'Description ', format: (value: any) => value || "NA" },
            {
                id: 'row', label: 'Raw Data', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
                onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
            },
        ]
        return columnList;
    };

    function errorCodeTableColumns(onClickViewButton: Function) {
        const columnList: ColumnStateModel[] = [
            { id: 'sheet', label: 'Sheet', format: (value: any) => value || "NA" },
            { id: 'rowNumber', label: 'Row Number', format: (value: any) => value || "NA" },
            { id: 'message', label: 'Description ', format: (value: any) => value || "NA" },
            {
                id: 'row', label: 'Raw Data', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
                onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
            },
        ]
        return columnList;
    };

    function onClickViewErrorButton(element: any) {
        element && element.rowPayload && setJsonError(JSON.parse(element.rowPayload))
        setToggleModal(true)
    }

    function onClickViewButton(element: any) {
        element && element.row && setJsonError(JSON.parse(element.row))
        setToggleModal(true)
    }
}

export default ErrorDisplayModal
