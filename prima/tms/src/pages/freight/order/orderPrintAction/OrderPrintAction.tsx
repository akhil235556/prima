import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { Clear, Delete, Edit, LocalShipping, PictureAsPdf } from '@material-ui/icons';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { OrderStatus } from '../../../../base/constant/ArrayList';
import { OrderELRUrl } from '../../../../base/constant/RoutePath';
// import { isNullValue } from '../../../../base/utility/StringUtils';
import './OrderPrintAction.css';

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

interface OrderPrintAction {
    statusCode: any,
    orderStatus: any,
    freightOrderCode: any,
    // demandOrderCode: any,
    onClickDelivered: any
    onClickReport: any
    onClickDelete: any
    onClickEdit: any
    shipmentData: any
    close: boolean,
    onClickEpod: any,
    onClickInvoice: any,
    onClickCancelInvoice: any
    onClickElr: any,
    configResponse?: any
}

export default function OrderPrintAction(props: OrderPrintAction) {
    const { statusCode, freightOrderCode, onClickDelivered, onClickDelete, onClickEdit, shipmentData, onClickReport, onClickEpod, onClickInvoice, onClickCancelInvoice, onClickElr, configResponse } = props;
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="print-action-wrap">
            <Button
                aria-controls="customized-action"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={handleClick}
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
                className="customized-action"
            >
                {statusCode >= OrderStatus.PLACED &&
                    statusCode !== OrderStatus.CANCELLED &&
                    statusCode !== OrderStatus.RETURNED &&
                    <StyledMenuItem
                        onClick={() => {
                            setAnchorEl(null);
                            onClickInvoice(shipmentData);
                            // history.push(OrderPODUrl + freightOrderCode + "/" + shipmentData.freightShipmentCode)
                        }}
                    >
                        <ListItemIcon>
                            <PictureAsPdf fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Print Invoice" />
                    </StyledMenuItem>
                }

                {statusCode >= OrderStatus.PLACED &&
                    statusCode !== OrderStatus.CANCELLED &&
                    statusCode !== OrderStatus.RETURNED &&
                    <StyledMenuItem
                        onClick={() => {
                            setAnchorEl(null);
                            onClickCancelInvoice(shipmentData);
                            // history.push(OrderPODUrl + freightOrderCode + "/" + shipmentData.freightShipmentCode)
                        }}
                    >
                        <ListItemIcon>
                            <Delete fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Cancel Invoice" />
                    </StyledMenuItem>
                }
                {
                    ((configResponse && configResponse[shipmentData.freightShipmentCode])) &&
                    <StyledMenuItem
                        onClick={() => {
                            setAnchorEl(null);
                            onClickEdit(shipmentData)
                        }}
                    >
                        <ListItemIcon>
                            <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Edit" />
                    </StyledMenuItem>
                }
                {(statusCode === OrderStatus.CONFIRMED ||
                    statusCode === OrderStatus.PENDING ||
                    statusCode === OrderStatus.PLACED ||
                    statusCode === OrderStatus.ORIGIN_ARRIVED) &&
                    <>

                        <StyledMenuItem
                            onClick={() => {
                                setAnchorEl(null);
                                onClickDelete(shipmentData)
                            }}
                        >
                            <ListItemIcon>
                                <Clear fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Delete" />
                        </StyledMenuItem>
                    </>
                }
                {statusCode === OrderStatus.RETURNED ? null :
                    statusCode >= OrderStatus.REPORTED && statusCode !== OrderStatus.CANCELLED &&
                    <StyledMenuItem
                        onClick={() => {
                            setAnchorEl(null);
                            onClickEpod(shipmentData);
                            // history.push(OrderPODUrl + freightOrderCode + "/" + shipmentData.freightShipmentCode)
                        }}
                    >
                        <ListItemIcon>
                            <PictureAsPdf fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Print E POD" />
                    </StyledMenuItem>
                }
                {
                    statusCode !== OrderStatus.CANCELLED &&
                    statusCode !== OrderStatus.PENDING &&
                    <StyledMenuItem
                        onClick={() => {
                            setAnchorEl(null);
                            shipmentData.lrUploaded ? onClickElr(shipmentData) : history.push(OrderELRUrl + freightOrderCode + "?shipmentCode=" + shipmentData.freightShipmentCode)
                        }}
                    >
                        <ListItemIcon>
                            <PictureAsPdf fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Print E LR" />
                    </StyledMenuItem>
                }
                {statusCode === OrderStatus.REPORTED &&
                    <StyledMenuItem
                        onClick={() => {
                            setAnchorEl(null);
                            onClickDelivered(shipmentData)
                        }}
                    >
                        <ListItemIcon>
                            <LocalShipping fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Mark Delivered" />
                    </StyledMenuItem>
                }
                {statusCode === OrderStatus.DISPATCHED &&
                    <StyledMenuItem
                        onClick={() => {
                            setAnchorEl(null);
                            onClickReport(shipmentData)
                        }}
                    >
                        <ListItemIcon>
                            <LocalShipping fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Report Vehicle" />
                    </StyledMenuItem>
                }
            </StyledMenu>

        </div>
    );
}
