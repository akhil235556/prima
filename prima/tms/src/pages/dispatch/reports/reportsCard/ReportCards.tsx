import React from "react";
import "./ReportCards.css";

interface ReportCardProps {
  CardStyle: any,
  heading: any,
  value: any,
  percentValue?: any,
  image: any
  icon: any
}

function ReportCard(props: ReportCardProps) {
  const { image, percentValue } = props;
  return (
    <div className={"report-card dispatch-report-card " + props.CardStyle}>
      <h4 className="card-head">{props.heading}</h4>
      <div className="mobile-card">
        <h3 className="card-value">{props.value}</h3>
        {percentValue && <div className="percent-value d-flex align-items-center">
          {props.heading === "Avg. Loading Time" ?
            <div className={percentValue < 0 ? "percent-icon" : "percent-icon arrow-red"}>
              {props.icon} <span className={percentValue < 0 ? "" : "red-text"}>{((percentValue && (Math.abs(percentValue) + " %")) || "0 %")}</span>
            </div> :
            <div className={percentValue < 0 ? "percent-icon arrow-red" : "percent-icon"}>
              {props.icon} <span className={percentValue < 0 ? "red-text" : ""}>{((percentValue && (Math.abs(percentValue) + " %")) || "0 %")}</span>
            </div>
          }
        </div>
        }
      </div>
      <img className="card-image img-fluid" src={image} alt="" />
    </div>
  );
}
export default ReportCard;
