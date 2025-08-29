import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { HomePageUrl } from "../../base/constant/RoutePath";
import useUserLocation from "../../base/hooks/useUserLocation";
import { getLogoBaseUrl } from "../../base/utility/AppUtils";
import { isMobile } from "../../base/utility/ViewUtils";
import SelectLocationModal from "../../pages/setting/selectLocationModal/SelectLocationModal";
import { openDrawer } from "../../redux/actions/AppActions";
import { getLoggedInUserInfo, setUserLocation } from '../../serviceActions/UserServiceActions';
import Button from "../widgets/button/Button";
import "./Header.css";
import Notification from "./notification/notification";
import ProfileLogo from "./profileLogo/profileLogo";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    menuButton2: {
      marginRight: theme.spacing(0.5)
    },
    title: {
      flexGrow: 1
    }
  })
);


const Header = () => {
  const classes = useStyles();
  const appDispatch = useDispatch();
  const history = useHistory();
  const [openSelectLocationModal, setOpenSelectLocationModal] = React.useState<boolean>(false);
  const [locations, setLocations] = React.useState<any>(undefined);
  const userInfo = useSelector((state: any) => state.appReducer.userInfo, shallowEqual);

  const partition = localStorage.getItem('partition');
  const userLocations = useUserLocation(userInfo, userInfo && !userInfo.locationName);

  useEffect(() => {
    const getList = async () => {
      if (userLocations.length === 1 && userInfo && !userInfo.locationName) {
        let locationType = userInfo.isAdminUser ? userLocations[0].data && userLocations[0].data.locationTypeName
          : userLocations[0].data && userLocations[0].data.locationType;
        let params = {
          locationName: userLocations[0].data && userLocations[0].data.locationName,
          locationCode: userLocations[0].value,
          locationType: locationType,
        }
        appDispatch(setUserLocation(params)).then((response: any) => {
          if (response) {
            localStorage.setItem("partition", JSON.stringify(params))
            appDispatch(getLoggedInUserInfo());
          }
        });
      } else if (partition && userInfo && !userInfo.locationName) {
        let storageParams = JSON.parse(partition);
        let checkValidLocation = userLocations.some((item: any) => item.value === storageParams.locationCode);
        if (checkValidLocation) {
          appDispatch(setUserLocation(storageParams)).then((response: any) => {
            if (response) {
              appDispatch(getLoggedInUserInfo());
            }
          });
        } else {
          setLocations(userLocations);
          setOpenSelectLocationModal(true);
        }
      } else if (!partition && !(userInfo && userInfo.locationName)) {
        setLocations(userLocations);
        setOpenSelectLocationModal(true);
      }
    }
    userLocations && getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, userLocations, partition]);

  return (
    <header className="header">
      <SelectLocationModal
        open={openSelectLocationModal}
        locations={locations}
        onSuccess={() => {
          window.location.reload();
        }}
        onClose={() => {
          setOpenSelectLocationModal(false)
          setLocations(undefined);
        }}
      />
      <div className={classes.root}>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              edge="start"
              className=""
              color="inherit"
              aria-label="menu"
              onClick={() => appDispatch(openDrawer())}
            >
              {isMobile &&
                <MenuIcon />
              }

            </IconButton>
            <Box
              component="div"
              className={classes.title}>
              {!isMobile &&
                <div
                  className="logo"
                  onClick={() => {
                    history.push({
                      pathname: HomePageUrl,
                    })
                  }}
                >
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
              }
            </Box>

            {/* profile with logo */}
            <Notification />

            <Button
              title={(userInfo && userInfo.locationName)}
              buttonStyle="location-btn text-truncate"
              leftIcon={<img src="/images/location-icon.svg" alt="location" />}
              onClick={() => {
                setOpenSelectLocationModal(true);
              }}
            />

            <div className="profile-login-wrap">
              <ProfileLogo
                styleName=""
              />
            </div>

          </Toolbar>
        </AppBar>
      </div>
    </header>
  );

}
export default Header;
