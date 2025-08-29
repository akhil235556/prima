import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
// import { openSubDrawer } from '../../../redux/actions/AppActions';
// import { useDispatch } from 'react-redux';
import { InvoiceStatusEnum } from '../../../base/constant/ArrayList';
import { webTitle, webTitleDetails } from '../../../base/constant/MessageUtils';
import { FreightBillingListUrl } from '../../../base/constant/RoutePath';
import './SubNavBar.css';

const drawerWidth = 240;
interface SubNavBarProps {
  open: boolean,
  onClickSubMenuArrow: any,
  onClickSubMenuItem: any,
  selectedMenu: any,
}

export default function SubNavBar(props: SubNavBarProps) {
  const history = useHistory();
  const classes = useStyles();
  // const appDispatch = useDispatch();
  const { open, onClickSubMenuArrow, selectedMenu } = props;

  return (
    <div className="sidenav-bar-wrapper"
    >
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        onMouseEnter={() => {
          // !open && appDispatch(openSubDrawer(true));
        }}
        onMouseLeave={() => {
          // open && appDispatch(openSubDrawer(false));
        }}
      >

        <div className="toolbar">
          <IconButton className="resize-button" onClick={onClickSubMenuArrow}>
            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        {open && <>
          <div className="tms-tagline">
            <h2>{webTitle}</h2>
            <span>{webTitleDetails}</span>
          </div>
          <div className="tms-heading">
            <h3>{selectedMenu.label}</h3>
          </div>
          <div >

          </div>
          <Divider />
          <List className="left-navigation">
            {selectedMenu.subMenu && selectedMenu.subMenu.map((element: any, index: number) => (
              <Link
                key={index}
                to={element.routePath === FreightBillingListUrl ? (element.routePath + InvoiceStatusEnum.PENDING) : element.routePath}
              >
                <ListItem
                  className={(history.location.pathname.startsWith(element.name)) ? "active" : ""}
                  button
                >
                  <ListItemText primary={element.label} />
                </ListItem>
              </Link>
            ))}
          </List>
        </>
        }
      </Drawer>
    </div >
  );
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      // overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(3) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);