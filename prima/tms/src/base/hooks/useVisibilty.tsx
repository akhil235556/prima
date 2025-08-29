import React, { useEffect } from 'react';
import { vis } from '../utility/WindowUtils';

export function useVisibilty() {
    const [pageVisiblity, setPageVisibilty] = React.useState<boolean>(false);
    var visible = vis();
    useEffect(() => {
        setPageVisibilty(visible);
    }, [visible]);

    return [pageVisiblity];
}