import { Card, CardContent, CardHeader, Collapse } from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import React, { useEffect } from "react";
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { endtDateLabel, freightTypeLabel, placementCutoffLabel, startDateLabel, vehicleTypeLabel } from '../../../base/constant/MessageUtils';
import { convertDateFormat, displayDateFormatter } from "../../../base/utility/DateUtils";
import Information from "../../../component/information/Information";
import TableList from "../../../component/widgets/tableView/TableList";
import { laneSOBTableColumns } from "../../../templates/LaneTemplates";
import './LaneDetails.css';

interface LaneSobDeatilsProps {
    sobDetails: any,
}

function LaneSobDeatils(props: LaneSobDeatilsProps) {
    const { sobDetails } = props
    const [details, setDetails] = React.useState<any>([]);

    useEffect(() => {
        const collapseData = () => {
            let temp: any = []
            sobDetails && sobDetails.forEach((item: any) => {
                temp.push(false);
            })
            setDetails(temp);
        }
        collapseData();
        // eslint-disable-next-line
    }, [])

    return (
        <div className="contract-detail-info-wrap">
            {sobDetails && sobDetails.map((item: any, index: any) =>
                <Card
                    key={index}
                    className="contract-card-wrap creat-contract-wrapp creat-wrapp" >
                    <CardHeader
                        className="billing-info-header creat-contract-header"
                        title={<h4>Share of business: <span>{item.vehicleType && item.vehicleType.label}</span></h4>}
                        onClick={() => {
                            let temp = [...details];
                            temp[index] = !details[index];
                            setDetails(temp)
                        }}
                        avatar={details[index] ? <Remove /> : <Add />}
                    />
                    <Collapse in={details[index]} timeout="auto" unmountOnExit>
                        <CardContent className="creat-contract-content p-0">
                            <>
                                <div className="order-detail-wrapper">
                                    <div className="custom-form-row row">
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={freightTypeLabel}
                                                text={item.freightType && item.freightType.label}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={vehicleTypeLabel}
                                                text={item.vehicleType && item.vehicleType.label}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-12">
                                            <Information
                                                title={startDateLabel}
                                                text={item.validityStartDatetime && convertDateFormat(item.validityStartDatetime, displayDateFormatter)}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-12">
                                            <Information
                                                title={endtDateLabel}
                                                text={item.validityEndDatetime && convertDateFormat(item.validityEndDatetime, displayDateFormatter)}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-12">
                                            <Information
                                                title={placementCutoffLabel}
                                                text={item.placementCutoffTime}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="table-detail-listing">
                                    {item.partnersList && item.partnersList.length > 0 &&
                                        <>
                                            {/* <p className="table-detail-head">Slabs</p> */}
                                            <TableList
                                                tableColumns={laneSOBTableColumns()}
                                                currentPage={0}
                                                rowsPerPage={25}
                                                rowsPerPageOptions={rowsPerPageOptions}
                                                listData={item.partnersList}
                                                onChangePage={(event: any, page: number) => {
                                                }}
                                                onChangeRowsPerPage={(event: any) => {

                                                }}
                                            />
                                        </>
                                    }
                                </div>
                            </>
                        </CardContent>
                    </Collapse>
                </Card>
            )
            }

        </div >
    );
}

export default LaneSobDeatils;

