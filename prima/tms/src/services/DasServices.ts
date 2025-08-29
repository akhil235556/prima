import { AxiosInstance } from 'axios';
import { docUploadUrl, docMetaUrl, getDocListUrl } from '../base/api/ServiceUrl';


export default (api: AxiosInstance) => {

    function uploadDoc(bodyParams: any) {
        return api.post(docUploadUrl, bodyParams, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
    }

    function setDocMeta(requestId: any, bodyParams: any) {
        return api.post(docMetaUrl + requestId, bodyParams);
    }


    function getDocs(params: any) {
        return api.get(getDocListUrl, { params: params });
    }
    return {
        uploadDoc,
        setDocMeta,
        getDocs,
    }
}