import { Publish, Timelapse, Tune } from "@material-ui/icons";
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RegisterJobs, rowsPerPageOptions } from '../../base/constant/ArrayList';
import { AuctionCreateUrl, AuctionDetaillUrl, AuctionUpdateUrl } from '../../base/constant/RoutePath';
import { useSearchParams } from '../../base/hooks/useSearchParams';
import { isObjectEmpty } from "../../base/utility/StringUtils";
import { isMobile } from '../../base/utility/ViewUtils';
import Chips from "../../component/chips/Chips";
import FileAction from '../../component/fileAction/FileAction';
import Filter from '../../component/filter/Filter';
import PageContainer from '../../component/pageContainer/PageContainer';
import Button from '../../component/widgets/button/Button';
import CardList from '../../component/widgets/cardlist/CardList';
import TableList from '../../component/widgets/tableView/TableList';
import BulkUploadDialog from '../../modals/BulkUploadDialog/BulkUploadDialog';
import { auctionFilters } from '../../moduleUtility/FilterUtils';
import { refreshList, setCurrentPage, setResponse, setRowPerPage, setSelectedElement, toggleBulkUpload, toggleLaneModal } from '../../redux/actions/AuctionActions';
import { toggleFilter } from '../../redux/actions/UserActions';
import AuctionReducer, { AUCTION_STATE } from '../../redux/reducers/AuctionReducer';
import { getAuctionList } from '../../serviceActions/AuctionServiceActions';
import { auctionTableColumns } from '../../templates/AuctionTemplates';
import LanePointsDisplayModal from "../masterPlatform/lane/LanePointsDisplayModal";
import AuctionFilters from "./AuctionFilters";

function AuctionListing() {
  const history = useHistory();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(auctionFilters);
  const appDispatch = useDispatch();
  const [state = AUCTION_STATE, dispatch] = useReducer(AuctionReducer, AUCTION_STATE);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {
        page: state.currentPage,
        size: state.pageSize
      }
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      setLoading(true);
      appDispatch(getAuctionList(queryParams)).then((response: any) => {
        dispatch(setResponse(response));
        setLoading(false);
      })
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);

  return (
    <div className="auction-listing">

      <AuctionFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          //dispatch(setFilter(filterChips, filterParams));
          dispatch(toggleFilter());
          dispatch(refreshList());
          addFiltersQueryParams(filterChips, filterParams)
        }}
        onClose={() => {
          dispatch(toggleFilter());
        }}
      />
      <BulkUploadDialog
        title=" Bulk Upload Auctions"
        open={state.openBulkUpload}
        jobName={RegisterJobs.AUCTION}
        onClose={() => {
          dispatch(toggleBulkUpload());
        }}
      />

      <LanePointsDisplayModal
        open={state.openLaneModal}
        laneCode={state.selectedItem && state.selectedItem.lane && state.selectedItem.lane.laneCode}
        onClose={() => {
          dispatch(setSelectedElement(undefined));
          dispatch(toggleLaneModal());
        }} />
      <Filter
        pageTitle="Auction Listing"
        buttonStyle="btn-orange"
        buttonTitle={isMobile ? " " : "Filter"}
        leftIcon={<Tune />}
        onClick={() => {
          dispatch(toggleFilter())
        }}
      >
        <Button
          buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
          title={isMobile ? " " : "Create Auction"}
          leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <Timelapse />}
          onClick={() => {
            history.push({
              pathname: AuctionCreateUrl,
            })
          }}
        />
        <FileAction
          options={[
            {
              menuTitle: "Upload CSV File",
              Icon: Publish,
              onClick: () => dispatch(toggleBulkUpload())
            },
          ]}
        />
      </Filter>
      <PageContainer
        loading={loading}
        listData={state.listData}
      >
        {!isObjectEmpty(filterState.chips) && Object.keys(filterState.chips).map((element) => (
          <Chips
            label={filterState.chips[element]}
            onDelete={() => {
              dispatch(refreshList());
              if (element === "auctionFromDateTime" || element === "auctionToDateTime") {
                let secondKey = element === "auctionFromDateTime" ? "auctionToDateTime" : "auctionFromDateTime";
                removeFiltersQueryParams([element, secondKey])
              } else {
                removeFiltersQueryParams([element]);
              }
            }}
          />
        ))}

        {
          isMobile ?
            <CardList
              listData={state.listData}
              tableColumns={auctionTableColumns(onClickViewButton, onClickLaneCode)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            /> :
            <TableList
              tableColumns={auctionTableColumns(onClickViewButton, onClickLaneCode)}
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

  function onClickViewButton(element: any) {
    if (element.status === "Scheduled") {
      history.push(AuctionUpdateUrl + element.id)
    } else {
      history.push(AuctionDetaillUrl + element.id)
    }
  }

  function onClickLaneCode(element: any) {
    dispatch(toggleLaneModal());
    dispatch(setSelectedElement(element))
  }

}
export default AuctionListing;
