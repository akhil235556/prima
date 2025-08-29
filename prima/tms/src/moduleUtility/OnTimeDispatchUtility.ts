import { convertDateFormat } from '../base/utility/DateUtils';
import { getDateFormatter } from "../moduleUtility/GraphDatesUtility";

export function createChartData(chartData: any, filterChips: any) {
    const orders = ((chartData && chartData.results && chartData.results.map((element: any) => element.groupedTat)) || []);
    const tat = ((chartData && chartData.results && chartData.results.map((element: any) => element.avgLoadingTime)) || []);
    const labels = ((chartData && chartData.results && chartData.results.map((element: any) => convertDateFormat(element.groupedDate, getDateFormatter(chartData.groupParam)))) || []);
    return {
        labels: labels,
        backgroundColor: 'yellow',
        maxBarThickness: 30,
        datasets: [{
            data: tat,
            // Changes this dataset to become a line
            type: 'line',
            fill: false,
            backgroundColor: "red",
            borderColor: "red",
            borderWidth: 1,
            label: ["Average Tat"],
            order: 1
        },
        {
            label: 'Dispatched',
            backgroundColor: '#006CC9',
            barThickness: "flex",
            barPercentage: .5,
            categoryPercentage: .5,
            data: orders,
            order: 2
        }
        ]
    };
}
