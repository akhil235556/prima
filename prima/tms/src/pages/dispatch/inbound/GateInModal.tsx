import { LocalShipping } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import React from "react";
import { useDispatch } from "react-redux";
import {
  driverNameLabel, driverNamePlaceholder, driverNumberLabel,
  driverNumberPlaceholder, freightTypeLabel, gateInDateTimeLabel,
  laneTitle, orderCodeLabel, orderStatusLabel, transporterLabel, vehicleNumberHint, vehicleNumberPlaceholder,
  vehicleTypeHint
} from "../../../base/constant/MessageUtils";
import { convertDateTimeServerFormat, displayDateTimeFormatter } from "../../../base/utility/DateUtils";
import { ListLaneView, VehicleNumberDisplayOption } from "../../../component/CommonView";
import Information from "../../../component/information/Information";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from '../../../component/widgets/EditText';
import NumberEditText from '../../../component/widgets/NumberEditText';
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import ModalContainer from '../../../modals/ModalContainer';
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { showAlert } from "../../../redux/actions/AppActions";
import { confirmPartner, shipmentPlaced } from "../../../serviceActions/OrderServiceActions";
import { searchVehicleList } from "../../../serviceActions/VehicleServiceActions";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import './InboundListing.css';
import { createPartnerParams, createShipmentParams, validateGateInData } from "./InboundViewUtility";

interface GateInModalProps {
  open: boolean,
  onClose: any
  onSuccess: any,
  selectedElement: any
}

function GateInModalModal(props: GateInModalProps) {
  const appDispatch = useDispatch();
  const { open, onClose, onSuccess, selectedElement = {} } = props;
  const [vehicleNumberList, setVehicleNumberList] = React.useState<Array<OptionType> | undefined>(undefined)
  const [userParams, setUserParams] = React.useState<any>({});
  const [error, setError] = React.useState<any>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (open && selectedElement) {
      setUserParams({
        ...selectedElement,
        vehicle: selectedElement.vehicleRegistrationNumber ? {
          label: selectedElement.vehicleRegistrationNumber,
          value: selectedElement.vehicleCode,
        } : undefined,
        originGateInTime: convertDateTimeServerFormat(new Date()),
      });
    }
    // eslint-disable-next-line
  }, [open]);

  return (
    <ModalContainer
      title={"Order Details "}
      primaryButtonTitle={"Place"}
      primaryButtonLeftIcon={<LocalShipping />}
      loading={loading}
      open={open}
      onClose={() => {
        clearData()
        onClose();
      }}
      onApply={() => {
        const validate = validateGateInData(userParams);
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
          open={openPointModal}
          laneCode={selectedElement.laneCode}
          onClose={() => {
            setOpenPointModal(false)
          }} />
        <div className="info-wrap">
          <div className="row">
            <div className="col-md-6 billing-group">
              <Information
                title={orderCodeLabel}
                text={selectedElement.freightOrderCode}
              />
            </div>
            <div className="col-md-6 billing-group">
              <Information
                title={"Shipping Code"}
                text={selectedElement.freightShipmentCode}
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
                text={selectedElement.vehicleTypeName}
              />
            </div>
          </div>
          <div className="divider-bottom"></div>
          <div className="row">
            <div className="col-md-6 billing-group">
              <Information
                title={"Volume"}
                text={((selectedElement && selectedElement.totalShipmentVolume && (selectedElement.totalShipmentVolume + " m")) || "")}
                sup={3}
              />
            </div>
            <div className="col-md-6 billing-group">
              <Information
                title={"Weight"}
                text={((selectedElement && selectedElement.totalShipmentWeight && (selectedElement.totalShipmentWeight + " kg")) || "")}
              />
            </div>
          </div>
          <div className="divider-bottom"></div>
          <div className="row">
            <div className="col-md-6 billing-group">
              <Information
                title={laneTitle}
                customView={<ListLaneView element={selectedElement} onClickLaneCode={() => {
                  setOpenPointModal(true);
                }} />}
                text={selectedElement.vehicleRegistrationNumber}
              />
            </div>
            <div className="col-md-6 billing-group">
              <Information
                title={transporterLabel}
                text={selectedElement.partnerName}
              />
            </div>
          </div>
          <div className="divider-bottom"></div>
          <div className="row">
            <div className="col-md-6 billing-group orange-text">
              <Information
                valueClassName="orange-text"
                title={orderStatusLabel}
                text={selectedElement.statusName}
              />
            </div>
          </div>
          <div className="divider-bottom"></div>
        </div>
      </div>
      <div className="row">
        <div className="form-group col-md-6 auto-suggest">
          <AutoSuggest
            label={vehicleNumberHint}
            mandatory
            placeHolder={vehicleNumberPlaceholder}
            value={userParams.vehicleRegistrationNumber}
            error={error.vehicleRegistrationNumber}
            suggestions={vehicleNumberList}
            renderOption={(optionProps: any) => <VehicleNumberDisplayOption optionProps={optionProps} />}
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
        <div className="form-group col-md-6 input-space">
          <EditText
            label={driverNameLabel}
            placeholder={driverNamePlaceholder}
            maxLength={25}
            mandatory
            value={userParams.primaryDriverName}
            error={error.primaryDriverName}
            onChange={(text: any) => {
              setValues({
                primaryDriverName: text,
              });
            }}
          />
        </div>
        <div className="form-group col-md-6 input-space">
          <NumberEditText
            label={driverNumberLabel}
            placeholder={driverNumberPlaceholder}
            maxLength={10}
            mandatory
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
        <div className="form-group col-md-6">
          <label className="picker-label">{gateInDateTimeLabel} <span className="mandatory-flied">*</span></label>
          <DateTimePicker
            className="custom-date-picker"
            placeholder="From Date"
            hiddenLabel
            helperText={error.originGateInTime}
            format={displayDateTimeFormatter}
            value={userParams.originGateInTime}
            onChange={(date: any) => {
              setValues({ originGateInTime: convertDateTimeServerFormat(date) });
            }}
          />
        </div>

      </div>
    </ModalContainer >
  );

  function placedOrder() {
    setLoading(true);
    let newUserParams = createPartnerParams(userParams);
    appDispatch(confirmPartner(newUserParams)).then((response: any) => {
      if (response) {
        // response.message && appDispatch(showAlert(response.message));
        let UserRolesAndPermissionsParams = createShipmentParams(userParams);
        return appDispatch(shipmentPlaced(UserRolesAndPermissionsParams));
      } else {
        setLoading(false);
      }
    }).then((response: any) => {
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
    let requestParams = {
      query: text,
      vehicleTypeCode: selectedElement.vehicleType
    }
    appDispatch(searchVehicleList(requestParams)).then((response: any) => {
      if (response) {
        setVehicleNumberList(setAutoCompleteListWithData(response.vehicles, "vehicleNumber", "vehicleCode"))
      }
    });
  }
}

export default GateInModalModal;
