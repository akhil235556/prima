import { AddCircle } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { isMobile } from '../../../base/utility/ViewUtils';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
import CardList from '../../../component/widgets/cardlist/CardList';
import TableList from '../../../component/widgets/tableView/TableList';
import { refreshList, setCurrentPage, setRowPerPage, setSelectedElement, showLoading, toggleModal } from '../../../redux/actions/RolesAction';
import RolesReducer, { ROLES_STATE } from '../../../redux/reducers/RolesReducer';
import { getRolesList } from '../../../serviceActions/RolesServiceActions';
import { roleTableColumns } from '../../../templates/SettingTemplates';
import CreateRoleModal from './CreateRoleModal';
import "./Roles.css";

function RolesListing() {

  const appDispatch = useDispatch();
  const [state = ROLES_STATE, dispatch] = useReducer(RolesReducer, ROLES_STATE);

  useEffect(() => {
    const getList = async () => {
      dispatch(showLoading());
      let queryParams: any = {
        page: state.currentPage,
        pageSize: state.pageSize
      }
      appDispatch(getRolesList(dispatch, queryParams))
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refreshList, state.currentPage, state.pageSize,]);

  return (
    <div>
      <CreateRoleModal
        open={state.openModal}
        selectedElement={state.selectedElement}
        onSuccess={() => {
          dispatch(refreshList());
          dispatch(toggleModal());
        }}
        onClose={() => {
          dispatch(setSelectedElement(undefined));
          dispatch(toggleModal());
        }} />
      <div className="filter-wrap">
        <Filter
          pageTitle={"Roles"}

        >

          <Button
            buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
            title={isMobile ? "" : "Create Role"}
            loading={state.loading}
            leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
            onClick={() => {
              dispatch(toggleModal());
            }}
          />
        </Filter>

      </div>
      <div className="roles-table">
        <PageContainer
          loading={state.loading}
          listData={state.listData}
        >
          {isMobile ?
            <CardList
              listData={state.listData}
              tableColumns={roleTableColumns(onClickViewButton)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            /> :
            <TableList
              tableColumns={roleTableColumns(onClickViewButton)}
              currentPage={state.currentPage}
              rowsPerPage={state.pageSize}
              rowsPerPageOptions={rowsPerPageOptions}
              totalCount={state.pagination && state.pagination.count}
              listData={state.listData}
              onChangePage={(event: any, page: number) => {
                dispatch(setCurrentPage(page));
              }}
              onChangeRowsPerPage={(event: any) => {
                dispatch(setRowPerPage(event.target.value))
              }}
            />
          }
        </PageContainer>
      </div>
    </div>
  )

  function onClickViewButton(element: any) {
    dispatch(setSelectedElement(element));
    dispatch(toggleModal());
  }
}
export default RolesListing;