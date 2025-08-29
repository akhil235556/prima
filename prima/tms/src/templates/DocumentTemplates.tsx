// import React from 'react';
import { ColumnStateModel } from '../Interfaces/AppInterfaces';

export const elrTableColumns = () => {
    const columnList: ColumnStateModel[] = [

        { id: 'index', label: 'SL', format: (value: any) => value || "" },
        { id: 'productName', label: 'Item Name', format: (value: any) => value || "" },
        { id: 'totalArticleCount', label: 'Material Qty', format: (value: any) => value || "" },
        { id: 'totalArticleQuantity', label: 'Product Qty', format: (value: any) => value || "" },
        { id: 'uom', label: 'UoM', format: (value: any) => value || "" },
        // { id: 'description', label: 'Description', format: (value: any) => value || "" },

    ]
    return columnList;
};

export const epodTableColumns = () => {
    const columnList: ColumnStateModel[] = [

        { id: 'index', label: 'SL', format: (value: any) => value || "" },
        { id: 'productName', label: 'Material Short Text', format: (value: any) => value || "" },
        { id: 'totalArticleQuantity', label: 'Inv. QTY Box', format: (value: any) => value || "" },
        { id: '', label: 'Shortages', format: (value: any) => value || "" },
        { id: '', label: 'Damages', format: (value: any) => value || "" },
        {
            id: '', label: 'Others', format: (value: any) => value || "",
            styleCss: { borderTop: 'solid 1px #707070', padding: '10px 15px', height: 40 }
        },

    ]
    return columnList;
};