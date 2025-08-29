import React, { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { setAutoCompleteList } from "../../moduleUtility/DataUtils";
import { hideLoading, setFreightTypeList, showLoading } from "../../redux/actions/DiversionCreateOrderAction";
import DiversionCreateOrderReducer, { DIVERSION_CREATE_ORDER_STATE } from "../../redux/reducers/DiversionCreateOrderReducer";
import { RAISE_INDENT_STATE } from "../../redux/reducers/RaiseIndentReducer";
import { getClientFreightTypeList } from "../../serviceActions/FreightTypeServiceActions";
import { getAllVehicleTypeList } from "../../serviceActions/VehicleTypeServiceActions";
// import ShipmentOrderDetails from "./ShipmentOrderDetails";
import CreateFreightOrder from "./CreateFreightOrder";
import DiversionShipmentOrderDetails from "./DiversionShipmentOrderDetails";


export const Context = React.createContext<any>(RAISE_INDENT_STATE);
function CreateDiversionOrder() {
    const appDispatch = useDispatch();
    const [state = DIVERSION_CREATE_ORDER_STATE, dispatch] = useReducer(DiversionCreateOrderReducer, DIVERSION_CREATE_ORDER_STATE);
    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            Promise.all([appDispatch(getClientFreightTypeList()), appDispatch(getAllVehicleTypeList())])
                .then((response: any) => {
                    response && response[0] && dispatch(setFreightTypeList(setAutoCompleteList(response[0], "freightTypeName", "freightTypeName")));
                    dispatch(hideLoading());
                })
        }
        getList();
        // eslint-disable-next-line
    }, []);

    return (
        <Context.Provider value={[state, dispatch]}>
            {
                !state.showOrderDetails ?
                    <CreateFreightOrder /> :
                    // "Shipment Details"
                    <DiversionShipmentOrderDetails />
                // <ShipmentOrderDetails />

            }

        </Context.Provider>
    )
}

export default CreateDiversionOrder;