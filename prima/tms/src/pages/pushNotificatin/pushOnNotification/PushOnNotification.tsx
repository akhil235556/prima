import React from "react";
import "./PushOnNotification.css";

function PushOnNotification(props: any) {
    return (
        <div className={props.styleName ? "d-flex notification-content_child" : "d-flex"}>
            <div className="notification-wrapp">
                <h3 className="notification-sub-heading">{props.heading}</h3>
                <p className="on-notification-content">{props.text}</p>
            </div>
            <div className="custom-switch-small">
                {props.switchButton}
            </div>
        </div>


    );
}
export default PushOnNotification;