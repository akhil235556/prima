import { Card, CardContent, CardHeader, Collapse } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import React from 'react';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { LaneView } from '../../../component/CommonView';
import Information from '../../../component/information/Information';
import TableList from '../../../component/widgets/tableView/TableList';
import { contractFreightChargeRulesTable, contractFreightChargeSlabsTable } from '../../../templates/ProcurementTemplates';
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';


interface FreightResponseViewProps {
    freightResponse: any;
    contractDetails: any;
}
const FreightResponseView = (props: FreightResponseViewProps) => {
    const { freightResponse, contractDetails, } = props;
    const [details, setDetails] = React.useState<any>([]);
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
    const [selectedLane, setSelectedLane] = React.useState<any>();
    return (
        <>
            <LanePointsDisplayModal
                open={openPointModal}
                laneCode={selectedLane}
                onClose={() => {
                    setOpenPointModal(false);
                }} />
            {
                contractDetails.contractType === "PTL" ? freightResponse.map((item: any, index: number) => (
                    <div className="contract-detail-wrap mb-2" key={item.id}>
                        <Card className="creat-contract-wrapp">
                            <CardHeader
                                className="billing-info-header freight-charge-header"
                                title={<h4>Freight Charge: <label className="orange-text m-0"> {item.chargeName} <label style={{
                                    color: "#133751"
                                }}>{(item.laneName ? "(" + item.laneName + ")" : "")}</label>
                                </label></h4>}
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
                                                title={"Lane"}
                                                customView={<LaneView element={item} onClickLaneCode={(data: any) => { setSelectedLane(item.laneCode); setOpenPointModal(true); }} />}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={"Charges"}
                                                text={item.chargeName}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={"Operation"}
                                                text={item.operation}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={"Rate Type"}
                                                text={item.rateType}
                                            />
                                        </div>


                                    </div>
                                    {
                                        item.rateType?.toUpperCase() === "FLAT" ? (
                                            <>
                                                <div className="row custom-form-row">
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
                                                                text={attribute.value}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="divider-line"></div>
                                            </>

                                        ) : null
                                    }
                                    {
                                        item.slab && (
                                            <div className="table-detail-listing contract-table-detail">
                                                <p className="table-detail-head">Slabs</p>
                                                <TableList
                                                    tableColumns={contractFreightChargeSlabsTable()}
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
                                        )
                                    }
                                    {
                                        item.rule && (
                                            <div className="table-detail-listing contract-table-detail">
                                                <p className="table-detail-head">Rules</p>
                                                <TableList
                                                    tableColumns={contractFreightChargeRulesTable()}
                                                    currentPage={0}
                                                    rowsPerPage={25}
                                                    rowsPerPageOptions={rowsPerPageOptions}
                                                    listData={item.rule}
                                                    onChangePage={(event: any, page: number) => {
                                                    }}
                                                    onChangeRowsPerPage={(event: any) => {

                                                    }}
                                                />
                                            </div>
                                        )
                                    }

                                </CardContent>
                            </Collapse>
                        </Card>
                    </div>
                )) : (
                    <>
                        {
                            freightResponse && freightResponse.length !== 0 && freightResponse.map((item: any, index: number) => (
                                <div className="contract-detail-wrap mb-2">
                                    <Card className="creat-contract-wrapp sobModal-freight">
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
                                                    {/* <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={"Charges"}
                                                            text={item.chargeName}
                                                        />
                                                    </div> */}
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
                                                {/* {
                                                    <div className="table-detail-listing contract-table-detail contract-ftl-table-detail">

                                                        <TableList
                                                            tableColumns={contractFreightFTLTable()}
                                                            currentPage={0}
                                                            rowsPerPage={25}
                                                            rowsPerPageOptions={rowsPerPageOptions}
                                                            listData={freightResponse}
                                                            onChangePage={(event: any, page: number) => {
                                                            }}
                                                            onChangeRowsPerPage={(event: any) => {

                                                            }}
                                                        />
                                                    </div>
                                                } */}

                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </div>
                            ))
                        }

                    </>
                )
            }


        </>
    )
}

export default FreightResponseView;