import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import "./TransferList.css"
import { ArrowForward, ArrowBack } from "@material-ui/icons";
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import EditText from '../EditText';
import Search from '@material-ui/icons/Search';
import { OptionType } from '../widgetsInterfaces';
import { isNullValue } from '../../../base/utility/StringUtils';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: 'auto',
        },
        cardHeader: {
            padding: theme.spacing(1, 2),
        },
        list: {
            width: 308,
            height: 192,
            backgroundColor: theme.palette.background.paper,
            overflow: 'auto',
        },
        button: {
            margin: theme.spacing(0.5, 0),
        },
    }),
);

function not(a: Array<OptionType>, b: Array<OptionType>) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: Array<OptionType>, b: Array<OptionType>) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: Array<OptionType>, b: Array<OptionType>) {
    return [...a, ...not(b, a)];
}

function removeSelectedItems(a: Array<OptionType>, b: Array<any>) {
    return a.filter((value) => b.indexOf(value.value) === -1);
}

interface TransferListProps {
    listData: Array<OptionType> | undefined
    label: string,
    onValueSelection: any
    isEditMode?: boolean,
    selectedPermission?: Array<OptionType> | undefined
    leftLabel: string,
    rightLabel: string,
}

export default function TransferList(props: TransferListProps) {
    const { listData = [], onValueSelection, isEditMode, selectedPermission, leftLabel, rightLabel } = props;
    const classes = useStyles();
    const [checked, setChecked] = React.useState<Array<OptionType>>([]);
    const [isListSet, setIsListSet] = React.useState<boolean>(false);
    const [isEditListSet, setEditListSet] = React.useState<boolean>(false);
    const [left, setLeft] = React.useState<Array<OptionType>>(listData);
    const [searchedLeft, setSearchedLeft] = React.useState<Array<OptionType>>(listData);
    const [right, setRight] = React.useState<Array<OptionType>>([]);
    const [searchValue, setSearchValue] = React.useState<string>("");

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
    useEffect(() => {
        if (!isEditListSet && isEditMode && selectedPermission) {
            setRight(right.concat(selectedPermission));
            setLeft(removeSelectedItems(listData, selectedPermission.map(element => element.value)));
            setEditListSet(true);
        } else if (!isListSet && listData.length > 0) {
            setIsListSet(true)
            setLeft(listData);
        }
        // eslint-disable-next-line
    }, [listData])

    const handleToggle = (value: OptionType) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const numberOfChecked = (items: Array<OptionType>) => intersection(checked, items).length;

    const handleToggleAll = (items: Array<OptionType>) => () => {
        setSearchValue("");
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setSearchValue("");
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        onValueSelection(right.concat(leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setSearchValue("");
        setLeft(left.concat(rightChecked));
        onValueSelection(not(right, rightChecked))
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (title: React.ReactNode, items: Array<OptionType>, isSearchable?: boolean) => (
        <Card>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox
                        className="custom-checkbox checkbox-white"
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{ 'aria-label': 'all items selected' }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length}`}
            />
            {isSearchable &&
                <div className="search-wrapp">
                    <EditText
                        placeholder="Search"
                        maxLength={50}
                        value={searchValue}
                        onChange={(text: any) => {
                            setSearchValue(text);
                            if (!isNullValue(searchValue)) {
                                var optionList = left && left.filter((element: any) => {
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
                    <div className="search-icon">
                        <Search />
                    </div>
                </div>
            }

            <List className={classes.list} dense component="div" role="list">

                {items.map((value: OptionType) => {
                    const labelId = `transfer-list-all-item-${value.value}-label`;

                    return (
                        <ListItem key={value.value} role="listitem" button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    className="custom-checkbox"
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value.label} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <div className="transfer-list-wrapp">
            <div className={classes.root}>

                <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                    <Grid className="left-box" item>{customList(leftLabel, (isNullValue(searchValue) ? left : searchedLeft), true)}</Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                className="transfer-list-btn list-btn-blue"
                                variant="outlined"
                                onClick={handleCheckedRight}
                                disabled={leftChecked.length === 0}
                                aria-label="move selected right"
                            >
                                <ArrowForward />
                            </Button>
                            <Button
                                className="transfer-list-btn list-btn-orange"
                                variant="outlined"
                                onClick={handleCheckedLeft}
                                disabled={rightChecked.length === 0}
                                aria-label="move selected left"
                            >
                                <ArrowBack />
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid className="right-box" item>{customList(rightLabel, right)}</Grid>
                </Grid>
            </div>
        </div>
    );
}