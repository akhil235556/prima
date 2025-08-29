import React, { useEffect } from 'react';
import './BulkUploadDialog/BulkUploadDialog.css'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ModalContainer from "./ModalContainer";
import { Button } from "@material-ui/core";
import { Publish, ArrowRightAlt } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { showAlert } from '../redux/actions/AppActions';
import {
    uploadDocument,
    // getDocList
} from "../serviceActions/DasServiceActions";

interface FileUploadDialogProps {
    open: boolean
    onClose: any
    title: string
    onApply: any
    contractId: any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        input: {
            display: 'none',
        },
    }),
);

function FileUploadDialog(props: FileUploadDialogProps) {
    const appDispatch = useDispatch();
    const classes = useStyles();
    const { open, onClose, title, onApply, contractId } = props;
    const [csvFile, setCsvFile] = React.useState<any>();
    const [loading, setLoading] = React.useState<boolean>(false);

    useEffect(() => {
        const clearData = async () => {
            setCsvFile(undefined);
        }
        !open && csvFile && clearData();
        // eslint-disable-next-line
    }, [])

    return (
        <ModalContainer
            title={title}
            styleName={"upload-dialog upload-pdf"}
            primaryButtonTitle={"Save"}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            loading={loading}
            open={open}
            onClose={() => {
                onClose();
            }}
            onApply={() => {
                if (csvFile) {
                    let metaData = {
                        "entityID": contractId,
                        "entityType": "eContract",
                        "source": "TmsWeb",
                        "entityModel": "contract"
                    }
                    var formData = new FormData();
                    formData.append("file", csvFile);
                    setLoading(true);
                    appDispatch(uploadDocument(metaData, formData)).then((response: any) => {
                        if (response) {
                            appDispatch(showAlert("File uploaded successfully!"));
                            onApply();
                        }
                        setLoading(false);
                    })

                } else {
                    appDispatch(showAlert("Select pdf file to upload.", false))
                }
            }}
            actionButtonStyle={"csv"}
        >

            <div className="custom-form-row row align-items-end">
                <div className="form-group col-md-12">
                    <input
                        accept="application/pdf"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={(event: any) => {
                            if (event && event.target && event.target.files) {
                                setCsvFile(event.target.files[0]);
                            }
                        }}
                    />
                    <div className="upload-btn-wrap">
                        <span className="upload-label">Upload PDF</span>
                        <label htmlFor="contained-button-file">
                            <Button variant="contained"
                                color="primary"
                                component="span">
                                {csvFile ? csvFile.name : "Choose File"}
                                <Publish />
                            </Button>
                        </label>
                    </div>
                </div>
            </div>


        </ModalContainer>
    );
}

export default FileUploadDialog;
