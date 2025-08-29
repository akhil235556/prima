import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DocType } from "../../../base/constant/ArrayList";
import ModalContainer from "../../../modals/ModalContainer";
import { getDocList } from '../../../serviceActions/DasServiceActions';

interface ViewElrModalProps {
    open: boolean,
    onClose: any
    orderId: any,
    shipmentId?: any,
    file?: any,
    fileLink?: any
}

function ViewElrModal(props: ViewElrModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, orderId, file, fileLink, shipmentId } = props;
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
            open && file && orderId && readFile();
        } else {
            SetImageLink(fileLink);
        }

        // eslint-disable-next-line
    }, [open]);

    useEffect(() => {
        const getDocsListData = async () => {
            const queryParams: any = {
                entityId: orderId,
                entitySubId: shipmentId,
                entityType: DocType.ELR
            };
            appDispatch(getDocList(queryParams)).then((response: any) => {
                if (response && response[0] && response[0].documentLink) {
                    // window.open(response[0].documentLink);
                    SetImageLink(response[0].documentLink);
                }

            });
        }
        open && !fileLink && !file && orderId && getDocsListData();
        // eslint-disable-next-line
    }, [open]);
    return (
        <ModalContainer
            title={"E LR"}
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
                        title="E LR"
                        src={imageLink} width="100%" height="500px" /> :
                    <img
                        src={src} alt="elr" className="img-fluid" />
                }
            </div>
        </ModalContainer>
    );
}

export default ViewElrModal;
