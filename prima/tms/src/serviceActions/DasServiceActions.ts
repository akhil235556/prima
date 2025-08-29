import { Dispatch } from 'redux';
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from "../redux/actions/AppActions";
import { das } from "../services";

export const uploadDocument = (metaParams: any, bodyParams: any): any => async (appDispatch: Dispatch) => {
    return das.uploadDoc(bodyParams)
        .then((responseAxios: any): any => {
            if (responseAxios) {
                let requestId = responseAxios.requestId
                return das.setDocMeta(requestId, metaParams);
            }
        })
        .then((responseAxios: any) => {
            if (responseAxios && responseAxios.documentId) {
                return responseAxios.documentId;
            } else {
                handleApiError(responseAxios.message, appDispatch);
            }
        }).catch((error: any) => {
            if (error.status === 413) {
                handleApiError("File having size more than 10 MB can not be uploaded", appDispatch)
            } else {
                handleApiError(error.message, appDispatch);
            }
        });
};


export const uploadDocumentMeta = (queryParam: any, bodyParams: any): any => async (appDispatch: Dispatch) => {
    das.setDocMeta(queryParam, bodyParams).then((responseAxios: any) => {
        if (responseAxios.documentId) {
            appDispatch(hideLoader());
        } else {
            handleApiError(responseAxios.message, appDispatch);
        }

    }).catch((error) => {
        handleApiError(error.message, appDispatch);
    });
};

export const getDocList = (queryParams: any): any => async (appDispatch: Dispatch) => {
    return das.getDocs(queryParams).then((responseAxios: any) => responseAxios && responseAxios.documents
    ).catch((error: any) => {
        handleApiError(error.message, appDispatch);
    });
};
