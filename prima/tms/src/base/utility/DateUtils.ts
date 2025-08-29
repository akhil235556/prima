import MomentUtils from "@date-io/moment";
import moment, { DurationInputArg2, Moment } from 'moment';

export const displayDateFormatter = "DD/MM/YYYY";
export const DashboardDateFormatter = "YYYY/MM/DD"
export const trackingDisplayDateFormatter = "DD MMM, hh:mmA";
export const trackingDashboardDisplayDateFormatter = "DD/MM/YYYY, hh:mmA";
export const displayDateTimeFormatter = "DD/MM/YYYY hh:mm A";
export const display24DateTimeFormatter = "YYYY-MM-DD HH:MM";
export const display24TimeFormatter = "DD-MM-YYYY HH:MM";
export const displayTimeFormatter = "hh:mm A";
export const displayTimeCounterFormatter = "hh:mm";
export const serverDateFormat = "YYYY-MM-DD";
export const hyphenDate = "YYYY-MM-DD";

export function convertDateTimeServerFormat(date: Moment | any): string {
    try {
        return new MomentUtils().date(date).toISOString(true);
    } catch (error) {
        return date && date.toISOString();
    }
}

export function convertDateServerFormat(date: Moment | any): string {
    try {
        return new MomentUtils().date(date).format(serverDateFormat);
    } catch (error) {
        return date && date.toISOString();
    }
}

export function getMonthName(month: number | any): string {
    try {
        return new MomentUtils().setMonth(moment(), month).format("MMM");
    } catch (error) {
        return "NA";
    }
}

export function convertDateToServerFromDate(date: Moment | any): string {
    try {
        return new MomentUtils().date(date).startOf("D").toISOString(true);
    } catch (error) {
        return date && date.toISOString();
    }
}

export function convertDateToServerToDate(date: Moment | any): string {
    try {
        return new MomentUtils().date(date).endOf("D").toISOString(true);
    } catch (error) {
        return date && date.toISOString();
    }
}

export function convertDateFormat(date: string | any, format: string): string {
    try {
        return new MomentUtils().date(date).format(format).toString()
    } catch (error) {
        return date && date.toString();
    }
}

export function getFutureDate(date: Moment | any, noOfDays: number) {
    try {
        return new MomentUtils().addDays(date, noOfDays)
    } catch (error) {
        return date;
    }
}

export function getPastDate(date: Moment | any, noOfDays: number, unit: DurationInputArg2) {
    try {
        return new MomentUtils().moment(date).subtract(noOfDays, unit);
    } catch (error) {
        return date;
    }
}

export function previousMonth(date: Moment | any) {
    try {
        return new MomentUtils().moment(date).subtract(1, "months");
    } catch (error) {
        return date;
    }
}

export function isDateGreater(fromDate: any, toDate: any) {
    try {
        return new MomentUtils().moment(fromDate).isAfter(toDate);
    } catch (error) {
        return false;
    }
}


export function getDifferenceInDates(fromDate: any, toDate: any) {
    try {
        return new MomentUtils().moment(fromDate).diff(toDate, "hours");
    } catch (error) {
        return 0;
    }
}

export function getDifferenceInDatesAsMinutes(fromDate: any, toDate: any) {
    try {
        return new MomentUtils().moment(fromDate).diff(toDate, "minutes", true);
    } catch (error) {
        return 0;
    }
}

export function getDifferenceInDatesAsDays(fromDate: any, toDate: any) {
    try {
        return new MomentUtils().moment(fromDate).diff(toDate, "days");
    } catch (error) {
        return 0;
    }
}

export function getDifferenceInDatesAs(fromDate: any, toDate: any, unit: any) {
    try {
        return new MomentUtils().moment(fromDate).diff(toDate, unit);
    } catch (error) {
        return 0;
    }
}

export function getPastMonth(date: Moment | any, month: any) {
    try {
        return new MomentUtils().moment(date).subtract(month, "months");
    } catch (error) {
        return date;
    }
}

export function getFutureMonth(date: Moment | any, month: any) {
    try {
        return new MomentUtils().moment(date).add(month, "months");
    } catch (error) {
        return date;
    }
}


export function convertSecondsInHours(secs: any, showSecond?: boolean) {
    let totalSec = Number(secs);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor(totalSec % 3600 / 60);
    var s = Math.floor(totalSec % 3600 % 60);

    var hDisplay = h > 0 ? h + (h === 1 ? " hr " : " hrs ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " min " : " mins ") : "";
    var sDisplay = s > 0 ? s + (s === 1 ? " sec " : " secs") : "";
    return showSecond ? hDisplay + mDisplay + sDisplay : hDisplay + mDisplay;
}

export function convertMinutesInHours(mins: any) {
    let totalMin = Number(mins);
    var h = Math.floor(totalMin / 60);
    var m = Math.floor(totalMin % 60);

    var hDisplay = h > 0 ? h + (h === 1 ? " hr " : " hrs ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " min " : " mins ") : "";

    return hDisplay + mDisplay;
}

export function convertHoursInDays(hours: any) {
    if (hours) {
        let totalHours = Number(hours);
        var d = Math.floor(totalHours / 24);
        var h = totalHours % 24;
        return (d && h) ? (d + "d " + h + "h") : (d ? d + "d" : (h ? h + "h" : "NA"))
    } else {
        return "NA"
    }
}

// export function setTatByDifference(RequiredDate: any, AppointmentDate: any) {
//     let diff = getDifferenceInDatesAsMinutes(AppointmentDate, RequiredDate)
//     diff = diff / 60;
//     return Math.floor(diff);
// }

export function convertMinutesInDays(minutes: any) {
    if (minutes) {
        let totalMinutes = Number(minutes);
        var d = Math.floor(totalMinutes / (24 * 60));
        var h = Math.floor((totalMinutes % (24 * 60)) / 60);
        var m = Math.floor((totalMinutes % (24 * 60)) % 60);
        if (d && !m && !h) {
            return (d + "d")
        } else if (d && m) {
            return (d + "d " + h + "h " + m + "m")
        } else if (d && h && !m) {
            return (d + "d " + h + "h")
        } else if (!d && h && m) {
            return (h + "h " + m + "m")
        } else if (!d && !h) {
            return (m + "m")
        } else if (!d && h && !m) {
            return (h + "h")
        }
        return (d + "d " + h + "h " + m + "m")
    } else {
        return "NA"
    }
}
