import { createReducer } from "reduxsauce";
import DrawerMenuTypes from "../types/DrawerMenuTypes";

// the initial state of this reducer
export const DRAWER_INIT_STATE: any = {
    procurementSubMenu: false,
}

export const openSubMenuReducer = (state = DRAWER_INIT_STATE, action: any) => {
    return {
        ...DRAWER_INIT_STATE,
        [action.value]: !state[action.value]
    }
}

const ACTION_HANDLERS = {
    [DrawerMenuTypes.OPEN_SUB_MENU]: openSubMenuReducer,
}


export default createReducer(DRAWER_INIT_STATE, ACTION_HANDLERS);

