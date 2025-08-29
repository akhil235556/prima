import { stockTransferStatusEnum } from "../base/constant/ArrayList";

type stockTransferString = keyof typeof stockTransferStatusEnum;

export function getStockTransferStatusUrl(selectedTabName: stockTransferString) {
    return stockTransferStatusEnum[selectedTabName];

}