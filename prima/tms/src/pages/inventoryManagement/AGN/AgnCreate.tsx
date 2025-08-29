import React, { useReducer } from 'react'
import { useDispatch } from 'react-redux';
import '../Agn.css';
import Filter from '../../../component/filter/Filter';
// import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { isMobile } from '../../../base/utility/ViewUtils';
import { Remove, Add, ClearAll, ArrowRightAlt, KeyboardBackspace } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { Card, CardHeader, CardContent, Collapse } from "@material-ui/core";
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
// import { CustomToolTip } from '../../../component/widgets/CustomToolTip';
import { RenderProducts, validateAgnData, createAgnParams } from './AgnCreateViewUtility';
import { showContractDetails, showFreightDetails, showLoading, setUserParams, clearUserParams, setError, hideLoading } from '../../../redux/actions/CreateAgnAction';
import CreateAgnReducer, { CREATE_AGN_STATE } from '../../../redux/reducers/CreateAgnReducer';
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import EditText from '../../../component/widgets/EditText';
import AutoSuggest from '../../../component/widgets/AutoSuggest';
import { DatePicker } from '@material-ui/pickers';
import { displayDateFormatter } from '../../../base/utility/DateUtils';
import { searchLocationList } from '../../../serviceActions/LocationServiceActions';
import { setAutoCompleteListWithData, removeListItem } from '../../../moduleUtility/DataUtils';
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { originLabel, originPlaceHolder, destinationLabel, destinationPlaceHolder } from '../../../base/constant/MessageUtils';
import { createAgn } from '../../../serviceActions/AgnServiceActions';
import { showAlert } from '../../../redux/actions/AppActions';

