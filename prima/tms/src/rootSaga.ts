import { Task } from '@redux-saga/types';
import { all, call, cancel, delay, fork, put, take } from 'redux-saga/effects';
import { orchestrationRunningStatusEnum } from './base/constant/ArrayList';
import { isNullValue } from './base/utility/StringUtils';
import { pollStop, showAlert } from './redux/actions/AppActions';

interface ResponseObject {
    status?: any,
    runtimeStatus?: any
    customStatus?: any
}
interface ActionObject {
    type: any,
    value: any
}

function* startPolling(action: any) {
    const actionParams = Object.assign({}, action.value);
    const { params, stopPollingLoader } = actionParams;
    while (true) {
        const response: ResponseObject = yield call(() => actionParams.asyncFetch(params));
        if (isNullValue(response)) {
            stopPollingLoader();
            break;
        }
        if (actionParams.orchestrationType === "Track Request") {
            if (
                response.runtimeStatus === orchestrationRunningStatusEnum.COMPLETED || response.runtimeStatus === orchestrationRunningStatusEnum.FAILED) {
                if (response.runtimeStatus === orchestrationRunningStatusEnum.COMPLETED || (response?.customStatus && response?.customStatus.code === 200)) {
                    yield put(showAlert("Operation Successful"));
                    actionParams.stopPollingData()
                } else {
                    if (response.runtimeStatus === orchestrationRunningStatusEnum.FAILED) {
                        let message = response?.status;
                        if (message.lastIndexOf(":") !== -1) {
                            let msg = message.split(/:(.*)/s);
                            yield put(showAlert(msg[1], false));
                        } else {
                            yield put(showAlert(message, false));
                        }
                    }
                    actionParams.stopPollingLoader();
                }
                yield put(pollStop(params))
            }
        } else {
            let validate = (action?.value?.params?.service === "INDENT_ORDER_CREATION" || response.runtimeStatus === orchestrationRunningStatusEnum.COMPLETED) && response?.customStatus?.details?.state >= 200;
            if (validate) {
                yield put(showAlert(response?.customStatus?.display_message));
                stopPollingLoader(true);
                yield put(pollStop(params));
            } else if (response.runtimeStatus === orchestrationRunningStatusEnum.FAILED || response?.customStatus?.code === 400) {
                yield put(showAlert(response?.customStatus?.display_message, false));
                stopPollingLoader(false);
                yield put(pollStop(params));
            }
        }
        yield delay(1000);
    }
}

function* runMultiplePollingTask() {
    let tempObj: any = {}
    while (true) {

        const action: ActionObject = yield take(['POLL_START', 'POLL_STOP']);
        if (action.type === 'POLL_START') {
            let task: Task = yield fork(startPolling, action)
            if (action && action.value && action.value.params && action.value.params.orchestrationId) {
                let key = action.value.params.orchestrationId;
                tempObj[key] = task;
            }
        } else {
            if (action && action.value && action.value.orchestrationId) {
                let response = action && action.value && action.value.orchestrationId;
                yield cancel(tempObj[response])
                delete tempObj[response]
            }
        }
    }
}

export default function* rootSaga() {
    yield all([runMultiplePollingTask()]);
}