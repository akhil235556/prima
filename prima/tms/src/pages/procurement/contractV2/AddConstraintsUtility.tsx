import { isNullValue } from "../../../base/utility/StringUtils";

export function createConstraintsParams(params: any) {

    let res = params?.map((item: any) => {
        let commonRes = {
            constraintName: item?.constraintName?.label,
            constraintCode: item?.constraintName?.value,
            constraintType: item?.constraintType?.value,
            valueType: item?.valueType?.value,
            variableName: item?.variableName?.value,
        };

        if (item?.valueType?.value === "Slab") {
            let slabRes = item?.slab?.map((slabItem: any) => {
                return { ...slabItem, operator: slabItem?.operator?.value, uom: slabItem?.uom?.value }
            })
            return {
                ...commonRes,
                slab: [...slabRes]
            }
        } else {
            return {
                ...commonRes,
                uom: item?.uom?.value,
                value: item?.value,
                operator: item?.operator?.value
            }
        }
    })
    return res;
}


export function validateData(userParams: any) {
    let error: any = [];
    let errCheck: any = true;
    error = userParams?.map((item: any, index: any) => {
        if (isNullValue(item?.constraintName)) {
            error[index] = { ...error[index], constraintName: "Enter Constraint Name" };
            errCheck = false;
        }
        if (isNullValue(item?.constraintType)) {
            error[index] = { ...error[index], constraintType: "Enter Constraint Type" };
            errCheck = false;
        }
        if (isNullValue(item?.valueType)) {
            error[index] = { ...error[index], valueType: "Enter Value Type" };
            errCheck = false;
        }
        if (isNullValue(item?.variableName)) {
            error[index] = { ...error[index], variableName: "Enter Name of the Variable" };
            errCheck = false;
        }
        if (item?.valueType?.value === "Slab") {
            let slab: any = [];
            slab = item?.slab?.map((data: any, idx: any) => {
                if (isNullValue(data?.slabStart)) {
                    slab[idx] = { ...slab[idx], slabStart: "Enter Slab Start" };
                    errCheck = false;
                }
                if (isNullValue(data?.slabEnd)) {
                    slab[idx] = { ...slab[idx], slabEnd: "Enter Slab End" };
                    errCheck = false;
                }
                if (isNullValue(data?.slabRate)) {
                    slab[idx] = { ...slab[idx], slabRate: "Enter Slab Rate" };
                    errCheck = false;
                }
                if (isNullValue(data?.operator)) {
                    slab[idx] = { ...slab[idx], operator: "Enter Operator" };
                    errCheck = false;
                }
                if (isNullValue(data?.uom)) {
                    slab[idx] = { ...slab[idx], uom: "Enter UoM" };
                    errCheck = false;
                }
                return slab[idx];
            });
            error[index] = { ...error[index], slab: slab };
        } else {
            if (isNullValue(item?.uom)) {
                error[index] = { ...error[index], uom: "Enter UoM" };
                errCheck = false;
            }
            if (isNullValue(item?.operator)) {
                error[index] = { ...error[index], operator: "Enter Operator" };
                errCheck = false;
            }
            if (isNullValue(item?.value)) {
                error[index] = { ...error[index], value: "Enter Value" };
                errCheck = false;
            }
        }
        return error[index];
    });
    if (errCheck) {
        return true;
    } else {
        return error;
    }
};

export function getConstraintsList(response: any) {
    return response[1]?.constraints?.map((constraint: any) => {
        let constraintItem = response?.[0]?.find((x: any) => x.label === constraint?.constraintName);
        let valueType = constraintItem?.valueType?.find((x: any) => x.label === constraint?.valueType);
        let res = {
            constraintName: {
                label: constraint?.constraintName,
                value: constraint?.constraintCode,
                data: constraintItem
            },
            constraintType: {
                label: constraint?.constraintType,
                value: constraint?.constraintType,
            },
            valueType: valueType,
            variableName: {
                label: constraint?.variableName,
                value: constraint?.variableName
            }
        }
        if (constraint?.slab?.length) {
            let slab = constraint?.slab?.map((data: any) => {
                return {
                    ...data,
                    operator: {
                        label: data?.operator,
                        value: data?.operator
                    },
                    uom: valueType?.uom?.find((x: any) => x.value === data?.uom)
                }
            });
            return { ...res, slab: slab };
        } else {
            return {
                ...res,
                operator: {
                    label: constraint?.operator,
                    value: constraint?.operator
                },
                value: constraint?.value,
                uom: valueType?.uom?.find((x: any) => x.value === constraint?.uom)
            }
        }
    });
}

export const slabColumnList = [
    { id: 'slabStart', label: 'From', format: (value: any) => ((value) || "NA") },
    { id: 'slabEnd', label: 'To', format: (value: any) => ((value || "NA")) },
    { id: 'operator', label: 'Operator', format: (value: any) => ((value?.label) || "NA") },
    { id: 'slabRate', label: 'Value', format: (value: any) => value || "NA" },
    { id: 'uom', label: 'UoM', format: (value: any) => value?.label || "NA" }
];

export const otherColumnList = [
    { id: 'operator', label: 'Operator', format: (value: any) => ((value?.label) || "NA") },
    { id: 'value', label: 'Value', format: (value: any) => value || "NA" },
    { id: 'uom', label: 'UoM', format: (value: any) => value?.label || "NA" }
];