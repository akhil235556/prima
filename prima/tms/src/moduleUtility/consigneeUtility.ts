import { Consignee } from '../redux/storeStates/ConsigneeStoreInterface';

export const consigneeElementData: Consignee = {
    name: "",
    address: "",
    email: "",
    panNumber: "",
    phoneNumber: "",
    gstinNumber: "",
    companyName: "",
    consigneeCode: "",
    secondaryPhoneNumber: [],
    secondaryEmail: [],
    createUser:false
}

export const validateEmail = (email: string) => {
    // eslint-disable-next-line
    return String(email).toLowerCase().match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
};

export const validatePhoneNumber = (phoneNumber: string) => {
    // eslint-disable-next-line
    return String(phoneNumber).match(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/)
}