import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { CheckCircle, Close, Create } from '@material-ui/icons';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import React from 'react';
import { demandOrderTabsEnum } from '../../../../base/constant/ArrayList';
import './demandOrderAction.css';

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

interface DemandOrderAction {
    status: any,
    onClickApprove: any,
    onClickEdit?: any,
    onClickDelete?: any,
    isDisabled: any,
    bulk?: any
}

export default function DemandOrderAction(props: DemandOrderAction) {
    const { status, onClickApprove, onClickEdit, onClickDelete, isDisabled, bulk } = props;
    // const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="print-action-wrap actin-btn-gray ">
            <Button
                aria-controls="customized-action"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={handleClick}
                disabled={isDisabled}
                className="demandOrder"
                
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
                {(status === demandOrderTabsEnum.PENDING || status === demandOrderTabsEnum.MODIFY_REQUEST) &&
                    <>
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

                        {status === demandOrderTabsEnum.PENDING && bulk !== true &&
                            < StyledMenuItem
                                className="modify-text"
                                onClick={() => {
                                    setAnchorEl(null);
                                    onClickEdit()
                                }}
                            >
                                <ListItemIcon>
                                    <Create fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Edit" />
                            </StyledMenuItem>}

                        <StyledMenuItem
                            className="cancel-text"
                            onClick={() => {
                                setAnchorEl(null);
                                onClickDelete();
                            }}
                        >
                            <ListItemIcon>
                                <Close fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Cancel" />
                        </StyledMenuItem>
                    </>
                }
            </StyledMenu>

        </div >
    );
}
