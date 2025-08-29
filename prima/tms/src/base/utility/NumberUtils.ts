import numeral from "numeral";

export const numberFormatter = "0.00 a";
export const numberWithoutDecimalFormatter = "0 a";
export const plainNumberFormatter = "0"
export const commaFormatter = "0,0.00"
export const floatFormatter = "0.00"

export function convertToNumberFormat(number: any, format: any): any {
    try {
        var value: any = numeral(number);
        if (getLength(value.format(plainNumberFormatter)) > 3) {
            return value.format(format);
        } else {
            return value.format(plainNumberFormatter)
        }
    } catch (error) {
        return 0
    }
}

export function convertAmountToNumberFormat(number: any, format: any): any {
    try {
        return numeral(number).format(format)
    } catch (error) {
        return "0.00"
    }
}

export function convertToCommaFormat(number: any, format: any): any {
    try {
        return numeral(number).format(format)
    } catch (error) {
        return "0.00"
    }
}

export function convertToCustomeFormat(number: any, format: any): any {
    try {
        return numeral(number).format(format)
    } catch (error) {
        return "0.00"
    }
}

function getLength(number: any) {
    return number.toString().length;
}
