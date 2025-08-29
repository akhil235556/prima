import { Add, Close } from "@material-ui/icons";
import React from "react";
import AutoComplete from "../../../component/widgets/AutoComplete";
import Button from "../../../component/widgets/button/Button";
import EditText from "../../../component/widgets/EditText";
import "./DisputeChildTable.css";

interface DisputeChildTableProps {
  onAdd: Function,
  onRemove: Function,
  shipmentList: any,
  reasonsList: any,
  onChangeReason: any,
  onChangeShipment: any,
  onChangeComment: any,
  isDisputed: any
  disputeDetailsArray: any
}

function DisputeChildTable(props: DisputeChildTableProps) {
  const { onAdd, onRemove, shipmentList, reasonsList, onChangeReason, onChangeShipment, onChangeComment, disputeDetailsArray, isDisputed } = props;
  return (
    <>
      {disputeDetailsArray && disputeDetailsArray.length > 0 && disputeDetailsArray.map((item: any, index: any) => {
        return (<div className="custom-form-row  row  dispute__row" key={index}>
          <div className="form-group col-md-4">
            <AutoComplete
              label={"Shipment"}
              menuPortalTarget={document.body}
              placeHolder={"shipment"}
              // isClearable
              error={item.shipmentError}
              mandatory={!isDisputed}
              onChange={(element: any) => {
                onChangeShipment(element, index)
              }}
              options={shipmentList}
              value={item.shipmentData}
            />
          </div>
          <div className="form-group col-md">
            <AutoComplete
              label={"Dispute Reason"}
              menuPortalTarget={document.body}
              placeHolder={"Select Dispute Reason"}
              mandatory={!isDisputed}
              error={item.reasonError}
              onChange={(element: any) => {
                onChangeReason(element, index)
              }}
              options={reasonsList}
              value={item.reasonData}
            />
          </div>
          <div className="form-group col-md">
            <EditText
              label={"Comments"}
              placeholder={"Comments"}
              mandatory={item.reasonData && item.reasonData.value === "Others" ? true : false}
              error={item.commentError}
              onChange={(element: any) => {
                onChangeComment(element, index)
              }}
              maxLength={100}
              value={item.comment}
            />
          </div>
          <div className="text-right text-md-left col-12 mb-3 mb-md-0 col-md-1 dispute__btn-container">
            {item.index === 0 ?
              <Button
                buttonStyle={"add-btn dispute-btn"}
                onClick={() => {
                  onAdd()
                }}
                leftIcon={<Add />}
              /> :
              (<Button
                buttonStyle={"minus-btn dispute-btn"}
                leftIcon={<Close />}
                onClick={() => {
                  onRemove(index);
                }}
              />)
            }
          </div>
        </div>)
      })}
    </>
  );
}

export default DisputeChildTable;