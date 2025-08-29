import React from "react";
import "./LabelBox.css";

interface LabelBoxProps {
  label: string;
  text: any;
  labelStyle?: any;
  onClick?: any;
}

function LabelBox(props: LabelBoxProps) {
  const { label, text, labelStyle, onClick } = props;
  return (
    <div >
      <label className={labelStyle ? labelStyle : "d-flex align-items-center labelbox--label"}>
        {label}
      </label>
      <div className="labelbox--container text-truncate contract-number" onClick={() => onClick && onClick()}>{text}</div>
    </div>
  );
}

export default LabelBox;
