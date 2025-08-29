import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Check, Close, FilterList, Settings } from '@material-ui/icons';
import _ from "lodash";
import React from 'react';
import { isNullValue } from '../../../base/utility/StringUtils';
import EditText from '../EditText';
import { OptionType } from '../widgetsInterfaces';
import "./CheckList.css";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: 'auto',
        },
        // cardHeader: {
        //     padding: theme.spacing(1, 2),
        // },
        list: {
            width: 356,
            height: 418,
            backgroundColor: theme.palette.background.paper,
            overflow: 'auto',
        },
        button: {
            margin: theme.spacing(0.5, 0),
        },
    }),
);

interface CheckListProps {
    listData: Array<OptionType> | undefined
    onValueSelection: any
    selectedPermission?: Array<OptionType> | undefined
    disabled?: boolean
    // checkOnlyValue?: boolean
    imagePath?: any
}

export default function CheckList(props: CheckListProps) {
    const { listData = [], onValueSelection, selectedPermission, disabled, imagePath } = props;
    const classes = useStyles();
    const [searchedLeft, setSearchedLeft] = React.useState<Array<OptionType>>(listData);
    const [searchValue, setSearchValue] = React.useState<string>("");

    const handleToggle = (value: OptionType) => () => {
        let exist: any = false;
        if (selectedPermission) {
            exist = selectedPermission.find((item: any) => item.value === value.value)
        }
        // const exist = _.find(selectedPermission, value) ? true : false;
        let newChecked = (selectedPermission && [...selectedPermission]) || [];
        if (!exist) {
            newChecked.push(value);
        } else {
            newChecked = newChecked.filter((item: any) => item.value !== value.value)
            // _.remove(newChecked, value)
        }
        onValueSelection(newChecked);
    };


    const customList = (items: Array<OptionType>, isSearchable?: boolean) => {
        // var sortedList = _.sortBy(items, (element: any) => _.find(selectedPermission, element));
        var sortedList = items;

        return (
            <div>
                {isSearchable &&
                    <div className="search-filter-wrapp">
                        <div className="filter-icon">
                            <FilterList />
                        </div>
                        <div className="search-box">
                            <EditText
                                placeholder="Search"
                                maxLength={50}
                                value={searchValue}
                                onChange={(text: any) => {
                                    setSearchValue(text);
                                    if (!isNullValue(searchValue)) {
                                        var optionList = listData && listData.filter((element: any) => {
                                            try {
                                                return (element.label).toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                                            } catch (error) {
                                                return element
                                            }

                                        });
                                        setSearchedLeft(optionList);
                                    }
                                }}
                            />
                        </div>
                        {searchValue && <div className="close-icon"
                            onClick={() => {
                                setSearchValue("");
                            }}
                        >
                            <Close />
                        </div>
                        }
                    </div>
                }

                <List className={classes.list} dense component="div" role="list">
                    {sortedList.map((value: OptionType) => {
                        const labelId = `transfer-list-all-item-${value.value}-label`;
                        var exist: any;
                        exist = _.find(selectedPermission, function (e) {
                            return e.value === value.value
                        }) ? true : false;
                        // if (checkOnlyValue) {
                        //     exist = _.find(selectedPermission, function (e) {
                        //         return e.value === value.value
                        //     });
                        // } else {
                        //     exist = _.find(selectedPermission, value) ? true : false;
                        // }

                        return (
                            <ListItem
                                key={value.value}
                                className={exist ? "assign-permission" : " "}
                                role="listitem"
                                disabled={disabled}
                                button
                                onClick={handleToggle(value)}>
                                <ListItemIcon>
                                    <Checkbox
                                        className={"custom-checkbox" + (exist ? "active-check" : " ")}
                                        checked={exist ? true : false}
                                        icon={<div />}
                                        checkedIcon={<Check />}
                                        tabIndex={-1}
                                        disabled={disabled}
                                        color="primary"
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                {/* <ListItemText id={labelId} primary={value.label} /> */}
                                <ListItemText id={labelId}>
                                    {imagePath && <img src={imagePath} className="home-loc-icon" alt="warehouse" />}
                                    <span>{value.label}</span>
                                    { value.data && value.data.isSystemRole && <Settings className="orange-text"/> }
                                </ListItemText>
                            </ListItem>
                        );
                    })}
                </List>
            </div>
        )
    };

    return (
        <div className="check-list-wrapp">
            <Grid className="left-box" item>{customList((isNullValue(searchValue) ? listData : searchedLeft), true)}</Grid>
        </div>
    );
}