import { IconButton } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Close, FilterList, Settings } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { isNullValue } from '../../../base/utility/StringUtils';
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import EditText from '../EditText';
import { OptionType } from '../widgetsInterfaces';
import "./ExpandableCheckList.css";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: 'auto',
        },
        list: {
            width: 356,
            height: 418,
            backgroundColor: theme.palette.background.paper,
            overflow: 'auto',
        },
        childList: {
            width: 356,
            backgroundColor: theme.palette.background.paper,
            overflow: 'auto',
        },
        button: {
            margin: theme.spacing(0.5, 0),
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
    }),
);

interface ExpandableCheckListProps {
    listData: Array<OptionType> | undefined
    onValueSelection: any
    onGroupSelection: any
    disabled?: boolean
    imagePath?: any
    childElementKey?: any,
    childValueKey?: any,
    childLabelKey?: any,
}

export default function ExpandableCheckList(props: ExpandableCheckListProps) {
    const { listData = [], onValueSelection, disabled, imagePath,
        childElementKey, childValueKey, childLabelKey, onGroupSelection } = props;
    const classes = useStyles();
    const [searchedLeft, setSearchedLeft] = React.useState<Array<OptionType>>(listData);
    const [searchValue, setSearchValue] = React.useState<string>("");


    const [expandIndex, setExpandIndex] = React.useState<number>(-1);
    const handleExpand = (index: number) => {
        if (index === expandIndex) {
            setExpandIndex(-1);
            return
        }
        setExpandIndex(index)
    }

    useEffect(() => {
        if (!isNullValue(searchValue)) {
            var optionList = listData && listData.filter((element: any) => {
                try {
                    return (element.label).toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                } catch (error) {
                    return element
                }
            })
            setSearchedLeft(optionList);
        } else {
            setSearchedLeft(listData);
        }
    }, [listData, searchValue]);

    const handleToggle = (childValue: OptionType, groupValue: OptionType) => () => {
        onValueSelection(childValue, groupValue);
    };

    const handleToggleParent = (value: OptionType) => () => {
        onGroupSelection(value);
    };

    const customList = (items: Array<OptionType>, isSearchable?: boolean) => {
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
                    {sortedList.map((groupValue: any, index: number) => {
                        const labelId = `transfer-list-all-item-${groupValue.value}-label`;
                        return (
                            <div
                                key={labelId}
                            >
                                <ListItem
                                    key={groupValue.value}
                                    className={groupValue.data.isGroupChecked ? "assign-permission" : " "}
                                    role="listitem"
                                    disabled={disabled}
                                    button
                                    onClick={handleToggleParent(groupValue)}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            className={"custom-checkbox " + (groupValue.data.isGroupChecked ? "active-check" : " ")}
                                            checked={groupValue.data.isGroupChecked ? true : false}
                                            // icon={<CheckBoxOutlineBlank />}
                                            // // checkedIcon={<Check />}
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
                                        <span>{groupValue.label}</span>
                                        {groupValue.data && groupValue.data.isSystemRole && <Settings className="orange-text" />}
                                    </ListItemText>
                                    <ListItemIcon>
                                        <IconButton
                                            className={clsx(classes.expand, {
                                                [classes.expandOpen]: (expandIndex === index),
                                            })}
                                            onClick={(event: any) => {
                                                event.stopPropagation()
                                                handleExpand(index);
                                            }}
                                            aria-expanded={expandIndex === index}
                                            aria-label="show more"
                                        >
                                            <ExpandMoreIcon />
                                        </IconButton>
                                    </ListItemIcon>
                                </ListItem>
                                {(expandIndex === index && groupValue && groupValue.data && groupValue.data[childElementKey] &&
                                    (<List className="exp-child-list-wrap" component="div" role="list">
                                        {groupValue.data[childElementKey] &&
                                            setAutoCompleteListWithData(groupValue.data[childElementKey], childLabelKey, childValueKey)
                                                .map((childValue: any, childIndex: number) => {
                                                    const childLabelId = `transfer-list-all-item-${childValue.value}-label`;
                                                    let isChildChecked = groupValue.data.isGroupChecked || childValue.data.isChecked;

                                                    return (<ListItem
                                                        key={childValue[childValueKey]}
                                                        className={Boolean(isChildChecked) ? "assign-permission" : " "}
                                                        role="listitem"
                                                        disabled={disabled}
                                                        button
                                                        onClick={handleToggle(childValue, groupValue)}>
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                className={"custom-checkbox " + (Boolean(isChildChecked) ? "active-check" : " ")}
                                                                checked={isChildChecked ? true : false}
                                                                // icon={<div />}
                                                                // checkedIcon={<Check />}
                                                                tabIndex={-1}
                                                                disabled={disabled}
                                                                color="primary"
                                                                disableRipple
                                                                inputProps={{ 'aria-labelledby': childLabelId }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText id={childLabelId}>
                                                            {imagePath && <img src={imagePath} className="home-loc-icon" alt="warehouse" />}
                                                            <span>{childValue.label}</span>
                                                            {childValue.data && childValue.data.isSystemRole && <Settings className="orange-text" />}
                                                        </ListItemText>
                                                    </ListItem>)
                                                })}
                                    </List>))}
                            </div >
                        );
                    })}
                </List>
            </div>
        )
    };

    return (
        <div className="exp-check-list-wrapp">
            <Grid className="left-box" item>{customList((isNullValue(searchValue) ? listData : searchedLeft), true)}</Grid>
        </div>
    );
}