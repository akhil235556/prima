
export function nullCheck(value: string, defaultValue: string) {
    return value === null || value === undefined ? defaultValue : value;
}

export function isEmptyArray(value: any) {
    return value === null || value === undefined || value.length <= 0;
}

export function isNullValue(value: any) {
    return value === null || value === undefined || (((typeof value) === "string") ? value.trim() : value) === "";
}

export function isFilterNullValue(value: any) {
    return value === null || value === undefined || value === "";
}


export function isNullValueOrZero(value: any) {
    return value === null || value === undefined || value === "" || value === 0;
}

export function convertToFloat(value: string) {
    return value === null || value === undefined || value === "" ? 0 : Number.parseFloat(value)
}
export function isObjectEmpty(obj: any) {
    return (obj === null || obj === undefined || (Object.keys(obj).length === 0 && obj.constructor === Object))
}

export function isObjectValueEmpty(obj: any) {
    return (obj === null || obj === undefined || (Object.keys(obj).length === 0 && obj.constructor === Object)
        || (Object.keys(obj).some((keyName: any) => isNullValue(obj[keyName]))))
}
export function doesNotInclude(state: any, value: any) {
    var include_flag = state.includes(value);
    return !include_flag;
}

export function isValidEmailId(string: any) {
    // eslint-disable-next-line no-useless-escape
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(string);
}

export function isValidMobileNumber(string: any) {
    var re = /^[6-9]{1}[0-9]{9}$/;
    return re.test(string);
}

export function isValidPassword(string: any) {
    var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return re.test(string);
}

export function vehicleNumberRegex(string: any) {
    var replaced_text = string.replace(/[^a-zA-Z0-9-]/g, "");
    return replaced_text.toString().toUpperCase();
}

export function hastDuplicateValue(array: any) {
    return array.some(function (value: any) {                            // .some will break as soon as duplicate found (no need to itterate over all array)
        return array.indexOf(value) !== array.lastIndexOf(value);   // comparing first and last indexes of the same value
    })
}

export function commaSeparatedNumbers(number: any) {
    if (number) {
        var str = number.toString();
        var numArray = str.split('.');
        var a = [];
        a = numArray;
        var x = a[0]
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + "." + ((a[1] === "0" ? "00" : a[1]) || "00");
        return res;
    } else {
        return "0.00"
    }
}

export function tatValueConverter(unit: any, number: any) {
    if (unit === "hr") {
        return number;
    } else if (unit === "d") {
        return 24 * number
    }
}

