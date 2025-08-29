import { CheckCircle, Report } from "@material-ui/icons";
import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ModalContainer from "../../modals/ModalContainer";
import {
    hideAlert
} from '../../redux/actions/AppActions';
import "./MessageAlertBox.css";


function MessageAlertBox() {
    const appDispatch = useDispatch();

    const appReducer = useSelector((state: any) => state.appReducer, shallowEqual);

    return (
        (appReducer.showAlert && appReducer.alertMessage && appReducer.alertMessage !== "" && <ModalContainer
            title={appReducer.successAlert ? "Success" : "Error"}
            secondaryButtonTitle={"OK"}
            onClear={() => {
                // appReducer.checkStartOrStop && appDispatch(okPressed(true))
                appDispatch(hideAlert())
            }}
            open={appReducer.showAlert}
            onClose={() => {
                // appReducer.checkStartOrStop && appDispatch(okPressed(true))
                appDispatch(hideAlert());
            }}
            styleName={"message-modal" + (appReducer.successAlert ? " success" : " error")}
        >
            <div className="text-center">
                {appReducer.successAlert ? <CheckCircle /> : <Report />}
                <h2 className={"content-heading" + (appReducer.successAlert ? " success" : " error")}>
                    {appReducer.successAlert ? "Success" : "Error"}</h2>
                <label>{appReducer.alertMessage}</label>
            </div>
        </ModalContainer>) || null
    );

}

export default MessageAlertBox;
