import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { inplant } from "../services";

export const getYmsNodeConfigStatus = (params: any): any => async (dispatch: Dispatch) => {
    return inplant.getYmsNodeConfigStatus(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};
