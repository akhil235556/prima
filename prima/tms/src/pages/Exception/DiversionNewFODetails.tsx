import { Card, CardContent } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import React from 'react';
import { isMobile } from '../../base/utility/ViewUtils';
import { laneTitle } from '../../base/constant/MessageUtils';
import { ListFreightLaneView } from '../../component/CommonView';
import Information from '../../component/information/Information';
import Button from '../../component/widgets/button/Button';
import { CustomToolTip } from '../../component/widgets/CustomToolTip';
import { OrderStatus } from "../../base/constant/ArrayList"

interface DiversionFODetailsProps {
    selectedElement: any
    oldFreightOrderDetails: any
    onDelete: any
    setOpenPointModal?: Function
    diversionRequestResponse?: any
}

function DiversionNewFODetails(props: DiversionFODetailsProps) {
    const { selectedElement, oldFreightOrderDetails, onDelete, setOpenPointModal, diversionRequestResponse } = props;
    const eclipseLength = isMobile ? 6 : 28;
    // const [isCollapsed, setIsCollapsed] = React.useState<boolean>(true);
    return (
        <Card className="creat-contract-wrapp creat-wrapp">
            {selectedElement &&
                <>
                    <div className="billing-info-header">
                        <h4>{`New FO :${selectedElement && selectedElement.freightOrderCode}`}</h4>
                        {(diversionRequestResponse && diversionRequestResponse.requestStatus &&
                            diversionRequestResponse.requestStatus !== "COMPLETED" && selectedElement &&
                            selectedElement.statusCode && selectedElement.statusCode <= OrderStatus.CONFIRMED) &&
                            <Button
                                buttonStyle="btn-orange delete-btn"
                                title="Delete"
                                leftIcon={<Delete />}
                                onClick={() => {
                                    onDelete && onDelete(selectedElement.index);
                                }}
                            />
                        }

                    </div>
                    <CardContent className="creat-contract-content">
                        <div className="custom-form-row row">
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
                                    title={laneTitle}
                                    customView={<ListFreightLaneView element={selectedElement} onClickLaneCode={(data: any) => { setOpenPointModal && setOpenPointModal(true) }} />}
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
                                    title={"Status"}
                                    text={selectedElement.statusName}
                                />
                            </div>
                            <div className="labelWidth col-md-3 billing-group col-6">
                                <Information
                                    title={"Remarks"}
                                    customView={
                                        <div className="d-flex ">
                                            <>
                                                <p>{selectedElement?.orderRemarks || "NA"}</p>
                                                {
                                                    selectedElement?.orderRemarks && selectedElement.orderRemarks.length >= eclipseLength &&
                                                    <CustomToolTip
                                                        title={selectedElement?.orderRemarks}
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
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={"Linked FO"}
                                    text={oldFreightOrderDetails.freightOrderCode}
                                />
                            </div>

                        </div>
                    </CardContent>
                </>
            }
        </Card >

    )
}

export default DiversionNewFODetails
