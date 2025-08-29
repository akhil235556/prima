import React from 'react';
import "./AllNotificationCard.css";
import { withStyles, MenuProps, Menu, MenuItem } from '@material-ui/core';
import { MoreVert, Notifications } from '@material-ui/icons';
import Button from '../../../component/widgets/button/Button';
import SnoozeModal from '../SnoozeModal';
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

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

interface AllNotificationCardProps {
    notificationIcon: any,
    heading: any,
    text: any,
    day: any,
    unread?: any,
    onClick?: any,
    forwardRef?: any,
    showMenu?: any,
    element?: any
}

const AllNotificationCard = (props: AllNotificationCardProps) => {
    const { notificationIcon, heading, text, day, onClick, unread, forwardRef, showMenu } = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const [toggleModal, setToggleModal] = React.useState<any>(false)

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <SnoozeModal
                open={toggleModal}
                selectedElement={showMenu}
                onSuccess={() => {
                    setToggleModal(false)
                }}
                onClose={() => {
                    setToggleModal(false)
                }}
            />
            <div className={unread ? "notification-row" : "notification-row bg-white-active"}>
                <div
                    className="media"
                    onClick={onClick}
                    ref={forwardRef}
                >
                    <div className="media-img">
                        {notificationIcon}
                    </div>
                    <div className="media-body notification-content">
                        <h6 className="notification-heading">{heading}</h6>

                        <p>{text}</p>
                        <span className="notification-day">{day}</span>
                    </div>

                </div>

                {showMenu && showMenu.alert_details &&
                    <div className="snooze-menu">
                        <Button
                            buttonStyle={"menu-button"}
                            title={""}
                            leftIcon={<MoreVert />}
                            aria-controls="snooze-action"
                            aria-haspopup="true"
                            onClick={handleClick}
                        />
                        <StyledMenu
                            id="snooze-action"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            className="snooze-action"
                        >
                            <StyledMenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                }}
                            >
                                <Button
                                    buttonStyle={"btn-blue"}
                                    title={"Snooze"}
                                    leftIcon={<Notifications />}
                                    aria-controls="customized-action"
                                    aria-haspopup="true"
                                    onClick={() => {
                                        setToggleModal(true)
                                    }}

                                />
                            </StyledMenuItem>
                        </StyledMenu>
                    </div>}
            </div>
        </>
    )
}

export default AllNotificationCard;