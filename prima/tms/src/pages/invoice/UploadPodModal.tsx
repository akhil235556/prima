import { createStyles, makeStyles } from "@material-ui/core";
import Buttons from '@material-ui/core/Button';
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DocType } from "../../base/constant/ArrayList";
import ModalContainer from "../../modals/ModalContainer";
import { showAlert } from '../../redux/actions/AppActions';
import { uploadDocument } from '../../serviceActions/DasServiceActions';
// import Claims from "./claims/Claims";

interface UploadPodModalProps {
    open: boolean,
    onClose: any
    onApply: any
    orderId: any
    file?: any,
    fileLink?: any
    shipmentId?: any
}

const useStyles = makeStyles(() =>
    createStyles({
        input: {
            display: 'none',
        },
    }),
);

function UploadPodModal(props: UploadPodModalProps) {
    const classes = useStyles();
    const appDispatch = useDispatch();
    const { open, onClose, orderId, shipmentId, onApply } = props;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [csvFile, setCsvFile] = React.useState<any>();

    useEffect(() => {
        const clearData = async () => {
            setCsvFile(undefined);
        }
        !open && csvFile && clearData();
        // eslint-disable-next-line
    }, [])

    return (
        <ModalContainer
            title={"POD"}
            primaryButtonTitle={"Save"}
            primaryButtonStyle="btn-blue"
            open={open}
            loading={loading}
            onClose={onClose}
            onApply={() => {
                if (csvFile) {
                    let metaData = {
                        "entityID": orderId,
                        "entitySubId": shipmentId,
                        "entityType": DocType.EPOD,
                        "source": "TmsWeb",
                        "entityModel": "freight_orders"
                    }
                    var formData = new FormData();
                    formData.append("file", csvFile);
                    setLoading(true);
                    appDispatch(uploadDocument(metaData, formData)).then((response: any) => {
                        if (response) {
                            appDispatch(showAlert("File uploaded successfully!"));
                            onApply(true);
                            setCsvFile(undefined);
                        }
                        // else {
                        //     appDispatch(showAlert("Error!", false));
                        // }
                        setLoading(false);
                    })

                } else {
                    appDispatch(showAlert("Select file to upload.", false))
                }
            }}
            styleName={"pod-up-load-modal"}
            actionButtonStyle="center"
        >
            <div className="upload-box">
                <img src="/images/storage.svg" alt="upload" />
                <p>Upload pod file</p>
                <div className="file-upload-wrap">
                    <input
                        accept="image/jpeg,image/jpeg,application/pdf,image/png"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={(event: any) => {
                            if (event && event.target && event.target.files) {
                                var filesize = Number(((event.target.files[0].size / 1024) / 1024).toFixed(2));
                                if (filesize <= 10) {
                                    setCsvFile(event.target.files[0]);
                                } else {
                                    appDispatch(showAlert("File having size more than 10 MB can not be uploaded", false))
                                }
                            }
                        }}
                    />
                    <label htmlFor="contained-button-file" className="m-0">
                        <Buttons variant="contained" className="file-upload-btn" color="primary" component="span">
                            Browse files
                        </Buttons>
                    </label>
                    <span className="file-name">{csvFile && csvFile.name}</span>
                </div>
            </div>
        </ModalContainer>
    );
}

export default UploadPodModal;
