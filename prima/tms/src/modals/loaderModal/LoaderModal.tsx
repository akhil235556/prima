import Dialog from "@material-ui/core/Dialog";
import React from 'react';
import "./loaderModal.css";

interface LoaderModalProps {
    open: boolean
}

function LoaderModal(props: LoaderModalProps) {
    const { open } = props
    return (
        <Dialog
            open={open}
            className={"custom-modal message-modal"}
        >
            {open &&
                <div className="processing-loader">
                    <div className="text-center">
                        <img src="/images/loader-progress.gif" alt="" />
                        <h5 className="title-loader">...Processing</h5>
                    </div>
                </div>
            }
        </Dialog >
    )
}

export default LoaderModal
