import { createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FreightType, rowsPerPageOptions } from "../../../base/constant/ArrayList";
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import TableList from "../../../component/widgets/tableView/TableList";
import { enableFreightType, getAllClientFreightType, getFreightTypeList, updateFreightType } from '../../../serviceActions/FreightTypeServiceActions';
import { freightTableColumns } from "../../../templates/MasterTemplates";
import "./FreightType.css";
import { setClientFreightMapping } from "./FreightTypeUtility";


const useStyles = makeStyles(() =>
    createStyles({
        wrapper: {
            position: 'relative',
        },
        buttonProgress: {
            color: "#006cc9",
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
            zIndex: 9,
        },
    })
);

function FreightTypeListing() {
    const appDispatch = useDispatch();
    const classes = useStyles();

    const [freightTypeList, setFreightTypeList] = React.useState<Array<any>>([]);
    const [refreshList, setRefreshList] = React.useState<boolean>(false)
    const [loading, setLoading] = React.useState<boolean>(false);
    const [ftlLoading, setFtlLoading] = React.useState<boolean>(false);
    const [LtlLoading, setLtlLoading] = React.useState<boolean>(false);

    useEffect(() => {
        const getList = async () => {
            !ftlLoading && !LtlLoading && setLoading(true);
            Promise.all([appDispatch(getFreightTypeList()), appDispatch(getAllClientFreightType())])
                .then((response: any) => {
                    setFreightTypeList(setClientFreightMapping(response[0], response[1]));
                    setLoading(false);
                    setFtlLoading(false);
                    setLtlLoading(false);
                })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshList]);

    return (
        <div>
            <Filter
                pageTitle="Freight Type"
            />
            <div className="fright-type-talbe">
                <PageContainer
                    loading={loading}
                >
                    <TableList
                        tableColumns={freightTableColumns(onChange, ftlLoading, LtlLoading, classes)}
                        currentPage={0}
                        rowsPerPage={25}
                        rowsPerPageOptions={rowsPerPageOptions}
                        listData={freightTypeList}
                        onChangePage={(event: any, page: number) => {
                        }}
                        onChangeRowsPerPage={(event: any) => {

                        }}
                    />

                </PageContainer>
            </div>
        </div>
    );

    function onChange(checked: boolean, element: any) {
        if (element.isMapped) {
            let params = {
                id: element.isClientId,
                freightTypeName: element.name,
                freightTypeDesc: element.description,
                isActive: checked ? 1 : -1

            }
            element.name === FreightType.FTL ? setFtlLoading(true) : setLtlLoading(true);
            appDispatch(updateFreightType(params)).then((response: any) => {
                element.name === FreightType.FTL ? setFtlLoading(false) : setLtlLoading(false);
                if (response) {
                    setRefreshList(!refreshList);
                }
            })
        } else {
            let params = {
                freightTypeId: element.id,
                freightTypeName: element.name,
                freightTypeDesc: element.description,
            }
            element.name === FreightType.FTL ? setFtlLoading(true) : setLtlLoading(true);
            appDispatch(enableFreightType(params)).then((response: any) => {
                element.name === FreightType.FTL ? setFtlLoading(false) : setLtlLoading(false);
                if (response) {
                    setRefreshList(!refreshList);
                }
            })
        }




    }
}

export default FreightTypeListing;
