import { FormControlLabel, Switch } from '@material-ui/core';
import { CheckCircleRounded } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    configBoolType
} from "../../../base/constant/ArrayList";
import DataNotFound from '../../../component/error/DataNotFound';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
import EditText from '../../../component/widgets/EditText';
import NumberEditText from '../../../component/widgets/NumberEditText';
import { showAlert } from '../../../redux/actions/AppActions';
import { getConfigList, saveConfig } from "../../../serviceActions/ConfigServiceActions";
import PushNotificationCard from '../pushNotificationCard/PushNotificationCard';
import PushNotifictaionSkeleton from '../pushNotifictaionSkeleton/PushNotifictaionSkeleton';
import PushOnNotification from '../pushOnNotification/PushOnNotification';
import './FreightPaymentNotification.css';


function FreightPaymentNotification() {
    const appDispatch = useDispatch();
    const [loading, setLoading] = React.useState<any>(false)
    const [saveLoading, setSaveLoading] = React.useState<any>(false)
    const [response, setResponse] = React.useState<any>(undefined)
    const [userParams, setUserParams] = React.useState<any>([])

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            let queryParams: any = {
                serviceName: "tms",
            }
            appDispatch(getConfigList(queryParams)).then((response: any) => {
                if (response && response.channels) {
                    setResponse(response.channels);
                    let params: any = [];
                    response.channels.forEach((item: any) => {
                        let tempArr: any = []
                        item.configs && item.configs.forEach((setting: any) => {
                            let settingsObject: any = {
                                configCode: setting.configCode,
                                value: setting.value,
                                userEditable: setting.userEditable === "True" ? "True" : "False",
                            }
                            if (setting.subConfig) {
                                settingsObject.subConfig = setting.subConfig
                            }
                            tempArr.push(settingsObject)
                        })
                        params.push(tempArr)
                    })
                    setUserParams(params);
                }
                setLoading(false);
            })
        }
        getList();
    }, [appDispatch]);

    function changeChildParams(index: any, pos: any, value: any, subConfigIndex: any) {
        var params: any = [...userParams];
        let subConfigParent = params[pos][index] && params[pos][index];
        if (subConfigParent.userEditable !== "True") {
            let subConfigArr = params[pos][index] && params[pos][index].subConfig;
            let newSubConfigArr = subConfigArr.map((subConfig: any, findIndex: any) => {
                if ((findIndex === subConfigIndex)) {
                    return {
                        ...subConfig,
                        value: (subConfig.value === "False") ? "True" : "False",
                    }
                } else {
                    return subConfig;
                }
            })
            params[pos][index].subConfig = newSubConfigArr;
        }
        setUserParams(params)
    }

    function changeParams(index: any, pos: any, value: any) {
        var params: any = [...userParams];
        let subConfigArr = params[pos][index] && params[pos][index].subConfig;
        if (subConfigArr) {
            subConfigArr = subConfigArr.map((config: any) => {
                return {
                    ...config,
                    userEditable: (config.userEditable === "True") ? "False" : "True",
                    value: (value === "True") ? "True" : "False",
                }
            })
            params[pos][index].subConfig = subConfigArr;
        }
        params[pos][index].value = value;
        setUserParams(params)
    }

    return (
        <div>
            <Filter
                pageTitle="Process Management"
            />
            <div className="push-notification-wrapp">
                <PageContainer>
                    {loading ? <PushNotifictaionSkeleton /> :
                        response ?
                            <>
                                {response && response.map((channel: any, pos: any) =>
                                    <PushNotificationCard>
                                        <h4 className="on-notification-heading">{channel.channelName}</h4>
                                        <div className="row">
                                            {
                                                channel.configs && channel.configs.map((item: any, index: any) => (
                                                    <>
                                                        {
                                                            (item.configValueType === configBoolType.INT || item.configValueType === configBoolType.FLOAT) &&
                                                            <div className="custom-option col-md-6 pr-35 mb-3 ">
                                                                <PushOnNotification
                                                                    heading={item.configName}
                                                                    switchButton={
                                                                        <NumberEditText
                                                                            label=""
                                                                            placeholder={"Enter Number"}
                                                                            allowZero
                                                                            decimalScale={item.configValueType === configBoolType.FLOAT ? 2 : 0}
                                                                            disabled={item.userEditable !== "True"}
                                                                            value={userParams && userParams[pos][index] && userParams[pos][index].value}
                                                                            maxLength={item.maxValueLimit ? item.maxValueLimit.length : 1}
                                                                            onChange={(value: any) => {
                                                                                changeParams(index, pos, value)
                                                                            }}
                                                                        />
                                                                    }
                                                                    text={item.configDescription}
                                                                />
                                                            </div>
                                                        }
                                                        {
                                                            item.configValueType === configBoolType.BOOL &&
                                                            <div className="col-md-6 pr-35 mb-3 ">
                                                                <PushOnNotification
                                                                    heading={item.configName}
                                                                    switchButton={
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Switch
                                                                                    onChange={() => {
                                                                                        let setValue = userParams && userParams[pos][index] && userParams[pos][index].value === "True" ? "False" : "True";
                                                                                        changeParams(index, pos, setValue)
                                                                                    }}
                                                                                    disabled={(!item.userEditable)}
                                                                                    checked={userParams && userParams[pos][index] && userParams[pos][index].value === "True" ? true : false}
                                                                                />
                                                                            }
                                                                            label=""
                                                                        />}
                                                                    text={item.configDescription}
                                                                />
                                                                {item.subConfig && item.subConfig.map((subConfigElement: any, subConfigIndex: any) => (
                                                                    <div className="col-md-12 p-0 ">
                                                                        <PushOnNotification
                                                                            heading={subConfigElement.configName}
                                                                            switchButton={
                                                                                <FormControlLabel
                                                                                    control={
                                                                                        <Switch
                                                                                            onChange={() => {
                                                                                                let setUserEditable = subConfigElement.userEditable === "True" ? "False" : "True";
                                                                                                changeChildParams(index, pos, setUserEditable, subConfigIndex)
                                                                                            }}
                                                                                            disabled={(!subConfigElement.userEditable) || (userParams && userParams[pos][index] && userParams[pos][index].subConfig && userParams[pos][index].subConfig[subConfigIndex] && userParams[pos][index].subConfig[subConfigIndex].userEditable !== "True")}
                                                                                            checked={userParams && userParams[pos][index] && userParams[pos][index].subConfig && userParams[pos][index].subConfig[subConfigIndex] && userParams[pos][index].subConfig[subConfigIndex].value === "True" ? true : false}
                                                                                        />
                                                                                    }
                                                                                    label=""
                                                                                />}
                                                                            text={subConfigElement.configDescription}
                                                                            styleName={"notification-content_child"}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        }
                                                        {
                                                            item.configValueType === configBoolType.STRING &&
                                                            <div className="custom-option col-md-6 pr-35 mb-3 ">
                                                                <PushOnNotification
                                                                    heading={item.configName}
                                                                    switchButton={
                                                                        <EditText
                                                                            label=""
                                                                            placeholder={"Enter Text"}
                                                                            disabled={item.userEditable !== "True"}
                                                                            value={userParams && userParams[pos][index] && userParams[pos][index].value}
                                                                            maxLength={item.maxValueLimit ? item.maxValueLimit.length : 1}
                                                                            onChange={(value: any) => {
                                                                                changeParams(index, pos, value)
                                                                            }}
                                                                        />
                                                                    }
                                                                    text={item.configDescription}
                                                                />
                                                            </div>
                                                        }
                                                    </>
                                                ))
                                            }
                                        </div>
                                    </PushNotificationCard>
                                )}

                                <div className="form-group text-right mt-2 mr-12">
                                    <Button
                                        buttonStyle="btn-blue"
                                        title="Save"
                                        disable={loading || saveLoading}
                                        loading={saveLoading}
                                        leftIcon={<CheckCircleRounded />}
                                        onClick={() => {
                                            let params: any = [];
                                            userParams && userParams.forEach((item: any) => {
                                                item && item.forEach((element: any) => {
                                                    if (element.userEditable) {
                                                        params.push({
                                                            configCode: element.configCode,
                                                            value: element.value,
                                                        });
                                                    }
                                                    if (element.subConfig) {
                                                        element.subConfig.forEach((config: any) => {
                                                            params.push({
                                                                configCode: config.configCode,
                                                                value: config.value,
                                                            });
                                                        })
                                                    }
                                                })
                                            })
                                            let queryParams: any = {
                                                configs: params
                                            }
                                            setSaveLoading(true);
                                            appDispatch(saveConfig(queryParams)).then((response: any) => {
                                                response && response.message && appDispatch(showAlert(response.message))
                                                setSaveLoading(false);
                                            })
                                        }}
                                    />
                                </div>
                            </> :
                            <DataNotFound />
                    }
                </PageContainer>
            </div>
        </div>
    )
};

export default FreightPaymentNotification;
