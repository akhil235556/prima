import React, { useEffect } from 'react';
import './PushNotification.css'
import Filter from '../../component/filter/Filter';
import PageContainer from '../../component/pageContainer/PageContainer';
import { Switch } from '@material-ui/core';
// import Button from '../../component/widgets/button/Button';
import PushNotificationCard from './pushNotificationCard/PushNotificationCard';
import PushOnNotification from './pushOnNotification/PushOnNotification';
import { getNotificationList, getSubscriptionList, subscribeNotificationTopic, unsubscribeNotificationTopic, getID } from '../../serviceActions/NotificationServiceAction';
import { useDispatch } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PushNotifictaionSkeleton from './pushNotifictaionSkeleton/PushNotifictaionSkeleton';
import { showAlert } from '../../redux/actions/AppActions';

function PushNotification() {
    const appDispatch = useDispatch();
    const [templateResponse, setTemplateResponse] = React.useState<any>();
    const [checkedState, setCheckedState] = React.useState<any>({});
    const [show, setShow] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [Id, setId] = React.useState(null);
    const [refresh, setRefresh] = React.useState(false);
    const token = localStorage.getItem('token');

    const toggleChange = (event: any) => {
        if (event.target.checked) {
            setShow((prev) => !prev);
            setRefresh((prev) => !prev);
        } else {
            if (checkActiveSubscriptions()) {
                unsubscribeAll();
            } else {
                setShow((prev) => !prev);
            }
        }
    };


    useEffect(() => {
        const getList = async () => {
            let queryParams: any = {
                service: "tms"
            }
            let listParams: any = {
                service: "tms"
            }
            setLoading(true);
            Promise.all([appDispatch(getNotificationList(queryParams)), appDispatch(getID())]).then((response: any) => {
                response && response[0] && setTemplateResponse(response[0]);
                if (response && response[1]) {
                    response[1].forEach((item: any) => {
                        if (item.metadata["queueName"] === "push-web") {
                            setId(item.id);
                            listParams.notificationTypeId = item.id;
                        }
                    });
                    return appDispatch(getSubscriptionList(listParams));
                }
                setLoading(false);
            }).then((response: any) => {
                if (response) {
                    var checkedList: any = {}
                    for (let i = 0; i < response.length; i++) {
                        if (response[i].subscriptionType === "push-web") {
                            let key = response[i].topicCode;
                            let value = response[i].isSubscribed === true ? true : false;
                            checkedList[key] = value;
                            value && setShow(true);
                        }
                    }
                    setCheckedState(checkedList);
                }
                setLoading(false);
            });
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    return (
        <div>
            <Filter
                pageTitle="Push Notifications"
            />
            <div className="push-notification-wrapp">
                <PageContainer>
                    <div className="push-notification-header">
                        <div className="push-notification-heading d-flex  align-items-center">
                            <h3>Push notifications</h3>
                            <div className="custom-switch">
                                <Switch
                                    checked={show}
                                    onChange={toggleChange}
                                />
                            </div>
                        </div>
                        <p className="content-text">Get push notifications to find out what’s going on when you’re not on Transport Management Systems (TMS). <br /> You can turn them off anytime. </p>
                    </div>

                    {loading ? <PushNotifictaionSkeleton /> :
                        (show && <div className="turn-on-notification">
                            {templateResponse && templateResponse.map((item: any) => (
                                <PushNotificationCard key={item.channel}>
                                    <h4 className="on-notification-heading">{item.channel}</h4>
                                    <div className="row">

                                        {item.topics && item.topics.map((element: any) => {
                                            return (
                                                <div className="col-md-6 pr-35 mb-3" key={element.id}>
                                                    <PushOnNotification
                                                        heading={element.name}
                                                        switchButton={
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        name={element.code}
                                                                        onChange={toggleNotificationSubscription}
                                                                        checked={checkedState[element.code] || false}
                                                                    />
                                                                }
                                                                label=""
                                                            />}
                                                        text={element.description}
                                                    />
                                                </div>
                                            )

                                        })}

                                    </div>
                                </PushNotificationCard>
                            ))}
                        </div>)}

                </PageContainer>
            </div>
        </div>
    )

    function toggleNotificationSubscription(event: any) {
        if (event.target.checked) {
            subscribe(event.target.name, event.target.checked);
        } else {
            unsubscribe(event.target.name, event.target.checked);
        }
    };

    function subscribe(name: any, checked: any) {
        if (token) {
            let queryParams: any = {
                topicCode: name,
                notificationData: {
                    data: token,
                    id: Id
                }
            }
            appDispatch(subscribeNotificationTopic(queryParams)).then((response: any) => {
                if (response) {
                    response && appDispatch(showAlert(response.message))
                    setCheckedState({ ...checkedState, [name]: checked });
                }
            })
        } else {
            appDispatch(showAlert("Please allow TMS to receive notifications", false))
        }
    }

    function unsubscribe(name: any, checked: any) {
        // if (token) {
        let queryParams: any = {
            topicCodes: [name],
            notificationTypeId: Id,
            service: "tms"
        }
        appDispatch(unsubscribeNotificationTopic(queryParams)).then((response: any) => {
            if (response) {
                response && appDispatch(showAlert(response.message))
                setCheckedState({ ...checkedState, [name]: checked });
            }
        })
        // }
    }

    function unsubscribeAll() {
        // if (token) {
        let queryParams: any = {
            notificationTypeId: Id,
            service: "tms"
        }
        appDispatch(unsubscribeNotificationTopic(queryParams)).then((response: any) => {
            if (response) {
                response && appDispatch(showAlert(response.message))
                setShow((prev) => !prev);
            }

        })
        // }
    }

    function checkActiveSubscriptions() {
        const keys = Object.keys(checkedState)
        for (const key of keys) {
            if (checkedState[key])
                return true;
        }
        return false;
    }
}
export default PushNotification;
