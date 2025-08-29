import { Divider } from '@material-ui/core';
import { Close, CloudDownload, Visibility } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Dispatch } from 'redux';
import { planningStatus } from '../../../../base/constant/ArrayList';
import { PlanningCreatePlanUrl } from '../../../../base/constant/RoutePath';
import { isEmptyArray, isObjectEmpty } from '../../../../base/utility/StringUtils';
import { isMobile } from '../../../../base/utility/ViewUtils';
import Information from '../../../../component/information/Information';
import Button from '../../../../component/widgets/button/Button';
import CardContentSkeleton from '../../../../component/widgets/cardContentSkeleton/CardContentSkeleton';
import { InfoTooltip } from '../../../../component/widgets/tooltip/InfoTooltip';
import { downloadPlanningIndentOutputCsv, downloadPlanningOutputCsv, getPlanningErrors, getPlanningResults } from '../../../../serviceActions/PlanningServiceAction';
import "./PlanningHistorySidePanel.css";

interface PlanningHistorySidePanelProps {
    onClose?: any,
    selectedTask?: any
    setSidePanelDetailsRef?: any
}

interface FileLinks {
    output?: any,
    link?: any
}

const PlanningHistorySidePanel = (props: PlanningHistorySidePanelProps) => {
    const history = useHistory();
    const appDispatch = useDispatch();
    const { onClose, selectedTask = undefined, setSidePanelDetailsRef } = props;
    const [response, setResponse] = React.useState<any>(undefined);
    const [fileLinks, setFileLinks] = React.useState<FileLinks | undefined>(undefined);
    const [planningErrorDetails, setPlanningErrorDetails] = React.useState<any>(undefined);
    const [loading, setLoading] = React.useState<boolean>(false);

    function onClickDetailButton() {
        history.push({
            pathname: PlanningCreatePlanUrl + selectedTask?.requestId,
            state: { ...response, ...fileLinks, ...planningErrorDetails, ...selectedTask, dashBoardVehicles: response?.totalVehicles }
        })
    }

    useEffect(() => {
        isMobile && setSidePanelDetailsRef({ ...response, ...fileLinks, ...planningErrorDetails, ...selectedTask, dashBoardVehicles: response?.totalVehicles })
        // eslint-disable-next-line
    }, [response, fileLinks, planningErrorDetails, selectedTask])

    useEffect(() => {
        getErrorDetails(selectedTask, appDispatch).then((errResponse: any) => {
            setPlanningErrorDetails(errResponse);
        })
        if (selectedTask?.statusCode === planningStatus.SUCCESS.statusCode) {
            setLoading(true)
            let queryParams = { planning_request_id: selectedTask?.requestId }
            appDispatch(getPlanningResults(queryParams)).then((res: any) => {
                !isEmptyArray(res) && setResponse(res[0]);
                let queryParams = {
                    planning_request_id: selectedTask?.requestId,
                    //planning_name: "mid-mile-sequential-planning"
                }
                let promiseArray: any = [appDispatch(downloadPlanningOutputCsv(queryParams)), appDispatch(downloadPlanningIndentOutputCsv(queryParams))]
                Promise.all(promiseArray).then((response: any) => {
                    if (!isEmptyArray(response)) {
                        let resFileLinks = {}
                        if (response[0]) {
                            resFileLinks = { ...response[0]?.results }
                        }
                        if (response[1]) {
                            resFileLinks = { ...resFileLinks, ...response[1] }
                        }
                        setFileLinks(resFileLinks)
                    }
                    setLoading(false);
                    return
                })
                setLoading(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTask]);
    return (
        <div className="planning_history--panel">
            <div className="planning_history--right-panel--header">
                <div className="panel--left-heading">
                    <p className='dark-blue-text text-truncate select-task-id'>
                        {<InfoTooltip
                            title={selectedTask?.requestId}
                            placement={"top"}
                            //disableInMobile={"false"}
                            infoText={selectedTask?.requestId || "....."}
                        />}</p>
                    <p className='planning-task-id'>Planning Task ID</p>
                </div>
                <div className="panel--right-heading d-flex align-items-center justify-content-center">
                    <p>Depot:<span className='orange-text'>{response?.depot || 'NA'}</span></p>
                </div>
            </div>
            <Divider />
            {loading ? <CardContentSkeleton row={5} column={2} /> :
                <>
                    <div className="planning_history--right-panel--body">
                        {!isObjectEmpty(planningErrorDetails) && planningErrorDetails?.errorMessage && <div className={"planning_panel-error " + planningErrorDetails.className}>
                            {planningErrorDetails?.errorMessage}
                        </div>}
                        <div className="custom-form-row row">
                            <div className="col-md-6 billing-group col-6">
                                <Information
                                    title={response?.totalRoutes || "—"}
                                    text={"No.routes"}
                                />
                            </div>
                            <div className="col-md-6 billing-group col-6">
                                <Information
                                    title={response?.totalCost || "—"}
                                    text={"Total cost"}
                                />
                            </div>
                        </div>
                        <div className="custom-form-row row">
                            <div className="col-md-6 billing-group col-6">
                                <Information
                                    title={response?.totalKms || "—"}
                                    text={"Total km driven"}
                                />
                            </div>
                            <div className="col-md-6 billing-group col-6">
                                <Information
                                    title={`${response?.totalOrders || "—"}/${selectedTask?.totalTasks || "—"}`}
                                    text={`${isNaN(selectedTask?.totalTasks - response?.totalOrders) ? "NA" : selectedTask?.totalTasks - response?.totalOrders} shipments skipped`}
                                    valueClassName="orange-text"
                                    textHeadingColor="orange-text"
                                />
                            </div>
                        </div>
                        <div className="custom-form-row row">
                            <div className="col-md-6 billing-group col-6">
                                <Information
                                    title={response?.totalVehicles || "—"}
                                    text={"# of vehicles"}
                                />
                            </div>
                            <div className="col-md-6 billing-group col-6">
                                <Information
                                    title={response?.totalDuration || "—"}
                                    text={"Duration"}
                                />
                            </div>
                        </div>
                        {
                            (!isMobile && selectedTask?.statusCode === planningStatus.SUCCESS.statusCode) && (<>
                                <div className="custom-form-row row">
                                    <div className="col-md-6 billing-group col-6 cloud-download--container">
                                        <p><CloudDownload /> <span>:</span>Download</p>
                                    </div>
                                </div>
                                <Divider />
                                <div className="custom-form-row row output--container">
                                    <div className="col-md-6 billing-group col-6" onClick={() => {
                                        fileLinks?.output && window.open(fileLinks?.output)
                                    }}>
                                        <InfoTooltip title={"Download complete results as Excel"} infoText="Output" valueClassName="output--tooltip-text" />
                                    </div>
                                    <div className="col-md-6 billing-group col-6" onClick={() => {
                                        fileLinks?.link && window.open(fileLinks?.link)
                                    }}>
                                        <InfoTooltip title={"Download complete results as Excel"} infoText="Output Indent" valueClassName="output--tooltip-text" />
                                    </div>
                                </div>
                            </>
                            )
                        }

                    </div>
                    {
                        !isMobile && <Divider />
                    }
                    {
                        !isMobile && <div className="planning_history--right-panel--footer">
                            <div className="row text-right">
                                <div className="col indent-btn-wrap planning-history-btns">
                                    <Button
                                        buttonStyle="btn btn-detail mr-3"
                                        title={"Close"}
                                        leftIcon={<Close />}
                                        onClick={onClose}
                                    />
                                    <Button
                                        buttonStyle="btn btn-blue"
                                        title={"Details"}
                                        leftIcon={<Visibility />}
                                        onClick={onClickDetailButton}
                                    />
                                </div>

                            </div>
                        </div>
                    }</>}

        </div>
    )
}

export async function getErrorDetails(selectedTask: any, appDispatch: Dispatch) {
    switch (selectedTask?.statusCode) {
        case planningStatus.FAIL.statusCode:
            return await appDispatch(getPlanningErrors({ planning_request_id: selectedTask?.requestId }))
                .then((errorResponse: any) => {
                    return { className: planningStatus?.FAIL?.className, errorMessage: errorResponse?.results?.[0]?.errorMessage };
                });
        case planningStatus.PROCESSING.statusCode:
            return Promise.resolve({ className: planningStatus?.PROCESSING?.className, errorMessage: "Planning In Process" });
        case planningStatus.PENDING.statusCode:
            return Promise.resolve({ className: planningStatus?.PENDING?.className, errorMessage: "Planning Pending" });
        default:
            return undefined;
    }

}

export default PlanningHistorySidePanel