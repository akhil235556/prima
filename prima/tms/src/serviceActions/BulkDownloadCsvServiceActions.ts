import { Dispatch } from "redux";
import { downloadBulkCsv } from "../services";
import { handleApiError } from "../base/utility/ErrorHandleUtils";

export const downloadCsv = (url: any, queryParams: any): any => async (dispatch: Dispatch) => {
    downloadBulkCsv.downloadCsv(url, queryParams).then((responseAxios: any) => {
        responseAxios.details && responseAxios.details.link && window.open(responseAxios.details.link)
    }
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};