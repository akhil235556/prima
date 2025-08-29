import React from "react";
import "./NoDuesCertificate.css";
import { ArrowRightAlt } from "@material-ui/icons";
import Filter from '../../../component/filter/Filter';
import Button from '../../../component/widgets/button/Button';
import { useHistory } from 'react-router-dom';
import { NoDuesCertificateCardUrl } from '../../../base/constant/RoutePath';
import PageContainer from "../../../component/pageContainer/PageContainer";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { transporterLabel, transporterPlaceHolder, errorTransporter } from "../../../base/constant/MessageUtils";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { useDispatch } from "react-redux";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";
import { setAutoCompleteList } from "../../../moduleUtility/DataUtils";
import { isFilterNullValue, isNullValue } from "../../../base/utility/StringUtils";
// import AutoComplete from "../../../component/widgets/AutoComplete";
// import { getBillingCycleNoDues } from '../../../serviceActions/ContractServiceActions';
// import { financialStatusList } from "../../../base/constant/ArrayList";

function NoDuesCertificate() {
  let history = useHistory();
  const appDispatch = useDispatch();
  const [error, setError] = React.useState<any>({});
  // const [billingCycleList, setBillingCycleList] = React.useState<Array<OptionType> | undefined>(undefined);
  const [userParams, setUserParams] = React.useState<any>({});
  const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined);

  // useEffect(() => {
  //   const getBillingCycleData = async () => {
  //     appDispatch(getBillingCycleNoDues()).then((response: any) => {
  //       response && setBillingCycleList(setAutoCompleteList(response, "cycle", "cycle"))
  //     })
  //   }
  //   getBillingCycleData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className="certificate-wrap">
      <Filter pageTitle="No Dues Certificates" />
      <PageContainer>
        <div className="row">
          <div className="col-md-10">
            <h1 className="dispatch-head">Select a Transporter</h1>
            {/* <div className="dispatch-content">
              <p>
                No Dues Certificates fact that a reader will be distracted by <br /> the readable content of a page when looking at its layout.
              </p>
            </div> */}
            <div className="row dispatch-location-form no-dues-form align-items-end">
              <div className="col-md-4">
                <AutoSuggest
                  label={transporterLabel}
                  placeHolder={transporterPlaceHolder}
                  value={userParams.partnerName}
                  error={error.partner}
                  suggestions={partnerList}
                  handleSuggestionsFetchRequested={({ value }: any) => {
                    if (value.length > autosuggestSearchLength) {
                      getPartnerList(value);
                    }
                  }}
                  onSelected={(element: OptionType) => {
                    setUserParams({ partnerName: element.label, partnerCode: element.value });
                  }}
                  onChange={(text: string) => {

                    setUserParams({ partnerName: text, partnerCode: "" });
                  }}
                />
              </div>
              {/* <div className="col-md-4">
                <AutoComplete
                  label="Billing Cycle"
                  placeHolder="Billing Cycle"
                  value={userParams.billingCycle}
                  options={billingCycleList}
                  error={error.billingCycle}
                  onChange={(element: OptionType) => {
                    setUserParams({
                      billingCycle: element
                    });
                    setError({});
                  }}
                />
              </div> */}
              <div className="col-md-4">
                <Button
                  buttonStyle="btn-blue"
                  rightIcon={<ArrowRightAlt />}
                  title="Next"
                  onClick={() => {
                    if ((!isFilterNullValue(userParams.partnerName) && isNullValue(userParams.partnerCode)) || (isFilterNullValue(userParams.partnerName))) {
                      setError({ partner: errorTransporter });
                      return;
                    }
                    // else if (isNullValue(userParams.billingCycle)) {
                    //   setError({ billingCycle: billingCycleError });
                    //   return;
                    // }
                    history.push(NoDuesCertificateCardUrl + userParams.partnerCode)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );

  function getPartnerList(text: string) {
    appDispatch(searchClientPartner({ query: text })).then((response: any) => {
      if (response) {
        setPartnerList(setAutoCompleteList(response, "partnerName", "partnerCode"))
      }
    });
  }
}

export default NoDuesCertificate;
