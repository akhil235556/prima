import { InvoiceStatusEnum, InvoiceStatusTabEnum } from "../base/constant/ArrayList";

type InvoiceLevelString = keyof typeof InvoiceStatusEnum;
export function getInvoiceStatusFilter(selectedTabName: InvoiceLevelString) {
    return InvoiceStatusEnum[selectedTabName];
}

export function getInvoiceStatusUrl(selectedTabName: InvoiceLevelString) {
    return InvoiceStatusTabEnum[selectedTabName];
}