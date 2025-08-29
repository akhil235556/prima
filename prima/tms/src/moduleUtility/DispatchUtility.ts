import { DispatchPeriodsEnum } from "../base/constant/ArrayList";
import { convertDateFormat } from '../base/utility/DateUtils';
import { getDateFormatter } from "../moduleUtility/GraphDatesUtility"

export function getChipsObject(filterChips: any) {
    let chips: any = Object.assign({}, filterChips);
    if (filterChips && filterChips.podUploaded) {
        chips = {
            ...chips,
            podUploaded: "POD Uploaded : " + filterChips.podUploaded
        }
    }
    if (filterChips && filterChips.periodLabel && filterChips.periodLabel === DispatchPeriodsEnum.Custom) {
        chips = {
            ...chips,
            periodLabel: filterChips.fromDateLabel + " to " + filterChips.toDateLabel,
            fromDateLabel: "",
            toDateLabel: "",
        }
        return chips;
    } else {
        return chips;
    }
}

export function getAnanlyticObject(filterChips: any) {
    let chips: any = Object.assign({}, filterChips);
    if (filterChips && filterChips.podUploadedChip) {
        chips = {
            ...chips,
            podUploadedChip: "POD Uploaded : " + filterChips.podUploadedChip
        }
    }
    if (chips && chips.fromDate) {
        delete chips["fromDate"]
    }
    if (chips && chips.toDate) {
        delete chips["toDate"]
    }
    return chips;
}

export function createChartData(chartData: any, filterChips: any) {
    const volume = ((chartData && chartData.results && chartData.results.map((element: any) => element.shipmentVolume)) || []);
    const weight = ((chartData && chartData.results && chartData.results.map((element: any) => element.shipmentWeight)) || []);
    const labels = ((chartData && chartData.results && chartData.results.map((element: any) => convertDateFormat(element.groupedDate, getDateFormatter(chartData.groupParam)))) || []);
    return {
        labels: labels,
        backgroundColor: 'yellow',
        maxBarThickness: 30,
        datasets: [{
            label: (chartData && chartData.units && chartData.units.volume) ?
                "Volume (" + (chartData && chartData.units && chartData.units.volume) + ')' : "Volume",
            backgroundColor: '#006CC9',
            barThickness: "flex",
            barPercentage: .5,
            categoryPercentage: .5,
            data: volume,
        }, {
            label: (chartData && chartData.units && chartData.units.weight) ?
                "Weight (" + (chartData && chartData.units && chartData.units.weight) + ')' : "Weight",
            backgroundColor: '#F7931E',
            barThickness: "flex",
            barPercentage: .5,
            categoryPercentage: .5,
            data: weight,
        }]
    };
}
