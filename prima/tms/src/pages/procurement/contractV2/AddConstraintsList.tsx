import { Card, CardContent, CardHeader, Collapse } from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import React from "react";
import { type, valueType, variableName } from "../../../base/constant/MessageUtils";
import Information from "../../../component/information/Information";
import TableList from "../../../component/widgets/tableView/TableList";
import { otherColumnList, slabColumnList } from "./AddConstraintsUtility";

interface AddConstraintsListProps {
    constraints: any;
}

const AddConstraintsList = (props: AddConstraintsListProps) => {

    const { constraints } = props;
    const [details, setDetails] = React.useState<any>([]);

    return (
        <>
            {
                constraints?.map((item: any, index: number) => (
                    <div className="contract-detail-wrap" key={index}>
                        <Card className="creat-contract-wrapp">
                            <CardHeader
                                className="billing-info-header freight-charge-header"
                                title={<h4>Constraint: <label className="orange-text m-0">{item?.constraintName?.label} </label></h4>}
                                onClick={() => {
                                    let temp = [...details];
                                    temp[index] = !details[index];
                                    setDetails(temp)
                                }}
                                action={details[index] ? <Remove /> : <Add />}
                            />

                            <Collapse in={details[index]} timeout="auto" unmountOnExit>
                                <CardContent className="creat-contract-content constraint-modal">
                                    <div className="row custom-form-row constraint-border">
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={type}
                                                text={item?.constraintType?.label}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={valueType}
                                                text={item?.valueType?.label}
                                            />
                                        </div>
                                        <div className="col-md-6 billing-group col-6">
                                            <Information
                                                title={variableName}
                                                text={item?.variableName?.label}
                                            />
                                        </div>
                                    </div>
                                    {item?.valueType?.label === "Slab" && <label className="orange-text m-0 pl-4 pt-3">Slabs</label>}
                                    {
                                        <div className="table-detail-listing contract-table-detail contract-ftl-table-detail">
                                            <TableList
                                                tableColumns={item?.valueType?.label === "Slab" ? slabColumnList : otherColumnList}
                                                currentPage={0}
                                                rowsPerPage={5}
                                                rowsPerPageOptions={[1]}
                                                listData={item?.valueType?.label === "Slab" ? item?.slab : [item]}
                                                onChangePage={(event: any, page: number) => { }}
                                                onChangeRowsPerPage={(event: any) => { }}
                                            />
                                        </div>
                                    }
                                </CardContent>
                            </Collapse>
                        </Card>
                    </div>
                ))
            }
        </>
    )
}

export default AddConstraintsList;