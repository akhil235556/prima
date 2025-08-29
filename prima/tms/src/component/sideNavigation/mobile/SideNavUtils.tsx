// import React from "react";
import { Dispatch } from "redux";
import { openDrawer, toggleModal } from "../../../redux/actions/AppActions";
import { openSubMenu } from "../../../redux/actions/DrawerActions";

/**
 * 
 * @param label string (Name of Menu)
 * @param dispatch (react dispatch)
 * @param history (Route Between Pages)
 */
export function handelNavClick(element: any, dispatch: any, history: any, appDispatch: Dispatch,) {
    if (element.subMenu) {
        dispatch(openSubMenu(element.stateKey));
    } else if (element.label === "Support") {
        appDispatch(toggleModal())
    } else {
        history.push(element.routePath)
        appDispatch(openDrawer())
    }
}