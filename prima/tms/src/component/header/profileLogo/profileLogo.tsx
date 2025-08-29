import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import {
  AccountCircle,
  PowerSettingsNew
} from '@material-ui/icons';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { unRegisterServiceWorker } from '../../../push-notification';
import { getLoggedInUserInfo } from '../../../serviceActions/UserServiceActions';
import "./profileLogo.css";

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

function ProfileLogo(props: { styleName: any; }) {
  const { styleName } = props;

  const appDispatch = useDispatch();
  useEffect(() => {
    appDispatch(getLoggedInUserInfo()).then((response: any) => {
      if (response && response.locationName) {
        let params = {
          locationCode: response.locationCode,
          locationName: response.locationName,
          locationType: response.locationType
        }
        localStorage.setItem("partition", JSON.stringify(params))
      }
    });
    // eslint-disable-next-line
  }, []);

  const userInfo = useSelector((state: any) => state.appReducer.userInfo, shallowEqual);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="profile-login">
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
        className="profile-btn"
      >
        <AccountCircle className="profile-icon" />
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={"customized-menu " + styleName}
      >
        <StyledMenuItem>
          <ListItemIcon className="user-info-icon">
            <AccountCircle />
          </ListItemIcon>
          <ListItemText className="user-name" primary={userInfo && userInfo.name} />
          <ListItemText className="user-email" primary={userInfo && userInfo.email} />
        </StyledMenuItem>

        <StyledMenuItem>
          <Button
            className="logout-btn"
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            onClick={() => {
              logout();
            }}
          >
            <PowerSettingsNew className="profile-icon" /> Log out
          </Button>
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );

  function logout() {
    unRegisterServiceWorker();
    localStorage.setItem("token", "");
    let firstDot = window.location.hostname.indexOf('.');
    let redirectTo = `https://auth.${window.location.hostname.substring(firstDot === -1 ? 0 : firstDot + 1)}/logout`;
    window.location.replace(redirectTo);
  }
}

export default ProfileLogo;