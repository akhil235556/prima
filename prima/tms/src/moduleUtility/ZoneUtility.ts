export function convertArrayToString(arr: any, key: string) {
    let res = "";
    if (arr?.length) {
        arr.forEach((element: any, index: any) => {
            if (index === arr.length - 1) {
                res += element?.[key];
            } else {
                res += element?.[key] + ", ";
            }
        });
    } else {
        res = "NA";
    }
    return res;
}