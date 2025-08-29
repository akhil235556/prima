import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { CheckCircle, Close } from '@material-ui/icons';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import React from 'react';
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

interface TrackRequestActionButton {
    statusTab: any,
    onClickApprove: any,
    onClickReject: any,
    isDisabled: any
}

export default function TrackRequestActionButton(props: TrackRequestActionButton) {
    const { statusTab, onClickApprove, onClickReject, isDisabled } = props;
    // const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="print-action-wrap actin-btn-gray">
            <Button
                aria-controls="customized-action"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={handleClick}
                disabled={isDisabled}
            >
                Action
                <span className="icon-wrap">
                    <ArrowDropDownIcon />
                </span>
            </Button>
            <StyledMenu
                id="customized-action"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className="customized-action customized-action-gray"
            >
                {(statusTab === 0) &&
                    <ul>
                        <li>
                            <StyledMenuItem
                                className="approve-text"
                                onClick={() => {
                                    setAnchorEl(null);
                                    onClickApprove()
                                }}
                            >
                                <ListItemIcon>
                                    <CheckCircle fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Approve" />
                            </StyledMenuItem>
                        </li>
                        <li>
                            <StyledMenuItem
                                className="cancel-text"
                                onClick={() => {
                                    setAnchorEl(null);
                                    onClickReject();
                                }}
                            >
                                <ListItemIcon>
                                    <Close fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Reject" />
                            </StyledMenuItem>
                        </li>
                    </ul>
                }
            </StyledMenu>
        </div>
    );
}
