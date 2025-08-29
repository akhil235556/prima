import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DocType } from "../../../base/constant/ArrayList";
import ModalContainer from "../../../modals/ModalContainer";
import { getDocList } from '../../../serviceActions/DasServiceActions';

interface ViewPdfModalProps {
    open: boolean,
    onClose: any
    contractId: any
    file?: any,
    fileLink?: any
}

function ViewPdfModal(props: ViewPdfModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, contractId, file, fileLink } = props;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [imageLink, SetImageLink] = React.useState<any>("");
    const [src, setSrc] = React.useState<any>("/images/data-not-found.png");
    var reader = new FileReader();


    useEffect(() => {
        const readFile = async () => {
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                setSrc(reader.result);
            }
        }
        if (file) {
            open && file && contractId && readFile();
        } else {
            SetImageLink(fileLink);
        }

        // eslint-disable-next-line
    }, [open]);

    useEffect(() => {
        const getDocsListData = async () => {
            const queryParams: any = {
                entityId: contractId,
                entityType: DocType.CONTRACT
            };
            appDispatch(getDocList(queryParams)).then((response: any) => {
                if (response && response[0] && response[0].documentLink) {
                    // window.open(response[0].documentLink);
                    SetImageLink(response[0].documentLink);
                }

            });
        }
        open && !fileLink && !file && contractId && getDocsListData();
        // eslint-disable-next-line
    }, [open]);
    return (
        <ModalContainer
            title={"PDF"}
            // primaryButtonTitle={"OK"}
            open={open}
            loading={loading}
            onClose={onClose}
            onApply={() => {
                setLoading(true);
            }}
            styleName={"pod-upload-modal"}
            actionButtonStyle="center"
        >
            <div className="text-center">
                {imageLink ?
                    <iframe
                        title="POD"
                        src={imageLink} width="100%" height="500px" /> :
                    <img
                        src={src} alt="pdf" className="img-fluid" />
                }
            </div>
        </ModalContainer>
    );
}

export default ViewPdfModal;
