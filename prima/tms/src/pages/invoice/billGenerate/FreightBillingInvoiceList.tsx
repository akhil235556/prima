import { Tab, Tabs } from "@material-ui/core";
import { CheckCircle, Close, Tune } from "@material-ui/icons";
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { InvoiceStatusEnum, invoiceTab, rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { bulkApproveTitle } from "../../../base/constant/MessageUtils";
import { FreightBillingListUrl, FreightBillingPeriodicInvoiceUrl, FreightBillingTripInvoiceUrl, InvoiceBulkApproveListUrl } from '../../../base/constant/RoutePath';
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { useQuery } from "../../../base/utility/Routerutils";
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import FileAction from "../../../component/fileAction/FileAction";
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import { TabPanel } from "../../../component/tabs/TabPanel";
import Button from "../../../component/widgets/button/Button";
import CardList from '../../../component/widgets/cardlist/CardList';
import TableList from "../../../component/widgets/tableView/TableList";
import WarningModal from "../../../modals/warningModal/WarningModal";
import { getInvoiceStatusUrl } from '../../../moduleUtility/BillUtility';
import { invoiceFilters } from "../../../moduleUtility/FilterUtils";
import { showAlert } from "../../../redux/actions/AppActions";
import { hideLoading, refreshList, setCurrentPage, setRowPerPage, setSelectedElement, setSelectedTab, showLoading, toggleFilter, togglePointsModal } from '../../../redux/actions/InvoiceActions';
import InvoiceReducer, { INVOICE_STATE } from '../../../redux/reducers/InvoiceReducer';
import { getInvoiceList, payBulkBill } from '../../../serviceActions/BillGenerateServiceActions';
import { pendingTableColumns } from "../../../templates/InvoiceTemplates";
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';
import FreightBillingInvoiceFilters from "./FreightBillingInvoiceFilters";
import "./FreightBillingInvoiceList.css";

function FreightBillingInvoiceList() {
  const history = useHistory();
  const { id } = useParams<any>();
  const params = useQuery();
  const appDispatch = useDispatch();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(invoiceFilters);
  const [state = INVOICE_STATE, dispatch] = useReducer(InvoiceReducer, INVOICE_STATE);
  const [allValue, setAllValue] = React.useState<any>(false);
  const [openCancelModal, setOpenCancelModal] = React.useState<boolean>(false);
  const userParams = React.useRef<any>([]);
  const [selectedCount, setSelectedCount] = React.useState<any>(0)
  useEffect(() => {
    userParams.current = []
    setSelectedCount(0)
    const getList = async () => {
      setAllValue(false)
      let queryParams: any = {
        pageNo: state.currentPage,
        pageSize: state.pageSize,
      }
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      dispatch(showLoading());
      appDispatch(getInvoiceList(dispatch, queryParams, id ? id : state.selectedTabName, getInvoiceStatusUrl(id ? id : state.selectedTabName)));
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh_list, state.currentPage, state.pageSize, history.location.search, id]);

  return (
    <div className="invoice-listing-wrapper">
      <FreightBillingInvoiceFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        approvedBy={state.selectedTabName}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          dispatch(refreshList());
          addFiltersQueryParams(filterChips, filterParams)
          dispatch(toggleFilter());
        }}
        onClose={() => {
          dispatch(toggleFilter());
        }}
      />

      <Filter
        pageTitle={invoiceTab[state.selectedTabIndex]}
        buttonStyle="count-num btn-blue"
        buttonTitle={state.selectedTabName === InvoiceStatusEnum.APPROVED ? (isMobile ? " " : "Pay") : ""}
        count={selectedCount}
        loading={state.loading}
        onClick={() => {
          if (userParams.current?.length === 0) {
            appDispatch(showAlert("Please select at least one Invoice to Pay", false));
            return;
          }
          else {
            setOpenCancelModal(true)
          }
        }}
      >
        {
          <Button
            buttonStyle={"btn-orange"}
            title={isMobile ? " " : "Filter"}
            leftIcon={<Tune />}
            onClick={() => {
              dispatch(toggleFilter())
            }}
          />
        }
        {(state.selectedTabName === "AWAITING APPROVAL") &&
          <FileAction
            options={[
              {
                menuTitle: bulkApproveTitle,
                Icon: CheckCircle,
                onClick: () => {
                  history.push({
                    pathname: InvoiceBulkApproveListUrl,
                  })
                }
              }
            ]}
          />
        }
      </Filter>

      <LanePointsDisplayModal
        open={state.openPointModal}
        laneCode={state.selectedItem && state.selectedItem.lane && state.selectedItem.lane.code}
        onClose={() => {
          dispatch(setSelectedElement(undefined));
          dispatch(togglePointsModal());
        }} />

      <WarningModal
        open={openCancelModal}
        onClose={() => {
          setOpenCancelModal(false);
        }}
        secondaryButtonLeftIcon={<Close />}
        primaryButtonLeftIcon={<CheckCircle />}
        warningMessage={"All the selected bills will be marked as paid."}
        primaryButtonTitle={"Confirm"}
        secondaryuttonTitle={"Cancel"}
        onSuccess={() => {
          setOpenCancelModal(false);
          dispatch(showLoading())
          userParams.current?.length > 0 && appDispatch(payBulkBill({ BulkBillDetails: userParams.current })).then((response: any) => {
            if (response) {
              dispatch(refreshList())
              response.message && appDispatch(showAlert(response.message));
            }
            dispatch(hideLoading());
          })
        }}
      />
      <div >
        <div className="bill-tab tab-nav">
          <Tabs value={state.selectedTabIndex} onChange={(event: any, newValue: any) => {
            if (newValue !== state.selectedTabIndex) {
              dispatch(setSelectedTab(newValue));
              dispatch(setCurrentPage(1));
              dispatch(setRowPerPage(rowsPerPageOptions[0]));
              history.replace({
                pathname: FreightBillingListUrl + invoiceTab[newValue],
                search: params.toString()
              });
            }
          }}
            variant="scrollable"
            scrollButtons={isMobile ? "on" : "off"}
          >
            {invoiceTab.map((element, index) => (
              <Tab
                key={index}
                label={element} />
            ))}
          </Tabs>
        </div>
        <TabPanel
          value={state.selectedTabIndex}
          index={state.selectedTabIndex}>
          {pageContent}
        </TabPanel>
      </div>
    </div>
  );

  function pageContent() {
    return (<PageContainer
      loading={state.loading}
    >
      {!isObjectEmpty(filterState.chips) && Object.keys(filterState.chips).map((element) => (
        <Chips
          label={filterState.chips[element]}
          onDelete={() => {
            dispatch(refreshList());
            if (element === "createdFrom" || element === "createdTo" || element === "freightOrderCreatedFrom" || element === "freightOrderCreatedTo") {
              let secondKey = "";
              if (element === "createdFrom" || element === "createdTo") {
                secondKey = element === "createdFrom" ? "createdTo" : "createdFrom";
              } else if (element === "freightOrderCreatedFrom" || element === "freightOrderCreatedTo") {
                secondKey = element === "freightOrderCreatedFrom" ? "freightOrderCreatedTo" : "freightOrderCreatedFrom";
              }
              removeFiltersQueryParams([element, secondKey])
            } else {
              removeFiltersQueryParams([element]);
            }
          }}
        />
      ))}
      {state.selectedTabName === InvoiceStatusEnum.APPROVED ?
        (
          <TableList
            tableColumns={pendingTableColumns(handleChecks, handleAllChecks, allValue, onClickViewButton, onClickLaneCode, state.selectedTabName, userParams.current)}
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
        ) :
        (isMobile ?
          <CardList
            listData={state.listData}
            tableColumns={pendingTableColumns(handleChecks, handleAllChecks, allValue, onClickViewButton, onClickLaneCode, state.selectedTabName)}
            isNextPage={state.pagination && state.pagination.next}
            onReachEnd={() => {
              dispatch(setCurrentPage(state.pagination.next))
            }}
          />
          :
          <TableList
            tableColumns={pendingTableColumns(handleChecks, handleAllChecks, allValue, onClickViewButton, onClickLaneCode, state.selectedTabName)}
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
        )
      }
    </PageContainer>);
  }

  function handleChecks(billNo: any, checked: any) {
    let checkedCounts: any = 0;
    if (checked) {
      userParams.current = [...userParams.current, { "billNo": billNo }]
    } else {
      userParams.current = [...userParams.current.filter((item: any) => item.billNo !== billNo)]
    }
    checkedCounts = userParams.current?.length;
    setSelectedCount(checkedCounts)
    if (checked && (checkedCounts === (state.listData && state.listData.length))) {
      setAllValue(true);
    } else {
      setAllValue(false);
    }
  }

  function handleAllChecks(checked: any) {
    state.listData && state.listData.forEach((item: any) => {
      if (checked) {
        userParams.current.filter((element: any) => item.billNo === element.billNo).length < 1 && userParams.current.push({ "billNo": item.billNo })
      }
    })
    if (!checked) {
      userParams.current = []
    }
    setSelectedCount(userParams.current.length)
    setAllValue(checked)
  }

  function onClickViewButton(element: any) {
    if (element && element.billType !== "trip") {
      // Redirecting to Periodic Pending Billing View
      history.push({
        pathname: FreightBillingPeriodicInvoiceUrl + element.billNo,
        state: state
      });
    } else {
      // Redirecting to Trip Level Pending  Billing View
      history.push({
        pathname: FreightBillingTripInvoiceUrl + element.billNo,
      });
    }
  }

  function onClickLaneCode(element: any) {
    dispatch(togglePointsModal());
    dispatch(setSelectedElement(element))
  }
}
export default FreightBillingInvoiceList;
