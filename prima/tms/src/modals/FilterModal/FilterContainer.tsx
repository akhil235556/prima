import React, { ReactNode, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { IconButton } from "@material-ui/core";
import { Close, ClearAll, FilterList } from "@material-ui/icons";
import "./FilterContainer.css";
import Button from "../../component/widgets/button/Button";

interface FilterContainerProps {
    children: ReactNode,
    open: boolean,
    onClose: any,
    onClear?: any,
    onApply: any,
}

function FilterContainer(props: FilterContainerProps) {
    const { children, open, onClose, onApply, onClear } = props;

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            scroll={'paper'}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            className="filter-modal"
        >
            <DialogTitle id="scroll-dialog-title">
                Apply Filter
                <IconButton
                    aria-label="close"
                    onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent >
                {children}

            </DialogContent>
            <DialogActions>
                <Button
                    title="Clear"
                    buttonStyle="btn-orange mr-2"
                    onClick={onClear}
                    leftIcon={<ClearAll />}
                />
                <Button
                    title="Apply Filter"
                    onClick={onApply}
                    buttonStyle="btn-blue w-100"
                    leftIcon={<FilterList />}
                />
            </DialogActions>
        </Dialog>
    );
}

export default FilterContainer;
