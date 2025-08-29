import React, { useEffect } from "react";
import "./Claims.css";
import { KeyboardBackspace, Visibility, Assignment, ArrowRightAlt } from "@material-ui/icons";
import Filter from '../../../component/filter/Filter';
import NumberEditText from "../../../component/widgets/NumberEditText";
import {
    useHistory, useParams
} from "react-router-dom";
import { isMobile } from "../../../base/utility/ViewUtils";
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from "../../../component/widgets/button/Button";
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton, createStyles, makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { orderDetail, getClaims, saveClaims } from '../../../serviceActions/OrderServiceActions';
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import ViewPodModal from "../ViewPodModal";
import { ListLaneView } from "../../../component/CommonView";
import { convertDateFormat, displayDateTimeFormatter } from "../../../base/utility/DateUtils";
import Buttons from '@material-ui/core/Button';
import { uploadDocument, getDocList } from "../../../serviceActions/DasServiceActions";
import { showAlert } from '../../../redux/actions/AppActions';
import { DocType } from "../../../base/constant/ArrayList";

const useStyles = makeStyles(() =>
    createStyles({
        input: {
            display: 'none',
        },
    }),
);

function Claims() {
    let history = useHistory();
    const classes = useStyles();
    const { id } = useParams();
    const appDispatch = useDispatch();
    const [orderDetails, setOrderDetails] = React.useState<any>({});
    const [claimsParams, setClaimsParams] = React.useState<any>({});
    const [docResponse, setDocResponse] = React.useState<any>();


    const [loading, setLoading] = React.useState<any>();
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
    const [disableField] = React.useState<boolean>(false);
    const [viewPod, setViewPod] = React.useState<boolean>(false);
    const [csvFile, setCsvFile] = React.useState<any>();

    useEffect(() => {
        const getAllDetails = async () => {
            setLoading(true);
            let orderParams: any = {
                freightOrderCode: id
            }
            const queryParams: any = {
                entityId: id,
                entityType: DocType.EPOD
            };
            var promise = [appDispatch(orderDetail(orderParams)), appDispatch(getClaims(orderParams)), appDispatch(getDocList(queryParams))];
            Promise.all(promise).then((response: any) => {
                if (response && response.length > 1) {
                    response[0] && response[0].details && setOrderDetails(response[0].details[0]);
                    // response[0] && response[0].details && response[0].details[0]['statusCode'] === OrderStatus.RECONCILED
                    // && setDisableFields(true);

                    response[2] && setDocResponse(response[2][0]);
                    if (response[1] && response[1].details && response[1].details.charges) {
                        // eslint-disable-next-line array-callback-return
                        response[1] && response[1].details.charges.map((element: any) => {
                            let name = element.chargeName;
                            let value = element.amount;
                            setClaimsParams((prev: any) => ({
                                ...prev,
                                [name]: value
                            }));
                        });
                    }
                }
                setLoading(false);
            });
        }
        getAllDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="claims-wrapper">
            <Filter
                pageTitle="Claims"
                buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                buttonTitle={isMobile ? " " : "Back"}
                leftIcon={<KeyboardBackspace />}
                onClick={() => {
                    history.goBack();
                }}
            />

            <LanePointsDisplayModal
                open={openPointModal}
                laneCode={orderDetails && orderDetails.laneCode}
                onClose={() => {
                    setOpenPointModal(false);
                }} />

            <ViewPodModal
                open={viewPod}
                orderId={orderDetails && orderDetails.freightTypeCode}
                file={csvFile}
                fileLink={docResponse && docResponse.documentLink}
                onClose={() => {
                    setViewPod(false);
                }} />
            <PageContainer>
                <div className="claim-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="billing-info-wrapp">
                                <div className="billing-info-header">
                                    <h4>Freight Information</h4>
                                </div>
                                <div className="billing-info-content freight-info-content">
                                    <div className="row info-row">
                                        <div className="col-md-4 col-6">
                                            <ul className="list-info">
                                                <li>Order Code</li>
                                                <li>{id}</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4 col-6">
                                            <ul className="list-info">
                                                <li>Shipment Code</li>
                                                <li>{orderDetails && orderDetails.freightShipmentCode}</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4 col-6">
                                            <ul className="list-info">
                                                <li>Freight Type</li>
                                                <li>{orderDetails && orderDetails.freightTypeCode}</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4 col-6">
                                            <ul className="list-info">
                                                <li>Vehicle Type</li>
                                                <li>{orderDetails && orderDetails.vehicleTypeName}</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4 col-6">
                                            <ul className="list-info">
                                                <li>Lane</li>
                                                <li>
                                                    <ListLaneView element={orderDetails} onClickLaneCode={() => {
                                                        setOpenPointModal(true)
                                                    }} />
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4 col-6">
                                            <ul className="list-info">
                                                <li>Transporter</li>
                                                <li>{orderDetails && orderDetails.partnerName}</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4 col-6">
                                            <ul className="list-info">
                                                <li>LR No.</li>
                                                <li>{orderDetails && orderDetails.lrNumber}</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4 col-6">
                                            <ul className="list-info">
                                                <li>Vehicle Number</li>
                                                <li>{orderDetails && orderDetails.vehicleRegistrationNumber}</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4 col-6">
                                            <ul className="list-info">
                                                <li>Driver Name</li>
                                                <li>{orderDetails && orderDetails.primaryDriverName}</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4 col-6">
                                            <ul className="list-info">
                                                <li>Driver Number</li>
                                                <li>{orderDetails && orderDetails.primaryDriverNumber}</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4 col-6">
                                            <ul className="list-info">
                                                <li>Unloading Date and Time</li>
                                                <li>{((orderDetails.destinationGateInTime &&
                                                    convertDateFormat(orderDetails.destinationGateOutTime, displayDateTimeFormatter)) || "NA")}</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4 col-6">
                                            <ul className="list-info">
                                                <li>Reporting Date and Time</li>
                                                <li>{((orderDetails.destinationGateInTime &&
                                                    convertDateFormat(orderDetails.destinationGateInTime, displayDateTimeFormatter)) || "NA")}</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4 col-6">
                                            <ul className="list-info">
                                                <li>Status</li>
                                                <li className="orange-text">{orderDetails && orderDetails.statusName}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 col-lg-6 short-damage-row">
                            <div className="billing-info-wrapp">
                                <div className="billing-info-header">
                                    <h4>Shortage and Damages</h4>
                                </div>
                                <div className="billing-info-content">
                                    <div className="custom-form-row payment-form">
                                        <div className="form-group rupee-sign">
                                            <NumberEditText
                                                label="Loading Charge :"
                                                placeholder="0.00"
                                                maxLength={6}
                                                decimalScale={2}
                                                allowNegative={false}
                                                disabled={disableField}
                                                value={claimsParams.loading_charge}
                                                type='number'
                                                onChange={(text: any) => {
                                                    setClaimsParams({
                                                        ...claimsParams,
                                                        loading_charge: text
                                                    })
                                                }}
                                            />
                                            <img className="rupee-icon" src="/images/rupee.svg" alt="" />
                                        </div>
                                        <div className="form-group rupee-sign">
                                            <NumberEditText
                                                label="Unloading Charge :"
                                                placeholder="0.00"
                                                maxLength={6}
                                                decimalScale={2}
                                                disabled={disableField}
                                                allowNegative={false}
                                                value={claimsParams.unloading_charge}
                                                type='number'
                                                onChange={(text: any) => {
                                                    setClaimsParams({
                                                        ...claimsParams,
                                                        unloading_charge: text
                                                    })
                                                }}
                                            />
                                            <img className="rupee-icon" src="/images/rupee.svg" alt="" />
                                        </div>
                                        <div className="form-group rupee-sign">
                                            <NumberEditText
                                                label="Detention Charges :"
                                                placeholder="0.00"
                                                maxLength={6}
                                                decimalScale={2}
                                                disabled={disableField}
                                                allowNegative={false}
                                                value={claimsParams.detention_charge}
                                                type='number'
                                                onChange={(text: any) => {
                                                    setClaimsParams({
                                                        ...claimsParams,
                                                        detention_charge: text
                                                    })
                                                }}
                                            />
                                            <img className="rupee-icon" src="/images/rupee.svg" alt="" />
                                        </div>
                                        <div className="form-group rupee-sign">
                                            <NumberEditText
                                                label="Damage Charges :"
                                                placeholder="0.00"
                                                maxLength={6}
                                                decimalScale={2}
                                                allowNegative={false}
                                                disabled={disableField}
                                                value={claimsParams.damage_charge}
                                                type='number'
                                                onChange={(text: any) => {
                                                    setClaimsParams({
                                                        ...claimsParams,
                                                        damage_charge: text
                                                    })
                                                }}
                                            />
                                            <img className="rupee-icon" src="/images/rupee.svg" alt="" />
                                        </div>
                                        <div className="form-group rupee-sign">
                                            <NumberEditText
                                                label="Shortage Charges :"
                                                placeholder="0.00"
                                                maxLength={6}
                                                decimalScale={2}
                                                disabled={disableField}
                                                allowNegative={false}
                                                value={claimsParams.shortage_charge}
                                                type='number'
                                                onChange={(text: any) => {
                                                    setClaimsParams({
                                                        ...claimsParams,
                                                        shortage_charge: text
                                                    })
                                                }}
                                            />
                                            <img className="rupee-icon" src="/images/rupee.svg" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12 col-lg-6 pod-up-row">
                            <div className="billing-info-wrapp">
                                <div className="billing-info-header">
                                    <h4>POD</h4>
                                </div>
                                <div className="billing-info-content">
                                    {!disableField &&
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
                                                            // if (event.target.files[0].name.includes('.csv')) {
                                                            setCsvFile(event.target.files[0]);
                                                            // } else {
                                                            //     appDispatch(showAlert("Select csv file only", false));
                                                            // }
                                                        }
                                                    }}
                                                />
                                                <label htmlFor="contained-button-file" className="m-0">
                                                    <Buttons variant="contained" className="file-upload-btn" color="primary" component="span">
                                                        Browse files
                                                    </Buttons>
                                                </label>
                                            </div>
                                        </div>
                                    }
                                    {(csvFile || (docResponse && docResponse.documentLink)) &&
                                        < div className="uploded-pdf-row">
                                            <List>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <Assignment />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={((csvFile && csvFile.name) || (docResponse && docResponse.entityId))}
                                                    // secondary={
                                                    //     <div className="d-flex align-items-center">
                                                    //         <CheckCircle />
                                                    //         <span>Done</span>
                                                    //     </div>}
                                                    />
                                                    <ListItemSecondaryAction
                                                        onClick={() => {
                                                            setViewPod(true)
                                                        }}
                                                    >
                                                        <IconButton edge="end" aria-label="delete">
                                                            <Visibility />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            </List>
                                        </div>
                                    }
                                </div>
                            </div>
                            {!disableField &&
                                <div className="row">
                                    <div className="col-12 text-right mt-2">
                                        <Button
                                            buttonStyle="btn-blue"
                                            title="Confirm"
                                            loading={loading}
                                            leftIcon={<ArrowRightAlt />}
                                            onClick={() => {
                                                onClickConfirm();
                                            }}
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </PageContainer>
        </div >
    );

    function onClickConfirm() {
        let charges: any = []
        charges.push({
            amount: claimsParams.detention_charge || 0,
            chargeName: "detention_charge",
            operation: "CREDIT"
        })
        charges.push({
            amount: claimsParams.loading_charge || 0,
            chargeName: "loading_charge",
            operation: "CREDIT"
        })
        charges.push({
            amount: claimsParams.unloading_charge || 0,
            chargeName: "unloading_charge",
            operation: "CREDIT"
        })
        charges.push({
            amount: claimsParams.shortage_charge || 0,
            chargeName: "shortage_charge",
            operation: "DEBIT"
        })
        charges.push({
            amount: claimsParams.damage_charge || 0,
            chargeName: "damage_charge",
            operation: "DEBIT"
        })
        // freezeClaims:1 represent true
        let claimsRequestParams = {
            freightOrderCode: id,
            freezeClaims: 1,
            charges: charges
        }
        if (csvFile) {
            let metaData = {
                "entityID": id,
                "entityType": "ePOD",
                "source": "TmsWeb",
                // "entityValue": 5000,
                // "description": "Testing",
                // "reason": "",
                "entityModel": "freight_orders"
            }
            var formData = new FormData();
            formData.append("file", csvFile);
            setLoading(true);
            appDispatch(uploadDocument(metaData, formData)).then((response: any) => {
                response && response.message && appDispatch(showAlert(response.message));
                if (response)
                    return appDispatch(saveClaims(claimsRequestParams));
                else
                    setLoading(false);
            }).then((response: any) => {
                response && response.message && appDispatch(showAlert(response.message));
                setLoading(false);
                response && history.goBack();
            });
        } else if (docResponse && docResponse.documentLink) {
            setLoading(true);
            appDispatch(saveClaims(claimsRequestParams)).then((response: any) => {
                response && response.message && appDispatch(showAlert(response.message));
                setLoading(false);
                response && history.goBack();
            });
        } else {
            appDispatch(showAlert("POD is required", false));
        }
    }
}
export default Claims;