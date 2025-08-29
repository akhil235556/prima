import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import DataNotFound from '../../../component/error/DataNotFound';
import ListingSkeleton from "../../../component/widgets/listingSkeleton/ListingSkeleton";
import TableList from '../../../component/widgets/tableView/TableList';
import ModalContainer from "../../../modals/ModalContainer";
import { getSob } from '../../../serviceActions/SobServiceActions';
import { ShareOfBusinessModalListTableColumn } from "../../../templates/AnalyticsTemplates";
import '../../freight/order/MaterialTableModal.css';


interface ShareOfBusinessModalProps {
    open: boolean
    onClose: any
    laneCode: any,
}
function ShareOfBusinessModal(props: ShareOfBusinessModalProps) {
    const { open, onClose, laneCode } = props;
    const [data, setData] = React.useState<any>({})
    const [loading, setLoading] = React.useState<boolean>(false);
    const appDispatch = useDispatch();
    useEffect(() => {
        const getSobData = async (inputParams: any) => {
            setLoading(true)
            const response = await appDispatch(getSob(inputParams))
            if (response && response.details && response?.details[0]) {
                setData(response?.details)
            }
            setLoading(false)

        }
        getSobData({ laneCode: laneCode, isActive: 1 });
        // eslint-disable-next-line
    }, [laneCode])

    return (
        <>
            <ModalContainer
                title={`Share of business: ${data[0]?.vehicleTypeName}`}
                open={open}
                primaryButtonTitle={""}
                onApply={() => {

                }}
                onClose={() => {
                    onClose();
                }}
                styleName={'product-listing-modal'}
            >
                {data.length > 0 ? (
                    (
                        <div className="table-detail-listing">
                            {loading ? <ListingSkeleton /> :
                                <TableList
                                    tableColumns={ShareOfBusinessModalListTableColumn()}
                                    currentPage={1}
                                    rowsPerPage={25}
                                    rowsPerPageOptions={rowsPerPageOptions}
                                    listData={data[0]?.sobPartners}
                                    onChangePage={(event: any, page: number) => {
                                        //dispatch(setCurrentPage(page));
                                    }}
                                    onChangeRowsPerPage={(event: any) => {
                                        //dispatch(setRowPerPage(event.target.value))
                                    }}
                                />}
                        </div>
                    )) :
                    <DataNotFound
                        header=""
                        customMessage="No Material Found !"
                    />
                }

            </ ModalContainer >
        </>
    );

}

export default ShareOfBusinessModal;