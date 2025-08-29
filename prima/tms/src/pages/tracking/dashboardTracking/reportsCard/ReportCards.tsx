import React from "react";

function ReportCard(props: any) {
  return (
    <div className={"report-card tracking-report-card " + props.CardStyle}>
      <h3 className="card-value">{props.value}</h3>
      <h4 className="card-head">{props.heading}</h4>
      <img className="card-image" src={props.image} alt="" />
    </div>
  );
}
export default ReportCard;
