import { ListItemIcon, ListItemText, Menu, MenuItem, MenuProps, withStyles } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React from 'react';
import Button from "../widgets/button/Button";
import { InfoTooltip } from '../widgets/tooltip/InfoTooltip';
import "./FileAction.css";
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

interface FileActionProps {
    options?: Array<any> | undefined
    disable?: boolean
}

function FileAction(props: FileActionProps) {
    const { options, disable } = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className="product">
            <Button
                buttonStyle={"btn-orange icon-list"}
                title={""}
                leftIcon={<MoreVert />}
                aria-controls="customized-action"
                aria-haspopup="true"
                disable={disable}
                onClick={handleClick}

            />

            <StyledMenu
                id="customized-action"
                keepMounted
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                className="customized-product"
            >
                {options && options.map((item: any, index: any) => {
                    const { Icon, onClick, menuTitle, tooltipTitle } = item;
                    return (
                        <StyledMenuItem
                            key={menuTitle}
                            onClick={() => {
                                onClick()
                                handleClose()
                            }}
                        >
                            <ListItemIcon>
                                <Icon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={tooltipTitle ?
                                <InfoTooltip
                                    title={tooltipTitle}
                                    placement={"top"}
                                    disableInMobile={"false"}
                                    infoText={menuTitle}
                                /> : menuTitle} />
                        </StyledMenuItem>
                    )
                })}
            </StyledMenu >
        </div >
    )

}
export default FileAction;