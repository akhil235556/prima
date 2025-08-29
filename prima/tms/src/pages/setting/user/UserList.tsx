import { AddCircle, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
import CardList from '../../../component/widgets/cardlist/CardList';
import TableList from '../../../component/widgets/tableView/TableList';
import { InfoTooltip } from '../../../component/widgets/tooltip/InfoTooltip';
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { usersFilters } from '../../../moduleUtility/FilterUtils';
import {
  refreshList, setCurrentPage, setRowPerPage, setSelectedItem,
  showLoading, toggleFilter, toggleModal
} from '../../../redux/actions/UserActions';
import UserReducer, { USER_STATE } from '../../../redux/reducers/UserReducer';
import { getGateList } from '../../../serviceActions/LocationServiceActions';
import { checkUserCreate, getUserList } from '../../../serviceActions/UserServiceActions';
import { userTableColumns } from '../../../templates/SettingTemplates';
import CreateUserModal from './CreateUserModal';
import UserFilters from './UserFilters';
import "./UserList.css";


function UserList() {

  const appDispatch = useDispatch();
  const [state = USER_STATE, dispatch] = useReducer(UserReducer, USER_STATE);
  const history = useHistory();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(usersFilters);
  const [gateOptions, setGateOptions] = React.useState<any>([]);
  const [enableCreateUser, setEnableCreateUser] = React.useState<any>(true);

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {
        page: state.currentPage,
        pageSize: state.pageSize
      }

      appDispatch(getGateList({ locationCode: 'ALL' })).then((response: any) => {
        response && response.details && setGateOptions(setAutoCompleteListWithData(response.details.result, "gateName", "gateCode"))
      })

      appDispatch(checkUserCreate()).then((response: any) => {
        if (response && response?.code === 200) {
          setEnableCreateUser(false);
        }
      });

      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params)
      }

      dispatch(showLoading());
      appDispatch(getUserList(dispatch, queryParams));
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);
  return (
    <div>
      <UserFilters
        open={state.openFilter}
        appliedFilters={filterState.chips}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          if (!isObjectEmpty(filterChips)) {
            dispatch(refreshList());
            //dispatch(setFilter(filterChips, filterParams));
            addFiltersQueryParams(filterChips, filterParams);
          }
          dispatch(toggleFilter());
        }}
        onClose={() => {
          dispatch(toggleFilter());
        }}
      />

      <CreateUserModal
        open={state.openModal}
        selectedElement={state.selectedItem}
        gatesList={gateOptions}
        onSuccess={() => {
          dispatch(toggleModal());
          dispatch(refreshList());
        }}
        onClose={() => {
          dispatch(toggleModal());
        }} />

      <div className="filter-wrap">
        <Filter
          pageTitle={"Users"}
          buttonStyle="btn-orange"
          buttonTitle={isMobile ? " " : "Filter"}
          leftIcon={<Tune />}
          onClick={() => {
            dispatch(toggleFilter());
          }}
        >
          {
            enableCreateUser ?
            <InfoTooltip
            title={"User do not have permission to create user"}
            customIcon={ <Button
              buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
              title={isMobile ? "" : "Create User"}
              loading={state.loading}
              leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
              disable={true}
            /> }
            >
            </InfoTooltip> :
            <Button
            buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
            title={isMobile ? "" : "Create User"}
            loading={state.loading}
            leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
            disable={false}
            onClick={() => {
              dispatch(toggleModal());
              dispatch(setSelectedItem(undefined));
            }}
          />
          }
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
              //dispatch(removeFilter(element));
              removeFiltersQueryParams([element]);
            }}
          />

        ))}
        {isMobile ?
          <CardList
            listData={state.listData}
            tableColumns={userTableColumns(onClickViewButton)}
            isNextPage={state.pagination && state.pagination.next}
            onReachEnd={() => {
              dispatch(setCurrentPage(state.pagination.next))
            }}
          /> :
          <TableList
            tableColumns={userTableColumns(onClickViewButton)}
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
  )

  function onClickViewButton(element: any) {
    dispatch(setSelectedItem(element));
    dispatch(toggleModal());
  }

}
export default UserList;