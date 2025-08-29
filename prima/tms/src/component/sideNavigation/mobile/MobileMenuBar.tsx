import { Box, Collapse, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import clsx from "clsx";
import React, { useReducer } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { useHistory } from 'react-router-dom';
import { menuList } from "../../../base/constant/ArrayList";
import { HomePageUrl } from "../../../base/constant/RoutePath";
import { getLogoBaseUrl } from "../../../base/utility/AppUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import { openDrawer } from "../../../redux/actions/AppActions";
import DrawerMenuReducers, { DRAWER_INIT_STATE } from "../../../redux/reducers/DrawerMenuReducers";
import "./MobileMenu.css";
import { handelNavClick } from "./SideNavUtils";

const drawerWidth = 285;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: "nowrap"
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            }),
            top: 0,
            [theme.breakpoints.up("sm")]: {
                top: 64,
            }
        },
        drawerClose: {
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }),
            overflowX: "hidden",
            width: theme.spacing(0) + 1,
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(8) + 1
            }
        },
        nested: {
            paddingLeft: theme.spacing(4),
            [theme.breakpoints.up("sm")]: {
                paddingLeft: theme.spacing(2) + 1
            }
        },
    })
);

function SideNav() {
    const appDispatch = useDispatch();
    const history = useHistory();
    const drawerOpen = useSelector((state: any) => state.appReducer.drawerSate);
    const userInfo = useSelector((state: any) => state.appReducer.userInfo, shallowEqual);

    const classes = useStyles();
    const [state, dispatch] = useReducer(DrawerMenuReducers, DRAWER_INIT_STATE)
    return (
        <nav className="menu-bar">
            <Drawer
                variant={"temporary"}
                onClose={() => {
                    appDispatch(openDrawer());
                }}
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: drawerOpen,
                    [classes.drawerClose]: !drawerOpen,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: drawerOpen,
                        [classes.drawerClose]: !drawerOpen
                    })
                }}
                onMouseEnter={() => {
                    !isMobile && !drawerOpen && appDispatch(openDrawer());
                }}
                onMouseLeave={() => {
                    !isMobile && drawerOpen && appDispatch(openDrawer());
                }}
                open={drawerOpen}
            >
                <Box component="div" className="mb-wrap">
                    <div
                        className="logo"
                        onClick={() => {
                            history.push({
                                pathname: HomePageUrl,
                            })
                        }}
                    >
                        {/* <img src="/images/logo-white.png" alt="GoBOLT ( Camions Logistics Solution Privet Limited )" /> */}
                        <img
                            src=
                            {
                                userInfo && userInfo.partition === undefined ?
                                    '/images/logo.svg' :
                                    getLogoBaseUrl(userInfo && userInfo.partition)
                            }
                            onError={(e: any) => {
                                if (e.target.src !== '/images/logo.svg') {
                                    e.target.onerror = null;
                                    e.target.src = '/images/logo.svg';
                                }
                            }
                            }
                            alt="logo" />
                    </div>
                </Box>
                <List>
                    {menuList.map((element: any, index: number) => (
                        <div
                            key={index}
                        >
                            <ListItem button
                                onClick={() => {
                                    handelNavClick(element, dispatch, history, appDispatch)
                                }}
                                // className={(element.routePath.includes(history.location.pathname) ? "active" : " ")}
                                key={element.label}>
                                <ListItemIcon>
                                    {element.image ?
                                        <img src={element.image} alt={element.name} /> :
                                        element['icon']
                                    }
                                </ListItemIcon>
                                <ListItemText primary={element.label} />
                                {(element.subMenu) ? (
                                    state[element.stateKey] ? <ExpandLess /> : <ExpandMore />) : null}
                            </ListItem>
                            <Collapse in={state[element.stateKey]} timeout="auto" unmountOnExit>
                                {element.subMenu && element.subMenu.map((innerElement: any, index: number) => (
                                    <List component="li" disablePadding key={index}>
                                        <ListItem button className={classes.nested}
                                            onClick={() => {
                                                history.push(innerElement.routePath);
                                                appDispatch(openDrawer());
                                            }}>
                                            {/* <ListItemIcon>
                                            </ListItemIcon> */}
                                            <RadioButtonUncheckedIcon />
                                            <ListItemText primary={innerElement.label} />
                                        </ListItem>
                                    </List>
                                ))}
                            </Collapse>
                        </div>
                    ))}
                </List>
            </Drawer>
        </nav>
    );
}

export default withRouter(SideNav);
