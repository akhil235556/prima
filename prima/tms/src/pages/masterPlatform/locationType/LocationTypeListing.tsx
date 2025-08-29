import { AddCircle } from "@material-ui/icons";
import React, { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { isMobile } from "../../../base/utility/ViewUtils";
import Filter from "../../../component/filter/Filter";
import PageContainer from "../../../component/pageContainer/PageContainer";
import CardList from "../../../component/widgets/cardlist/CardList";
import TableList from "../../../component/widgets/tableView/TableList";
import { hideLoader } from "../../../redux/actions/AppActions";
import { refreshList, setlocationTypeResponse } from '../../../redux/actions/LocationTypeActions';
import { setCurrentPage, setRowPerPage, showLoading } from "../../../redux/actions/RolesAction";
import LocationTypeReducer, { LOCATION_TYPE_STATE } from "../../../redux/reducers/LocationTypeReducer";
import { getLocationType } from "../../../serviceActions/LocationServiceActions";
import { locationTypeTableColumns } from "../../../templates/MasterTemplates";
import LocationTypeModal from "./LocationTypeModal";

function LocationTypeListing() {
    const appDispatch = useDispatch();
    const [state = LOCATION_TYPE_STATE, dispatch] = useReducer(LocationTypeReducer, LOCATION_TYPE_STATE);
    const [openLocationTypeModal, setOpenLocationTypeModal] = React.useState<boolean>(false);
    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            // let queryParams: any = {
            //     pageNo: state.currentPage,
            //     pageSize: state.pageSize
            // }
            let enableList = await appDispatch(getLocationType(dispatch));
            enableList && enableList.length && dispatch(setlocationTypeResponse(enableList));
            dispatch(hideLoader());
        }
        getList();
    }, [appDispatch, state.currentPage, state.refreshList, state.pageSize]);

    return (
        <div>
            <LocationTypeModal
                open={openLocationTypeModal}
                onSuccess={() => {
                    setOpenLocationTypeModal(false);
                    dispatch(refreshList());
                }}
                onClose={() => {
                    setOpenLocationTypeModal(false)
                }}
            />

            <div className="filter-wrap">
                <Filter
                    pageTitle={"Location Type"}
                    buttonStyle="btn-blue mob-btn-blue"
                    buttonTitle={isMobile ? " " : "Enable Location Type"}
                    leftIcon={<AddCircle />}
                    onClick={() => {
                        setOpenLocationTypeModal(true);
                    }}
                />
            </div>
            <PageContainer
                loading={state.loading}
                listData={state.listData}
            >
                {
                    isMobile ?
                        <CardList
                            listData={state.listData}
                            tableColumns={locationTypeTableColumns()}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :

                        <TableList
                            tableColumns={locationTypeTableColumns()}
                            currentPage={state.currentPage}
                            rowsPerPage={state.pageSize}
                            rowsPerPageOptions={rowsPerPageOptions}
                            totalCount={state.pagination && state.pagination.count}
                            listData={state.listData}
                            onChangePage={(event: any, page: number) => {
                                dispatch(setCurrentPage(page));
                            }}
                            onChangeRowsPerPage={(event: any) => {
                                dispatch(setRowPerPage(event.target.value));
                            }}
                        />
                }
            </PageContainer>
        </div>
    );

}
export default LocationTypeListing;