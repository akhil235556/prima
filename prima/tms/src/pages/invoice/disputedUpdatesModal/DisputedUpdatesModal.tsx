import List from '@material-ui/core/List';
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import DataNotFound from "../../../component/error/DataNotFound";
import ModalContainer from "../../../modals/ModalContainer";
import { getDisputesList } from '../../../serviceActions/BillGenerateServiceActions';
import ClientInfo from "./ClientInfo";
import "./DisputedUpdatesModal.css";
import TransporterInfo from "./TransporterInfo";

interface DisptedUpdatesModalProps {
    open: boolean,
    onClose: any,
    onSuccess: any,
    billNo: any,
    orderDetails?: any,
    status: any
}

function DisptedUpdatesModal(props: DisptedUpdatesModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, billNo, orderDetails } = props;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [disputesList, setDisputesList] = React.useState<any>(undefined);
    // const [refresh, setRefresh] = React.useState(false);

    useEffect(() => {
        const getDisputesListData = async () => {
            const queryParams: any = {
                billNo: billNo,
                partnerCode: orderDetails && orderDetails.partnerCode,
            };
            appDispatch(getDisputesList(queryParams)).then((response: any) => {
                response && setDisputesList(response)
            });
        }
        open && getDisputesListData();
        // eslint-disable-next-line
    }, [open]);

    return (
        <ModalContainer
            title={"Comments"}
            open={open}
            loading={loading}
            onClose={() => {
                onClose()
            }}
            onApply={() => {
                setLoading(true);
            }}
            styleName={"disputed-update-modal"}
            actionButtonStyle="center"
        >
            <div className="comment-content">
                <List>
                    {(disputesList && disputesList.map((item: any) => {
                        if (item.raisedBy === "PARTNER") {
                            return (
                                <TransporterInfo
                                    comment={item.comment}
                                    date={item.createdAt}
                                    name={item.partnerName}
                                />)
                        } else {
                            return (<ClientInfo
                                comment={item.comment}
                                date={item.createdAt}
                                name={item.clientName}
                            />)
                        }
                    })) || <DataNotFound
                            header=""
                            image="/images/chat-not-found.png"
                            message="" />}
                </List>
            </div>
            {/* {status === "PENDING" &&
                <div className="comment-footer">
                    <List>
                        <ListItem>
                            <div className="comment-box">
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    rowsMax={3}
                                    placeholder="Type your message…"
                                    value={text}
                                    onChange={(event: any) => {
                                        if (event.target.value.length === 1) {
                                            setText(event.target.value.trim())
                                        } else {
                                            setText(event.target.value);
                                        }
                                    }}
                                />
                            </div>
                            <Button
                                buttonStyle="btn-blue send-btn"
                                title={""}
                                loading={loading}
                                leftIcon={<Send />}
                                onClick={() => {
                                    if (text.length > 0) {
                                        setLoading(true)
                                        let queryParams = {
                                            billNo: billNo,
                                            clientName: orderDetails && orderDetails.clientName,
                                            partner: {
                                                name: orderDetails && orderDetails.partnerName,
                                                code: orderDetails && orderDetails.partnerCode,
                                            },
                                            comment: text
                                        }
                                        appDispatch(createDispute(queryParams)).then((response: any) => {
                                            setRefresh((prev) => !prev);
                                            if (response) {
                                                props.onSuccess();
                                            }
                                            setText("");
                                            setLoading(false)
                                        });
                                    }
                                }}
                            />
                        </ListItem>
                    </List>
                </div>} */}
        </ModalContainer>
    );
}

export default DisptedUpdatesModal;