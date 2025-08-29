import { Card, CardContent, CardHeader, Collapse } from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import React, { useEffect } from "react";
import { contractModeType, ContractRateType, rowsPerPageOptions } from "../../base/constant/ArrayList";
import { charges, destinationLabel, laneTitle, operation, originLabel } from "../../base/constant/MessageUtils";
import Information from "../../component/information/Information";
import TableList from "../../component/widgets/tableView/TableList";
import { contractFreightChargeRulesTableColumns, contractFreightChargeSlabsTableColumns } from "../../templates/IndentTemplates";

interface ContractFreightChargeDetailProps {
    open: any,
    charge: any,
    showAllCharges: any
    contractMode: any
}

function ContractFreightChargeDetail(props: ContractFreightChargeDetailProps) {
    const { open, charge, showAllCharges, contractMode } = props
    const [details, setDetails] = React.useState<any>([]);

    useEffect(() => {
        const collapseData = () => {
            let temp: any = []
            charge.forEach((item: any) => {
                temp.push(false);
            })
            setDetails(temp);
        }
        open && collapseData();
        // eslint-disable-next-line
    }, [open])

    return (
        <div className="contract-detail-info-wrap">
            {charge && charge.map((item: any, index: any) =>
                <Card className="contract-card-wrap">
                    <CardHeader
                        className="billing-info-header"
                        title={
                            <h4>
                                Freight Charge : <span>{item.chargeName}</span>
                                {showAllCharges && item.laneName && <span>{"(" + item.laneName + ")"}</span>}
                            </h4>
                        }
                        onClick={() => {
                            let temp = [...details];
                            temp[index] = !details[index];
                            setDetails(temp)
                        }}
                        avatar={details[index] ? <Remove /> : <Add />}
                    />
                    <Collapse in={details[index]} timeout="auto" unmountOnExit>
                        <CardContent className="creat-contract-content">
                            <div className="order-detail-wrapper">
                                <div className="custom-form-row row">
                                    {contractMode === contractModeType.ZONE ? <>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={originLabel}
                                                text={item?.originName}
                                            />
                                        </div>
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={destinationLabel}
                                                text={item?.destinationName}
                                            />
                                        </div>
                                    </> :
                                        <div className="col-md-4 billing-group col-6">
                                            <Information
                                                title={laneTitle}
                                                text={item.laneName}
                                            />
                                        </div>
                                    }
                                    <div className="col-md-4 billing-group col-6">
                                        <Information
                                            title={charges}
                                            text={item.chargeName}
                                        />
                                    </div>
                                    <div className="col-md-4 billing-group col-6">
                                        <Information
                                            title={operation}
                                            text={item.operation}
                                        />
                                    </div>
                                    {item.rateType === ContractRateType.FLAT ?
                                        <>
                                            <div className="col-md-4 billing-group col-6">
                                                <Information
                                                    title={"Variable"}
                                                    text={item.variableName}
                                                />
                                            </div>
                                            {item.chargeAttributes && item.chargeAttributes.map((attribute: any) => (
                                                <div className="col-md-4 billing-group col-6">
                                                    <Information
                                                        title={attribute.attributeName}
                                                        text={attribute.value ? attribute.value : "0"}
                                                    />
                                                </div>
                                            ))}
                                            {/* <div className="divider-line"></div> */}
                                        </>
                                        : null
                                    }


                                    {item.slab && item.slab.length > 0 &&
                                        <div className="table-detail-listing">
                                            <p className="table-detail-head">Slabs</p>
                                            <TableList
                                                tableColumns={contractFreightChargeSlabsTableColumns()}
                                                currentPage={0}
                                                rowsPerPage={25}
                                                rowsPerPageOptions={rowsPerPageOptions}
                                                listData={item.slab}
                                                onChangePage={(event: any, page: number) => {
                                                }}
                                                onChangeRowsPerPage={(event: any) => {

                                                }}
                                            />
                                        </div>
                                    }

                                    {item.rule && item.rule.length > 0 &&
                                        <div className="table-detail-listing">
                                            <p className="table-detail-head">Rules</p>
                                            <TableList
                                                tableColumns={contractFreightChargeRulesTableColumns()}
                                                currentPage={0}
                                                rowsPerPage={25}
                                                rowsPerPageOptions={rowsPerPageOptions}
                                                listData={item.rule}
                                                onChangePage={(event: any, page: number) => {
                                                }}
                                                onChangeRowsPerPage={(event: any) => {
                                                }}
                                            />
                                        </div>}
                                </div>
                            </div>
                        </CardContent>
                    </Collapse>
                </Card>
            )
            }

        </div >
    );
}

export default ContractFreightChargeDetail;

