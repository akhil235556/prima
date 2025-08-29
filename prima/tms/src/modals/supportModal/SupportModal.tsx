import { IconButton, TextareaAutosize } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Clear, Close, ImageOutlined } from "@material-ui/icons";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { isNullValue } from "../../base/utility/StringUtils";
import AutoComplete from "../../component/widgets/AutoComplete";
import Button from "../../component/widgets/button/Button";
import EditText from "../../component/widgets/EditText";
import { OptionType } from "../../component/widgets/widgetsInterfaces";
import { setAutoCompleteList } from "../../moduleUtility/DataUtils";
import { showAlert } from "../../redux/actions/AppActions";
import { getJiraList, postJiraStory, uploadJiraImage } from "../../serviceActions/JiraServiceActions";
import "./SupportModal.css";

interface SupportModalProps {
    open: boolean,
    onClose?: any,
    onApply?: any,
}

function SupportModal(props: SupportModalProps) {
    const { open, onClose, onApply } = props;
    const appDispatch = useDispatch();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [options, setOptions] = React.useState<any>([]);
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [selectedFiles, setSelectedFiles] = React.useState<any>([]);
    const [description, setDescription] = React.useState<any>("");
    const userInfo = useSelector((state: any) => state.appReducer.userInfo, shallowEqual);

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            setUserParams({
                email: userInfo && userInfo.email
            })
            appDispatch(getJiraList({})).then((response: any) => {
                if (response) {
                    let responseOptions = [];
                    responseOptions = response.values && setAutoCompleteList(response.values, "name", "id");
                    setOptions(responseOptions)
                }
                setLoading(false);
            })
        }
        open && getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={() => {
                onClearParams();
                onClose();
            }}
            scroll={'paper'}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            className="support-modal"
        >
            <DialogTitle id="scroll-dialog-title">
                Support
                <IconButton
                    aria-label="close"
                    onClick={() => {
                        onClearParams();
                        onClose();
                    }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent className="support-form-row">
                <div className="form-group">
                    <AutoComplete
                        label="What can we help you with?"
                        placeHolder="Select module"
                        mandatory
                        value={userParams.module}
                        error={error.module}
                        options={options}
                        onChange={(element: OptionType) => {
                            setUserParams({
                                ...userParams,
                                module: element
                            })
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group">
                    <EditText
                        label="Summary"
                        placeholder="Enter Summary"
                        mandatory
                        value={userParams.summary}
                        error={error.summary}
                        maxLength={50}
                        onChange={(text: string) => {
                            setUserParams({
                                ...userParams,
                                summary: text
                            })
                            setError({});
                        }}
                    />
                </div>
                <div className="support-remark form-group">
                    <label>Description</label>
                    <TextareaAutosize
                        rowsMax={2}
                        rowsMin={2}
                        aria-label="maximum height"
                        placeholder={"Description"}
                        value={description}
                        onChange={(event: any) => {
                            setDescription(event.target.value)
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group">
                    <EditText
                        label="Email"
                        placeholder="Enter Email"
                        value={userParams.email}
                        maxLength={150}
                        disabled
                        onChange={(text: string) => {
                            setUserParams({
                                ...userParams,
                                email: text
                            })
                            setError({});
                        }}
                    />
                </div>
                <div className="upload-btn-wrapper">
                    <label>Attachment</label>
                    <label htmlFor="contained-button-file">
                        <button className="btn"><span>Choose File </span>
                            <img src="/images/storage.svg" alt="upload" />
                        </button>
                    </label>
                    <input
                        name="myfile"
                        accept="image/jpeg,image/png,image/jpg"
                        multiple
                        id="contained-button-file"
                        type="file"
                        onChange={(event: any) => {
                            if (event && event.target && event.target.files) {
                                let promiseArray: any = [];
                                for (let i = 0; i < event.target.files.length; i++) {
                                    let formData = new FormData();
                                    formData.append("file", event.target.files[i]);
                                    promiseArray[i] = appDispatch(uploadJiraImage(formData));
                                }
                                setLoading(true);
                                Promise.all(promiseArray).then((response: any) => {
                                    if (response) {
                                        let newArray = [...selectedFiles];
                                        response.forEach((item: any) => {
                                            item && newArray.push(item);
                                        })
                                        setSelectedFiles(newArray);
                                    }
                                    setLoading(false);
                                })
                            }
                        }}
                    />
                </div>
                <ul className="attach-img-list">
                    {
                        selectedFiles && selectedFiles.map((item: any, index: any) => {
                            return (
                                <li>
                                    <span>
                                        <ImageOutlined className="mr-2" /> {item.temporaryAttachments[0].fileName}
                                    </span>
                                    <div
                                        onClick={() => {
                                            let fileArray = selectedFiles.filter((element: any, value: any) => value !== index);
                                            setSelectedFiles(fileArray);
                                        }}>
                                        <Clear className="close-img" />
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </DialogContent>
            <DialogActions className="text-right">
                <Button
                    title="Cancel"
                    buttonStyle="btn-detail mr-2"
                    disable={loading}
                    onClick={() => {
                        onClearParams();
                    }}
                />
                <Button
                    title="Send"
                    onClick={() => {
                        if (validate()) {
                            let queryParams: any = {
                                requestTypeId: userParams.module.value,
                                requestFieldValues: {
                                    summary: userParams.summary,
                                    description: description,
                                    customfield_10055: userParams.email,
                                }
                            }
                            if (selectedFiles && selectedFiles.length > 0) {
                                let attachment = selectedFiles.map((item: any) => {
                                    return item.temporaryAttachments[0].temporaryAttachmentId
                                })
                                queryParams.requestFieldValues.attachment = attachment;
                            }
                            setLoading(true);
                            appDispatch(postJiraStory(queryParams)).then((response: any) => {
                                if (response) {
                                    response.message && appDispatch(showAlert(response.message))
                                    onClearParams();
                                    onApply();
                                }
                                setLoading(false);
                            })
                        }
                    }}
                    loading={loading}
                    buttonStyle="btn-blue"
                />
            </DialogActions>
        </Dialog>
    );

    function onClearParams() {
        setUserParams({});
        setError({});
        setDescription("")
        setSelectedFiles([]);
    }

    function validate() {
        if (isNullValue(userParams.module)) {
            setError({ module: "Select module" });
            return false;
        } else if (isNullValue(userParams.summary)) {
            setError({ summary: "Enter summary" });
            return false;
        }
        return true;
    }
}

export default SupportModal;
