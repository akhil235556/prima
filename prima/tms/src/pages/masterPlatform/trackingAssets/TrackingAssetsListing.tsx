import React, { useEffect, useReducer } from 'react';
import "./TrackingAssetsListing.css"
import Breadcrumb from '../../../component/breadcrumb/Breadcrumb';
import Filter from '../../../component/filter/Filter';
import { AddCircle } from '@material-ui/icons';
import Button from '../../../component/widgets/button/Button';
import TableList from '../../../component/widgets/tableView/TableList';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { trackingAssetsTableColumns } from '../../../templates/MasterTemplates';
// import TrackingAssetsFilter from './TrackingAssetsFilters';
import CreateTrackingAssetsModal from './CreateTrackingAssetsModal';
import PageContainer from '../../../component/pageContainer/PageContainer';
import { useDispatch } from 'react-redux';
import { toggleModal, setCurrentPage, setSelectedElement, refreshList, showLoading } from '../../../redux/actions/TrackingAssetsActions';
import TrackingAssetsReducer, { TRACKING_ASSETS_STATE } from '../../../redux/reducers/TrackingAssetsReducer';
import { getTrackingAssetsList } from '../../../serviceActions/TrackingAssetsServiceActions';
import CardList from '../../../component/widgets/cardlist/CardList';
import { isMobile } from '../../../base/utility/ViewUtils';

function TrackingAssetsListing() {

    const appDispatch = useDispatch();
    const [state = TRACKING_ASSETS_STATE, dispatch] = useReducer(TrackingAssetsReducer, TRACKING_ASSETS_STATE);

    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            appDispatch(getTrackingAssetsList(dispatch));
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList]);

    return (
        <div className="tracking-assets">
            <CreateTrackingAssetsModal
                open={state.openModal}
                selectedElement={state.selectedItem}
                onSuccess={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(refreshList());
                    dispatch(toggleModal());

                }}
                onClose={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(toggleModal());
                }} />
            <div className="filter-wrap">
                <Breadcrumb />
                <Filter
                    pageTitle="Tracking Assets"
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Create Assets"}
                        loading={state.loading}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
                        onClick={() => {
                            dispatch(toggleModal());
                        }}
                    />
                </Filter>
            </div>
            <PageContainer
                loading={state.loading}
                listData={state.listData}
            >
                {isMobile ?
                    <CardList
                        listData={state.listData}
                        tableColumns={trackingAssetsTableColumns(onClickViewButton)}
                        isNextPage={state.pagination && state.pagination.next}
                        onReachEnd={() => {
                            dispatch(setCurrentPage(state.pagination.next))
                        }}
                    /> :
                    <TableList
                        tableColumns={trackingAssetsTableColumns(onClickViewButton)}
                        currentPage={0}
                        rowsPerPage={25}
                        rowsPerPageOptions={rowsPerPageOptions}
                        // totalCount={100}
                        listData={state.listData}
                        onChangePage={(event: any, page: number) => {
                            dispatch(setCurrentPage(page));
                        }}
                        onChangeRowsPerPage={(event: any) => {

                        }}
                    />
                }
            </PageContainer>
        </div >
    )

    function onClickViewButton(element: any) {
        dispatch(setSelectedElement(element));
        dispatch(toggleModal());
    }
}
export default TrackingAssetsListing;