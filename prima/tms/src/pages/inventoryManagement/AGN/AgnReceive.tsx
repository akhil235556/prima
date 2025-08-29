import { KeyboardBackspace, SwapVert } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { isMobile } from '../../../base/utility/ViewUtils';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from "../../../component/widgets/button/Button";
import CardList from '../../../component/widgets/cardlist/CardList';
import TableList from '../../../component/widgets/tableView/TableList';
import { showAlert } from '../../../redux/actions/AppActions';
import { getAgnList, receiveAgn } from '../../../serviceActions/AgnServiceActions';
import { agnReceiveTableColumns } from '../../../templates/InventoryTemplates';
import '../Agn.css';


function AgnReceiveListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const { id } = useParams();
    const [productDetails, setProductDetails] = React.useState<any>();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const [loading, setLoading] = React.useState<any>(false);
    const [receviceLoading, setReceiveLoading] = React.useState<any>(false);
    // eslint-disable-next-line
    const [dataChanged, SetDataChange] = React.useState<any>(false);

    useEffect(() => {
        const getList = async () => {
            let queryParams: any = {
                agnCode: id
            }
            setLoading(true);
            appDispatch(getAgnList(queryParams)).then((response: any) => {
                setLoading(false);
                response && response.results && setProductDetails(response.results[0].productDetails)
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="agn-table-list">
            <div className="filter-wrap">
                <Filter
                    pageTitle="AGN Details"
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                />
            </div>

            <PageContainer
                loading={loading}
                listData={productDetails}
            >
                {
                    isMobile ?
                        <CardList
                            listData={productDetails}
                            tableColumns={agnReceiveTableColumns(onHandleValueChangeReceived, onHandleValueChangeShortage, onHandleValueChangeDamaged)}
                        />
                        :
                        <TableList
                            tableColumns={agnReceiveTableColumns(onHandleValueChangeReceived, onHandleValueChangeShortage, onHandleValueChangeDamaged)}
                            currentPage={0}
                            rowsPerPage={0}
                            rowsPerPageOptions={rowsPerPageOptions}
                            listData={productDetails}
                            onChangePage={() => {

                            }}
                            onChangeRowsPerPage={() => {

                            }}
                        />
                }
                <div className="text-right mt-3">
                    <Button
                        buttonStyle="btn-blue"
                        title="Receive"
                        leftIcon={<SwapVert />}
                        onClick={() => {
                            let queryParams: any = {
                                agnCode: id,
                                productDetails: productDetails
                            }
                            setReceiveLoading(true);
                            appDispatch(receiveAgn(queryParams)).then((response: any) => {
                                response && response.message && appDispatch(showAlert(response.message));
                                // response && setRefresh((prev: any) => !prev);
                                setReceiveLoading(false);
                                response && history.goBack();
                            })
                        }}
                        loading={receviceLoading}
                    />
                </div>
            </PageContainer>

        </div>
    )
    function onHandleValueChangeShortage(text: any, element: any) {
        var index: any = getIndex(element);
        var copyProductDetails: any = productDetails;
        copyProductDetails[index].shortageCount = Number(text);
        setProductDetails(copyProductDetails);
        SetDataChange((prev: any) => !prev);
    }
    function onHandleValueChangeDamaged(text: any, element: any) {
        var index: any = getIndex(element);
        var copyProductDetails: any = productDetails;
        copyProductDetails[index].damagedCount = Number(text);
        setProductDetails(copyProductDetails);
        SetDataChange((prev: any) => !prev);
    }
    function onHandleValueChangeReceived(text: any, element: any) {
        var index: any = getIndex(element);
        var copyProductDetails: any = productDetails;
        copyProductDetails[index].receivedCount = Number(text);
        setProductDetails(copyProductDetails);
        SetDataChange((prev: any) => !prev);
    }
    function getIndex(element: any) {
        for (let i = 0; i < productDetails.length; i++) {
            if (productDetails[i].productSku === element.productSku) {
                return i;
            }
        }
    }
}
export default AgnReceiveListing;