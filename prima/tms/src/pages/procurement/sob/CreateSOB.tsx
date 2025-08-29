import { Card, CardContent } from "@material-ui/core";
import { ArrowRightAlt, KeyboardBackspace } from "@material-ui/icons";
import { default as React, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import { freightTypeList } from '../../../base/constant/ArrayList';
import { freightTypeLabel, freightTypePlaceholder, indentCutoffTimingLabel, laneLabel, lanePlaceholder, placementCutoffTimingLabel, vehicleTypeLabel, vehicleTypePlaceholder } from "../../../base/constant/MessageUtils";
import { isNullValue } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Filter from "../../../component/filter/Filter";
import PageContainer from "../../../component/pageContainer/PageContainer";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import Button from "../../../component/widgets/button/Button";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import NumberEditText from "../../../component/widgets/NumberEditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { autosuggestSearchLength } from '../../../moduleUtility/ConstantValues';
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { showAlert } from "../../../redux/actions/AppActions";
import { getSobContractsList } from "../../../serviceActions/ContractServiceActions";
import { searchLane } from "../../../serviceActions/LaneServiceActions";
import { createSob, getSob, updateSob } from '../../../serviceActions/SobServiceActions';
import { getAllVehicleTypeList } from "../../../serviceActions/VehicleTypeServiceActions";
import "./CreateSOB.css";
import { RenderContract } from "./RenderContract";





const initObject = {
  sobPartners: [{
    index: 0
  }],
  freightTypeCode: "FTL"
}

function CreateSOB() {
  const appDispatch = useDispatch();
  const history = useHistory();
  const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);
  const [contractsList, setContractsList] = React.useState<Array<any> | undefined>(undefined);
  const [userParams, setUserParams] = React.useState<any>(initObject);
  const SobCode = new URLSearchParams(useLocation().search).get("sobCode");
  let editMode = !isNullValue(SobCode);
  const [loading, setLoading] = React.useState<boolean>(false);
  const vehicleTypeList = useSelector(
    (state: any) => state.appReducer.vehicleTypeList,
    shallowEqual
  );
  const [partnerLevel, setPartnerLevel] = useState([{ label: "1", value: "1" }])


  useEffect(() => {
    const getList = async () => {
      appDispatch(getAllVehicleTypeList())
    }
    const getSobData = async (inputParams: any) => {
      setLoading(true)
      const response = await appDispatch(getSob(inputParams))
      // setSobData(response?.details[0])
      if (response) {
        let params = {
          freightTypeCode: response.details && response.details[0]?.freightTypeCode,
          vehicleTypeCode: response.details && response.details[0]?.vehicleTypeCode,
          vehicleTypeName: response.details && response.details[0]?.vehicleTypeName,
          laneName: response.details && response.details[0]?.laneName,
          laneCode: response.details && response.details[0]?.laneCode,
          indentCutoffTime: response.details && response.details[0]?.indentCutoffTime,
          placementCutoffTime: response.details && response.details[0]?.placementCutoffTime,
          sobPartners: []
        }
        let sobPartners: any = []
        let tmpPartnerLevel: any = []
        response?.details[0]?.sobPartners?.forEach((item: any, index: number) => {
          tmpPartnerLevel.push({ label: String(index + 1), value: String(index + 1) })
          sobPartners.push({
            index: index,
            allocationPercentage: item.allocationPercentage,
            contractCode: item.contractId,
            status: item.isActive,
            partner: {
              code: item.partnerCode,
              name: item.partnerName,
              contributionScore: item.contributionScore,
              inTransitScore: item.inTransitScore,
              participantScore: item.participantScore
            },
            level: {
              label: item.level,
              value: item.level
            }
          })
        })
        params.sobPartners = sobPartners;

        setUserParams({ ...userParams, ...params })
        setPartnerLevel(tmpPartnerLevel)
      }
      setLoading(false)
    }
    editMode && getSobData({ sobCode: SobCode, isActive: 1 });
    getList();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (!(isNullValue(userParams.laneCode) || isNullValue(userParams.vehicleTypeCode) || isNullValue(userParams.freightTypeCode))) {
      let inputParams = {
        freightTypeCode: userParams.freightTypeCode,
        laneCode: userParams.laneCode,
        vehicleTypeCode: userParams.vehicleTypeCode,
        contractStatus: "ACTIVE"
      }
      getContractsList(inputParams);
    }
    // eslint-disable-next-line
  }, [userParams.laneCode, userParams.vehicleTypeCode, userParams.freightTypeCode])

  return (
    <div>
      <div className="filter-wrap">
        <Filter
          pageTitle={editMode ? "Edit SOB" : "SOB Creation"}
          buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
          buttonTitle={isMobile ? " " : "Back"}
          leftIcon={<KeyboardBackspace />}
          onClick={() => {
            history.goBack();
          }}
        />
      </div>
      <PageContainer>
        <Card className="creat-contract-wrapp creat-wrapp">
          <div className="billing-info-header">
            <h4>SOB Details</h4>
          </div>
          {loading ? (
            <CardContentSkeleton row={3} column={3} />
          ) : (
            <CardContent className="creat-contract-content">
              <div className="custom-form-row row align-items-end">
                <div className="form-group col-md-4">
                  <AutoSuggest
                    label={laneLabel}
                    mandatory
                    isDisabled={editMode}
                    placeHolder={lanePlaceholder}
                    error={userParams.laneCodeError}
                    value={userParams.laneName}
                    suggestions={laneList}
                    handleSuggestionsFetchRequested={({ value }: any) => {
                      if (value.length > autosuggestSearchLength) {
                        getLaneList(value);
                      }
                    }}
                    onSelected={(element: OptionType) => {
                      setUserData({
                        laneName: element.label,
                        laneCode: element.value,
                      })
                    }}
                    onChange={(text: string) => {

                      setUserData({
                        laneCode: undefined,
                        laneName: text,
                        laneCodeError: ""
                      })

                    }}
                  />
                </div>

                <div className="form-group col-md-4">
                  <AutoComplete
                    label={vehicleTypeLabel}
                    mandatory
                    isDisabled={editMode}
                    placeHolder={vehicleTypePlaceholder}
                    value={userParams.vehicleTypeName ? {
                      label: userParams.vehicleTypeName,
                      value: userParams.vehicleTypeCode,
                    } : undefined}
                    error={userParams.vehicleTypeCodeError}
                    options={setAutoCompleteListWithData(
                      vehicleTypeList,
                      "type",
                      "code"
                    )}
                    onChange={(element: OptionType) => {
                      setUserData({ vehicleTypeName: element.label, vehicleTypeCode: element.value, vehicleTypeCodeError: "" });
                    }}
                  />
                </div>

                <div className="form-group col-md-4">
                  <AutoComplete
                    label={freightTypeLabel}
                    mandatory
                    isDisabled={true}
                    placeHolder={freightTypePlaceholder}
                    value={userParams.freightTypeCode ? {
                      label: userParams.freightTypeCode,
                      value: userParams.freightTypeCode
                    } : undefined}
                    error={userParams.freightTypeCodeError}
                    options={freightTypeList}
                    onChange={(element: OptionType) => {
                      setUserData({ freightTypeCode: element.value, freightTypeCodeError: "" })
                    }}
                  />
                </div>

                <div className="form-group col-md-4">
                  <NumberEditText
                    placeholder={"Enter Time in hrs"}
                    maxLength={20}
                    label={placementCutoffTimingLabel}
                    allowNegative={false}
                    decimalSeparator={false}
                    onChange={(text: any) => {
                      setUserData({
                        placementCutoffTime: text
                      })
                    }}
                    value={userParams.placementCutoffTime}
                  />
                </div>
                <div className="form-group col-md-4">
                  <NumberEditText
                    placeholder={"Enter Time in hrs"}
                    maxLength={20}
                    label={indentCutoffTimingLabel}
                    allowNegative={false}
                    decimalSeparator={false}
                    onChange={(text: any) => {
                      setUserData({
                        indentCutoffTime: text
                      })
                    }}
                    value={userParams.indentCutoffTime}
                  />
                </div>
              </div>
              <div className="border-dark-grey"></div>
              <div className="mt-4">
                {userParams.sobPartners && userParams.sobPartners.map((item: any, index: any) => (
                  <RenderContract
                    key={index}
                    element={item}
                    contractsList={createContractsListOption(contractsList, userParams.sobPartners)}
                    isAddButton={(index === 0)}
                    onAdd={(obj: any) => {
                      setPartnerLevel([...partnerLevel, { label: String(userParams.sobPartners.length + 1), value: String(userParams.sobPartners.length + 1) }])
                      setUserData({
                        sobPartners: [...userParams.sobPartners, { ...obj, index: userParams.sobPartners.length }]
                      });
                    }}
                    partnerLevel={partnerLevel}
                    onChangeContract={(obj: any, partnerIndex: number) => {
                      const partners = userParams.sobPartners.map(
                        (data: any) => ((data.index === partnerIndex) ? obj : data));
                      setUserData({
                        sobPartners: partners,
                      });
                    }}
                    onRemove={(partnerIndex: number) => {
                      let newPartnerLevel = [...partnerLevel]
                      newPartnerLevel.pop()
                      setPartnerLevel([...newPartnerLevel])
                      setUserData({
                        sobPartners: userParams.sobPartners.filter((elm: any) => elm.index !== partnerIndex),
                      });
                    }}
                  />
                ))
                }
              </div>
            </CardContent>
          )}
        </Card>

        <div className="text-right">

          <Button
            buttonStyle="btn-blue"
            title={editMode ? "Update" : "Create"}
            loading={loading}
            leftIcon={<ArrowRightAlt />}
            onClick={async () => {
              const validate = validateUserParams()
              if (validate.isError) {
                setUserParams(validate.inputParams)
              } else {
                const params = createSobParams();
                editMode ? updateSobData(params) : createNewSob(params);
              }
            }}
          />
        </div>
      </PageContainer>
    </div>
  );
  function validateUserParams() {
    let inputParams = { ...userParams }
    let isError = false;
    if (isNullValue(inputParams.laneCode)) {
      isError = true;
      inputParams.laneCodeError = "Enter valid lane"
    }
    if (isNullValue(inputParams.vehicleTypeCode)) {
      isError = true;
      inputParams.vehicleTypeCodeError = "Enter valid Vehicle Type"
    }
    if (isNullValue(inputParams.freightTypeCode)) {
      isError = true;
      inputParams.freightTypeCodeError = "Enter valid Freight Type"
    }
    let sobErrorInfo = inputParams.sobPartners.map((sobInfo: any) => {
      if (!(sobInfo.partner && sobInfo.partner.code)) {
        isError = true;
        sobInfo.partnerError = "Enter valid transporter"
      }
      if (!(sobInfo.contractCode)) {
        isError = true;
        sobInfo.contractCodeError = "Enter valid contract"
      }
      if (!(sobInfo.level && sobInfo.level.value)) {
        isError = true;
        sobInfo.levelError = "Select valid level"
      }
      if (!(sobInfo.allocationPercentage)) {
        isError = true;
        sobInfo.allocationPercentageError = "Enter valid Contribution"
      }
      return sobInfo;
    })
    inputParams.sobPartners = sobErrorInfo;
    return {
      isError,
      inputParams
    }

  }

  function createSobParams() {
    let param: any = {
      freightTypeCode: userParams?.freightTypeCode,
      indentCutoffTime: userParams?.indentCutoffTime !== "" ? userParams?.indentCutoffTime : undefined,
      laneCode: userParams?.laneCode,
      placementCutoffTime: userParams?.placementCutoffTime !== "" ? userParams?.placementCutoffTime : undefined,
      sobPartners: [],
      vehicleTypeCode: userParams?.vehicleTypeCode,
      vehicleTypeName: userParams?.vehicleTypeName
    }
    userParams?.sobPartners?.forEach((item: any, index: Number) => {
      if (item.allocationPercentage && item.level && item.contractCode) {
        param.sobPartners.push(
          {
            allocationPercentage: item?.allocationPercentage,
            contractId: item?.contractCode,
            isActive: true,
            level: item?.level?.value,
            partnerCode: item?.partner?.code,
          }
        )
      }
    })
    return param;
  }

  function updateSobData(params: any) {
    setLoading(true)
    appDispatch(updateSob({ ...params, sobCode: SobCode })).then((response: any) => {
      setLoading(false)
      if (response) {
        appDispatch(showAlert(response.message));
        history.goBack();
      }
    })
  }

  function createNewSob(params: any) {
    setLoading(true)
    appDispatch(createSob(params)).then((response: any) => {
      setLoading(false)
      if (response) {
        appDispatch(showAlert(response.message));
        history.goBack();
      }
    })
  }

  function setUserData(inputParams: any) {
    inputParams && setUserParams({
      ...userParams,
      ...inputParams
    });
  }

  function getLaneList(text: string) {
    appDispatch(searchLane({ query: text })).then((response: any) => {
      if (response) {
        setLaneList(setAutoCompleteListWithData(response, "laneName", "laneCode"))
      }
    });
  }
  function getContractsList(inputParams: any) {
    if (!editMode) {
      setContractsList([])
      setUserData({
        sobPartners: [{
          index: 0
        }]
      })
    }
    appDispatch(getSobContractsList(inputParams)).then((response: any) => {
      if (response) {
        setContractsList(response.details)
      }
    });
  }
  function createContractsListOption(contractsList: any, sobPartners: any) {
    let newContractsList: { label: any; value: any; }[] = []
    contractsList?.forEach((item: any, index: Number) => {
      if (sobPartners.filter((e: any) => e.partner?.code === item.partner?.code).length <= 0) {
        newContractsList.push({
          label: item?.partner?.name,
          value: item,
        })
      }
    })
    return newContractsList;
  }

}
export default CreateSOB;
