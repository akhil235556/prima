import React, { useEffect } from 'react';
import NavBar from './navBar/NavBar';
import SubNavBar from './subNavBar/SubNavBar';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { openSubDrawer, enableActionButton, setMainMenuInfo, toggleModal } from '../../redux/actions/AppActions';
import { useHistory } from 'react-router-dom';
import { isMobile } from '../../base/utility/ViewUtils';
import MobileMenuBar from './mobile/MobileMenuBar';
import { getMenuIndex } from '../CommonView';

function SideNavigation() {
  const appDispatch = useDispatch();
  let history = useHistory();
  const subDrawerSate = useSelector((state: any) => state.appReducer.subDrawerSate, shallowEqual);
  const refreshSideNavigation = useSelector((state: any) =>
    state.appReducer.sideNavigation, shallowEqual
  );

  const selectedIndex = useSelector((state: any) =>
    state.appReducer.menuSelectedIndex, shallowEqual
  )

  const selectedMenu = useSelector((state: any) =>
    state.appReducer.menuElement, shallowEqual
  );

  const myListener = (location: any, action: any) => {
    let info = getMenuIndex(location);
    appDispatch(setMainMenuInfo(info));
  };

  useEffect(() => {
    const unListen = history.listen(myListener);
    return () => unListen();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (history && history.location) {
      let info = getMenuIndex(history.location);
      appDispatch(setMainMenuInfo(info));
    }

    // eslint-disable-next-line 
  }, [refreshSideNavigation]);

  return (
    isMobile ?
      <MobileMenuBar /> :
      (
        <>
          <div className="sidenav-wrapper">
            <NavBar
              onClickItem={onClickItem}
              selectedIndex={selectedIndex}
            />
            {selectedMenu && selectedMenu.subMenu &&
              <SubNavBar
                open={subDrawerSate}
                selectedMenu={selectedMenu}
                onClickSubMenuItem={() => {
                  appDispatch(openSubDrawer(!subDrawerSate));
                }}
                onClickSubMenuArrow={() => {
                  appDispatch(openSubDrawer(!subDrawerSate));
                }}
              />
            }
          </div>
        </>
      )
  );

  function onClickItem(element: any, index: number) {
    if (element.label === "Support") {
      appDispatch(toggleModal());
      return
    }
    appDispatch(openSubDrawer(true));
    appDispatch(setMainMenuInfo({ index: index, element: element }))
    appDispatch(enableActionButton());
    if (selectedIndex !== index || history.location.pathname !== element.routePath) {
      history.push(element.routePath);
    }

  }
}

export default SideNavigation;
