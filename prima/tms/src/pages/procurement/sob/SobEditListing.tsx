import { Card, CardContent } from "@material-ui/core";
import { Create, Delete, KeyboardBackspace } from "@material-ui/icons";
import React, { useEffect, useReducer, useState } from "react";
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { SobCreateUrl } from '../../../base/constant/RoutePath';
import { isMobile } from "../../../base/utility/ViewUtils";
import { LaneView } from "../../../component/CommonView";
import Filter from "../../../component/filter/Filter";
import Information from "../../../component/information/Information";
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from "../../../component/widgets/button/Button";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import CardList from "../../../component/widgets/cardlist/CardList";
import TableList from "../../../component/widgets/tableView/TableList";
import { InfoTooltip } from "../../../component/widgets/tooltip/InfoTooltip";
import { showAlert } from "../../../redux/actions/AppActions";
import { setSelectedElement, togglePointsModal } from '../../../redux/actions/SobActions';
import SobReducer, { SOB_STATE } from '../../../redux/reducers/SobReducer';
import { deleteSob, getSob } from '../../../serviceActions/SobServiceActions';
import { sobEditColumn } from "../../../templates/ProcurementTemplates";
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';
import DeleteSobModal from "./DeleteSobModal";
import "./SobEditListing.css";
import SobEditModal from "./SobEditModal";



interface SalesOrderModalProps {
  open: boolean;
  onClose: any;
  selectedElement: any;
}

function SobEditListing(props: SalesOrderModalProps) {
  const appDispatch = useDispatch();
  const history = useHistory();
  const [state = SOB_STATE, dispatch] = useReducer(SobReducer, SOB_STATE);
  const [openEditModal, toggleEditModal] = useState(false);
  const SobCode = new URLSearchParams(useLocation().search).get("sobCode");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [sobData, setSobData] = React.useState<any>({})
  const [selectedContract, setSelectedContract] = React.useState<any>({})
  const [openDeleteModal, setOpenDeleteModal] = React.useState<any>(false)



  useEffect(() => {
    const getSobData = async (inputParams: any) => {
      setLoading(true)
      const response = await appDispatch(getSob(inputParams))
      if (response && response.details && response?.details[0]) {
        setSobData(response?.details[0])
      }
      setLoading(false)
    }
    getSobData({ sobCode: SobCode, isActive: 1 });
    // eslint-disable-next-line
  }, [])

  return (
    <div className="order-detail-wrapper ship-order-detail-wrap">
      <LanePointsDisplayModal
        open={state.openPointModal}
        laneCode={state.selectedItem && state.selectedItem.laneCode}
        onClose={() => {
          dispatch(setSelectedElement(null));
          dispatch(togglePointsModal());
        }} />
      <DeleteSobModal
        open={openDeleteModal}
        onSuccess={() => {
          deleteSobData()
        }}
        onClose={() => {
          setOpenDeleteModal(false);
        }}
      />


      <div className="filter-wrap">
        <Filter
          pageTitle={"Edit SOB"}
          buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
          buttonTitle={isMobile ? " " : "Back"}
          leftIcon={<KeyboardBackspace />}
          onClick={() => {
            history.goBack();
          }}
        >
          <>
            <Button
              buttonStyle={"btn-orange"}
              title={isMobile ? "" : "Delete"}
              leftIcon={<Delete />}
              onClick={() => {
                setOpenDeleteModal(true)
              }}
            />
            <Button
              buttonStyle={"btn-orange"}
              title={isMobile ? "" : "Edit"}
              leftIcon={<Create />}
              onClick={() => {
                history.push({
                  pathname: SobCreateUrl,
                  search: "?sobCode=" + SobCode
                })
              }}
            />
          </>
        </Filter>
      </div>
      <div>
        {loading ? (
          <CardContentSkeleton
            row={3}
            column={3}
          />
        ) : (<PageContainer
        >
          <Card className="creat-contract-wrapp creat-wrapp">
            <div className="billing-info-header">
              <h4>SOB Details </h4>
            </div>
            <CardContent className="creat-contract-content">
              <div className="custom-form-row row">
                <div className="col-md-3 billing-group col-6">
                  <Information title={"SOB ID"} text={sobData.sobCode} />
                </div>
                <div className="col-md-3 billing-group col-6">
                  <Information
                    title={"Lane"}
                    customView={
                      <InfoTooltip
                        disableInMobile={"false"}
                        placement="top"
                        title={"Demtal->Banglore"}
                        infoText={
                          (
                            <LaneView
                              className="lane-wrap lane-content lane-content-mobile slisting-soNum text-truncate"
                              element={sobData}
                              onClickLaneCode={onClickLaneCode}
                            />
                          ) || "......"
                        }
                      />
                    }
                  />
                </div>
                <div className="col-md-3 billing-group col-6">
                  <Information title={"Vehicle Type"} text={sobData.vehicleTypeName} />
                </div>
                <div className="col-md-3 billing-group col-6">
                  <Information title={"Freight Type"} text={sobData.freightTypeCode} />
                </div>
                <div className="col-md-3 billing-group col-6">
                  <Information
                    title={"Placement Cutoff Timing (hr)"}
                    text={sobData.placementCutoffTime}
                  />
                </div>
                <div className="col-md-3 billing-group col-6">
                  <Information title={"Indent Cutoff Timing (hr)"} text={sobData.indentCutoffTime} />
                </div>
              </div>
            </CardContent>
            <CardContent className="creat-contract-content">
              <div className="table-detail-listing">
                {isMobile ? (
                  <CardList
                    listData={sobData?.sobPartners}
                    tableColumns={sobEditColumn(
                      () => { },
                      (item: any) => { setSelectedContract({ contractId: item.contractId }); toggleEditModal(true) }
                    )}
                    isNextPage={false}
                    onReachEnd={() => { }}
                  />
                ) : (
                  <TableList
                    tableColumns={sobEditColumn(
                      () => { },
                      (item: any) => { setSelectedContract({ contractId: item.contractId }); toggleEditModal(true) }
                    )}
                    currentPage={0}
                    rowsPerPage={0}
                    rowsPerPageOptions={rowsPerPageOptions}
                    // totalCount={0}
                    listData={sobData?.sobPartners}
                    onChangePage={(event: any, page: number) => { }}
                    onChangeRowsPerPage={(event: any) => { }}
                  />
                )}
              </div>
              </CardContent>
              {openEditModal && (
                <SobEditModal
                  open={openEditModal} onClose={() => { toggleEditModal(false) }} contract={selectedContract}
                />
              )}
            
          </Card>
        </PageContainer>)}
      </div>
    </div>
  );
  function onClickLaneCode(element: any) {
    dispatch(setSelectedElement(element));
    dispatch(togglePointsModal());
  }


  function deleteSobData() {
    appDispatch(deleteSob({ sobCode: SobCode })).then((response: any) => {
      if (response) {
        appDispatch(showAlert(response.message));
        history.goBack();
      }
    })
  }
}

export default SobEditListing;
