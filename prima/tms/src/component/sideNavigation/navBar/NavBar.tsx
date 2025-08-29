import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import React from 'react';
// import { Link } from "react-router-dom";
import { menuList } from '../../../base/constant/ArrayList';
// import { DASHBOARDUrl } from '../../../base/constant/RoutePath';
import './NavBar.css';

interface NavBardProps {
  onClickItem: any,
  selectedIndex: number,
}

export default function NavBar(props: NavBardProps) {

  const { onClickItem, selectedIndex } = props;
  return (
    <div className="appbar-wrapper">
      {/* <Link
        to={DASHBOARDUrl}
      >
        <div className="logo text-center">
          <img src="/images/logo.svg" alt="logo" />
        </div>
      </Link> */}
      <List>
        {menuList.map((element: any, index: number) => (
          <div
            key={index}
          >
            <ListItem button
              key={element.name}
              className={(element.className ? element.className : "  ") + ((selectedIndex === index) ? "active" : " ")}
              onClick={() => {
                onClickItem && onClickItem(element, index)
              }}>
              {element.image ?
                <img src={element.image} alt={element.name} /> :
                element['icon']
              }
              <span className='menu_label'>{element.label}</span>
            </ListItem>
          </div>
        ))}
      </List>
    </div>
  );
}