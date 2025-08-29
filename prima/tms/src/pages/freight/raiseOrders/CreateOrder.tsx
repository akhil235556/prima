import React, { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { setAutoCompleteList } from "../../../moduleUtility/DataUtils";
import { hideLoading, setFreightTypeList, setPtlStatus, showLoading } from '../../../redux/actions/RaiseIndentAction';
import RaiseIndentReducer, { RAISE_INDENT_STATE } from "../../../redux/reducers/RaiseIndentReducer";
import { getClientFreightTypeList, getPtlStatus } from "../../../serviceActions/FreightTypeServiceActions";
import RaiseOrder from "./RaiseOrder";
import ShipmentOrderDetails from "./ShipmentOrderDetails";


export const Context = React.createContext<any>(RAISE_INDENT_STATE);
function CreateOrder() {
    const appDispatch = useDispatch();
    const [state = RAISE_INDENT_STATE, dispatch] = useReducer(RaiseIndentReducer, RAISE_INDENT_STATE);
    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            Promise.all([appDispatch(getClientFreightTypeList())])
                .then((response: any) => {
                    response && response[0] && dispatch(setFreightTypeList(setAutoCompleteList(response[0], "freightTypeName", "freightTypeName")));
                    dispatch(hideLoading());
                })
        }
        getList();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const fetchPtlStatus = async () => {
            dispatch(showLoading());
            Promise.all([appDispatch(getPtlStatus())])
                .then((response: any) => {
                    dispatch(setPtlStatus(response[0]))
                })
                .finally(() => dispatch(hideLoading()))
        }
        fetchPtlStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Context.Provider value={[state, dispatch]}>
            {
                !state.showOrderDetails ?
                    <RaiseOrder /> :
                    <ShipmentOrderDetails />

            }

        </Context.Provider>
    )
}

export default CreateOrder;