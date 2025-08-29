import { Card, CardContent, CardHeader, Collapse } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import React from 'react';
import { diversionTabEnum } from '../../base/constant/ArrayList';
import { diversionRemarks } from '../../base/constant/MessageUtils';
import { isMobile } from '../../base/utility/ViewUtils';
import Information from '../../component/information/Information';
import { CustomToolTip } from '../../component/widgets/CustomToolTip';

interface DiversionFODetailsProps {
    tabName: any,
    selectedElement: any
    requestId: any
    isCollapsed?: boolean
    setIsCollapsed?: any,
    activeStep?: any
    orderLog?: any
    diversionRequestDetails?: any
}

function DiversionFODetails(props: DiversionFODetailsProps) {
    const { tabName, selectedElement, requestId, setIsCollapsed, isCollapsed, diversionRequestDetails } = props;
    const eclipseLength = isMobile ? 6 : 28;
    return (
        <>
            {selectedElement &&
                <Card className="creat-contract-wrapp creat-wrapp">
                    <CardHeader className="creat-contract-header"
                        title={`Request Id: ${requestId}`}
                    />
                    {tabName === diversionTabEnum.IN_PROGRESS && (
                        <div className="collapseBtn">
                            <button onClick={() => setIsCollapsed()}>{isCollapsed ? <Remove /> : <Add />}</button>
                        </div>
                    )}

                    <Collapse in={isCollapsed} timeout="auto" unmountOnExit>
                        <CardContent className="creat-contract-content">
                            <div className="custom-form-row row">
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={(tabName === diversionTabEnum.DIVERSION_REQUEST || tabName === diversionTabEnum.REJECTED) ? "Diversion FO" : "Old freight Order"}
                                        text={selectedElement.freightOrderCode}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={"Freight Type"}
                                        text={selectedElement.freightTypeCode}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={"Vehicle Type"}
                                        text={selectedElement.vehicleTypeName}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={"Total Qty"}
                                        text={selectedElement.totalOrderQuantity}
                                    />
                                </div>

                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={"Reference id"}
                                        text={selectedElement.referenceId}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        valueClassName="orange-text"
                                        title={(tabName === diversionTabEnum.COMPLETED || tabName === diversionTabEnum.REJECTED) ? "Status" : "Old FO Status"}
                                        text={(tabName === diversionTabEnum.IN_PROGRESS) ? diversionRequestDetails.oldFoLastStatus : selectedElement.statusName}
                                    />
                                </div>
                                <div className="labelWidth col-md-3 billing-group col-6">
                                    <Information
                                        title={diversionRemarks}
                                        customView={
                                            <div className="d-flex ">
                                                <>
                                                    <p>{diversionRequestDetails?.remarks || "NA"}</p>
                                                    {
                                                        diversionRequestDetails?.remarks && diversionRequestDetails.remarks.length >= eclipseLength &&
                                                        <CustomToolTip
                                                            title={diversionRequestDetails?.remarks}
                                                            placement={"top"}
                                                            disableInMobile={"false"}
                                                        >
                                                            <span className="blue-text">more</span>
                                                        </CustomToolTip>
                                                    }
                                                </>
                                            </div>
                                        }
                                    />

                                </div>


                            </div>
                        </CardContent>
                    </Collapse>
                </Card>
            }
        </>
    )
}

export default DiversionFODetails
