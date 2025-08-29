import { AddCircle, GetApp, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { partnerCsvUrl } from '../../../base/api/ServiceUrl';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { downloadCsvTitle } from '../../../base/constant/MessageUtils';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
import CardList from '../../../component/widgets/cardlist/CardList';
import TableList from '../../../component/widgets/tableView/TableList';
import { transporterFilters } from '../../../moduleUtility/FilterUtils';
import { showAlert } from '../../../redux/actions/AppActions';
import { refreshList, setCurrentPage, setRowPerPage, showLoading, toggleFilter, toggleModal } from '../../../redux/actions/PartnerActions';
import PartnerReducer, { PARTNER_STATE } from '../../../redux/reducers/PartnerReducer';
import { downloadCsv } from '../../../serviceActions/BulkDownloadCsvServiceActions';
import { clientPartnersList, contractTerminate, disableClientPartnerRltn, getPartnerCheck } from '../../../serviceActions/PartnerServiceAction';
import { partnerTableColumns } from '../../../templates/MasterTemplates';
import CreatePartnerModal from './CreatePartnerModal';
import DisableTransporterModal from './disableTransporterModal/DisableTransporterModal';
import EnablePartner from './EnablePartnerModal';
import PartnerFilters from './PartnerFilters';
import "./PartnerListing.css";

function PartnerListing() {
    const history = useHistory();
    const [openDisableTransporterModal, setOpenDisableTransporterModal] = React.useState<boolean>(false);
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(transporterFilters);
    const appDispatch = useDispatch();
    const [state = PARTNER_STATE, dispatch] = useReducer(PartnerReducer, PARTNER_STATE);
    const [readyToDisable, setReadyToDisable] = React.useState<boolean>(false);
    const [modalLoading, setModalLoading] = React.useState<boolean>(false);
    const [modalCheckList, setModalCheckList] = React.useState<any>({});
    const [selectedPartner, setSelectedPartner] = React.useState<any>({});
    const [createModal, openCreateModal] = React.useState<boolean>(false);

    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let queryParams: any = {
                page: state.currentPage,
                pageSize: state.pageSize,
                // isActive: 1,
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params)
            }
            appDispatch(clientPartnersList(dispatch, queryParams))
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);

    function downloadCsvAction() {
        let queryParams: any = {};
        if (!isObjectEmpty(filterState.params)) {
            queryParams = Object.assign(queryParams, filterState.params)
        }
        appDispatch(downloadCsv(partnerCsvUrl, queryParams))
    }

    return (
        <div>
            <PartnerFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    // dispatch(setFilter(filterChips, filterParams));
                    dispatch(refreshList());
                    addFiltersQueryParams(filterChips, filterParams)
                    dispatch(toggleFilter());

                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />

            <EnablePartner
                open={state.openPartnerModal}
                onSuccess={() => {
                    dispatch(toggleModal());
                    dispatch(refreshList());
                }}
                onClose={() => {
                    dispatch(toggleModal());
                }}
            />

            <CreatePartnerModal
                open={createModal}
                onSuccess={() => {
                    openCreateModal(false);
                    dispatch(refreshList());
                }}
                onClose={() => {
                    openCreateModal(false);
                }}
            />

            <DisableTransporterModal
                open={openDisableTransporterModal}
                onSuccess={() => {
                    disablePartner()
                    setOpenDisableTransporterModal(false)
                    setReadyToDisable(false);
                    setModalCheckList({})
                    dispatch(refreshList());
                }}
                onClose={() => {
                    setOpenDisableTransporterModal(false);
                    setReadyToDisable(false);
                    setModalCheckList({})
                }}
                readyToDisable={readyToDisable}
                isLoading={modalLoading}
                checkList={modalCheckList}
            />
            <div className="filter-wrap">
                <Filter
                    pageTitle="Transporters"
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Create Transporter"}
                        loading={state.loading}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Create Transporter" /> : <AddCircle />}
                        onClick={() => {
                            openCreateModal(true);
                        }}
                    />
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Enable Transporter"}
                        loading={state.loading}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable Transporter" /> : <AddCircle />}
                        onClick={() => {
                            dispatch(toggleModal());
                        }}
                    />
                    <FileAction
                        options={[
                            {
                                menuTitle: downloadCsvTitle,
                                Icon: GetApp,
                                onClick: downloadCsvAction
                            },
                        ]}
                    />
                </Filter>
            </div>
            <PageContainer
                loading={state.loading}
                listData={state.listData}
            >
                {!isObjectEmpty(filterState.chips) && Object.keys(filterState.chips).map((element) => (
                    <Chips
                        label={filterState.chips[element]}
                        onDelete={() => {
                            dispatch(refreshList());
                            removeFiltersQueryParams([element])
                            // dispatch(removeFilter(element));
                        }}
                    />
                ))}
                {
                    isMobile ?
                        <CardList
                            listData={state.listData}
                            tableColumns={partnerTableColumns(onClickViewButton)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={partnerTableColumns(onClickViewButton)}
                            currentPage={state.currentPage}
                            rowsPerPage={state.pageSize}
                            rowsPerPageOptions={rowsPerPageOptions}
                            totalCount={state.pagination && state.pagination.count}
                            listData={state.listData}
                            onChangePage={(event: any, page: number) => {
                                dispatch(setCurrentPage(page))
                            }}
                            onChangeRowsPerPage={(event: any) => {
                                dispatch(setRowPerPage(event.target.value))
                            }}
                        />
                }

            </PageContainer>
        </div>
    )

    function onClickViewButton(element: any) {
        const queryParams = {
            partition: element.partition,
            partnerCode: element.partnerCode,
            partner_name: element.partnerName,
        }
        setModalLoading(true);
        appDispatch(getPartnerCheck(queryParams)).then((response: any) => {
            if (response) {
                const { inSob, inOrder } = response;
                // !inPayment &&
                if (!inSob && !inOrder) {
                    setReadyToDisable(true);
                }
                setModalCheckList(response)

            }
            setModalLoading(false);
        })
        setOpenDisableTransporterModal(true);
        setSelectedPartner(element);
    }

    async function disablePartner() {
        const element = selectedPartner;

        const contractTerminateParams = {
            clientId: element.clientId,
            id: element.id,
            isActive: -1,
            partition: element.partition,
            partnerCode: element.partnerCode,
            partnerId: element.partnerId,
        }

        const disableClientPartnerRltnParams = {
            id: element.id,
            isActive: -1,
            tenant: element.tenant,
            email: element.partnerEmail
        }

        setModalLoading(true);
        const promiseArr = [
            appDispatch(contractTerminate(contractTerminateParams)),
            appDispatch(disableClientPartnerRltn(disableClientPartnerRltnParams))
        ]

        try {
            let response = await Promise.all(promiseArr);
            if (response && response.length > 1) {
                response[1] && response[1].message && appDispatch(showAlert(response[1].message))
            }
        } catch (err) {
            setModalLoading(false);
        }
    }
}
export default PartnerListing;