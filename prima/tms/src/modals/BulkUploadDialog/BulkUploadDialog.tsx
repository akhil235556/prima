import { Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ArrowRightAlt, CheckCircle, Publish } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BulkUploadTrackViewUrl } from '../../base/constant/RoutePath';
import { isNullValue } from '../../base/utility/StringUtils';
import RadioButtonWidget from '../../component/widgets/radioButton/RadioButton';
import ErrorDisplayModal from "../../pages/planning/shipments/ErrorDisplayModal";
import { showAlert } from '../../redux/actions/AppActions';
import { getJobDetails, getJobsSample, uploadFile } from '../../serviceActions/BulkUploadServiceActions';
import ModalContainer from "../ModalContainer";
import './BulkUploadDialog.css';

interface BulkUploadDialogProps {
    open: boolean
    onClose: any
    title: string
    jobName: string,
    modalMessage?: string,
    acceptFiles?: string,
    downloadMessage?: string,
    jobFileType?: string | undefined,
    onJobFileTypeChange?: any
    showErrorDetails?: boolean
    setPinCodeList?: any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        input: {
            display: 'none',
        },
    }),
);

function BulkUploadDialog(props: BulkUploadDialogProps) {
    const appDispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const { open, onClose, title, jobName, modalMessage, acceptFiles, downloadMessage, jobFileType, onJobFileTypeChange, showErrorDetails = false, setPinCodeList } = props;
    const [csvFile, setCsvFile] = React.useState<any>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [response, setResponse] = React.useState<any>("");
    const [fileType, setFileType] = React.useState<any>("");
    const [openErrorModal, setOpenErrorModal] = React.useState<boolean>(false);
    const [errorDetails, setErrorDetails] = React.useState<any>({});
    const [status, setStatus] = React.useState<any>(false);
    const [requestId, setRequestId] = React.useState<any>("");

    useEffect(() => {
        if (requestId) {
            appDispatch(getJobDetails(requestId)).then((response: any) => {
                if (response?.code !== 200) {
                    setLoading(false);
                } else if (response?.details?.status !== "Completed") {
                    setStatus(!status);
                } else {
                    setLoading(false);
                    onClose();
                    if (response?.details?.errors) {
                        setErrorDetails(response?.details);
                        setOpenErrorModal(true);
                    } else {
                        let res = JSON.parse(response?.details?.report?.response);
                        res = res?.oda_pincodes?.map((value: any) => ({
                            value: value,
                            selected: true
                        })) || [];
                        setPinCodeList([...res]);
                        appDispatch(showAlert(response?.message));
                    }
                }
            })
        }
        // eslint-disable-next-line
    }, [status, requestId])

    useEffect(() => {
        const clearData = async () => {
            setCsvFile(undefined);
            setResponse("");
        }
        !open && csvFile && clearData();
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <ErrorDisplayModal
                open={openErrorModal}
                onClose={() => setOpenErrorModal(false)}
                details={errorDetails}
                uploadError={true}
            />
            <ModalContainer
                title={title}
                styleName={isNullValue(response) ? "upload-dialog" : "message-modal success"}
                primaryButtonStyle={isNullValue(response) ? "btn-blue" : "btn-orange"}
                primaryButtonTitle={isNullValue(response) ? "Submit" : "Track"}
                primaryButtonLeftIcon={isNullValue(response) ? <ArrowRightAlt /> : null}
                open={open}
                csvSample={isNullValue(response)}
                orderCsvSampleMessage={downloadMessage}
                loading={loading}
                onClose={() => {
                    setResponse("")
                    setCsvFile(undefined)
                    onClose();
                }}
                onApply={() => {
                    if (csvFile) {
                        if (isNullValue(response)) {
                            UploadCsv();
                        } else {
                            history.push({
                                pathname: BulkUploadTrackViewUrl + response.details.requestId,
                            });
                        }

                    } else {
                        appDispatch(showAlert("Select csv file to upload.", false))
                    }

                }}
                onClickDownloadSample={() => {
                    let queryParams: any = {
                        jobName: jobName
                    }
                    if (acceptFiles) {
                        queryParams.fileExt = "zip";
                    }
                    appDispatch(getJobsSample(queryParams)).then((response: any) => {
                        response && window.open(response.lnk);
                    })
                }}
                actionButtonStyle={isNullValue(response) ? "csv" : ""}
            >
                {isNullValue(response) ?
                    <div className="custom-form-row row align-items-end">
                        <div className="form-group col-md-12">
                            {(jobFileType && onJobFileTypeChange) && (<RadioButtonWidget jobFileType={jobFileType} onJobFileTypeChange={onJobFileTypeChange} />)}
                            <input
                                accept={acceptFiles || ".csv"}
                                className={classes.input}
                                id="contained-button-file"
                                type="file"
                                onChange={(event: any) => {
                                    if (event && event.target && event.target.files) {
                                        if (acceptFiles) {
                                            if (event.target.files[0].name.includes('.xls')) {
                                                setFileType("xls")
                                                setCsvFile(event.target.files[0]);
                                            } else if (event.target.files[0].name.includes('.xlsx')) {
                                                setFileType("xlsx")
                                                setCsvFile(event.target.files[0]);
                                            } else if (event.target.files[0].name.includes('.csv')) {
                                                setFileType("csv")
                                                setCsvFile(event.target.files[0]);
                                            } else {
                                                appDispatch(showAlert("Select csv, xls or xlsx file only", false));
                                            }
                                        } else {
                                            if (event.target.files[0].name.includes('.csv')) {
                                                setFileType("csv")
                                                setCsvFile(event.target.files[0]);
                                            } else {
                                                appDispatch(showAlert("Select csv file only", false));
                                            }
                                        }

                                    }
                                }}
                            />
                            <div className="upload-btn-wrap">
                                <span className="upload-label">{modalMessage || "Upload CSV"}</span>
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
                    :
                    <div className="text-center">
                        {<CheckCircle />}
                        <h2 className={"content-heading success"}>
                            {"Success"}</h2>
                        <label>{response && response.message}</label>
                    </div>
                }
            </ModalContainer>
        </>
    );

    function UploadCsv() {
        var formData = new FormData();
        formData.append("file", csvFile);
        setLoading(true);
        appDispatch(uploadFile(formData, fileType, jobName)).then((response: any) => {
            if (response) {
                if (showErrorDetails) {
                    setRequestId(response?.details?.requestId);
                } else {
                    setResponse(response);
                    setLoading(false);
                }
            }
        });
    }
}

export default BulkUploadDialog;
