import { Card, CardContent, CardHeader } from '@material-ui/core';
import { KeyboardBackspace } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { jobStatus, rowsPerPageOptions } from '../../base/constant/ArrayList';
import { convertDateFormat, displayDateFormatter } from '../../base/utility/DateUtils';
import { isMobile } from '../../base/utility/ViewUtils';
import DataNotFound from '../../component/error/DataNotFound';
import Filter from '../../component/filter/Filter';
import PageContainer from '../../component/pageContainer/PageContainer';
import CardContentSkeleton from '../../component/widgets/cardContentSkeleton/CardContentSkeleton';
import TableList from '../../component/widgets/tableView/TableList';
import { getJobDetails } from '../../serviceActions/BulkUploadServiceActions';
import { errorCodeTableColumns } from '../../templates/BulkUploadTemplates';
import "./BulkUpload.css";
import BulkUploadModal from './BulkUploadModal';

function BulkUploadTrackView() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const { id }: any = useParams();
    const [details, setDetails] = React.useState<any>({})
    const [jsonError, setJsonError] = React.useState<any>({})
    const [toggleModal, setToggleModal] = React.useState<any>(false)
    const [loading, setLoading] = React.useState<any>(false)

    useEffect(() => {
        const getJobList = async () => {
            setLoading(true);
            appDispatch(getJobDetails(id)).then((response: any) => {
                if (response?.details) {
                    setDetails(response.details);
                }
                setLoading(false);
            });
        }
        id && getJobList();
        // eslint-disable-next-line
    }, []);

    return (
        <div>

            <BulkUploadModal
                open={toggleModal}
                selectedElement={jsonError}
                onClose={() => {
                    setJsonError(undefined)
                    setToggleModal(false)
                }}
            />
            <div className="filter-wrap">
                <Filter
                    pageTitle="Bulk Upload"
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                />
                <PageContainer>
                    <div className="row">
                        <div className="col-md-12 col-lg-6">
                            <Card className="creat-contract-wrapp">
                                <CardHeader className="creat-contract-header"
                                    title="Job Detail"
                                />
                                {
                                    loading ?
                                        <CardContentSkeleton
                                            row={3}
                                            column={1}
                                        /> :
                                        <CardContent className="creat-contract-content job-detail">
                                            <div className="row job-detail-row">
                                                <div className="col left-col">Job Id :</div>
                                                <div className="col col-lg-7 right-col text-truncate">{details.requestId}</div>
                                            </div>
                                            <div className="row job-detail-row">
                                                <div className="col left-col">Job Entity :</div>
                                                <div className="col col-lg-7 right-col">{details.jobName}</div>
                                            </div>
                                            <div className="row job-detail-row">
                                                <div className="col left-col">Description :</div>
                                                <div className="col col-lg-7 right-col text-truncate">{details.jobDescription}</div>
                                            </div>
                                            <div className="row job-detail-row">
                                                <div className="col left-col">Created At :</div>
                                                <div className="col col-lg-7 right-col">
                                                    {(details.createdAt && convertDateFormat(details.createdAt, displayDateFormatter)) || "NA"}</div>
                                            </div>
                                            <div className="row job-detail-row">
                                                <div className="col left-col">Started At :</div>
                                                <div className="col col-lg-7 right-col">
                                                    {(details.report && details.report.startedAt && convertDateFormat(details.report.startedAt, displayDateFormatter)) || "NA"}
                                                </div>
                                            </div>
                                            <div className="row job-detail-row">
                                                <div className="col left-col">Completed :</div>
                                                <div className="col col-lg-7 right-col">
                                                    {(details.report && details.report.completedAt && convertDateFormat(details.report.completedAt, displayDateFormatter)) || "NA"}
                                                </div>
                                            </div>
                                        </CardContent>
                                }
                            </Card>
                        </div>
                        <div className="col-md-12 col-lg-6">
                            <Card className="creat-contract-wrapp">
                                <CardHeader className="creat-contract-header"
                                    title="Error Detail"
                                />
                                {loading ?
                                    <CardContentSkeleton
                                        row={3}
                                        column={1}
                                    /> :
                                    <CardContent className="creat-contract-content display-all-data">
                                        <div className="article-list-wrapp error-code">
                                            <div className="article-list-content">
                                                {(details.status && ((details.errors && <TableList
                                                    tableColumns={errorCodeTableColumns(onClickViewButton)}
                                                    currentPage={0}
                                                    rowsPerPage={500}
                                                    rowsPerPageOptions={rowsPerPageOptions}
                                                    listData={details.errors}
                                                    onChangePage={(event: any, page: number) => {
                                                    }}
                                                    onChangeRowsPerPage={(event: any) => {
                                                    }}
                                                />)
                                                    ||
                                                    <div className="img-upload">
                                                        <DataNotFound
                                                            message={getMessage(details.status)}
                                                            header={details.jobName}
                                                            image={getImage(details.status)}

                                                        />
                                                    </div>

                                                ))
                                                }

                                            </div>
                                        </div>
                                    </CardContent>}
                            </Card>
                        </div>
                    </div>
                </PageContainer>
            </div>

        </div>
    );

    function getImage(status: string) {
        switch (status) {
            case jobStatus.PENDING:
                return "/images/product-upload-pending.png";
            case jobStatus.IN_PROCESS:
                return "/images/product-upload-process.png";
            case jobStatus.COMPLETED:
                return "/images/product-upload-complete.png";
            default:
                return "";
        }
    }

    function getMessage(status: string) {
        switch (status) {
            case jobStatus.PENDING:
                return "Upload request pending";
            case jobStatus.IN_PROCESS:
                return "Upload request under process";
            case jobStatus.COMPLETED:
                return "Upload request completed";
            default:
                return " ";
        }

    }

    function onClickViewButton(element: any) {
        element && element.rowPayload && setJsonError(JSON.parse(element.rowPayload))
        setToggleModal(true);
    }

};
export default BulkUploadTrackView;