function AgnCreate() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [state = CREATE_AGN_STATE, dispatch] = useReducer(CreateAgnReducer, CREATE_AGN_STATE);
    const [originSuggestion, setOriginSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [destinationSuggestion, setDestinationSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);

    return (
        <div className="agn-create">
            <div className="filter-wrap">
                <Filter
                    pageTitle="Create AGN"
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                />
            </div>

            <PageContainer>
                <Card className="creat-contract-wrapp creat-wrapp">
                    <CardHeader className="creat-contract-header"
                        title="AGN Details"
                        onClick={() => {
                            dispatch(showContractDetails());
                        }}
                        avatar={isMobile ? (state.showAgnDetails ? <Remove /> : <Add />) : null}
                    />
                    <Collapse in={state.showAgnDetails} timeout="auto" unmountOnExit>
                        <CardContent className="creat-contract-content">
                            <div className="custom-form-row row align-items-end">
                                <div className="form-group col-md-4">
                                    <EditText
                                        label="Freight Order Code "
                                        mandatory
                                        placeholder="Freight Order Code"
                                        value={state.userParams.orderId}
                                        error={state.error.orderId}
                                        maxLength={50}
                                        onChange={(text: any) => {
                                            dispatch(setUserParams({
                                                orderId: text,
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <EditText
                                        label="Shipment Code"
                                        mandatory
                                        placeholder="Shipment Code"
                                        value={state.userParams.shipmentId}
                                        error={state.error.shipmentId}
                                        maxLength={50}
                                        onChange={(text: any) => {
                                            dispatch(setUserParams({
                                                shipmentId: text,
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <AutoSuggest
                                        label={originLabel}
                                        mandatory
                                        placeHolder={originPlaceHolder}
                                        error={state.error.origin}
                                        value={state.userParams && state.userParams.originName}
                                        suggestions={originSuggestion}
                                        handleSuggestionsFetchRequested={({ value }: any) => {
                                            if (value.length > autosuggestSearchLength) {
                                                getSuggestionList(value, "origin");
                                            }
                                        }}
                                        onSelected={(element: OptionType) => {
                                            dispatch(setUserParams({
                                                originName: element.label,
                                                origin: element,
                                            }));
                                        }}
                                        onChange={(text: string) => {
                                            dispatch(setUserParams({
                                                origin: undefined,
                                                originName: text
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <AutoSuggest
                                        label={destinationLabel}
                                        mandatory
                                        placeHolder={destinationPlaceHolder}
                                        error={state.error.destination}
                                        value={state.userParams && state.userParams.destinationName}
                                        suggestions={destinationSuggestion}
                                        handleSuggestionsFetchRequested={({ value }: any) => {
                                            if (value.length > autosuggestSearchLength) {
                                                getSuggestionList(value, "destination");
                                            }
                                        }}
                                        onSelected={(element: OptionType) => {
                                            dispatch(setUserParams({
                                                destinationName: element.label,
                                                destination: element,
                                            }));
                                        }}
                                        onChange={(text: string) => {
                                            dispatch(setUserParams({
                                                destinationName: text,
                                                destination: undefined,
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="picker-label">{"Expected Date"}<span className="mandatory-flied">*</span></label>
                                    <DatePicker
                                        className="custom-date-picker"
                                        hiddenLabel
                                        placeholder="Expected Date"
                                        helperText={state.error.expectedDatetime}
                                        disablePast
                                        format={displayDateFormatter}
                                        value={(state.userParams && state.userParams.expectedDatetime) || null}
                                        onChange={(date: any) => {
                                            dispatch(setUserParams({
                                                expectedDatetime: date,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Collapse>
                </Card>

                <Card className="creat-contract-wrapp creat-wrapp">
                    <CardHeader className="creat-contract-header"
                        title="Product Details"
                        onClick={() => {
                            dispatch(showFreightDetails());
                        }}
                        avatar={isMobile ? (state.showProductDetails ? <Remove /> : <Add />) : null}
                    />
                    <Collapse in={state.showProductDetails} timeout="auto" unmountOnExit>
                        <CardContent className="creat-contract-content">
                            {state.userParams.products && state.userParams.products.map((element: any, index: number) => (
                                <RenderProducts
                                    key={index}
                                    element={element}
                                    isAddButton={(index === 0)}
                                    onAdd={() => {
                                        dispatch(setUserParams({
                                            products: [...state.userParams.products, {
                                                index: state.userParams.products.length,
                                            }]
                                        }));
                                    }}
                                    onChangeProduct={(text: any, partnerIndex: number) => {
                                        const products = state.userParams.products.map(
                                            (data: any) => ((data.index === partnerIndex) ? {
                                                ...data,
                                                productError: "",
                                                productName: text,
                                            } : data));
                                        dispatch(setUserParams({
                                            products: products,
                                        }));
                                    }}
                                    onSelectProduct={(element: any, articlesIndex: number) => {
                                        const products = state.userParams.products.map(
                                            (data: any) => ((data.index === articlesIndex) ? {
                                                ...data,
                                                productError: "",
                                                productName: element.label,
                                                product: element
                                            } : data));
                                        dispatch(setUserParams({
                                            products: products,
                                        }));
                                    }}
                                    onChangeQuantity={(text: any) => {
                                        const products = state.userParams.products.map(
                                            (data: any) => ((data.index === index) ? {
                                                ...data,
                                                unitsError: "",
                                                units: text
                                            } : data));
                                        dispatch(setUserParams({
                                            products: products,
                                        }));
                                    }}
                                    onRemove={(element: any) => {
                                        const products = removeListItem(state.userParams.products, element)
                                        dispatch(setUserParams({
                                            products: products,
                                        }));
                                    }}
                                />
                            ))}
                        </CardContent>
                    </Collapse>
                </Card>
                <div className="text-right">
                    <Button
                        buttonStyle="btn-orange mr-3"
                        title={"Clear"}
                        disable={state.loading}
                        leftIcon={<ClearAll />}
                        onClick={() => {
                            dispatch(clearUserParams());
                        }}
                    />
                    <Button
                        buttonStyle="btn-blue"
                        title={"Create"}
                        loading={state.loading}
                        leftIcon={<ArrowRightAlt />}
                        onClick={() => {
                            const validate = validateAgnData(state.userParams, appDispatch)
                            if (validate === true) {
                                raiseAgn();
                            } else if (validate.error) {
                                dispatch(setUserParams(validate));
                            } else {
                                dispatch(setError(validate));
                            }
                        }}
                    />
                </div>
            </PageContainer>
        </div>
    )

    function getSuggestionList(text: string, type: string) {
        appDispatch(searchLocationList({ query: text })).then((response: any) => {
            if (response) {
                switch (type) {
                    case "origin":
                        setOriginSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
                        break;
                    case "destination":
                        setDestinationSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
                        break;
                }

            }
        })
    };

    function raiseAgn() {
        let params = createAgnParams(state.userParams);
        dispatch(showLoading());
        appDispatch(createAgn(params)).then((response: any) => {
            if (response && response.details) {
                response.message && appDispatch(showAlert(response.message));
                dispatch(clearUserParams());
                response && history.goBack();
            }
            dispatch(hideLoading());
        })
    }

}

export default AgnCreate;