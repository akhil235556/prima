import React, { useEffect } from 'react'
import '../Agn.css'
import { KeyboardBackspace } from '@material-ui/icons';
import Filter from '../../../component/filter/Filter';
import { isMobile } from '../../../base/utility/ViewUtils';
import PageContainer from '../../../component/pageContainer/PageContainer';
import TableList from '../../../component/widgets/tableView/TableList';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getAgnList } from '../../../serviceActions/AgnServiceActions';
import { agnHistoryViewTableColumns } from '../../../templates/InventoryTemplates';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import CardList from '../../../component/widgets/cardlist/CardList';


function AgnHistoryListingView() {
    const history = useHistory();
    const { id } = useParams();
    const appDispatch = useDispatch();
    const [productDetails, setProductDetails] = React.useState<any>();
    const [loading, setLoading] = React.useState<boolean>(false);


    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            let queryParams: any = {
                agnCode: id
            }
            appDispatch(getAgnList(queryParams)).then((response: any) => {
                response && response.results && setProductDetails(response.results[0].productDetails);
                setLoading(false);
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>

            <div className="filter-wrap">

                <Filter
                    pageTitle="AGN History"
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
                            tableColumns={agnHistoryViewTableColumns()}
                        />
                        :
                        <TableList
                            tableColumns={agnHistoryViewTableColumns()}

                            currentPage={1}
                            rowsPerPage={1}
                            rowsPerPageOptions={rowsPerPageOptions}
                            // totalCount={state.pagination && state.pagination.count}
                            listData={productDetails}
                            onChangePage={(event: any, page: number) => {
                            }}
                            onChangeRowsPerPage={(event: any) => {
                            }}
                        />
                }
            </PageContainer>
        </div>
    )
}
export default AgnHistoryListingView;