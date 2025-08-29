import { createStyles, makeStyles } from "@material-ui/core";
import Buttons from '@material-ui/core/Button';
import { DatePicker } from '@material-ui/pickers';
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DocType } from "../../base/constant/ArrayList";
import { billNumberLabel } from "../../base/constant/MessageUtils";
import { convertDateTimeServerFormat, displayDateFormatter } from "../../base/utility/DateUtils";
import EditText from "../../component/widgets/EditText";
import ModalContainer from "../../modals/ModalContainer";
import { showAlert } from "../../redux/actions/AppActions";
import { uploadDocument } from "../../serviceActions/DasServiceActions";

interface UploadBillModalProps {
    open: boolean,
    onClose: any
    onApply: any
    orderId: any
    file?: any,
    fileLink?: any
    shipmentId?: any,
    flag: boolean
}

const useStyles = makeStyles(() =>
    createStyles({
        input: {
            display: 'none',
        },
    }),
);

function UploadBillModal(props: UploadBillModalProps) {
    const classes = useStyles();
    const appDispatch = useDispatch();
    const { open, onClose, orderId, shipmentId, onApply, flag } = props;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [csvFile, setCsvFile] = React.useState<any>();
    const [billNo, setBillNo] = React.useState<any>(undefined);
    const [billDate, setBillDate] = React.useState<any>(undefined);

    useEffect(() => {
        const clearData = async () => {
            setCsvFile(undefined);
        }
        !open && csvFile && clearData();
        // eslint-disable-next-line
    }, [])

    return (
        <ModalContainer
            title={"Upload Bill"}
            primaryButtonTitle={"Save"}
            primaryButtonStyle="btn-blue"
            primaryButtonDisable={!billNo || !billDate || !csvFile}
            open={open}
            loading={loading}
            onClose={() => {
                onClose();
                setBillNo(undefined);
                setBillDate(undefined)
                setCsvFile(undefined);
            }}
            onApply={() => {
                if (csvFile) {
                    let metaData: any = flag ?
                        {
                            "entityID": orderId,
                            "entityType": DocType.EORDERBILL,
                            "source": "TmsWeb",
                            "entityModel": "freight_orders",
                            "contextData": billNo,
                        }
                        : {
                            "entityID": orderId,
                            "entitySubId": shipmentId,
                            "entityType": DocType.EBILL,
                            "source": "TmsWeb",
                            "entityModel": "freight_orders",
                            "contextData": billNo,
                        }
                    if (billDate) {
                        metaData.entityDatetime = convertDateTimeServerFormat(billDate);
                    }
                    var formData = new FormData();
                    formData.append("file", csvFile);
                    setLoading(true);
                    appDispatch(uploadDocument(metaData, formData)).then((response: any) => {
                        if (response) {
                            appDispatch(showAlert("File uploaded successfully!"));
                            onApply({
                                [shipmentId]: {
                                    billNo: billNo,
                                    billDate: billDate
                                }
                            });
                            setCsvFile(undefined);
                            setBillNo(undefined);
                            setBillDate(undefined)
                        }
                        setLoading(false);
                    })

                } else {
                    appDispatch(showAlert("Select file to upload.", false))
                }
            }}
            styleName={"bill-up-load-modal pod-up-load-modal"}

        >
            <div className="upload-box">
                <img src="/images/storage.svg" alt="upload" />
                <p>Upload bill</p>
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
            <div className="form-group">
                <EditText
                    label={billNumberLabel}
                    placeholder={'Bill Number'}
                    maxLength={25}
                    value={billNo}
                    disabled={loading}
                    mandatory
                    onChange={(text: any) => {
                        setBillNo(text.trim())
                    }}
                />
            </div>
            <div className="form-group">
                <label className="picker-label">{"Bill Date"}<span className="mandatory-flied">*</span></label>
                <DatePicker
                    className="custom-date-picker"
                    placeholder={'Bill Date'}
                    hiddenLabel
                    format={displayDateFormatter}
                    value={billDate || null}
                    disableFuture
                    onChange={(date: any) => {
                        setBillDate(date)
                    }}
                />
            </div>

        </ModalContainer>
    );
}

export default UploadBillModal;
