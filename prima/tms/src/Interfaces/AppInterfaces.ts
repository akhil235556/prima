
export interface ColumnStateModel {
    id: Array<any> | string;
    label: string;
    buttonLabel?: string;
    minWidth?: number;
    align?: 'right';
    type?: any;
    format?: (value: any) => any;
    class?: string | Function;
    onClickActionButton?: Function;
    icon?: any;
    leftIcon?: any;
    staticValue?: string
    customHead?: any
    customView?: any
    cellIconLeft?: any
    styleCss?: any,
    mandatoryHeader?: boolean
}

export interface GoogleSearchResponse {
    active: boolean,
    description: string,
    formattedSuggestion: { mainText: string, secondaryText: string },
    id: string,
    index: 0,
    matchedSubstrings: [{ length: number, offset: number }],
    placeId: string,
    terms: Array<{ offset: number, value: string }>,
    types: Array<String>
}