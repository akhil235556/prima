import React from "react";
import './DispatchCard.css';

function DispatchCard(props: any) {
    return (
        <div className={"dispatch-card " + (props.CardStyle)}>
            <h4 className="card-head">{props.heading}</h4>
            <div className="mobile-content">
                <h3 className="card-value">{props.value}</h3>
                {/* <div className="percent-value d-flex align-items-center">
                    <div className="percent-icon"><CallMadeRounded /></div>
                    <span>{props.percentValue}</span>
                </div> */}
            </div>
            <img className="card-image" src={props.image} alt="" />

        </div>
    );
}

export default DispatchCard;