import { Checkbox, FormControlLabel } from '@material-ui/core';
import { GetApp, KeyboardBackspace } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isMobile } from '../../base/utility/ViewUtils';
import DataNotFound from '../../component/error/DataNotFound';
import Filter from '../../component/filter/Filter';
import PageContainer from '../../component/pageContainer/PageContainer';
import Button from '../../component/widgets/button/Button';
import CardContentSkeleton from '../../component/widgets/cardContentSkeleton/CardContentSkeleton';
import { showAlert } from '../../redux/actions/AppActions';
import { getExportTemplate, postExport } from "../../serviceActions/ExportServiceActions";
import './ExportModuleData.css';

function ExportModuleData() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [loading, setLoading] = React.useState<any>(false)
    const [postLoading, setPostLoading] = React.useState<any>(false)
    const [templateResponse, setTemplateResponse] = React.useState<any>(undefined);
    const [refresh, setRefresh] = React.useState<any>(false)

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            appDispatch(getExportTemplate()).then((response: any) => {
                response && setTemplateResponse(response)
                setLoading(false);
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    return (
        <div className="export-module-wrap">
            <div className="filter-wrap">
                <Filter
                    pageTitle={"Export Master Data"}
                >
                    {isMobile &&
                        <Button
                            buttonStyle="btn-detail-mob"
                            title=""
                            leftIcon={<KeyboardBackspace />}
                            onClick={() => {
                                history.goBack();
                            }}
                        />
                    }
                </Filter>
            </div>
            <PageContainer>
                {loading ?
                    <div className="export-data-skeleton">
                        <CardContentSkeleton
                            row={3}
                            column={isMobile ? 2 : 4}
                        />
                    </div>
                    :
                    templateResponse ?
                        <div className="row">
                            <div className="col-md-12 col-12">
                                {templateResponse && templateResponse.map((element: any) =>
                                    <div className="billing-info-wrapp" key={element.moduleName}>
                                        <div className="billing-info-header d-flex align-items-center justify-content-between">
                                            <div className="custom-list-wrap">
                                                <FormControlLabel
                                                    value="end"
                                                    checked={checkAllStatus(element.moduleName)}
                                                    control={
                                                        <Checkbox
                                                            className="custom-checkbox"
                                                            onChange={(e) => {
                                                                handleCardCheckChange(e.target.checked, element.moduleName)
                                                            }}
                                                        />
                                                    }
                                                    label={element.moduleLabel}
                                                    labelPlacement="end"
                                                />
                                            </div>
                                        </div>
                                        <div className="billing-info-content">
                                            <div className="row">
                                                {
                                                    element.resources && element.resources.map((item: any) =>
                                                        <div className="col-md-3 col-6 custom-list-wrap" key={item.resourceName}>
                                                            <FormControlLabel
                                                                value="end"
                                                                checked={Boolean(item.checked)}
                                                                control={
                                                                    <Checkbox
                                                                        className="custom-checkbox"
                                                                        onChange={(e) => {
                                                                            handleCheckChange(e.target.checked, item)
                                                                        }}
                                                                    />
                                                                }
                                                                label={item.label}
                                                                labelPlacement="end"
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="text-right">
                                    <Button
                                        buttonStyle="btn-blue w-m-100"
                                        title="Export File"
                                        leftIcon={<GetApp />}
                                        loading={postLoading}
                                        onClick={() => {
                                            let params = createParams();
                                            if (params.length < 1) {
                                                appDispatch(showAlert("Select atleast 1 module", false));
                                                return
                                            }
                                            setPostLoading(true);
                                            appDispatch(postExport({ resources: params })).then((response: any) => {
                                                if (response) {
                                                    response.message && appDispatch(showAlert(response.message));
                                                    setRefresh((prev: any) => !prev);
                                                }
                                                setPostLoading(false);
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div> :
                        <DataNotFound />
                }
            </PageContainer>
        </div>
    )

    function checkAllStatus(moduleName: any) {
        let flag = 0;

        let currentResources = templateResponse && templateResponse.filter((item: any) => item.moduleName === moduleName)
        if (currentResources.length > 0) {
            let resourceArray = currentResources[0].resources;
            for (let i = 0; i < resourceArray.length; i++) {
                if (!resourceArray[i].checked) {
                    flag = 1;
                    break;
                }
            }
            if (flag === 1) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    function handleCardCheckChange(checked: any, moduleName: any) {
        let tempArray = templateResponse && templateResponse.map((element: any) => {
            if (element.moduleName === moduleName) {
                let resources = element.resources && element.resources.map((value: any) => {
                    return {
                        ...value,
                        checked: checked
                    }
                })
                return {
                    ...element,
                    resources: resources
                }
            } else {
                return element;
            }
        });
        setTemplateResponse(tempArray)
    }

    function handleCheckChange(checked: any, item: any) {
        let tempArray = templateResponse && templateResponse.map((element: any) => {
            let resources = element.resources && element.resources.map((value: any) => {
                if (item.resourceName === value.resourceName) {
                    return {
                        ...value,
                        checked: checked
                    }
                }
                return value;
            })
            return {
                ...element,
                resources: resources
            }
        });
        setTemplateResponse(tempArray)
    }

    function createParams() {
        let params: any = [];
        templateResponse && templateResponse.forEach((element: any) => {
            element.resources && element.resources.forEach((item: any) => {
                if (item.checked) {
                    params.push({ resource: item.resourceName })
                }
            })
        })
        return params;
    }

}
export default ExportModuleData;