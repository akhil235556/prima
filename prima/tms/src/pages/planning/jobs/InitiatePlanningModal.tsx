import React from "react";
import ModalContainer from "../../../modals/ModalContainer";
import './InitiatePlanningModal.css';
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { useDispatch } from "react-redux";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { createTasks } from "../../../serviceActions/PlanningServiceAction";
import { showAlert } from "../../../redux/actions/AppActions";
import { isNullValue, isFilterNullValue } from '../../../base/utility/StringUtils';

interface CreateJobsModalProps {
  open: boolean;
  onClose: any;
  onApply: any;
}

function InitiatePlanningModal(props: CreateJobsModalProps) {
  const { open, onClose, onApply } = props;
  const appDispatch = useDispatch();
  const [originSuggestion, setOriginSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
  const [destinationSuggestion, setDestinationSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
  const [location, SetLocation] = React.useState<any>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>({});
  return (
    <ModalContainer
      title={"Initiate Planning"}
      primaryButtonTitle={"OK"}
      primaryButtonStyle="btn-orange ok-btn"
      open={open}
      loading={loading}
      onClose={onClose}
      onApply={() => {
        let params: any = null
        if (isNullValue(location.originName) || (!isFilterNullValue(location.originName) && isNullValue(location.origin))) {
          setError({ originName: "Enter valid origin" });
          return;
        } else if (isNullValue(location.destinationName) || (!isFilterNullValue(location.destinationName) && isNullValue(location.destination))) {
          setError({ destinationName: "Enter valid destination" });
          return;
        } else {
          params = {
            origin: location.origin.value,
            destination: location.destination.value
          }
        }
        setLoading(true);
        appDispatch(createTasks(params)).then((response: any) => {
          response && response.message && appDispatch(showAlert(response.message));
          response && onApply();
          setLoading(false);
        })
      }}
      styleName="initiate-planning-modal"
    >
      <div className="form-group">
        <AutoSuggest
          label={"Origin"}
          placeHolder={"Search Origin"}
          value={location.originName}
          error={error.originName}
          suggestions={originSuggestion}
          handleSuggestionsFetchRequested={({ value }: any) => {
            if (value.length > autosuggestSearchLength) {
              getSuggestionList(value);
            }
          }}
          onSelected={(element: OptionType) => {
            SetLocation((prev: any) => ({
              ...prev,
              originName: element.label,
              origin: element,
            }));
            setError({});
          }}
          onChange={(text: string) => {
            SetLocation((prev: any) => ({
              ...prev,
              originName: text,
              origin: "",
            }));
            setError({});
          }}
        />
      </div>
      <div className="form-group">
        <AutoSuggest
          label={"Destination"}
          placeHolder={"Search Destination"}
          value={location.destinationName}
          error={error.destinationName}
          suggestions={destinationSuggestion}
          handleSuggestionsFetchRequested={({ value }: any) => {
            if (value.length > autosuggestSearchLength) {
              getSuggestionList(value, "destination");
            }
          }}
          onSelected={(element: OptionType) => {
            SetLocation((prev: any) => ({
              ...prev,
              destinationName: element.label,
              destination: element,
            }));
            setError({});
          }}
          onChange={(text: string) => {
            SetLocation((prev: any) => ({
              ...prev,
              destinationName: text,
              destination: "",
            }));
            setError({});
          }}
        />
      </div>
    </ModalContainer>
  );

  function getSuggestionList(text: string, type?: string) {
    appDispatch(searchLocationList({ query: text })).then((response: any) => {
      if (response) {
        type ? setDestinationSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"))
          : setOriginSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
      }
    })
  };
}

export default InitiatePlanningModal;
