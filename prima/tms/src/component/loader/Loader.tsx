import React from "react";
import "./Loader.css";
import { useSelector, shallowEqual, } from "react-redux";

interface LoaderProps {
    loading?: boolean
}
function Loader(props: LoaderProps) {
    let loading = useSelector((state: any) =>
        state.appReducer.showLoader, shallowEqual
    );

    return (
        ((loading || props.loading) &&
            <div>
                <div className="page-loader">
                    <img src="/images/loader.gif" alt="loader" />
                </div>
            </div>
        ) ||
        null
    )
}

export default Loader;