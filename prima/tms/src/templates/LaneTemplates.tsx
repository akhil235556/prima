import { contributionPercentageLabel, levelLabel, transporterLabel } from '../base/constant/MessageUtils';
import { convertToCustomeFormat } from '../base/utility/NumberUtils';
import { ColumnStateModel } from "../Interfaces/AppInterfaces";


export const laneSOBTableColumns = () => {

    const columnList: ColumnStateModel[] = [
        { id: 'partnerName', label: transporterLabel, format: (value: any) => (value) || "NA" },
        { id: 'level', label: levelLabel, format: (value: any) => (value && value.label) || "NA" },
        {
            id: 'allocationPercentage', label: contributionPercentageLabel, format: (value: any) => (value && convertToCustomeFormat(value, "0.00")) || "NA"
        }
    ]
    return columnList;
};