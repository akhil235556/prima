import React from 'react';

interface DocumentCellProps {
    cellData: Array<any> | undefined,
    template: any
}

export function DocumentCell(props: DocumentCellProps) {
    const { cellData, template } = props;

    return (<>
        {cellData && cellData.map((row: any, innerIndex: number) =>
            <tr
                key={innerIndex}
            >
                {template && template.map((column: any, index: number) =>
                    <td
                        key={index}
                        style={column.styleCss ? column.styleCss
                            : { borderRight: 'solid 1px #707070', borderTop: 'solid 1px #707070', padding: '10px 15px', height: 40 }}>
                        {column.id === "index" ? (innerIndex + 1) : (column.format ? column.format(row[column.id]) : row[column.id])}</td>
                )}
            </tr>
        )
        }
    </>
    );
}

interface DocumentHeaderProps {
    headerList: Array<any>
}

export function DocumentHeader(props: DocumentHeaderProps) {
    const { headerList } = props;

    return (
        <tr>
            {headerList && headerList.map((element: any, index: number) => <th
                key={index}
                style={{ borderRight: 'solid 1px #707070', padding: '10px 15px', height: 40 }}>{element.label}</th>)}
            {/* <th style={{ padding: '10px 15px', height: 40 }}>Others</th> */}
        </tr>
    )
}