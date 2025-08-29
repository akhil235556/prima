import { Search, Today } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fromDateError, toDateError } from '../../../base/constant/MessageUtils';
import {
    convertDateToServerFromDate,
    convertDateToServerToDate, displayDateFormatter,
    getDifferenceInDatesAs, getPastMonth
} from "../../../base/utility/DateUtils";
import { isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import Button from "../../../component/widgets/button/Button";
import { showAlert } from "../../../redux/actions/AppActions";
import "./SearchFilterBar.css";

export interface filtersProps {
    onApply: Function,
    filterParams: any,
    fromDate?: any,
    toDate?: any
}

export default function SearchFilterBar(props: filtersProps) {
    const { onApply, filterParams, fromDate, toDate } = props;
    const appDispatch = useDispatch();
    const [userParams, setUserParams] = React.useState<any>({});
    const [searchDisable, setSearchDisable] = React.useState<boolean>(false)
    useEffect(() => {
        if (!isObjectEmpty(filterParams)) {
            if (fromDate && toDate) {
                setUserParams({
                    fromDate: fromDate,
                    toDate: toDate
                })
            }
            else {
                setUserParams({
                    fromDate: filterParams.fromDate,
                    toDate: filterParams.toDate
                })
            }
        }
        // eslint-disable-next-line
    }, [filterParams]);

    return (
        <div className="date-list">
            <label className=" picker-label custom-label">From :</label>
            <div className="pl-3 ">
                <DatePicker
                    className="custom-date-picker"
                    placeholder={"From Date"}
                    hiddenLabel
                    disableFuture
                    format={displayDateFormatter}
                    maxDate={userParams.toDate}
                    value={userParams.fromDate || null}
                    onChange={(date: any) => {
                        if (!date) {
                            setSearchDisable(true);
                        }
                        const changes: any = {
                            fromDate: convertDateToServerFromDate(date)
                        }
                        setUserParams({
                            ...userParams,
                            ...changes
                        })
                    }}
                />
                <span className="date-icon"><Today /></span>
            </div>
            <label className="picker-label custom-label">To :</label>
            <div className="pl-3 position">
                <DatePicker
                    className="custom-date-picker"
                    placeholder={"To Date"}
                    hiddenLabel
                    disableFuture
                    minDate={userParams.fromDate}
                    format={displayDateFormatter}
                    value={userParams.toDate || null}
                    onChange={(date: any) => {
                        if (!date) {
                            setSearchDisable(true)
                        } else {
                            setSearchDisable(false)
                        }
                        setUserParams({
                            ...userParams,
                            toDate: convertDateToServerToDate(date)
                        })
                    }}
                />
                <span className="date-icon"><Today /></span>
            </div>
            <Button
                buttonStyle={"btn-blue icon-list"}
                title={""}
                disable={searchDisable}
                leftIcon={<Search />}
                onClick={() => {
                    if (isNullValue(userParams.fromDate)) {
                        appDispatch(showAlert(fromDateError, false));
                        return
                    } else if (isNullValue(userParams.toDate)) {
                        appDispatch(showAlert(toDateError, false))
                        return
                    }
                    const previousDate = getPastMonth(userParams.toDate, 3)
                    const dayDiff = getDifferenceInDatesAs(previousDate, userParams.fromDate, "day")
                    const difference = getDifferenceInDatesAs(userParams.toDate, userParams.fromDate, "month")
                    if (difference >= 3 && dayDiff > 0) {
                        appDispatch(showAlert('Diffference between From Date and To Date should be less than 3 months', false))
                        return;
                    }
                    if (fromDate && toDate) {
                        onApply({
                            fromDatetime: userParams.fromDate,
                            toDatetime: userParams.toDate
                        })
                    } else {
                        onApply(userParams)
                    }
                }}
            />
        </div>
    );

}