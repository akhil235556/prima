import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  errorLane,
  errorTransporter,
  fromDateError,
  laneLabel,
  lanePlaceholder,
  toDateError,
  transporterLabel,
  transporterPlaceHolder,
} from "../../../base/constant/MessageUtils";
import {
  isFilterNullValue,
  isNullValue,
  isObjectEmpty,
} from "../../../base/utility/StringUtils";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList } from "../../../moduleUtility/DataUtils";
import { searchLane } from "../../../serviceActions/LaneServiceActions";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";

interface ForwardTrackingFiltersProps {
  open: boolean;
  onClose: any;
  onApplyFilter: any;
  filerChips: any;
  filerParams: any;
}

function ForwardTrackingFilters(props: ForwardTrackingFiltersProps) {
  const appDispatch = useDispatch();
  const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
  const [filterValues, setFilterValues] = React.useState<any | undefined>({});
  const [filterParams, setFilterParams] = React.useState<any | undefined>({});
  const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>({});
  const [partnerList, setPartnerList] = React.useState<
    Array<OptionType> | undefined
  >(undefined);
  const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(
    undefined
  );

  useEffect(() => {
    if (open) {
      setFilterValues(filerChips);
      setFilterParams(filerParams);
      setIsFilterChanged(false);
    }
    // eslint-disable-next-line
  }, [open]);

  return (
    <FilterContainer
      open={open}
      onClose={() => {
        setError({});
        closeModal();
      }}
      onClear={() => {
        setFilterParams({});
        setFilterValues({});
        setError({});
      }}
      onApply={onApply}
    >
      <div className="filter-form-row">
        <div className="form-group">
          <AutoSuggest
            label={transporterLabel}
            placeHolder={transporterPlaceHolder}
            value={filterValues.partnerName}
            error={error.partner}
            suggestions={partnerList}
            handleSuggestionsFetchRequested={({ value }: any) => {
              if (value.length > autosuggestSearchLength) {
                getPartnerList(value);
              }
            }}
            onSelected={(element: OptionType) => {
              setValues(
                { partnerName: element.label },
                { partnerCode: element.value }
              );
            }}
            onChange={(text: string) => {
              setValues({ partnerName: text }, { partnerCode: "" });
            }}
          />
        </div>
        <div className="form-group">
          <AutoSuggest
            label={laneLabel}
            placeHolder={lanePlaceholder}
            value={filterValues.laneName}
            suggestions={laneList}
            error={error.lane}
            handleSuggestionsFetchRequested={({ value }: any) => {
              if (value.length > autosuggestSearchLength) {
                getLaneList(value);
              }
            }}
            onSelected={(element: OptionType) => {
              setValues(
                { laneName: element.label },
                { laneCode: element.value }
              );
            }}
            onChange={(text: string) => {
              setValues({ laneName: text }, { laneCode: "" });
            }}
          />
        </div>
      </div>
    </FilterContainer>
  );

  function getPartnerList(text: string) {
    appDispatch(searchClientPartner({ query: text })).then((response: any) => {
      if (response) {
        setPartnerList(
          setAutoCompleteList(response, "partnerName", "partnerCode")
        );
      }
    });
  }

  function getLaneList(text: string) {
    appDispatch(searchLane({ query: text })).then((response: any) => {
      if (response) {
        setLaneList(setAutoCompleteList(response, "laneName", "laneCode"));
      }
    });
  }

  function setValues(chips: any, params?: any) {
    setFilterValues({
      ...filterValues,
      ...chips,
    });
    setError({});
    params &&
      setFilterParams({
        ...filterParams,
        ...params,
      });
    setIsFilterChanged(true);
  }

  function closeModal() {
    setError({});
    onClose();
  }

  function onApply() {
    if (
      !isFilterNullValue(filterValues.partnerName) &&
      isNullValue(filterParams.partnerCode)
    ) {
      setError({ partner: errorTransporter });
      return;
    } else if (
      !isFilterNullValue(filterValues.laneName) &&
      isNullValue(filterParams.laneCode)
    ) {
      setError({ lane: errorLane });
      return;
    } else if (
      !isNullValue(filterValues.period) &&
      (isNullValue(filterParams.fromDate) || isNullValue(filterParams.toDate))
    ) {
      if (isNullValue(filterParams.fromDate)) {
        setError({ fromDate: fromDateError });
        return;
      } else if (isNullValue(filterParams.toDate)) {
        setError({ toDate: toDateError });
        return;
      }
    }

    if (!isObjectEmpty(filterParams)) {
      if (isFilterChanged) {
        setError({});
        onApplyFilter(filterValues, filterParams);
      } else {
        closeModal();
      }
    } else {
      setError({ partner: errorTransporter });
    }
  }
}

export default ForwardTrackingFilters;
