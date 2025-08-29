import { IconButton } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Close, GetApp } from "@material-ui/icons";
import Add from "@material-ui/icons/Add";
import Done from "@material-ui/icons/Done";
import React, { ReactNode } from "react";
import { isNullValue } from '../base/utility/StringUtils';
import Button from "../component/widgets/button/Button";
import NumberEditText from "../component/widgets/NumberEditText";
import "./ModalContainer.css";




interface ModalContainerProps {
    children: ReactNode,
    open: boolean,
    onClose: any,
    onApply?: any,
    onClear?: any,
    title: any,
    hideCloseButton?: boolean
    primaryButtonTitle?: string,
    primaryButtonType?: string,
    primaryButtonStyle?: string,
    secondaryButtonStyle?: string,
    primaryButtonRightIcon?: any,
    primaryButtonLeftIcon?: any,
    primaryButtonDisable?: boolean,
    secondaryButtonRightIcon?: any,
    secondaryButtonLeftIcon?: any,
    secondaryButtonTitle?: string,
    secondaryButtonLoading?: boolean,
    tertiaryButtonTitle?: string,
    tertiaryButtonLeftIcon?: any,
    tertiaryButtonDisable?: boolean,
    tertiaryButtonLoading?: boolean,
    tertiaryButtonRightIcon?: any,
    tertiaryButtonStyle?: string,
    onClickTertiary?: any,
    styleName?: any,
    loading?: boolean,
    csvSample?: boolean,
    secondaryButtonDisable?: boolean,
    onClickDownloadSample?: any,
    actionButtonStyle?: any,
    orderCsvSampleMessage?: string,
    showSearch?: boolean,
    searchPlaceHolder?: string,
    searchText?: any,
    searchOnChange?: any,
    showSearchIcon?: boolean,
    btnClick?: any
    btnDisable?: boolean
    btnTitle?: string
}

function ModalContainer(props: ModalContainerProps) {
    const { title, children, open = false, onClose, onApply, onClear, csvSample, onClickDownloadSample, orderCsvSampleMessage,
        primaryButtonTitle, secondaryButtonTitle, primaryButtonLeftIcon, primaryButtonType, actionButtonStyle, primaryButtonStyle, secondaryButtonStyle, secondaryButtonLoading,
        onClickTertiary, styleName, tertiaryButtonTitle, secondaryButtonRightIcon, tertiaryButtonLeftIcon, tertiaryButtonDisable, tertiaryButtonLoading, tertiaryButtonRightIcon,
        tertiaryButtonStyle, secondaryButtonLeftIcon, primaryButtonRightIcon, loading, secondaryButtonDisable, primaryButtonDisable, hideCloseButton = false, showSearch = false,
        searchPlaceHolder = "", searchText, searchOnChange, showSearchIcon, btnClick, btnDisable, btnTitle } = props;

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <div>
            <Dialog
                open={open}
                onClose={() => {
                    return false;
                }}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                className={"custom-modal " + styleName}
            >
                <DialogTitle id="scroll-dialog-title">
                    <div className="title-with-search">
                        <span className="text-truncate">{title}</span>
                        {showSearch && <div className="search-pincode">
                            <NumberEditText
                                onChange={searchOnChange}
                                value={searchText}
                                placeholder={searchPlaceHolder}
                                label={""}
                                maxLength={6}
                                allowZero={false}
                                allowNegative={false}
                                decimalSeparator={false}
                            />
                            {showSearchIcon && <span><Done /></span>}
                            <Button
                                buttonStyle="btn-blue ml-1 mt-1"
                                onClick={btnClick}
                                title={btnTitle}
                                leftIcon={<Add />}
                                disable={btnDisable}
                            />
                        </div>}
                    </div>

                    {!hideCloseButton &&
                        <IconButton
                            aria-label="close"
                            onClick={onClose}>
                            <Close />
                        </IconButton>}
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions
                    className={actionButtonStyle ? actionButtonStyle : ""}
                >
                    {!isNullValue(tertiaryButtonTitle) && <Button
                        title={tertiaryButtonTitle}
                        buttonStyle={tertiaryButtonStyle ? tertiaryButtonStyle : "btn-orange ok-btn"}
                        leftIcon={tertiaryButtonLeftIcon}
                        rightIcon={tertiaryButtonRightIcon}
                        disable={tertiaryButtonDisable}
                        onClick={onClickTertiary}
                        loading={tertiaryButtonLoading}
                    />
                    }

                    {!isNullValue(secondaryButtonTitle) && <Button
                        title={secondaryButtonTitle}
                        buttonStyle={secondaryButtonStyle ? secondaryButtonStyle : "btn-orange ok-btn"}
                        rightIcon={secondaryButtonRightIcon}
                        leftIcon={secondaryButtonLeftIcon}
                        disable={secondaryButtonDisable}
                        onClick={onClear}
                        loading={secondaryButtonLoading}
                    />
                    }
                    <>
                        {csvSample && <span className="download-csv"
                            onClick={onClickDownloadSample}
                        >
                            {orderCsvSampleMessage !== " " && (<> < GetApp />{orderCsvSampleMessage || "Download CSV sample"}</>)} </span>}
                        {primaryButtonTitle && <Button
                            title={primaryButtonTitle}
                            onClick={onApply}
                            loading={loading}
                            rightIcon={primaryButtonRightIcon}
                            leftIcon={primaryButtonLeftIcon}
                            type={primaryButtonType}
                            buttonStyle={primaryButtonStyle ? primaryButtonStyle : "btn-blue"}
                            primaryButton={true}
                            disable={primaryButtonDisable}
                        />
                        }
                    </>

                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ModalContainer;