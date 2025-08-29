import { GetApp, Publish } from "@material-ui/icons";
import React, { useEffect, useReducer } from "react";
import { RegisterJobs } from "../../../base/constant/ArrayList";
import { noPincodeFound } from "../../../base/constant/MessageUtils";
import DataNotFound from "../../../component/error/DataNotFound";
import PincodeLabel from "../../../component/pinCodeLabel";
import BulkUploadDialog from "../../../modals/BulkUploadDialog/BulkUploadDialog";
import ModalContainer from "../../../modals/ModalContainer";
import { toggleBulkUpload } from '../../../redux/actions/ServiceabilityActions';
import ServiceabilityReducer, { SERVICEABILITY_STATE } from "../../../redux/reducers/ServiceabilityReducer";
import "./ODAPincode.css";

interface ODAPincodeModalProps {
    open: boolean
    onClose: any
    pinCodeList: any
    setPinCodeList: any
    csvLink: any
    title: any
}

function ODAPincodeModal(props: ODAPincodeModalProps) {
    const { open, onClose, pinCodeList, setPinCodeList, csvLink, title } = props;
    const [state = SERVICEABILITY_STATE, dispatch] = useReducer(ServiceabilityReducer, SERVICEABILITY_STATE);
    const [searchText, setSearchText] = React.useState<any>("");
    const [showPinCodeList, setShowPinCodeList] = React.useState<any>([...pinCodeList]);

    function searchPincode() {
        return pinCodeList.map((e: any) => e.value).indexOf(Number(searchText));
    }

    useEffect(() => {
        if (searchText) {
            if (searchText.length !== 6) {
                setShowPinCodeList([]);
            } else {
                let idx = searchPincode();
                if (idx > -1) {
                    setShowPinCodeList([pinCodeList[idx]])
                } else {
                    setShowPinCodeList([]);
                }
            }
        } else {
            setShowPinCodeList([...pinCodeList]);
        }
        // eslint-disable-next-line
    }, [searchText, pinCodeList])

    return (
        <>
            <ModalContainer
                title={title + ' : ODA Pincodes'}
                styleName={'odaPincode-modal'}
                open={open}
                onClose={onClose}
                onApply={onClose}
                primaryButtonTitle={"Submit"}
                secondaryButtonTitle={"Upload CSV File"}
                onClear={() => dispatch(toggleBulkUpload())}
                secondaryButtonLeftIcon={<Publish />}
                primaryButtonStyle={'btn-orange ok-btn'}
                secondaryButtonStyle={'btn-blue'}
                primaryButtonDisable={searchText !== ""}
                showSearch={true}
                searchPlaceHolder={"Search Pincode"}
                searchText={searchText}
                searchOnChange={(text: any) => setSearchText(text)}
                showSearchIcon={searchText.length === 6 && searchPincode() > -1}
                btnClick={() => {
                    pinCodeList.unshift({
                        value: Number(searchText),
                        selected: true
                    });
                    setSearchText("");
                    setShowPinCodeList([pinCodeList[0]]);
                    setPinCodeList([...pinCodeList]);
                }}
                btnDisable={!(searchText.length === 6 && searchPincode() === -1)}
                btnTitle={"Add"}
            >
                {showPinCodeList?.length > 0 ?
                    <PincodeLabel
                        showPinCodeList={showPinCodeList}
                        setShowPinCodeList={setShowPinCodeList}
                    /> :
                    <DataNotFound message={noPincodeFound} showSearchError={true} />}
                <div className="download-csvLink">
                    <a href={csvLink}><GetApp />Download CSV </a>
                </div>
            </ModalContainer>
            <BulkUploadDialog
                title="Upload Pincodes"
                open={state.openBulkUpload}
                jobName={RegisterJobs.ODA_PINCODE}
                onClose={() => dispatch(toggleBulkUpload())}
                showErrorDetails={true}
                setPinCodeList={setPinCodeList}
            />
        </>
    );
}

export default ODAPincodeModal;
