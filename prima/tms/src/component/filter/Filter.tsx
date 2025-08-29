import { Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import Button from '../widgets/button/Button';
import "./Filter.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    button: {
      margin: theme.spacing(1)
    },
    title: {
      flex: 1,
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    }
  })
);

interface FilterProps {
  className?: any,
  pageTitle: string,
  buttonTitle?: string,
  rightIcon?: any,
  leftIcon?: any,
  buttonStyle?: any,
  children?: any,
  onClick: any,
  isMobViewText?: any,
  count?: any,
  loading?: any,
}

function Filter(props: FilterProps) {
  const classes = useStyles();
  const { className, pageTitle, buttonTitle, buttonStyle, rightIcon, leftIcon, children, onClick, isMobViewText, count, loading } = props;

  return (
    <div className={className ? "filter-panel " + className : "filter-panel"}>
      <Toolbar>
        <Typography className={classes.title} variant="h6" noWrap>
          {pageTitle}
        </Typography>
        {(buttonTitle || isMobViewText) &&
          <Button
            buttonStyle={buttonStyle}
            title={isMobViewText ? "" : buttonTitle}
            rightIcon={rightIcon}
            leftIcon={leftIcon}
            onClick={onClick}
            count={count}
            loading={loading}
          />
        }
        {children}
      </Toolbar>
    </div>
  );
}

Filter.defaultProps = {
  onClick: () => { }
};

export default Filter;
