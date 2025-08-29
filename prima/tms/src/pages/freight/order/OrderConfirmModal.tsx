import { LocalShipping } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import {
  driverNameLabel, driverNamePlaceholder,
  driverNumberLabel, driverNumberPlaceholder, freightTypeLabel, laneTitle, orderCodeLabel, orderStatusLabel, transporterLabel, vehicleNumberHint, vehicleNumberPlaceholder, vehicleTypeHint
} from '../../../base/constant/MessageUtils';
import { ListLaneView } from '../../../component/CommonView';
import Information from "../../../component/information/Information";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
// import AutoComplete from '../../../component/widgets/AutoComplete';
import EditText from '../../../component/widgets/EditText';
import NumberEditText from "../../../component/widgets/NumberEditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import ModalContainer from "../../../modals/ModalContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList } from "../../../moduleUtility/DataUtils";
import { showAlert } from "../../../redux/actions/AppActions";
import { confirmPartner } from "../../../serviceActions/OrderServiceActions";
import { searchVehicleList } from "../../../serviceActions/VehicleServiceActions";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import { createConfirmPartnerParams, validateOrderData } from "./OrderViewUtility";


interface OrderConfirmProps {
  open: boolean,
  onClose: any
  onSuccess: any,
  selectedElement: any
}

function OrderConfirmModal(props: OrderConfirmProps) {
  const appDispatch = useDispatch();
  const { open, onClose, onSuccess, selectedElement = {} } = props;
  const [vehicleNumberList, setVehicleNumberList] = React.useState<Array<OptionType> | undefined>(undefined);
  // const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined);
  const [userParams, setUserParams] = React.useState<any>({});
  const [error, setError] = React.useState<any>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openLanePoints, setOpenLanePoints] = React.useState<boolean>(false);

  React.useEffect(() => {
    const setModalData = async () => {
      if (open && selectedElement) {
        setUserParams({
          ...selectedElement,
          vehicle: selectedElement.vehicleRegistrationNumber ? {
            label: selectedElement.vehicleRegistrationNumber,
            value: selectedElement.vehicleRegistrationNumber,
          } : undefined,
        });
      }
    }
    setModalData();
    // eslint-disable-next-line
  }, [open]);

  return (
    <ModalContainer
      title={"Order Details"}
      primaryButtonTitle={"Save"}
      primaryButtonLeftIcon={<LocalShipping />}
      open={open}
      loading={loading}
      onClose={() => {
        clearData()
        onClose();
      }}
      onApply={() => {
        const validate = validateOrderData(userParams);
        if (validate === true) {
          placedOrder();
        } else {
          setError(validate);
        }
      }}
      styleName="users-modal"
    >
      <div className="custom-form-row">
        <LanePointsDisplayModal
          open={openLanePoints}
          laneCode={selectedElement.laneCode}
          onClose={() => {
            setOpenLanePoints(false);
          }} />
        <div className="info-wrap order-listing-info">
          <div className="row">
            <div className="col-md-6 billing-group">
              <Information
                title={orderCodeLabel}
                text={selectedElement.freightOrderCode}
              />
            </div>
            <div className="col-md-6 billing-group blue-text">
              <Information
                title={orderStatusLabel}
                text={selectedElement.statusName}
              />
            </div>
          </div>
          <div className="divider-bottom"></div>
          <div className="row">
            <div className="col-md-6 billing-group">
              <Information
                title={freightTypeLabel}
                text={selectedElement.freightTypeCode}
              />
            </div>
            <div className="col-md-6 billing-group">
              <Information
                title={vehicleTypeHint}
                text={selectedElement.vehicleType}
              />
            </div>
          </div>
          <div className="divider-bottom"></div>
          <div className="row">
            <div className="col-md-6 billing-group">
              <Information
                title={transporterLabel}
                text={selectedElement.partnerName}
              />
            </div>
            <div className="col-md-6 billing-group">
              <Information
                title={laneTitle}
                customView={<ListLaneView element={selectedElement} onClickLaneCode={(data: any) => { setOpenLanePoints(true); }} />}
              />
            </div>
            {/* <div className="col-md-6 billing-group">
              <Information
                title={originLabel}
                text={selectedElement.originLocationName}
              />
            </div> */}

          </div>
          <div className="divider-bottom"></div>
        </div>
        <div className="row">
          <div className="form-group col-md-6">
            <AutoSuggest
              label={vehicleNumberHint}
              placeHolder={vehicleNumberPlaceholder}
              value={userParams.vehicleRegistrationNumber}
              error={error.vehicleRegistrationNumber}
              suggestions={vehicleNumberList}
              handleSuggestionsFetchRequested={({ value }: any) => {
                if (value.length > autosuggestSearchLength) {
                  getVehicleList(value);
                }
              }}
              onSelected={(element: OptionType) => {
                setValues({
                  vehicleRegistrationNumber: element.label,
                  vehicle: element
                });
              }}
              onChange={(text: string) => {
                setValues({
                  vehicleRegistrationNumber: text,
                  vehicle: undefined
                });
              }}
            />
          </div>
          <div className="form-group col-md-6">
            <EditText
              label={driverNameLabel}
              placeholder={driverNamePlaceholder}
              maxLength={25}
              value={userParams.primaryDriverName}
              error={error.primaryDriverName}
              onChange={(text: any) => {
                setValues({
                  primaryDriverName: text,
                });
              }}
            />
          </div>
          <div className="form-group col-md-6">
            <NumberEditText
              label={driverNumberLabel}
              placeholder={driverNumberPlaceholder}
              maxLength={10}
              decimalSeparator={false}
              value={userParams.primaryDriverNumber}
              error={error.primaryDriverNumber}
              onChange={(text: any) => {
                setValues({
                  primaryDriverNumber: text,
                });
              }}
            />
          </div>
        </div>
      </div>
    </ModalContainer >
  );

  function placedOrder() {
    setLoading(true);
    let confirmPartnerParams = createConfirmPartnerParams(userParams);
    appDispatch(confirmPartner(confirmPartnerParams)).then((response: any) => {
      if (response) {
        response.message && appDispatch(showAlert(response.message));
        clearData();
        onSuccess();
      }
      setLoading(false);
    })
  }

  function clearData() {
    setVehicleNumberList(undefined);
    setUserParams({});
    setError({});
  }

  function setValues(params: any) {
    setUserParams({
      ...userParams,
      ...params
    });
    setError({});
  }
  function getVehicleList(text: string) {
    appDispatch(searchVehicleList({ query: text })).then((response: any) => {
      if (response) {
        setVehicleNumberList(setAutoCompleteList(response.vehicles, "vehicleNumber", "vehicleCode"))
      }
    });
  }
}

export default OrderConfirmModal;
