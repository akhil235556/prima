import { Edit } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DocType } from "../../base/constant/ArrayList";
import { convertDateFormat, displayDateTimeFormatter } from "../../base/utility/DateUtils";
import { isMobile } from "../../base/utility/ViewUtils";
import Filter from "../../component/filter/Filter";
import ModalContainer from "../../modals/ModalContainer";
import { getDocList } from '../../serviceActions/DasServiceActions';

interface EditBillModalProps {
    open: boolean,
    onClose: any
    orderId: any,
    shipmentId?: any,
    file?: any,
    fileLink?: any,
    onEditClickHandler?: any,
    editable?: any,
    flag: boolean
}

function EditBillModal(props: EditBillModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, orderId, file, fileLink, shipmentId, onEditClickHandler, flag } = props;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [imageLink, SetImageLink] = React.useState<any>("");
    const [response, setResponse] = React.useState<any>({});
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
            const queryParams: any = flag ? {
                entityId: orderId,
                entityType: DocType.EORDERBILL
            } : {
                    entityId: orderId,
                    entitySubId: shipmentId,
                    entityType: DocType.EBILL
                };
            appDispatch(getDocList(queryParams)).then((response: any) => {
                if (response && response[0]) {
                    setResponse(response[0])
                    response[0].documentLink && SetImageLink(response[0].documentLink);
                }

            });
        }
        open && !fileLink && !file && orderId && getDocsListData();
        !open && setResponse({})
        // eslint-disable-next-line
    }, [open]);
    return (
        <ModalContainer
            title={"View Bill"}
            open={open}
            loading={loading}
            onClose={onClose}
            onApply={() => {
                setLoading(true);
            }}
            styleName={"pod-upload-modal edit-upload-modal"}
            actionButtonStyle="center"
        >
            <div className="filter-wrap edit-bill-wrapp">
                <Filter
                    pageTitle={
                        (response.contextData || response.entityDatetime) &&
                        (response.contextData + (response.entityDatetime ? " - (" + convertDateFormat(response.entityDatetime, displayDateTimeFormatter) + ")" : ""))
                    }
                    buttonStyle={"btn-hide"}
                    buttonTitle={isMobile ? " " : "Edit"}
                    leftIcon={<Edit />}
                    onClick={() => {
                        onEditClickHandler();
                    }}
                />
            </div>
            <div className="bill-file text-center">
                {imageLink ?
                    <iframe
                        title="BILL"
                        src={imageLink} width="100%" height="500px" /> :
                    <img
                        src={src} alt="ebill" className="img-fluid" />
                }
            </div>

        </ModalContainer>
    );
}

export default EditBillModal;
