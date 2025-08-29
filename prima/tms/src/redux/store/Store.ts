import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from "redux-thunk";
import rootSaga from "../../rootSaga";
import rootReducer from '../reducers/index';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    }
}


export default function configureStore() {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [thunkMiddleware];
    const middleWareEnhancer = applyMiddleware(...middlewares, sagaMiddleware);
    // eslint-disable-next-line no-underscore-dangle
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        rootReducer,
        composeEnhancers(
            middleWareEnhancer
        ),
    );

    sagaMiddleware.run(rootSaga);

    return store;
}