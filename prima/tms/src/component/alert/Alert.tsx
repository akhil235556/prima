import React, { SyntheticEvent } from "react";
import { useSelector, shallowEqual, useStore } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import { makeStyles, Theme } from "@material-ui/core/styles";
import './Alert.css';
import { hideAlert } from '../../redux/actions/AppActions';

export const AlertBox = () => {

    const useStyles = makeStyles((theme: Theme) => ({

        icon: {
            fontSize: 20,
        },
        message: {
            display: 'flex',
            alignItems: 'center',
        },
        iconVariant: {
            opacity: 0.9,
            marginRight: theme.spacing(1),
        },
    }));

    // /*eslint no-unused-vars: "warn"*/
    useSelector((state: any) =>
        state.appReducer.showAlert, shallowEqual
    )
    const store = useStore();
    const props = store.getState().appReducer;
    const classes = useStyles();
    return (
        <Snackbar
            open={props.showAlert && props.alertMessage && props.alertMessage !== ""}
            className="snackbar-wrapper"
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'top'
            }}
            message={
                <span id="client-snackbar" className={classes.message}>
                    {props.alertMessage}
                </span>
            }
            autoHideDuration={3000}
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
                    <Close className={classes.icon} />
                </IconButton>,
            ]}
            onClose={handleClose}
        />
    );

    function handleClose(event?: SyntheticEvent, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }
        store.dispatch(hideAlert())
    }
}