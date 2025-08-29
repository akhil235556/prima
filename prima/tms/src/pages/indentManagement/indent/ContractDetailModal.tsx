import { Card, CardContent, CardHeader, Collapse, Tab, Tabs } from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { contractCreationTabValue, FreightType } from '../../../base/constant/ArrayList';
import { contractId, noDataAvailableMessage, orderStatusLabel, TranspoterLabel, validityFrom, validityTo } from '../../../base/constant/MessageUtils';
import { convertDateFormat, displayDateFormatter } from "../../../base/utility/DateUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Information from "../../../component/information/Information";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import ModalContainer from "../../../modals/ModalContainer";
import { getConstraints, getContractDetails, searchContractDetails, templateConstraints } from '../../../serviceActions/ContractServiceActions';
import {
    getContractFreightRates, getFreightDefinition, getProxyContractFreightRates, getProxyFreightDefinition
} from "../../../serviceActions/FrightRateServiceAction";
import AddConstraintsList from "../../procurement/contractV2/AddConstraintsList";
import { getConstraintsList } from "../../procurement/contractV2/AddConstraintsUtility";
import ContractFreightChargeDetail from "../ContractFreightChargeDetail";
import './ContractDetailModal.css';

interface ContractDetailModalProps {
    open: boolean
    onClose: any
    onSuccess: any
    selectedElement?: any
    laneCode: any
    freightType: any
    showAllCharges?: boolean
    isContractPermissionRequired?: boolean
}

function ContractDetailModal(props: ContractDetailModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, selectedElement, laneCode, freightType, showAllCharges, isContractPermissionRequired } = props;
    const [loading, setLoading] = React.useState<any>(false);
    const [response, setResponse] = React.useState<any>({});
    const [charges, setCharges] = React.useState<any>([]);
    const [details, setDetails] = React.useState<any>([]);
    const [tabIndex, setTabIndex] = React.useState<any>(0);
    const [userPrams, setUserParams] = React.useState<any>([]);

    useEffect(() => {
        const getDetails = () => {
            setLoading(true);
            let queryParams: any = {
                contractCode: selectedElement.contractCode,
                partnerCode: selectedElement.partnerCode
            }
            let promiseList: any = [];
            if (freightType === "PTL") {
                queryParams.laneCode = laneCode;
            }
            if (isContractPermissionRequired) {
                promiseList.push(appDispatch(getContractDetails({ contractCode: selectedElement.contractCode })));
                let chargesInfo = showAllCharges ?
                    appDispatch(getContractFreightRates({ contractCode: selectedElement.contractCode })) :
                    appDispatch(getFreightDefinition(queryParams));
                promiseList.push(chargesInfo);
            } else {
                promiseList.push(appDispatch(searchContractDetails({ contractCode: selectedElement.contractCode })));
                let chargesInfo = showAllCharges ?
                    // appDispatch(getContractFreightRates({ contractCode: selectedElement.contractCode })) :
                    // appDispatch(getFreightDefinition(queryParams));
                    appDispatch(getProxyContractFreightRates({ contractCode: selectedElement.contractCode })) :
                    appDispatch(getProxyFreightDefinition(queryParams));
                promiseList.push(chargesInfo);
            }
            Promise.all(promiseList)
                .then((response: any) => {
                    response[0] ? setResponse(response[0]) : setResponse({})
                    response[1] ? setCharges(response[1]) : setCharges([])
                    setLoading(false);
                })
            Promise.all([appDispatch(templateConstraints({})), appDispatch(getConstraints({ contractCode: selectedElement.contractCode }))])
                .then((response: any) => {
                    if (response && response[1]) {
                        let constraints = getConstraintsList(response);
                        if (constraints?.length) {
                            setUserParams([...constraints]);
                        } else {
                            setUserParams([]);
                        }
                    }
                });
        }
        open && getDetails();
        // eslint-disable-next-line
    }, [open])

    return (
        <ModalContainer
            title="Contract Detail"
            loading={loading}
            open={open}
            onClose={() => {
                onClose();
            }}
            styleName={"contract-detail-modal"}
        >
            <div className="order-detail-wrapper">
                {loading ?
                    <CardContentSkeleton
                        row={4}
                        column={2}
                    />
                    : <div className="custom-form-row row">
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={TranspoterLabel}
                                text={response.partner && response.partner.name}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={contractId}
                                text={response.contractCode}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={validityFrom}
                                text={response.contractStartDate && convertDateFormat(response.contractStartDate, displayDateFormatter)}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={validityTo}
                                text={response.contractEndDate && convertDateFormat(response.contractEndDate, displayDateFormatter)}
                            />
                        </div>
                        <div className="col-md-12 billing-group col-6">
                            <Information
                                title={orderStatusLabel}
                                text={response.contractStatus}
                                valueClassName={"orange-text"}
                            />
                        </div>
                    </div>}
            </div>
            <div className="bill-tab tab-nav mb-0">
                <Tabs value={tabIndex} onChange={(event: any, newValue: any) => setTabIndex(newValue)} variant="scrollable" scrollButtons={isMobile ? "on" : "off"} >
                    {contractCreationTabValue.map((element, index) => (
                        <Tab
                            key={index}
                            label={element}
                        />
                    ))}
                </Tabs>
            </div>
            {!loading && (
                <>
                    {tabIndex === 0 && (
                        (response.contractType === FreightType.FTL ?
                            (charges && charges.length > 0 ? charges.map((item: any, index: any) =>
                                <div className="contract-detail-wrap">
                                    <Card className="creat-contract-wrapp">
                                        <CardHeader
                                            className="billing-info-header freight-charge-header"
                                            title={<h4>Freight Charge: <label className="orange-text m-0"> {item.chargeName} </label></h4>}
                                            onClick={() => {
                                                let temp = [...details];
                                                temp[index] = !details[index];
                                                setDetails(temp)
                                            }}
                                            action={details[index] ? <Remove /> : <Add />}
                                        />

                                        <Collapse in={details[index]} timeout="auto" unmountOnExit>
                                            <CardContent className="creat-contract-content">
                                                <div className="row custom-form-row">
                                                    <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={"Operation"}
                                                            text={item.operation}
                                                        />
                                                    </div>
                                                    <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={"Variable"}
                                                            text={item.variableName}
                                                        />
                                                    </div>
                                                    {item.chargeAttributes && item.chargeAttributes.map((attribute: any) => (
                                                        <div className="col-md-3 billing-group col-6">
                                                            <Information
                                                                title={attribute.attributeName}
                                                                text={attribute.value ? attribute.value : "0"}
                                                            />
                                                        </div>
                                                    ))}


                                                </div>


                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </div>
                            ) : (
                                <div className={"noDataDisplay"}>
                                    <p className='m-0'>{noDataAvailableMessage}</p>
                                </div>
                            )
                            ) :
                            <ContractFreightChargeDetail
                                open={open}
                                charge={charges}
                                showAllCharges={showAllCharges}
                                contractMode={response?.contractMode}
                            />)
                    )}
                    {tabIndex === 1 && (
                        <>
                            {userPrams.length > 0 ? (
                                <AddConstraintsList constraints={userPrams} />
                            ) : (
                                <div className={"noDataDisplay"}>
                                    <p className='m-0'>{noDataAvailableMessage}</p>
                                </div>
                            )}
                        </>
                    )}
                </>
            )
            }
        </ModalContainer>
    );
}

export default ContractDetailModal;

