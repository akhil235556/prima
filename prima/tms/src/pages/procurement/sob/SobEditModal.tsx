import { Tab, Tabs } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { contractCreationTabValue } from "../../../base/constant/ArrayList";
import { noDataAvailableMessage } from "../../../base/constant/MessageUtils";
import { convertDateFormat, displayDateFormatter } from "../../../base/utility/DateUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Information from "../../../component/information/Information";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import ModalContainer from "../../../modals/ModalContainer";
import { getConstraints, getContractDetails, templateConstraints } from '../../../serviceActions/ContractServiceActions';
import { getContractFreightRates } from "../../../serviceActions/FrightRateServiceAction";
import AddConstraintsList from "../contractV2/AddConstraintsList";
import { getConstraintsList } from "../contractV2/AddConstraintsUtility";
import FreightResponseView from "./FreightResponseView";
import "./SobEditModal.css";

interface ContractDetailModalProps {
  open: boolean;
  onClose?: any;
  onSuccess?: any;
  contract: any;
}

function SobEditModal(props: ContractDetailModalProps) {
  const { open, onClose, contract } = props;
  const appDispatch = useDispatch();
  const [loading, setLoading] = React.useState<any>(false);
  const [details, setDetails] = React.useState<any>({});
  const [freightResponse, setFreightResponse] = React.useState<any>([]);
  const [tabIndex, setTabIndex] = React.useState<any>(0);
  const [userPrams, setUserParams] = React.useState<any>([]);

  useEffect(() => {
    const getContracts = async () => {
      setLoading(true)
      const contractResponse = await appDispatch(getContractDetails({ contractCode: contract?.contractId }));
      const freightDetails = await appDispatch(getContractFreightRates({ contractCode: contract?.contractId }))
      contractResponse ? setDetails(contractResponse) : setDetails({})
      freightDetails ? setFreightResponse(freightDetails) : setFreightResponse([])
      Promise.all([
        appDispatch(templateConstraints({})),
        appDispatch(getConstraints({ contractCode: contract?.contractId })),
      ]).then((response: any) => {
        if (response && response[1]) {
          let constraints = getConstraintsList(response);
          if (constraints?.length) {
            setUserParams([...constraints]);
          } else {
            setUserParams([]);
          }
        }
      });
      setLoading(false)
    }
    contract && contract.contractId && getContracts()
    // eslint-disable-next-line
  }, [contract])


  return (
    <ModalContainer
      title="Contract Detail"
      loading={false}
      open={open}
      onClose={() => {
        onClose();
      }}
      styleName={"contract-detail-modal"}
    >
      <div className="order-detail-wrapper">
        {loading ? (
          <CardContentSkeleton row={4} column={2} />
        ) : (
          <div className="custom-form-row row">
            <div className="col-md-6 billing-group col-6">
              <Information
                title={"Transporter"}
                text={details?.partner?.name}
              />
            </div>
            <div className="col-md-6 billing-group col-6">
              <Information title={"Contract ID"} text={details?.contractCode} />
            </div>
            <div className="col-md-6 billing-group col-6">
              <Information title={"Validity From"} text={details?.contractApprovedDate && convertDateFormat(details?.contractApprovedDate, displayDateFormatter)} />
            </div>
            <div className="col-md-6 billing-group col-6">
              <Information title={"Validity To"} text={details?.contractEndDate && convertDateFormat(details?.contractEndDate, displayDateFormatter)} />
            </div>
            <div className="col-md-12 billing-group col-6">
              <Information title={"Status"} text={details?.contractStatus} valueClassName="orange-text"/>
            </div>
          </div>
        )}
      </div>
      <div className="bill-tab tab-nav mb-0">
        <Tabs
          value={tabIndex}
          onChange={(event: any, newValue: any) => setTabIndex(newValue)}
          variant="scrollable"
          scrollButtons={isMobile ? "on" : "off"}
        >
          {contractCreationTabValue.map((element, index) => (
            <Tab key={index} label={element} />
          ))}
        </Tabs>
      </div>
      {!loading && (
        <>
          {tabIndex === 0 && (
          <>
              {freightResponse.length > 0 ? (
                <FreightResponseView contractDetails={details} freightResponse={freightResponse} />
              ) : (
                <div className={"noDataDisplay"}>
                  <p className="m-0">{noDataAvailableMessage}</p>
                </div>
              ) }
          </>
          )}
          {tabIndex === 1 && (
            <>
              {userPrams.length > 0 ? (
                <AddConstraintsList constraints={userPrams} />
              ) : (
                <div className={"noDataDisplay"}>
                  <p className="m-0">{noDataAvailableMessage}</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </ModalContainer>
  );
}

export default SobEditModal;
